/**
 * Netlify Serverless Function: Get Curriculum
 * Securely fetches curriculum data from Supabase
 * NO KEYS EXPOSED - Uses environment variables
 */

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        // Get Supabase credentials from environment variables (NOT hardcoded!)
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

        // Initialize Supabase client with service role key (server-side only)
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Parse query parameters
        const params = event.queryStringParameters || {};
        const { subject_key, grade_level, day_key } = params;

        // Build query
        let query = supabase
            .from('curriculum_lessons')
            .select('*');

        // Apply filters
        if (subject_key) {
            query = query.eq('subject_key', subject_key);
        }
        if (grade_level) {
            query = query.eq('grade_level', parseInt(grade_level));
        }
        if (day_key) {
            query = query.eq('day_key', day_key);
        }

        // Execute query
        const { data, error } = await query.order('subject_key, day_key');

        if (error) {
            console.error('Supabase error:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Database error',
                    message: error.message
                })
            };
        }

        // Subject metadata mappings (from merge-curriculum.js)
        const subjectNames = {
            '7th_civics': 'Civics',
            '7th_ela': 'English Language Arts',
            '7th_math': 'Pre-Algebra',
            '7th_science': 'Life Science',
            '9th_ela': 'English Language Arts',
            '9th_world_history': 'World History',
            '9th_math': 'Geometry',
            '11th_us_gvmnt': 'U.S. Government',
            '11th_ela': 'American Literature',
            '11th_math': 'Pre-Calculus'
        };

        const colorMapping = {
            '7th_civics': '#3B82F6',
            '7th_ela': '#8B5CF6',
            '7th_math': '#10B981',
            '7th_science': '#F59E0B',
            '9th_ela': '#8B5CF6',
            '9th_world_history': '#EF4444',
            '9th_math': '#10B981',
            '11th_us_gvmnt': '#3B82F6',
            '11th_ela': '#8B5CF6',
            '11th_math': '#10B981'
        };

        const gradeMapping = {
            '7th_civics': 7,
            '7th_ela': 7,
            '7th_math': 7,
            '7th_science': 7,
            '9th_ela': 9,
            '9th_world_history': 9,
            '9th_math': 9,
            '11th_us_gvmnt': 11,
            '11th_ela': 11,
            '11th_math': 11
        };

        // Format response: organize by subject_key and day_key with metadata
        const curriculum = {};
        data.forEach(lesson => {
            if (!curriculum[lesson.subject_key]) {
                curriculum[lesson.subject_key] = {
                    grade: gradeMapping[lesson.subject_key] || lesson.grade_level,
                    subject: subjectNames[lesson.subject_key] || lesson.subject_key,
                    color: colorMapping[lesson.subject_key] || '#6B7280',
                    lessons: {}
                };
            }

            curriculum[lesson.subject_key].lessons[lesson.day_key] = {
                code: lesson.lesson_code,
                title: lesson.title,
                objectives: lesson.objectives,
                standards: lesson.standards,
                materials: lesson.materials || '',
                activities: lesson.activities || [],
                assessment: lesson.assessment || '',
                grade_level: lesson.grade_level
            };
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                curriculum,
                count: data.length
            })
        };

    } catch (error) {
        console.error('Function error:', error);
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
