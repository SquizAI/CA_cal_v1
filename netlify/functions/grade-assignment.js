/**
 * Grade Assignment Serverless Function
 *
 * Allows teachers to manually grade student submissions with comprehensive feedback.
 * Supports both points-based and rubric-based grading with automatic course grade calculation.
 *
 * Endpoint: POST /.netlify/functions/grade-assignment
 *
 * Request Body:
 * {
 *   "submission_id": "uuid-123",
 *   "points_earned": 87.5,
 *   "feedback": "Great work! Watch citations.",
 *   "rubric_scores": {
 *     "research": {"score": 18, "max": 20},
 *     "presentation": {"score": 15, "max": 20}
 *   },
 *   "return_to_student": true,
 *   "comments": [
 *     {"type": "strength", "text": "Excellent analysis"},
 *     {"type": "improvement", "text": "Work on citations"}
 *   ]
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "grade_id": "uuid",
 *   "percentage": 87.5,
 *   "letter_grade": "B",
 *   "updated_course_grade": 88.2,
 *   "assignment_class_average": 82.5
 * }
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://qypmfilbkvxwyznnenge.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
        };
    }

    try {
        // Parse request body
        const requestData = JSON.parse(event.body);

        // Validate required fields
        const validation = validateRequest(requestData);
        if (!validation.valid) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Validation failed',
                    details: validation.errors
                })
            };
        }

        // Extract authentication token from headers
        const authHeader = event.headers.authorization || event.headers.Authorization;
        const token = authHeader ? authHeader.replace('Bearer ', '') : null;

        if (!token) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Authentication required. Please provide a valid token.' })
            };
        }

        // Verify teacher authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Invalid authentication token' })
            };
        }

        const teacherId = user.id;

        // Verify teacher exists
        const { data: teacher, error: teacherError } = await supabase
            .from('teachers')
            .select('id, first_name, last_name')
            .eq('id', teacherId)
            .single();

        if (teacherError || !teacher) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'User is not registered as a teacher' })
            };
        }

        // Get submission details
        const { data: submission, error: submissionError } = await supabase
            .from('submissions')
            .select(`
                id,
                assignment_id,
                student_id,
                status,
                assignments (
                    id,
                    title,
                    subject_key,
                    teacher_id,
                    total_points,
                    category
                )
            `)
            .eq('id', requestData.submission_id)
            .single();

        if (submissionError || !submission) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    error: 'Submission not found',
                    details: submissionError?.message
                })
            };
        }

        // Verify teacher has permission to grade this submission
        if (submission.assignments.teacher_id !== teacherId) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({
                    error: 'Permission denied. You can only grade assignments you created.'
                })
            };
        }

        // Calculate points if rubric is provided
        const gradeData = calculateGradeData(requestData, submission.assignments);

        // Start a transaction-like process
        let gradeId;
        let courseGrade;
        let classAverage;

        try {
            // 1. Upsert grade record
            const { data: grade, error: gradeError } = await supabase
                .from('grades')
                .upsert({
                    submission_id: requestData.submission_id,
                    assignment_id: submission.assignment_id,
                    student_id: submission.student_id,
                    teacher_id: teacherId,
                    points_earned: gradeData.points_earned,
                    points_possible: gradeData.points_possible,
                    teacher_feedback: requestData.feedback,
                    rubric_scores: requestData.rubric_scores || {},
                    graded_at: new Date().toISOString()
                }, {
                    onConflict: 'submission_id'
                })
                .select()
                .single();

            if (gradeError) {
                throw new Error(`Failed to save grade: ${gradeError.message}`);
            }

            gradeId = grade.id;

            // 2. Update submission status
            const newStatus = requestData.return_to_student ? 'graded' : 'graded';

            const { error: submissionUpdateError } = await supabase
                .from('submissions')
                .update({ status: newStatus })
                .eq('id', requestData.submission_id);

            if (submissionUpdateError) {
                throw new Error(`Failed to update submission status: ${submissionUpdateError.message}`);
            }

            // 3. Add grade comments if provided
            if (requestData.comments && requestData.comments.length > 0) {
                const comments = requestData.comments.map(comment => ({
                    grade_id: gradeId,
                    teacher_id: teacherId,
                    comment_text: comment.text,
                    comment_type: comment.type || 'general'
                }));

                const { error: commentsError } = await supabase
                    .from('grade_comments')
                    .insert(comments);

                if (commentsError) {
                    console.error('Failed to save comments:', commentsError);
                    // Non-critical, continue
                }
            }

            // 4. Calculate and update course grade
            const { data: updatedCourseGrade, error: courseGradeError } = await supabase
                .rpc('calculate_course_grade', {
                    p_student_id: submission.student_id,
                    p_subject_key: submission.assignments.subject_key
                });

            if (courseGradeError) {
                console.error('Failed to calculate course grade:', courseGradeError);
                // Non-critical, continue
            } else {
                courseGrade = updatedCourseGrade;
            }

            // 5. Get assignment class average
            const { data: avgData, error: avgError } = await supabase
                .from('grades')
                .select('percentage')
                .eq('assignment_id', submission.assignment_id);

            if (!avgError && avgData && avgData.length > 0) {
                const sum = avgData.reduce((acc, g) => acc + parseFloat(g.percentage), 0);
                classAverage = (sum / avgData.length).toFixed(2);
            }

            // 6. Success response
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    grade_id: gradeId,
                    submission_id: requestData.submission_id,
                    points_earned: gradeData.points_earned,
                    points_possible: gradeData.points_possible,
                    percentage: grade.percentage,
                    letter_grade: grade.letter_grade,
                    updated_course_grade: courseGrade || null,
                    assignment_class_average: classAverage || null,
                    graded_by: {
                        id: teacherId,
                        name: `${teacher.first_name} ${teacher.last_name}`
                    },
                    graded_at: grade.graded_at
                })
            };

        } catch (transactionError) {
            // Rollback-like handling
            console.error('Transaction error:', transactionError);

            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Failed to complete grading process',
                    details: transactionError.message
                })
            };
        }

    } catch (error) {
        console.error('Error in grade-assignment function:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};

/**
 * Validate incoming request data
 */
