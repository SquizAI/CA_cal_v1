# Assign to Students - Netlify Serverless Function

## Overview
This serverless function enables teachers to create and distribute assignments to students from lesson content. It supports individual and bulk assignment creation with comprehensive validation and error handling.

**File Location:** `/netlify/functions/assign-to-students.js`

**Endpoint:** `POST /.netlify/functions/assign-to-students`

---

## Features

- **Bulk Assignment Creation:** Assign work to multiple students in a single API call
- **Multiple Assignment Types:** Support for quiz, homework, reading, video, and activity assignments
- **Lesson Integration:** Direct linking to lessons via `lesson_key`
- **Quiz Data Embedding:** Store quiz questions and answers in assignment metadata
- **Student Validation:** Verifies student existence and role before assignment
- **Authentication & Authorization:** JWT-based authentication with role validation
- **Automatic Subject Extraction:** Extracts subject_key from lesson_key automatically
- **Notification System:** Triggers automatic notifications to students
- **Transaction Safety:** Uses database transactions for bulk operations
- **Comprehensive Error Handling:** Detailed error messages for debugging

---

## API Reference

### Request

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lesson_key` | string | Yes | Lesson identifier (format: `YYYY-MM-DD_subjectKey_period`) |
| `assignment_type` | string | Yes | Type of assignment: `quiz`, `homework`, `reading`, `video`, `activity` |
| `title` | string | Yes | Assignment title (shown to students) |
| `description` | string | No | Brief description of the assignment |
| `instructions` | string | No | Detailed instructions (supports HTML) |
| `points_possible` | number | No | Total points (default: 100) |
| `due_date` | string | Yes | Due date in ISO 8601 format |
| `student_ids` | array | Yes | Array of student UUIDs |
| `quiz_data` | object | No | Quiz questions and settings (for quiz type) |
| `metadata` | object | No | Additional custom data |

**Example Request:**
```json
{
  "lesson_key": "2025-10-20_9th_ela_1",
  "assignment_type": "quiz",
  "title": "Literary Elements Quiz",
  "description": "Quiz covering themes, plot, and character analysis",
  "instructions": "Complete all questions. You have one attempt.",
  "points_possible": 100,
  "due_date": "2025-10-25T23:59:59Z",
  "student_ids": [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440002"
  ],
  "quiz_data": {
    "questions": [
      {
        "id": "q1",
        "type": "multiple-choice",
        "question": "What is the main theme?",
        "options": ["Love", "Revenge", "Hope", "Despair"],
        "correct_answer": "Hope",
        "points": 25
      }
    ],
    "time_limit_minutes": 30
  }
}
```

### Response

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully created 2 assignment(s)",
  "assignments_created": 2,
  "assignment_ids": [
    "uuid-1",
    "uuid-2"
  ],
  "assignment_details": {
    "lesson_key": "2025-10-20_9th_ela_1",
    "subject_key": "9th_ela",
    "title": "Literary Elements Quiz",
    "type": "quiz",
    "due_date": "2025-10-25T23:59:59Z",
    "points_possible": 100
  },
  "students": [
    {
      "assignment_id": "uuid-1",
      "student_id": "550e8400-e29b-41d4-a716-446655440001",
      "student_name": "John Doe",
      "student_email": "john.doe@school.edu",
      "title": "Literary Elements Quiz",
      "type": "quiz",
      "due_date": "2025-10-25T23:59:59Z",
      "points_possible": 100,
      "status": "assigned"
    },
    ...
  ]
}
```

---

## Error Codes

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | Bad Request | Missing or invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | User is not a teacher or admin |
| 405 | Method Not Allowed | HTTP method is not POST |
| 409 | Conflict | Duplicate assignment (same student, lesson, type, title) |
| 500 | Internal Server Error | Database or server error |

**Error Response Format:**
```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": "Additional error context (optional)"
}
```

---

## Assignment Types

### 1. Quiz
For assessments with questions and answers.

**Required Fields:** `title`, `due_date`, `student_ids`

**Optional Fields:** `quiz_data` (recommended)

**Example quiz_data:**
```json
{
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A",
      "points": 10
    }
  ],
  "time_limit_minutes": 30,
  "passing_score": 70,
  "allow_retakes": false
}
```

### 2. Homework
For general homework assignments.

**Example:**
```json
{
  "assignment_type": "homework",
  "title": "Chapter 5 Questions",
  "instructions": "Answer questions 1-10 on page 89",
  "points_possible": 50
}
```

### 3. Reading
For reading assignments.

**Example with metadata:**
```json
{
  "assignment_type": "reading",
  "title": "Read Chapter 6",
  "instructions": "Read and annotate Chapter 6",
  "metadata": {
    "pages": "89-105",
    "annotations_required": 5
  }
}
```

### 4. Video
For video watching assignments.

**Example:**
```json
{
  "assignment_type": "video",
  "title": "Watch: Introduction to Shakespeare",
  "instructions": "Watch the video and submit a summary",
  "metadata": {
    "video_url": "https://example.com/video",
    "video_duration_minutes": 20
  }
}
```

### 5. Activity
For hands-on activities or projects.

**Example:**
```json
{
  "assignment_type": "activity",
  "title": "Create a Character Map",
  "instructions": "Create a visual character map for the novel",
  "points_possible": 75
}
```

---

## Database Schema

The function creates records in the `student_assignments` table:

