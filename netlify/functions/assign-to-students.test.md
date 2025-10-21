# Testing Guide: assign-to-students Function

## Overview
This document provides testing examples for the `assign-to-students` Netlify serverless function.

**Endpoint:** `POST /.netlify/functions/assign-to-students`

## Prerequisites
1. Teacher account with valid JWT token
2. Student account(s) in the system
3. Valid lesson_key from the lessons calendar

## Authentication
All requests require a Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Test Cases

### 1. Basic Assignment Creation (Single Student)

**Request:**
```json
POST /.netlify/functions/assign-to-students
Authorization: Bearer YOUR_TEACHER_JWT_TOKEN
Content-Type: application/json

{
  "lesson_key": "2025-10-20_9th_ela_1",
  "assignment_type": "homework",
  "title": "Chapter 5 Reading Comprehension",
  "description": "Answer questions about Chapter 5 themes and characters",
  "instructions": "<p>Read Chapter 5 and answer the following questions:</p><ol><li>What is the main theme?</li><li>Describe the protagonist's motivation.</li></ol>",
  "points_possible": 50,
  "due_date": "2025-10-25T23:59:59Z",
  "student_ids": ["550e8400-e29b-41d4-a716-446655440000"]
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully created 1 assignment(s)",
  "assignments_created": 1,
  "assignment_ids": ["a1b2c3d4-e5f6-7890-abcd-ef1234567890"],
  "assignment_details": {
    "lesson_key": "2025-10-20_9th_ela_1",
    "subject_key": "9th_ela",
    "title": "Chapter 5 Reading Comprehension",
    "type": "homework",
    "due_date": "2025-10-25T23:59:59Z",
    "points_possible": 50
  },
  "students": [
    {
      "assignment_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "student_id": "550e8400-e29b-41d4-a716-446655440000",
      "student_name": "John Doe",
      "student_email": "john.doe@school.edu",
      "title": "Chapter 5 Reading Comprehension",
      "type": "homework",
      "due_date": "2025-10-25T23:59:59Z",
      "points_possible": 50,
      "status": "assigned"
    }
  ]
}
```

---

### 2. Bulk Assignment Creation (Multiple Students)

**Request:**
```json
{
  "lesson_key": "2025-10-20_9th_ela_1",
  "assignment_type": "quiz",
  "title": "Key Elements Quiz",
  "description": "Quiz on literary elements covered in class",
  "instructions": "Complete all 10 questions. You have one attempt.",
  "points_possible": 100,
  "due_date": "2025-10-27T17:00:00Z",
  "student_ids": [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440002",
    "550e8400-e29b-41d4-a716-446655440003"
  ]
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully created 3 assignment(s)",
  "assignments_created": 3,
  "assignment_ids": [
    "uuid-1",
    "uuid-2",
    "uuid-3"
  ],
  "assignment_details": {
    "lesson_key": "2025-10-20_9th_ela_1",
    "subject_key": "9th_ela",
    "title": "Key Elements Quiz",
    "type": "quiz",
    "due_date": "2025-10-27T17:00:00Z",
    "points_possible": 100
  },
  "students": [...]
}
```

---

### 3. Quiz Assignment with Quiz Data

**Request:**
```json
{
  "lesson_key": "2025-10-20_7th_civics_2",
  "assignment_type": "quiz",
  "title": "Constitution Fundamentals Quiz",
  "description": "Test your knowledge of the U.S. Constitution",
  "instructions": "Answer all questions to the best of your ability",
  "points_possible": 100,
  "due_date": "2025-10-22T23:59:59Z",
  "student_ids": ["student-uuid-1", "student-uuid-2"],
  "quiz_data": {
    "questions": [
      {
        "id": "q1",
        "type": "multiple-choice",
        "question": "How many amendments are in the Bill of Rights?",
        "options": ["5", "7", "10", "12"],
        "correct_answer": "10",
        "points": 10
      },
      {
        "id": "q2",
        "type": "short-answer",
        "question": "Explain the concept of separation of powers.",
        "points": 20
      }
    ],
    "time_limit_minutes": 30,
    "passing_score": 70
  }
}
```

**Note:** Quiz data is stored in the `metadata` field as `metadata.quiz_data`

---

### 4. Video Assignment

**Request:**
```json
{
  "lesson_key": "2025-10-20_9th_ela_1",
  "assignment_type": "video",
  "title": "Watch: Themes in Literature",
  "description": "Watch the video and take notes on key themes",
  "instructions": "<p>Watch the video linked below and submit a one-paragraph summary.</p><p>Video: https://example.com/themes-video</p>",
  "points_possible": 25,
  "due_date": "2025-10-23T23:59:59Z",
  "student_ids": ["student-uuid-1"],
  "metadata": {
    "video_url": "https://example.com/themes-video",
    "video_duration_minutes": 15
  }
}
```

---

### 5. Reading Assignment

**Request:**
```json
{
  "lesson_key": "2025-10-20_9th_ela_1",
  "assignment_type": "reading",
  "title": "Read Chapter 6: The Climax",
  "description": "Read and annotate Chapter 6",
  "instructions": "Read Chapter 6 and make at least 5 annotations highlighting important plot points.",
  "points_possible": 30,
  "due_date": "2025-10-24T08:00:00Z",
  "student_ids": ["student-uuid-1", "student-uuid-2"]
}
```

---

