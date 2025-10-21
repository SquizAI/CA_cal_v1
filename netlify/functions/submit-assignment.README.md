# Submit Assignment Function

## Overview
Netlify serverless function that allows students to submit completed assignments with automatic quiz grading support.

**File Location**: `/netlify/functions/submit-assignment.js`

**Endpoint**: `POST /.netlify/functions/submit-assignment`

## Features

- ✅ Student authentication validation
- ✅ Assignment verification and access control
- ✅ Support for 4 submission types: quiz, file upload, text response, link
- ✅ Automatic quiz grading with score calculation
- ✅ Multiple attempt tracking
- ✅ Late submission detection
- ✅ Automatic grade entry creation for quizzes
- ✅ Student assignment status updates

## Authentication

All requests must include a valid Supabase authentication token in the Authorization header:

```
Authorization: Bearer <supabase_jwt_token>
```

The token is used to:
1. Identify the student making the submission
2. Verify they have access to the assignment
3. Prevent unauthorized submissions

## Request Format

### Headers
```http
Content-Type: application/json
Authorization: Bearer <token>
```

### Submission Types

#### 1. Quiz Submission
```json
{
  "assignment_id": "uuid-123",
  "submission_type": "quiz_answers",
  "answers": [
    {
      "question_id": "q1",
      "answer": "B"
    },
    {
      "question_id": "q2",
      "answer": ["A", "C"]
    }
  ],
  "time_spent_seconds": 1800
}
```

**Quiz Features**:
- Automatic grading based on correct answers stored in `assignments.quiz_questions`
- Supports single-choice and multiple-choice questions
- Case-insensitive answer comparison
- Immediate score calculation and feedback
- Creates `grades` entry automatically

#### 2. Homework/File Submission
```json
{
  "assignment_id": "uuid-456",
  "submission_type": "file_upload",
  "file_urls": [
    "https://storage.supabase.co/.../essay.pdf",
    "https://storage.supabase.co/.../diagram.png"
  ]
}
```

#### 3. Text Response Submission
```json
{
  "assignment_id": "uuid-789",
  "submission_type": "text_response",
  "text_response": "My essay content here...\n\nThis is a multi-paragraph response."
}
```

#### 4. Link Submission
```json
{
  "assignment_id": "uuid-abc",
  "submission_type": "link",
  "link_url": "https://docs.google.com/document/d/..."
}
```

## Response Format

### Success Response (200)

#### Auto-Graded Quiz
```json
{
  "success": true,
  "submission_id": "uuid-sub-123",
  "attempt_number": 1,
  "score": 85.5,
  "auto_graded": true,
  "grade_id": "uuid-grade-456",
  "message": "Assignment submitted and graded! Score: 85.5/100"
}
```

#### Non-Quiz Submission
```json
{
  "success": true,
  "submission_id": "uuid-sub-789",
  "attempt_number": 1,
  "score": null,
  "auto_graded": false,
  "grade_id": null,
  "message": "Assignment submitted successfully. Your teacher will grade it soon."
}
```

### Error Responses

#### 400 - Missing Required Fields
```json
{
  "error": "Missing required fields",
  "required": ["assignment_id", "submission_type"]
}
```

#### 400 - Invalid Submission Type
```json
{
  "error": "Invalid submission_type",
  "validTypes": ["quiz_answers", "file_upload", "text_response", "link"]
}
```

#### 400 - Max Attempts Exceeded
```json
{
  "error": "Maximum submission attempts exceeded",
  "message": "You have reached the maximum number of attempts for this assignment"
}
```

#### 401 - Authentication Error
```json
{
  "error": "Invalid authentication token"
}
```

#### 404 - Assignment Not Found
```json
{
  "error": "Assignment not found"
}
```

#### 500 - Server Error
```json
{
  "error": "Internal server error",
  "details": "Error message details"
}
```

## Database Operations

### Tables Modified

1. **submissions** - Inserts new submission record
2. **grades** - Creates grade entry (auto-graded quizzes only)
3. **student_assignments** - Updates status to 'submitted' or 'graded'

### Functions Called

- `can_student_submit(p_student_id, p_assignment_id)` - Checks if student can submit another attempt