```sql
CREATE TABLE student_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL,
    student_id UUID NOT NULL,
    lesson_key TEXT NOT NULL,
    subject_key TEXT NOT NULL,
    assignment_type assignment_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    assigned_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_date TIMESTAMPTZ NOT NULL,
    points_possible INTEGER NOT NULL DEFAULT 100,
    points_earned DECIMAL(5,2),
    status assignment_status NOT NULL DEFAULT 'assigned',
    submission_text TEXT,
    submission_urls TEXT[],
    submitted_at TIMESTAMPTZ,
    feedback TEXT,
    rubric_scores JSONB,
    graded_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## How It Works

### 1. Authentication & Authorization
```javascript
// Validates JWT token from Authorization header
// Checks user role is 'teacher' or 'admin'
```

### 2. Request Validation
```javascript
// Validates required fields
// Checks assignment_type is valid
// Validates due_date format
// Ensures student_ids is a non-empty array
```

### 3. Student Validation
```javascript
// Queries database for all student IDs
// Verifies all IDs exist
// Confirms all users have 'student' role
// Returns error if any validation fails
```

### 4. Subject Key Extraction
```javascript
// Extracts subject_key from lesson_key
// Example: '2025-10-20_9th_ela_1' → '9th_ela'
```

### 5. Metadata Construction
```javascript
// Builds metadata object
// Adds quiz_data if assignment_type is 'quiz'
// Includes creation timestamp and function name
```

### 6. Bulk Insert
```javascript
// Creates array of assignment objects
// Inserts all assignments in single transaction
// Returns created assignments with IDs
```

### 7. Response Formatting
```javascript
// Enriches response with student names
// Returns assignment IDs and details
// Provides comprehensive success information
```

---

## Automatic Features

### Database Triggers

1. **Auto Subject Key Extraction**
   - Trigger: `set_subject_key_from_lesson_key`
   - Automatically populates `subject_key` from `lesson_key`

2. **Student Notifications**
   - Trigger: `notify_on_assignment_created`
   - Creates notification for each student when assignment is created
   - Notification includes title, type, and due date

3. **Status Updates**
   - Trigger: `auto_status_update`
   - Updates status to 'submitted' when student submits
   - Updates status to 'graded' when teacher grades

4. **Updated Timestamp**
   - Trigger: `update_student_assignments_updated_at`
   - Automatically updates `updated_at` on any changes

### Scheduled Jobs

- **Overdue Detection:** Periodically runs `update_overdue_assignments()` to mark past-due assignments as 'overdue'

---

## Security Considerations

1. **Authentication Required:** All requests must include valid JWT token
2. **Role-Based Access:** Only teachers and admins can create assignments
3. **Student Validation:** Prevents assigning to non-existent or non-student users
4. **SQL Injection Protection:** Uses parameterized queries
5. **Service Role Key:** Function uses Supabase service role for admin operations
6. **Row Level Security:** Database RLS policies control data access

---

## Environment Variables

Required environment variables in `.env` or Netlify dashboard:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important:** Never commit service role keys to version control!

---

## Integration Example (React)

```javascript
import { useSupabase } from './hooks/useSupabase';

function CreateAssignment({ lessonKey, studentIds }) {
  const { session } = useSupabase();

  const createAssignment = async () => {
    try {
      const response = await fetch('/.netlify/functions/assign-to-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          lesson_key: lessonKey,
          assignment_type: 'quiz',
          title: 'Chapter Quiz',
          description: 'Test your understanding',
          points_possible: 100,
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          student_ids: studentIds,
          quiz_data: {
            questions: [...],
            time_limit_minutes: 30
          }
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      console.log(`Created ${result.assignments_created} assignments`);
      alert(`Successfully assigned to ${result.assignments_created} students`);

      return result;

    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to create assignment: ${error.message}`);
    }
  };

  return (
    <button onClick={createAssignment}>
      Assign to Students
    </button>
  );
}
```

---

## Best Practices

1. **Batch Size:** Keep student_ids array under 50 students per request for optimal performance
2. **Due Dates:** Always set due dates in the future and in UTC format
3. **Quiz Data:** Include complete quiz data for quiz assignments
4. **Error Handling:** Always check response status and handle errors gracefully
5. **Student Selection:** Validate student selection on frontend before API call
6. **Token Refresh:** Ensure JWT token is fresh before making request
7. **Loading States:** Show loading indicators during assignment creation
8. **Success Feedback:** Display confirmation message with assignment details

---

## Troubleshooting

### Common Issues

**Issue:** "Unauthorized" error
- **Solution:** Check that Authorization header includes valid Bearer token

**Issue:** "Invalid student IDs" error
- **Solution:** Verify student UUIDs exist in database and have 'student' role

**Issue:** "Duplicate assignment" error
- **Solution:** Assignment with same student_id, lesson_key, type, and title already exists

**Issue:** "Invalid lesson_key format" error
- **Solution:** Ensure lesson_key follows format: `YYYY-MM-DD_subjectKey_period`

**Issue:** Assignments created but students not notified
- **Solution:** Check that `notifications` table exists and trigger is enabled

---

## Related Functions

- `generate-assessment.js` - Generate quiz content using AI
- `generate-assignment.js` - AI-powered assignment generation
- Database function: `bulk_create_assignments()` - Alternative SQL-based bulk insert
- Database function: `get_student_assignment_summary()` - Get student stats

---

## Changelog

**Version 1.0.0** (2025-10-20)
- Initial release
- Support for 5 assignment types
- Bulk assignment creation
- Student validation
- Quiz data embedding
- Comprehensive error handling

---

## Support

For issues or questions:
1. Check the testing guide: `assign-to-students.test.md`
2. Review database schema: `database/003_enhanced_assignments_schema.sql`
3. Check Netlify function logs for error details
4. Verify environment variables are configured

---

## License

Part of AI Academy Content Generator V2
