// Netlify Function to setup all student login accounts
// Creates auth users and profiles for all students in centner_students table
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

    // 1. Get all active students from centner_students table
    const studentsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/centner_students?is_active=eq.true&select=*`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    if (!studentsResponse.ok) {
      const errorText = await studentsResponse.text();
      throw new Error(`Failed to fetch students: ${errorText}`);
    }

    const students = await studentsResponse.json();
    console.log(`Found ${students.length} active students`);

    const results = [];

    // 2. Create auth account for each student
    for (const student of students) {
      try {
        // Generate password: FirstName2025! (e.g., Giacomo2025!)
        const password = `${student.first_name}2025!`;

        console.log(`Creating account for ${student.first_name} ${student.last_name} (${student.email})`);

        // Create auth user using Admin API
        const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
          },
          body: JSON.stringify({
            email: student.email,
            password: password,
            email_confirm: true,  // Auto-confirm email
            user_metadata: {
              first_name: student.first_name,
              last_name: student.last_name,
              role: 'student',
              grade_level: student.grade_level,
              student_id: student.id
            }
          })
        });

        if (!authResponse.ok) {
          const errorText = await authResponse.text();

          // If user already exists, that's okay
          if (errorText.includes('already exists') || errorText.includes('already been registered')) {
            console.log(`User ${student.email} already exists, skipping...`);
            results.push({
              email: student.email,
              name: `${student.first_name} ${student.last_name}`,
              grade: student.grade_level,
              status: 'already_exists',
              message: 'Auth account already exists'
            });
            continue;
          }

          throw new Error(`Failed to create auth user for ${student.email}: ${errorText}`);
        }

        const authData = await authResponse.json();
        const authUserId = authData.id;

        console.log(`Created auth user ${authUserId} for ${student.email}`);

        // Create user profile
        const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            id: authUserId,
            role: 'student',
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email,
            grade_level: parseInt(student.grade_level.replace(/[^0-9]/g, '')), // Convert "7th" to 7
            student_id: student.id
          })
        });

        if (!profileResponse.ok) {
          const errorText = await profileResponse.text();
          console.error(`Profile creation error for ${student.email}:`, errorText);
          // Continue even if profile creation fails
        }

        results.push({
          email: student.email,
          name: `${student.first_name} ${student.last_name}`,
          grade: student.grade_level,
          password: password,
          auth_user_id: authUserId,
          status: 'created',
          message: 'Account created successfully'
        });

      } catch (error) {
        console.error(`Error creating account for ${student.email}:`, error);
        results.push({
          email: student.email,
          name: `${student.first_name} ${student.last_name}`,
          grade: student.grade_level,
          status: 'error',
          message: error.message
        });
      }
    }

    // Count results
    const created = results.filter(r => r.status === 'created').length;
    const existing = results.filter(r => r.status === 'already_exists').length;
    const errors = results.filter(r => r.status === 'error').length;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Student login setup complete',
        summary: {
          total: students.length,
          created,
          existing,
          errors
        },
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