## Error Response Examples

### Missing Authentication (401)
```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid authorization header. Please provide a Bearer token."
}
```

### Invalid Role (403)
```json
{
  "error": "Forbidden",
  "message": "Only teachers and administrators can create assignments."
}
```

### Missing Required Field (400)
```json
{
  "error": "Missing required field: lesson_key",
  "message": "lesson_key is required (format: YYYY-MM-DD_subjectKey_period)"
}
```

### Invalid Assignment Type (400)
```json
{
  "error": "Invalid assignment_type",
  "message": "assignment_type must be one of: quiz, homework, reading, video, activity"
}
```

### Invalid Student IDs (400)
```json
{
  "error": "Invalid student IDs",
  "message": "2 student ID(s) not found in the system",
  "missing_ids": ["invalid-uuid-1", "invalid-uuid-2"]
}
```

### Non-Student User (400)
```json
{
  "error": "Invalid student role",
  "message": "1 user(s) are not students",
  "invalid_users": [
    {
      "id": "teacher-uuid",
      "name": "Jane Smith",
      "email": "jane.smith@school.edu",
      "role": "teacher"
    }
  ]
}
```

### Duplicate Assignment (409)
```json
{
  "error": "Duplicate assignment",
  "message": "One or more students already have this assignment",
  "details": "duplicate key value violates unique constraint..."
}
```

### Database Error (500)
```json
{
  "error": "Database error",
  "message": "Failed to create assignments",
  "details": "connection timeout"
}
```

---

## Using curl for Testing

### Example: Create assignment for 3 students
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/assign-to-students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TEACHER_JWT_TOKEN" \
  -d '{
    "lesson_key": "2025-10-20_9th_ela_1",
    "assignment_type": "quiz",
    "title": "Midterm Quiz",
    "description": "Comprehensive quiz covering chapters 1-6",
    "instructions": "Complete all questions within 45 minutes",
    "points_possible": 100,
    "due_date": "2025-10-28T15:00:00Z",
    "student_ids": ["uuid1", "uuid2", "uuid3"]
  }'
```

---

## Database Verification

After creating assignments, verify in Supabase:

```sql
-- Check created assignments
SELECT
    id,
    student_id,
    title,
    assignment_type,
    status,
    points_possible,
    due_date,
    created_at
FROM student_assignments
WHERE lesson_key = '2025-10-20_9th_ela_1'
ORDER BY created_at DESC;

-- Check with student names
SELECT
    sa.id,
    sa.title,
    sa.assignment_type,
    sa.status,
    up.first_name || ' ' || up.last_name as student_name,
    up.email as student_email,
    sa.due_date
FROM student_assignments sa
JOIN user_profiles up ON sa.student_id = up.id
WHERE sa.lesson_key = '2025-10-20_9th_ela_1';
```

---

## Notes

1. **Automatic Notifications:** The database trigger `notify_on_assignment_created` automatically creates notifications for students when assignments are created.

2. **Subject Key Extraction:** The function automatically extracts `subject_key` from `lesson_key`. For example:
   - `2025-10-20_9th_ela_1` → subject_key: `9th_ela`
   - `2025-10-20_7th_civics_2` → subject_key: `7th_civics`

3. **Unique Constraint:** The database prevents duplicate assignments based on: `(student_id, lesson_key, assignment_type, title)`

4. **Overdue Status:** A scheduled job or trigger should periodically update assignments to 'overdue' status using the `update_overdue_assignments()` function.

5. **Quiz Data Storage:** For quiz assignments, include the `quiz_data` field. It will be stored in `metadata.quiz_data` for later retrieval.

6. **Metadata Field:** Use the `metadata` field to store any additional custom data relevant to your assignment (e.g., video URLs, reading pages, activity instructions).

---

## Integration with Frontend

Example JavaScript/TypeScript code for frontend integration:

```javascript
async function assignWorkToStudents(assignmentData, token) {
  try {
    const response = await fetch('/.netlify/functions/assign-to-students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(assignmentData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create assignment');
    }

    console.log(`Created ${result.assignments_created} assignment(s)`);
    console.log('Assignment IDs:', result.assignment_ids);

    return result;
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
}

// Usage
const assignmentData = {
  lesson_key: '2025-10-20_9th_ela_1',
  assignment_type: 'quiz',
  title: 'Chapter Quiz',
  description: 'Test on Chapter 5',
  instructions: 'Complete all questions',
  points_possible: 100,
  due_date: '2025-10-25T23:59:59Z',
  student_ids: ['student-id-1', 'student-id-2']
};

const result = await assignWorkToStudents(assignmentData, userToken);
```

---

## Performance Considerations

- **Bulk Inserts:** The function uses a single transaction to insert all assignments, making it efficient for large classes.
- **Student Validation:** Validates all student IDs in a single query before creating assignments.
- **Transaction Safety:** If any assignment fails, the entire operation is rolled back.
- **Recommended Batch Size:** Up to 50 students per request for optimal performance.

---

## Security Features

1. **JWT Authentication:** Verifies user identity via Bearer token
2. **Role-Based Access:** Only teachers and admins can create assignments
3. **Student Validation:** Ensures all target users exist and have 'student' role
4. **Input Validation:** Validates all required fields and data types
5. **SQL Injection Protection:** Uses parameterized queries via Supabase client
6. **CORS Protection:** Configurable CORS headers