## Quiz Grading Algorithm

The `calculateQuizScore()` function:

1. Parses quiz questions from `assignments.quiz_questions` (JSON/array)
2. Compares student answers with correct answers
3. Handles multiple answer formats:
   - Single choice (string/number)
   - Multiple choice (arrays)
   - Case-insensitive text matching
4. Calculates points: `(correct_answers / total_questions) * points_possible`
5. Returns score with breakdown

### Answer Comparison Logic

```javascript
// Single answer
correctAnswer: "B"
studentAnswer: "B" → ✓ Correct

// Multiple answers (order independent)
correctAnswer: ["A", "C", "D"]
studentAnswer: ["D", "A", "C"] → ✓ Correct

// Case insensitive
correctAnswer: "Paris"
studentAnswer: "paris" → ✓ Correct
```

## Usage Examples

### Frontend Implementation (React/Vue/etc.)

```javascript
async function submitAssignment(assignmentId, submissionData) {
  const token = supabase.auth.session()?.access_token;

  const response = await fetch('/.netlify/functions/submit-assignment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      assignment_id: assignmentId,
      ...submissionData
    })
  });

  const result = await response.json();

  if (result.success) {
    console.log('Submitted!', result);
    if (result.auto_graded) {
      alert(`Score: ${result.score} points!`);
    }
  } else {
    console.error('Submission failed:', result.error);
  }

  return result;
}

// Example: Submit quiz
await submitAssignment('abc-123', {
  submission_type: 'quiz_answers',
  answers: [
    { question_id: 'q1', answer: 'B' },
    { question_id: 'q2', answer: ['A', 'C'] }
  ],
  time_spent_seconds: 1200
});

// Example: Submit essay
await submitAssignment('xyz-789', {
  submission_type: 'file_upload',
  file_urls: ['https://storage.../essay.pdf']
});
```

### cURL Testing

```bash
# Get token first
TOKEN=$(curl -X POST https://your-project.supabase.co/auth/v1/token \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"pass123"}' \
  | jq -r '.access_token')

# Submit quiz
curl -X POST https://your-site.netlify.app/.netlify/functions/submit-assignment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "assignment_id": "uuid-123",
    "submission_type": "quiz_answers",
    "answers": [
      {"question_id": "q1", "answer": "B"},
      {"question_id": "q2", "answer": ["A", "C"]}
    ]
  }'
```

## Security Features

✅ **Authentication Required** - Uses Supabase JWT tokens
✅ **Student Verification** - Checks assignment access
✅ **Attempt Limits** - Prevents unlimited re-submissions
✅ **Input Validation** - Validates all input fields
✅ **SQL Injection Protection** - Uses Supabase client (parameterized queries)
✅ **CORS Enabled** - Allows frontend integration

## Error Handling

The function handles:
- Missing/invalid authentication
- Assignment not found
- Student not assigned to assignment
- Invalid submission types
- Missing required fields per submission type
- Maximum attempts exceeded
- Database errors
- Quiz grading failures (non-critical)

## Environment Variables Required

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Testing Checklist

- [ ] Test quiz submission with single-choice questions
- [ ] Test quiz submission with multiple-choice questions
- [ ] Test file upload submission
- [ ] Test text response submission
- [ ] Test link submission
- [ ] Test with missing authentication
- [ ] Test with invalid assignment ID
- [ ] Test maximum attempts enforcement
- [ ] Test late submission detection
- [ ] Test score calculation accuracy
- [ ] Test grade entry creation
- [ ] Test student_assignments status update

## Future Enhancements

Potential improvements:
- Support for partial credit in quiz grading
- File validation (size, type)
- Plagiarism detection integration
- AI-powered essay grading
- Peer review workflow
- Submission drafts (save without submitting)
- Rich text formatting for text responses
- Attachment limits and quotas

## Related Functions

- `generate-assignment.js` - Creates assignments
- `get-curriculum.js` - Retrieves assignments for students
- `setup-database.js` - Database initialization

## Support

For issues or questions:
1. Check server logs in Netlify dashboard
2. Verify environment variables are set
3. Test with cURL to isolate frontend issues
4. Check Supabase database for submission records
