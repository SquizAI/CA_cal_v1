# Grade Assignment Function Documentation

## Overview

The `grade-assignment` serverless function allows teachers to manually grade student submissions with comprehensive feedback support. It handles both points-based and rubric-based grading, automatically calculates course grades, and provides detailed grade analytics.

## Endpoint

```
POST /.netlify/functions/grade-assignment
```

## Authentication

Requires a valid Supabase authentication token in the Authorization header:

```
Authorization: Bearer <your-auth-token>
```

Only users registered in the `teachers` table can grade assignments.

## Request Format

### Basic Points-Based Grading

```json
{
  "submission_id": "550e8400-e29b-41d4-a716-446655440000",
  "points_earned": 87.5,
  "feedback": "Great work! Watch citations in future assignments.",
  "return_to_student": true
}
```

### Rubric-Based Grading

```json
{
  "submission_id": "550e8400-e29b-41d4-a716-446655440000",
  "rubric_scores": {
    "research": {
      "score": 18,
      "max": 20
    },
    "presentation": {
      "score": 15,
      "max": 20
    },
    "citations": {
      "score": 8,
      "max": 10
    }
  },
  "feedback": "Excellent research and presentation. Remember to format citations properly.",
  "comments": [
    {
      "type": "strength",
      "text": "Outstanding analysis of primary sources"
    },
    {
      "type": "improvement",
      "text": "Work on APA citation format"
    },
    {
      "type": "general",
      "text": "Consider exploring counter-arguments in future papers"
    }
  ],
  "return_to_student": true
}
```

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `submission_id` | UUID | Yes | ID of the submission to grade |
| `points_earned` | Number | Conditional* | Points earned (0 to points_possible) |
| `rubric_scores` | Object | Conditional* | Rubric-based scores |
| `feedback` | String | No | General teacher feedback |
| `comments` | Array | No | Detailed comment objects |
| `return_to_student` | Boolean | No | Whether to return graded work to student (default: true) |

*Either `points_earned` OR `rubric_scores` must be provided.

### Rubric Score Object Format

Each criterion in `rubric_scores` must have:

```json
{
  "criterion_name": {
    "score": 18,    // Points earned for this criterion
    "max": 20       // Maximum points for this criterion
  }
}
```

### Comment Object Format

```json
{
  "type": "strength|improvement|general",  // Optional, defaults to "general"
  "text": "Your comment text here"
}
```

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "grade_id": "660e8400-e29b-41d4-a716-446655440000",
  "submission_id": "550e8400-e29b-41d4-a716-446655440000",
  "points_earned": 87.5,
  "points_possible": 100,
  "percentage": 87.5,
  "letter_grade": "B",
  "updated_course_grade": 88.2,
  "assignment_class_average": 82.5,
  "graded_by": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "John Smith"
  },
  "graded_at": "2025-10-20T18:30:00.000Z"
}
```

### Error Responses

#### 400 Bad Request - Validation Error

```json
{
  "error": "Validation failed",
  "details": [
    "submission_id is required",
    "Either points_earned or rubric_scores must be provided"
  ]
}
```

#### 401 Unauthorized

```json
{
  "error": "Authentication required. Please provide a valid token."
}
```

#### 403 Forbidden

```json
{
  "error": "Permission denied. You can only grade assignments you created."
}
```

#### 404 Not Found

```json
{
  "error": "Submission not found",
  "details": "No submission exists with the provided ID"
}
```

#### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "message": "Detailed error message"
}
```

## Features

### 1. Dual Grading Modes

- **Points-Based**: Directly specify points earned
- **Rubric-Based**: Automatically calculates total from rubric criteria

### 2. Automatic Calculations

- Percentage calculation (points_earned / points_possible × 100)
- Letter grade assignment (A/B/C/D/F)
- Course grade recalculation
- Class average for the assignment

### 3. Comprehensive Feedback

- General text feedback
- Structured comments (strength/improvement/general)
- Rubric scores with detailed criteria

### 4. Grade History Tracking

- All grade changes are logged in `grade_history` table
- Maintains audit trail of who changed what and when

### 5. Security

