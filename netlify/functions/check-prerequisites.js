/**
 * Netlify Serverless Function: Check Prerequisites
 * Validates if a student has met prerequisites before accessing a lesson
 *
 * POST Query Parameters:
 * - student_id: Required - The student's UUID
 * - lesson_code: Required - The lesson code (e.g., "7_civ_intro")
 * - subject_key: Required - The subject key (e.g., "7th_civics")
 *
 * Returns: JSON with can_access boolean, missing prerequisites, and recommendations
 */

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Get Supabase credentials from environment variables
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Server configuration error',
                    message: 'Missing Supabase credentials'
                })
            };
        }

        // Initialize Supabase client with service role key
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Parse request body
        const body = JSON.parse(event.body || '{}');
        const { student_id, lesson_code, subject_key } = body;

        // Validate required parameters
        if (!student_id || !lesson_code || !subject_key) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Bad Request',
                    message: 'student_id, lesson_code, and subject_key are required'
                })
            };
        }

        // Call the database function to check prerequisites
        const { data, error } = await supabase
            .rpc('can_access_lesson_simple', {
                p_student_id: student_id,
                p_lesson_code: lesson_code,
                p_subject_key: subject_key
            });

        if (error) {
            console.error('Database error:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Database error',
                    message: error.message
                })
            };
        }

        // Get detailed prerequisite chain for context
        const { data: prereqChain, error: chainError } = await supabase
            .rpc('get_prerequisite_chain_simple', {
                p_lesson_code: lesson_code,
                p_max_depth: 5
            });

        if (chainError) {
            console.error('Error fetching prerequisite chain:', chainError);
        }

        // Get student's current mastery levels for the prerequisites
        const missingPrereqs = [];
        if (prereqChain && prereqChain.length > 0) {
            for (const prereq of prereqChain) {
                // Get student's mastery for this prerequisite
                const { data: masteryData } = await supabase
                    .from('standard_mastery')
                    .select('mastery_level, standard_code')
                    .eq('student_id', student_id)
                    .eq('subject_key', subject_key)
                    .order('mastery_level', { ascending: false })
                    .limit(1);

                const currentMastery = masteryData && masteryData.length > 0
                    ? masteryData[0].mastery_level
                    : 0;

                if (currentMastery < prereq.mastery_threshold) {
                    missingPrereqs.push({
                        lesson_code: prereq.prerequisite_code,
                        lesson_title: prereq.prerequisite_code, // TODO: Get actual title from curriculum
                        relationship_type: prereq.relationship_type,
                        current_mastery: currentMastery,
                        required_mastery: prereq.mastery_threshold,
                        mastery_gap: prereq.mastery_threshold - currentMastery
                    });
                }
            }
        }

        // Build response
        const canAccess = data && data.length > 0 ? data[0] : false;
        const response = {
            success: true,
            can_access: canAccess,
            student_id,
            lesson_code,
            subject_key,
            prerequisite_count: prereqChain ? prereqChain.length : 0,
            missing_prerequisites: missingPrereqs,
            recommendations: generateRecommendations(canAccess, missingPrereqs)
        };

        // Log access attempt for audit trail
        await supabase.from('lesson_access_log').insert({
            student_id,
            lesson_code,
            subject_key,
            can_access: canAccess,
            missing_prerequisite_count: missingPrereqs.length,
            timestamp: new Date().toISOString()
        }).catch(err => {
            // Non-blocking: Log error but don't fail the request
            console.warn('Failed to log access attempt:', err);
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response)
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            })
        };
    }
};

/**
 * Generate helpful recommendations based on prerequisite status
 */
function generateRecommendations(canAccess, missingPrereqs) {
    if (canAccess) {
        return 'Student meets all prerequisites and can access this lesson.';
    }

    if (missingPrereqs.length === 0) {
        return 'No prerequisites found for this lesson.';
    }

    const criticalPrereqs = missingPrereqs.filter(p => p.relationship_type === 'required');
    const recommendedPrereqs = missingPrereqs.filter(p => p.relationship_type === 'recommended');

    let recommendation = '';

    if (criticalPrereqs.length > 0) {
        recommendation += `Student must complete ${criticalPrereqs.length} required prerequisite(s) before accessing this lesson. `;

        // Find the prerequisite with the largest mastery gap
        const highestGap = criticalPrereqs.reduce((max, p) =>
            p.mastery_gap > max.mastery_gap ? p : max
        );

        recommendation += `Start with: ${highestGap.lesson_code} (needs ${highestGap.mastery_gap} more mastery level${highestGap.mastery_gap > 1 ? 's' : ''}).`;
    }

    if (recommendedPrereqs.length > 0) {
        recommendation += ` Additionally, ${recommendedPrereqs.length} recommended prerequisite(s) would help improve understanding.`;
    }

    return recommendation;
}
