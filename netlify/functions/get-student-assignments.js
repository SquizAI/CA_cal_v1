// Converted from TypeScript to JavaScript for Netlify deployment
import { createClient } from "@supabase/supabase-js";

/**
 * Netlify Serverless Function: Get Student Assignments
 *
 * Purpose: Retrieves student assignments with flexible filtering for dashboard display
 *
 * Query Parameters:
 * - status: Filter by status ('assigned', 'submitted', 'graded', 'overdue') - optional
 * - class_id: Filter by subject like '9th_ela' - optional
 * - limit: Number of results (default: 50) - optional
 * - sort: Sort by 'due_date' or 'assigned_date' (default: 'due_date') - optional
 *
 * Returns: JSON array of assignments with related data (submission, grade, time remaining)
 */

// TypeScript interfaces removed for JavaScript compatibility
// AssignmentRecord and FormattedAssignment types are implicit

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

export default async (req, context) => {
  // Only allow GET requests
  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  try {
    // Get Supabase credentials from environment variables
    const supabaseUrl = Netlify.env.get("VITE_SUPABASE_URL") || Netlify.env.get("SUPABASE_URL");
    const supabaseKey = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({
          error: "Server configuration error",
          message: "Missing Supabase credentials"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse query parameters from URL
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const classId = url.searchParams.get("class_id");
    const limitParam = url.searchParams.get("limit");
    const sortParam = url.searchParams.get("sort");
    const studentId = url.searchParams.get("student_id");

    // Validate student_id (required for security)
    if (!studentId) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "student_id is required"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Parse limit (default: 50, max: 100)
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 100) : 50;

    // Parse sort (default: due_date)
    const sortBy = sortParam === "assigned_date" ? "assigned_date" : "due_date";

    // Build query
    let query = supabase
      .from("student_assignments")
      .select("*")
      .eq("student_id", studentId);

    // Apply status filter if provided
    if (status) {
      const validStatuses = ["assigned", "submitted", "graded", "overdue"];
      if (validStatuses.includes(status)) {
        query = query.eq("status", status);
      }
    }

    // Apply class_id (subject_key) filter if provided
    if (classId) {
      query = query.eq("subject_key", classId);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: true });

    // Apply limit
    query = query.limit(limit);

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return new Response(
        JSON.stringify({
          error: "Database error",
          message: error.message
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Format response data
    const assignments = data.map(formatAssignment);

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        assignments,
        total: assignments.length,
        filters: {
          status: status || "all",
          class_id: classId || "all",
          sort: sortBy,
          limit
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

export const config: Config = {
  path: "/api/student-assignments"
};
