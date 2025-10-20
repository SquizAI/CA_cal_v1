// Netlify Function to setup database schema
// Creates tables needed for user profiles, subjects, and enrollments
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

    // SQL to create necessary tables
    const setupSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types if they don't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'student',
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    grade_level INTEGER CHECK (grade_level IN (7, 9, 11)),
    student_id TEXT UNIQUE,
    avatar_url TEXT,
    phone TEXT,
    parent_email TEXT,
    parent_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_key TEXT NOT NULL UNIQUE,
    subject_name TEXT NOT NULL,
    grade_level INTEGER NOT NULL CHECK (grade_level IN (7, 9, 11)),
    color TEXT NOT NULL,
    description TEXT,
    teacher_id UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, subject_id)
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Everyone can view subjects" ON subjects;
DROP POLICY IF EXISTS "Students can view own enrollments" ON enrollments;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Everyone can view subjects" ON subjects
    FOR SELECT USING (true);

CREATE POLICY "Students can view own enrollments" ON enrollments
    FOR SELECT USING (student_id = auth.uid());

-- Insert subjects if they don't exist
INSERT INTO subjects (subject_key, subject_name, grade_level, color) VALUES
    ('7th_civics', 'Civics', 7, '#3B82F6'),
    ('7th_ela', 'English Language Arts', 7, '#8B5CF6'),
    ('7th_math', 'Pre-Algebra', 7, '#10B981'),
    ('7th_science', 'Life Science', 7, '#F59E0B'),
    ('9th_ela', 'English Language Arts', 9, '#8B5CF6'),
    ('9th_world_history', 'World History', 9, '#EF4444'),
    ('9th_math', 'Geometry', 9, '#10B981'),
    ('11th_us_gvmnt', 'U.S. Government', 11, '#3B82F6'),
    ('11th_math', 'Pre-Calculus', 11, '#10B981')
ON CONFLICT (subject_key) DO NOTHING;
`;

    // Execute SQL using PostgREST
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        sql: setupSQL
      })
    });

    // Since direct SQL execution might not work through REST API,
    // let's return the SQL for manual execution
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Database schema setup SQL generated',
        note: 'Please run this SQL in Supabase SQL Editor',
        sql: setupSQL
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
