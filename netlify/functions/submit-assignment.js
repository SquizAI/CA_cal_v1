// Netlify Serverless Function: Submit Assignment
// POST /.netlify/functions/submit-assignment

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key for admin access
const supabase = createClient(
    process.env.SUPABASE_URL || 'https://qypmfilbkvxwyznnenge.supabase.co',
    process.env.SUPABASE_SERVICE_KEY // Service role key, NOT anon key
);

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Method not allowed. Use POST.'
            })
        };
    }

    try {
        // Parse request body
        const data = JSON.parse(event.body);

        // Validate required fields
        if (!data.assignment_id || !data.student_id) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Missing required fields: assignment_id and student_id are required'
                })
            };
        }

        // Validate that at least one submission method is provided
        if (!data.file_urls?.length && !data.text_response && !data.link_url) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'At least one submission method required (files, text, or link)'
                })
            };
        }

        // Prepare submission data
        const submissionData = {
            assignment_id: data.assignment_id,
            student_id: data.student_id,
            submission_type: data.submission_type || 'homework',
            file_urls: data.file_urls || [],
            text_response: data.text_response || null,
            link_url: data.link_url || null,
            student_notes: data.student_notes || null,
            submitted_at: data.submitted_at || new Date().toISOString(),
            status: 'submitted',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Insert submission into database
        const { data: submission, error } = await supabase
            .from('homework_submissions')
            .insert([submissionData])
            .select()
            .single();

        if (error) {
            console.error('Supabase insert error:', error);

            // Check if error is due to missing table
            if (error.message.includes('relation') && error.message.includes('does not exist')) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'Database table not found. Please run the setup SQL to create homework_submissions table.',
                        details: error.message
                    })
                };
            }

            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Failed to save submission to database',
                    details: error.message
                })
            };
        }

        // Log successful submission
        console.log('Homework submitted successfully:', {
            submission_id: submission.id,
            student_id: data.student_id,
            assignment_id: data.assignment_id,
            type: data.submission_type
        });

        // Return success response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                submission_id: submission.id,
                submitted_at: submission.submitted_at,
                message: 'Assignment submitted successfully'
            })
        };

    } catch (error) {
        console.error('Function error:', error);

        // Handle JSON parse errors
        if (error instanceof SyntaxError) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid JSON in request body'
                })
            };
        }

        // Generic error response
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error',
                details: error.message
            })
        };
    }
};
