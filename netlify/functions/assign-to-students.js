/**
 * Netlify Serverless Function: Assign Work to Students
 *
 * Purpose: Teachers create assignments from lessons and distribute to students
 * Endpoint: POST /.netlify/functions/assign-to-students
 *
 * Features:
 * - Individual and bulk assignment creation
 * - Support for multiple assignment types (quiz, homework, reading, video, activity)
 * - Direct lesson linking via lesson_key
 * - Quiz data embedding in metadata
 * - Student validation
 * - Transaction-safe bulk operations
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
        };
    }

    try {
        // =====================================================
        // 1. AUTHENTICATION CHECK
        // =====================================================

        const authHeader = event.headers.authorization || event.headers.Authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({
                    error: 'Unauthorized',
                    message: 'Missing or invalid authorization header. Please provide a Bearer token.'
                })
            };
        }

        const token = authHeader.replace('Bearer ', '');

        // Verify the JWT token and get user
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({
                    error: 'Unauthorized',
                    message: 'Invalid or expired token. Please log in again.'
                })
            };
        }

        const teacherId = user.id;

        // Verify user is a teacher or admin
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', teacherId)
            .single();

        if (profileError || !profile || !['teacher', 'admin'].includes(profile.role)) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({
                    error: 'Forbidden',
                    message: 'Only teachers and administrators can create assignments.'
                })
            };
        }

        // =====================================================
        // 2. PARSE AND VALIDATE REQUEST BODY
        // =====================================================

        const requestBody = JSON.parse(event.body);

        const {
            lesson_key,
            assignment_type,
            title,
            description,
            instructions,
            points_possible = 100,
            due_date,
            student_ids,
            quiz_data,
            metadata = {}
        } = requestBody;

        // Validate required fields
        if (!lesson_key) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Missing required field: lesson_key',
                    message: 'lesson_key is required (format: YYYY-MM-DD_subjectKey_period)'
                })
            };
        }

        if (!assignment_type) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Missing required field: assignment_type',
                    message: 'assignment_type must be one of: quiz, homework, reading, video, activity'
                })
            };
        }

        // Validate assignment type
        const validTypes = ['quiz', 'homework', 'reading', 'video', 'activity'];
        if (!validTypes.includes(assignment_type)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Invalid assignment_type',
                    message: `assignment_type must be one of: ${validTypes.join(', ')}`
                })
            };
        }

        if (!title) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Missing required field: title',
                    message: 'Assignment title is required'
                })
            };
        }

        if (!due_date) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Missing required field: due_date',
                    message: 'due_date is required (ISO 8601 format, e.g., 2025-10-25T23:59:59Z)'
                })
            };
        }

        if (!student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Missing or invalid field: student_ids',
                    message: 'student_ids must be a non-empty array of UUIDs'
                })
            };
        }

        // Validate due date format
        const dueDateObj = new Date(due_date);
        if (isNaN(dueDateObj.getTime())) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Invalid due_date format',
                    message: 'due_date must be a valid ISO 8601 timestamp'
                })
            };
        }

        // Validate points_possible
        if (typeof points_possible !== 'number' || points_possible <= 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Invalid points_possible',
                    message: 'points_possible must be a positive number'
                })
            };
        }

        // =====================================================
        // 3. VALIDATE STUDENTS EXIST AND ARE ACTUALLY STUDENTS
        // =====================================================

        const { data: students, error: studentError } = await supabase
            .from('user_profiles')
            .select('id, role, first_name, last_name, email')
            .in('id', student_ids);

        if (studentError) {
            console.error('Error validating students:', studentError);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Database error',
                    message: 'Failed to validate student IDs',
                    details: studentError.message
                })
            };
        }

        // Check if all provided student IDs exist
        if (!students || students.length !== student_ids.length) {
            const foundIds = students ? students.map(s => s.id) : [];
            const missingIds = student_ids.filter(id => !foundIds.includes(id));

            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Invalid student IDs',
                    message: `${missingIds.length} student ID(s) not found in the system`,
                    missing_ids: missingIds
                })
            };
        }

        // Check if all users have student role
        const nonStudents = students.filter(s => s.role !== 'student');
        if (nonStudents.length > 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Invalid student role',
                    message: `${nonStudents.length} user(s) are not students`,
                    invalid_users: nonStudents.map(s => ({
                        id: s.id,
                        name: `${s.first_name} ${s.last_name}`,
                        email: s.email,
                        role: s.role
                    }))
                })
            };
        }

        // =====================================================
        // 4. EXTRACT SUBJECT_KEY FROM LESSON_KEY
        // =====================================================

        // lesson_key format: YYYY-MM-DD_subjectKey_period (e.g., '2025-10-20_9th_ela_1')
        const lessonParts = lesson_key.split('_');

        if (lessonParts.length < 3) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Invalid lesson_key format',
                    message: 'lesson_key must be in format: YYYY-MM-DD_subjectKey_period'
                })
            };
        }

        // Extract subject_key (e.g., '9th_ela' from '2025-10-20_9th_ela_1')
        const subject_key = `${lessonParts[1]}_${lessonParts[2]}`;

        // =====================================================
        // 5. BUILD METADATA OBJECT
        // =====================================================

        const assignmentMetadata = {
            ...metadata,
            created_by_function: 'assign-to-students',
            created_at: new Date().toISOString()
        };

        // If quiz_data is provided, embed it in metadata
        if (assignment_type === 'quiz' && quiz_data) {
            assignmentMetadata.quiz_data = quiz_data;
        }

        // =====================================================
        // 6. BULK CREATE ASSIGNMENTS FOR ALL STUDENTS
        // =====================================================

        const assignmentsToCreate = student_ids.map(student_id => ({
            teacher_id: teacherId,
            student_id: student_id,
            lesson_key: lesson_key,
            subject_key: subject_key,
            assignment_type: assignment_type,
            title: title,
            description: description || null,
            instructions: instructions || null,
            due_date: due_date,
            points_possible: points_possible,
            status: 'assigned',
            metadata: assignmentMetadata
        }));

        // Insert all assignments in a single transaction
        const { data: createdAssignments, error: insertError } = await supabase
            .from('student_assignments')
            .insert(assignmentsToCreate)
            .select('id, student_id, title, assignment_type, due_date, points_possible, status');

        if (insertError) {
            console.error('Error creating assignments:', insertError);

            // Check if it's a duplicate error
            if (insertError.code === '23505') { // PostgreSQL unique violation
                return {
                    statusCode: 409,
                    headers,
                    body: JSON.stringify({
                        error: 'Duplicate assignment',
                        message: 'One or more students already have this assignment',
                        details: insertError.message
                    })
                };
            }

            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Database error',
                    message: 'Failed to create assignments',
                    details: insertError.message
                })
            };
        }

        // =====================================================
        // 7. PREPARE SUCCESS RESPONSE
        // =====================================================

        const assignmentIds = createdAssignments.map(a => a.id);

        // Get student names for better response
        const studentsWithAssignments = createdAssignments.map(assignment => {
            const student = students.find(s => s.id === assignment.student_id);
            return {
                assignment_id: assignment.id,
                student_id: assignment.student_id,
                student_name: `${student.first_name} ${student.last_name}`,
                student_email: student.email,
                title: assignment.title,
                type: assignment.assignment_type,
                due_date: assignment.due_date,
                points_possible: assignment.points_possible,
                status: assignment.status
            };
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: `Successfully created ${createdAssignments.length} assignment(s)`,
                assignments_created: createdAssignments.length,
                assignment_ids: assignmentIds,
                assignment_details: {
                    lesson_key: lesson_key,
                    subject_key: subject_key,
                    title: title,
                    type: assignment_type,
                    due_date: due_date,
                    points_possible: points_possible
                },
                students: studentsWithAssignments
            })
        };

    } catch (error) {
        console.error('Unexpected error in assign-to-students function:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: 'An unexpected error occurred while creating assignments',
                details: error.message
            })
        };
    }
};
