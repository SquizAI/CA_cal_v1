/**
 * Netlify Serverless Function: Get Student Assignments
 * Securely fetches student assignments from Supabase
 *
 * Query Parameters:
 * - student_id: Required - The student's UUID
 * - status: Filter by status ('assigned', 'submitted', 'graded', 'overdue') - optional
 * - class_id: Filter by subject like '9th_ela' - optional
 * - limit: Number of results (default: 50) - optional
 * - sort: Sort by 'due_date' or 'assigned_date' (default: 'due_date') - optional
 *
 * Returns: JSON array of assignments with related data (submission, grade, time remaining)
 */

const { createClient } = require('@supabase/supabase-js');

/**
 * Calculate days and hours until due date
 */
function getTimeUntilDue(dueDate) {
  const due = new Date(dueDate);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const isLate = diffMs < 0;

  const absDiffMs = Math.abs(diffMs);
  const days = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return { days, hours, isLate };
}

/**
 * Format assignment data for response
 */
function formatAssignment(assignment) {
  const timeInfo = getTimeUntilDue(assignment.due_date);

  return {
    id: assignment.id,
    title: assignment.title,
    type: assignment.assignment_type,
    due_date: assignment.due_date,
    assigned_date: assignment.assigned_date,
    status: assignment.status,
    points_possible: assignment.points_possible,
    grade: assignment.points_earned,
    subject_key: assignment.subject_key,
    lesson_key: assignment.lesson_key,
    description: assignment.description,
    is_late: timeInfo.isLate,
    days_until_due: timeInfo.days,
    hours_until_due: timeInfo.hours,
    feedback: assignment.feedback,
    submitted_at: assignment.submitted_at
  };
}

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
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

    // Parse query parameters
    const params = event.queryStringParameters || {};
    const { student_id, status, class_id, limit: limitParam, sort: sortParam } = params;

    // Validate student_id (required for security)
    if (!student_id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Bad Request',
          message: 'student_id is required'
        })
      };
    }

    // Parse limit (default: 50, max: 100)
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 100) : 50;

    // Parse sort (default: due_date)
    const sortBy = sortParam === 'assigned_date' ? 'assigned_date' : 'due_date';

    // Build query
    let query = supabase
      .from('student_assignments')
      .select('*')
      .eq('student_id', student_id);

    // Apply status filter if provided
    if (status) {
      const validStatuses = ['assigned', 'submitted', 'graded', 'overdue'];
      if (validStatuses.includes(status)) {
        query = query.eq('status', status);
      }
    }

    // Apply class_id (subject_key) filter if provided
    if (class_id) {
      query = query.eq('subject_key', class_id);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: true });

    // Apply limit
    query = query.limit(limit);

    // Execute query
    const { data, error } = await query;

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

    // Format response data
    const assignments = data.map(formatAssignment);

    // Return successful response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        assignments,
        total: assignments.length,
        filters: {
          status: status || 'all',
          class_id: class_id || 'all',
          sort: sortBy,
          limit
        }
      })
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
