// Netlify Function to setup demo users using Supabase Admin API
// This function creates auth users and user profiles for demo accounts
// Requires SUPABASE_SERVICE_ROLE_KEY environment variable

const fetch = globalThis.fetch || require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const SUPABASE_URL = 'https://qypmfilbkvxwyznnenge.supabase.co';
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' })
      };
    }

    // Demo users to create
    const demoUsers = [
      {
        email: 'brett@centneracademy.com',
        password: 'Brett2025Admin!',
        role: 'admin',
        first_name: 'Brett',
        last_name: 'Centner',
        grade_level: null
      },
      {
        email: 'demo.teacher@centneracademy.com',
        password: 'Teacher2025!',
        role: 'teacher',
        first_name: 'Demo',
        last_name: 'Teacher',
        grade_level: null
      },
      {
        email: 'demo.student@centneracademy.com',
        password: 'Student2025!',
        role: 'student',
        first_name: 'Demo',
        last_name: 'Student',
        grade_level: 7,
        student_id: 'DEMO-7-001'
      }
    ];

    const results = [];

    // Create each user
    for (const user of demoUsers) {
      try {
        // 1. Create auth user using Admin API
        const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
          },
          body: JSON.stringify({
            email: user.email,
            password: user.password,
            email_confirm: true,  // Auto-confirm email
            user_metadata: {
              first_name: user.first_name,
              last_name: user.last_name,
              role: user.role
            }
          })
        });

        if (!authResponse.ok) {
          const errorText = await authResponse.text();

          // If user already exists, try to get their ID
          if (errorText.includes('already exists') || errorText.includes('already been registered')) {
            console.log(`User ${user.email} already exists, skipping...`);
            results.push({
              email: user.email,
              status: 'already_exists',
              message: 'User already exists'
            });
            continue;
          }

          throw new Error(`Failed to create auth user: ${errorText}`);
        }

        const authData = await authResponse.json();
        const userId = authData.id;

        // 2. Create user profile
        const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            id: userId,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            grade_level: user.grade_level,
            student_id: user.student_id || null
          })
        });

        if (!profileResponse.ok) {
          const errorText = await profileResponse.text();
          console.error(`Profile creation error for ${user.email}:`, errorText);
          // Continue even if profile creation fails - we can create it later
        }

        // 3. If student, create enrollments
        if (user.role === 'student' && user.grade_level) {
          // Get all subjects for this grade
          const subjectsResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/subjects?grade_level=eq.${user.grade_level}&select=id`,
            {
              headers: {
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
              }
            }
          );

          if (subjectsResponse.ok) {
            const subjects = await subjectsResponse.json();

            // Create enrollments
            for (const subject of subjects) {
              await fetch(`${SUPABASE_URL}/rest/v1/enrollments`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': SUPABASE_SERVICE_ROLE_KEY,
                  'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                  'Prefer': 'resolution=ignore-duplicates'
                },
                body: JSON.stringify({
                  student_id: userId,
                  subject_id: subject.id
                })
              });
            }
          }
        }

        results.push({
          email: user.email,
          user_id: userId,
          status: 'created',
          message: 'User created successfully'
        });

      } catch (error) {
        console.error(`Error creating user ${user.email}:`, error);
        results.push({
          email: user.email,
          status: 'error',
          message: error.message
        });
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Demo user setup complete',
        results: results
      })
    };

  } catch (error) {
    console.error('Setup error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