- Teacher authentication required
- Permission verification (can only grade own assignments)
- Row-level security policies enforced

## Database Operations

The function performs the following database operations:

1. **Verify Teacher**: Checks user is registered as a teacher
2. **Fetch Submission**: Gets submission details and validates access
3. **Upsert Grade**: Creates or updates grade record
4. **Update Submission Status**: Marks submission as 'graded'
5. **Add Comments**: Inserts teacher comments (if provided)
6. **Calculate Course Grade**: Runs `calculate_course_grade()` function
7. **Compute Class Average**: Calculates assignment's class performance

## Grade Calculation Logic

### Points-Based

```javascript
percentage = (points_earned / points_possible) × 100
```

### Rubric-Based

```javascript
// Sum all rubric criteria
rubric_total = sum(criterion.score for each criterion)
rubric_max = sum(criterion.max for each criterion)

// Scale to assignment total_points
points_earned = (rubric_total / rubric_max) × assignment.total_points
percentage = (points_earned / points_possible) × 100
```

### Letter Grade Scale

| Percentage | Letter Grade |
|------------|--------------|
| 90-100 | A |
| 80-89 | B |
| 70-79 | C |
| 60-69 | D |
| 0-59 | F |

## Course Grade Calculation

After grading, the function triggers `calculate_course_grade()` which:

1. Aggregates all graded assignments for the student in that subject
2. Calculates weighted or simple average based on configuration
3. Updates the `course_grades` table
4. Returns the updated overall grade

## Usage Examples

### Example 1: Simple Points Grading

```javascript
const response = await fetch('/.netlify/functions/grade-assignment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  },
  body: JSON.stringify({
    submission_id: '550e8400-e29b-41d4-a716-446655440000',
    points_earned: 92,
    feedback: 'Excellent work! Clear understanding demonstrated.'
  })
});

const result = await response.json();
console.log(`Grade: ${result.letter_grade} (${result.percentage}%)`);
```

### Example 2: Rubric-Based Grading with Comments

```javascript
const gradeData = {
  submission_id: '550e8400-e29b-41d4-a716-446655440000',
  rubric_scores: {
    content_accuracy: { score: 28, max: 30 },
    organization: { score: 18, max: 20 },
    grammar: { score: 14, max: 15 },
    citations: { score: 32, max: 35 }
  },
  feedback: 'Strong analytical essay with minor citation improvements needed.',
  comments: [
    { type: 'strength', text: 'Excellent thesis statement and argument structure' },
    { type: 'strength', text: 'Strong use of textual evidence' },
    { type: 'improvement', text: 'Review MLA format for in-text citations' },
    { type: 'general', text: 'Consider adding a counter-argument section' }
  ],
  return_to_student: true
};

const response = await fetch('/.netlify/functions/grade-assignment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  },
  body: JSON.stringify(gradeData)
});

const result = await response.json();
console.log('Grading complete:', result);
```

### Example 3: Error Handling

```javascript
async function gradeAssignment(submissionId, points) {
  try {
    const response = await fetch('/.netlify/functions/grade-assignment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        submission_id: submissionId,
        points_earned: points
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Grading failed:', result.error);
      if (result.details) {
        console.error('Details:', result.details);
      }
      return null;
    }

    console.log('Success! Grade:', result.letter_grade);
    console.log('Updated course grade:', result.updated_course_grade);
    return result;

  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}
```

## Testing

See `test-grade-assignment.js` for comprehensive test cases.

## Related Database Tables

- `submissions` - Student assignment submissions
- `grades` - Individual assignment grades
- `grade_history` - Grade change audit trail
- `grade_comments` - Detailed teacher feedback
- `course_grades` - Aggregated course grades
- `assignment_categories` - Grade category weights
- `assignments` - Assignment definitions
- `teachers` - Teacher accounts
- `centner_students` - Student accounts

## Environment Variables Required

```
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Notes

- Grades are stored with 2 decimal precision
- Percentage and letter grade are auto-calculated (generated columns)
- Course grade recalculation happens asynchronously
- Grade history is automatically tracked via database trigger
- Class average includes only completed grades