function validateRequest(data) {
    const errors = [];

    if (!data.submission_id) {
        errors.push('submission_id is required');
    }

    // Must have either points_earned or rubric_scores
    if (data.points_earned === undefined && !data.rubric_scores) {
        errors.push('Either points_earned or rubric_scores must be provided');
    }

    // Validate points_earned if provided
    if (data.points_earned !== undefined) {
        const points = parseFloat(data.points_earned);
        if (isNaN(points) || points < 0) {
            errors.push('points_earned must be a non-negative number');
        }
    }

    // Validate rubric_scores if provided
    if (data.rubric_scores) {
        if (typeof data.rubric_scores !== 'object' || Array.isArray(data.rubric_scores)) {
            errors.push('rubric_scores must be an object');
        } else {
            // Validate each rubric criterion
            for (const [key, value] of Object.entries(data.rubric_scores)) {
                if (!value.score || !value.max) {
                    errors.push(`Rubric criterion "${key}" must have both score and max properties`);
                }
                if (parseFloat(value.score) > parseFloat(value.max)) {
                    errors.push(`Rubric criterion "${key}": score cannot exceed max`);
                }
            }
        }
    }

    // Validate comments if provided
    if (data.comments) {
        if (!Array.isArray(data.comments)) {
            errors.push('comments must be an array');
        } else {
            data.comments.forEach((comment, index) => {
                if (!comment.text) {
                    errors.push(`Comment at index ${index} must have text property`);
                }
                if (comment.type && !['strength', 'improvement', 'general'].includes(comment.type)) {
                    errors.push(`Comment at index ${index} has invalid type. Must be: strength, improvement, or general`);
                }
            });
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Calculate grade data from points or rubric scores
 */
function calculateGradeData(requestData, assignment) {
    let points_earned;
    let points_possible = assignment.total_points;

    // If rubric scores provided, calculate total
    if (requestData.rubric_scores) {
        let rubricTotal = 0;
        let rubricMax = 0;

        for (const criterion of Object.values(requestData.rubric_scores)) {
            rubricTotal += parseFloat(criterion.score);
            rubricMax += parseFloat(criterion.max);
        }

        // Scale to assignment total_points
        points_earned = (rubricTotal / rubricMax) * points_possible;
    } else {
        // Use directly provided points
        points_earned = parseFloat(requestData.points_earned);
    }

    return {
        points_earned: Math.round(points_earned * 100) / 100, // Round to 2 decimal places
        points_possible
    };
}

/**
 * Calculate letter grade from percentage
 */
function getLetterGrade(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
}
