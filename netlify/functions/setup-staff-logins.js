// Netlify Function to setup teacher and admin login accounts
// Updates existing auth accounts with proper passwords and metadata
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

    // Staff accounts to update/create
    const staffAccounts = [
      {
        email: 'brett@centneracademy.com',
        password: 'Brett2025!',
        first_name: 'Brett',
        last_name: 'Centner',
        role: 'admin',
        is_teacher: true,
        is_admin: true
      },
      {
        email: 'teacher@centneracademy.com',
        password: 'Teacher2025!',
        first_name: 'Demo',
        last_name: 'Teacher',
        role: 'teacher',
        is_teacher: true,
        is_admin: false
      },
      {
        email: 'admin@centneracademy.com',
        password: 'Admin2025!',
        first_name: 'Demo',
        last_name: 'Admin',
        role: 'admin',
        is_teacher: false,
        is_admin: true
      }
    ];

    const results = [];

    for (const account of staffAccounts) {
      try {
        console.log(`Processing account for ${account.email}`);

        // Try to update existing user first
        let authUserId = null;

        // Get existing user by email
        const listResponse = await fetch(
          `${SUPABASE_URL}/auth/v1/admin/users`,
          {
            headers: {
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
            }
          }
        );

        if (listResponse.ok) {
          const users = await listResponse.json();
          const existingUser = users.users?.find(u => u.email === account.email);

          if (existingUser) {
            authUserId = existingUser.id;
            console.log(`Found existing user ${account.email} with ID ${authUserId}`);

            // Update existing user
            const updateResponse = await fetch(
              `${SUPABASE_URL}/auth/v1/admin/users/${authUserId}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': SUPABASE_SERVICE_ROLE_KEY,
                  'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
                },
                body: JSON.stringify({
                  password: account.password,
                  email_confirm: true,
                  user_metadata: {
                    first_name: account.first_name,
                    last_name: account.last_name,
                    role: account.role
                  }
                })
              }
            );

            if (!updateResponse.ok) {
              const errorText = await updateResponse.text();
              throw new Error(`Failed to update user ${account.email}: ${errorText}`);
            }

            results.push({
              email: account.email,
              name: `${account.first_name} ${account.last_name}`,
              role: account.role,
              password: account.password,
              auth_user_id: authUserId,
              status: 'updated',
              message: 'Auth account updated successfully'
            });

            console.log(`Updated auth user ${authUserId} for ${account.email}`);
            continue;
          }
        }

        // If user doesn't exist, create new one
        console.log(`Creating new account for ${account.email}`);

        const createResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
          },
          body: JSON.stringify({
            email: account.email,
            password: account.password,
            email_confirm: true,
            user_metadata: {
              first_name: account.first_name,
              last_name: account.last_name,
              role: account.role
            }
          })
        });

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          throw new Error(`Failed to create auth user for ${account.email}: ${errorText}`);
        }

        const authData = await createResponse.json();
        authUserId = authData.id;

        console.log(`Created auth user ${authUserId} for ${account.email}`);

        // Create/update teacher record if applicable
        if (account.is_teacher) {
          const teacherResponse = await fetch(`${SUPABASE_URL}/rest/v1/teachers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({
              auth_user_id: authUserId,
              first_name: account.first_name,
              last_name: account.last_name,
              email: account.email,
              subjects_taught: ['7th_civics', '7th_ela', '7th_math', '7th_science',
                               '9th_ela', '9th_world_history', '9th_math',
                               '11th_us_gvmnt', '11th_ela', '11th_math'],
              is_active: true
            })
          });

          if (!teacherResponse.ok) {
            const errorText = await teacherResponse.text();
            console.error(`Teacher record error for ${account.email}:`, errorText);
          }
        }

        // Create/update admin record if applicable
        if (account.is_admin) {
          const adminResponse = await fetch(`${SUPABASE_URL}/rest/v1/admins`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({
              auth_user_id: authUserId,
              first_name: account.first_name,
              last_name: account.last_name,
              email: account.email,
              permissions: ['manage_users', 'view_analytics', 'edit_curriculum', 'manage_schedule'],
              is_super_admin: account.email === 'brett@centneracademy.com'
            })
          });

          if (!adminResponse.ok) {
            const errorText = await adminResponse.text();
            console.error(`Admin record error for ${account.email}:`, errorText);
          }
        }

        results.push({
          email: account.email,
          name: `${account.first_name} ${account.last_name}`,
          role: account.role,
          password: account.password,
          auth_user_id: authUserId,
          status: 'created',
          message: 'Account created successfully'
        });

      } catch (error) {
        console.error(`Error processing account for ${account.email}:`, error);
        results.push({
          email: account.email,
          name: `${account.first_name} ${account.last_name}`,
          role: account.role,
          status: 'error',
          message: error.message
        });
      }
    }

    // Count results
    const created = results.filter(r => r.status === 'created').length;
    const updated = results.filter(r => r.status === 'updated').length;
    const errors = results.filter(r => r.status === 'error').length;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Staff login setup complete',
        summary: {
          total: staffAccounts.length,
          created,
          updated,
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
