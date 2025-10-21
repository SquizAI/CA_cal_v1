# Get Student Assignments Function

## Overview

**File**: `get-student-assignments.mts`
**Endpoint**: `GET /api/student-assignments`
**Purpose**: Retrieves student assignments with flexible filtering for student dashboard display

This serverless function provides a secure, optimized API endpoint for fetching student assignments with various filtering options, suitable for powering the "Upcoming Assignments" feature in student dashboards.

---

## API Endpoint

### URL
```
GET /.netlify/functions/get-student-assignments
GET /api/student-assignments (custom path)
```

### Authentication
Requires `student_id` parameter to identify the student. In production, this should be extracted from an authentication token rather than passed as a parameter.

---

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `student_id` | UUID | **Yes** | - | Student's unique identifier (auth.uid) |
| `status` | String | No | all | Filter by assignment status: 'assigned', 'submitted', 'graded', 'overdue' |
| `class_id` | String | No | all | Filter by subject key (e.g., '9th_ela', '7th_civics') |
| `limit` | Number | No | 50 | Number of results to return (max: 100) |
| `sort` | String | No | 'due_date' | Sort by 'due_date' or 'assigned_date' |

---

## Example Requests

### 1. Get All Assignments for a Student
```javascript
const response = await fetch(
  `/api/student-assignments?student_id=${studentId}`
);
const data = await response.json();
```

### 2. Get Pending Assignments Only
```javascript
const response = await fetch(
  `/api/student-assignments?student_id=${studentId}&status=assigned&limit=20`
);
const data = await response.json();
```

### 3. Get Assignments for Specific Subject
```javascript
const response = await fetch(
  `/api/student-assignments?student_id=${studentId}&class_id=9th_ela&sort=due_date`
);
const data = await response.json();
```

### 4. Get Overdue Assignments
```javascript
const response = await fetch(
  `/api/student-assignments?student_id=${studentId}&status=overdue`
);
const data = await response.json();
```

---

## Response Format

### Success Response (200 OK)
```json
{
  "success": true,
  "assignments": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Quiz on Literary Elements",
      "type": "quiz",
      "due_date": "2025-10-25T23:59:59Z",
      "assigned_date": "2025-10-20T08:00:00Z",
      "status": "assigned",
      "points_possible": 100,
      "grade": null,
      "subject_key": "9th_ela",
      "lesson_key": "2025-10-20_9th_ela_2",
      "description": "Quiz covering symbolism and metaphor",
      "is_late": false,
      "days_until_due": 5,
      "hours_until_due": 8,
      "feedback": null,
      "submitted_at": null
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "Essay on Romeo and Juliet",
      "type": "homework",
      "due_date": "2025-10-28T23:59:59Z",
      "assigned_date": "2025-10-18T08:00:00Z",
      "status": "submitted",
      "points_possible": 100,
      "grade": null,
      "subject_key": "9th_ela",
      "lesson_key": "2025-10-18_9th_ela_2",
      "description": "Analyze themes in Act 3",
      "is_late": false,
      "days_until_due": 8,
      "hours_until_due": 2,
      "feedback": null,
      "submitted_at": "2025-10-27T14:30:00Z"
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "title": "Chapter 5 Reading",
      "type": "reading",
      "due_date": "2025-10-18T23:59:59Z",
      "assigned_date": "2025-10-15T08:00:00Z",
      "status": "graded",
      "points_possible": 50,
      "grade": 45,
      "subject_key": "9th_ela",
      "lesson_key": "2025-10-15_9th_ela_2",
      "description": "Complete reading and annotations",
      "is_late": false,
      "days_until_due": 0,
      "hours_until_due": 0,
      "feedback": "Great annotations! Watch for theme connections.",
      "submitted_at": "2025-10-18T15:20:00Z"
    }
  ],
  "total": 3,
  "filters": {
    "status": "all",
    "class_id": "9th_ela",
    "sort": "due_date",
    "limit": 50
  }
}
```

### Error Responses

#### 400 Bad Request - Missing student_id
```json
{
  "error": "Bad Request",
  "message": "student_id is required"
}
```

#### 405 Method Not Allowed
```json
{
  "error": "Method not allowed"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Database error",
  "message": "Detailed error message"
}
```

---

## Response Fields

### Assignment Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique assignment identifier |
| `title` | String | Assignment title |
| `type` | String | Assignment type: 'quiz', 'homework', 'reading', 'video', 'activity' |
| `due_date` | ISO DateTime | When the assignment is due |
| `assigned_date` | ISO DateTime | When the assignment was assigned |
| `status` | String | Current status: 'assigned', 'submitted', 'graded', 'overdue' |
| `points_possible` | Number | Maximum points for this assignment |
| `grade` | Number \| null | Points earned (null if not graded) |
| `subject_key` | String | Subject identifier (e.g., '9th_ela') |
| `lesson_key` | String | Lesson identifier (e.g., '2025-10-20_9th_ela_2') |
| `description` | String \| null | Assignment description |
| `is_late` | Boolean | Whether the assignment is past due |
| `days_until_due` | Number | Days remaining until due (or days overdue if negative) |
| `hours_until_due` | Number | Additional hours beyond days |
| `feedback` | String \| null | Teacher feedback (if graded) |
| `submitted_at` | ISO DateTime \| null | When student submitted (if submitted) |

---

## Database Schema

This function queries the `student_assignments` table:

```sql
SELECT * FROM student_assignments
WHERE student_id = $student_id
  AND status = $status (optional)
  AND subject_key = $class_id (optional)
ORDER BY due_date ASC
LIMIT $limit
```

### Required Database Tables
- `student_assignments` - Main assignments table

### Required Database Functions
None (direct table query)

---

## Security Considerations

### Row Level Security (RLS)
The database has RLS policies that ensure:
- Students can only view their own assignments (`student_id = auth.uid()`)
- Teachers can view assignments they created
- Admins can view all assignments

### Environment Variables Required
- `VITE_SUPABASE_URL` or `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for server-side queries

### Production Security Enhancements Recommended
1. **Authentication Token**: Replace `student_id` query parameter with JWT token validation
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Input Sanitization**: Add additional validation for query parameters
4. **CORS Configuration**: Configure appropriate CORS headers for production domains

---

## Performance Optimizations

### Database Indexes
The following indexes improve query performance (from `003_enhanced_assignments_schema.sql`):

```sql
CREATE INDEX idx_student_assignments_student ON student_assignments(student_id);
CREATE INDEX idx_student_assignments_status ON student_assignments(status);
CREATE INDEX idx_student_assignments_subject ON student_assignments(subject_key);
CREATE INDEX idx_student_assignments_due_date ON student_assignments(due_date);
CREATE INDEX idx_student_assignments_student_status ON student_assignments(student_id, status);
CREATE INDEX idx_student_assignments_student_due ON student_assignments(student_id, due_date)
  WHERE status IN ('assigned', 'submitted');
```

### Query Optimization
- Limited result set (max 100 records)
- Indexed column filtering
- Minimal data transfer (no joins for basic view)

---

## Frontend Integration Example

### React/Vue Component Integration

```javascript
// Student Dashboard Component
import { useEffect, useState } from 'react';

function StudentAssignmentsDashboard({ studentId }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('assigned');

  useEffect(() => {
    fetchAssignments();
  }, [filter]);

  async function fetchAssignments() {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/student-assignments?student_id=${studentId}&status=${filter}&limit=20`
      );
      const data = await response.json();

      if (data.success) {
        setAssignments(data.assignments);
      } else {
        console.error('Failed to fetch assignments:', data.error);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="assignments-dashboard">
      <div className="filter-buttons">
        <button onClick={() => setFilter('assigned')}>Pending</button>
        <button onClick={() => setFilter('submitted')}>Submitted</button>
        <button onClick={() => setFilter('graded')}>Graded</button>
        <button onClick={() => setFilter('overdue')}>Overdue</button>
      </div>

      {loading ? (
        <div>Loading assignments...</div>
      ) : (
        <div className="assignments-list">
          {assignments.map(assignment => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}
    </div>
  );
}

function AssignmentCard({ assignment }) {
  const getDueDateColor = () => {
    if (assignment.is_late) return 'red';
    if (assignment.days_until_due <= 1) return 'orange';
    if (assignment.days_until_due <= 3) return 'yellow';
    return 'green';
  };

  return (
    <div className="assignment-card">
      <h3>{assignment.title}</h3>
      <div className="assignment-meta">
        <span className="type">{assignment.type}</span>
        <span className="subject">{assignment.subject_key}</span>
      </div>
      <p>{assignment.description}</p>
      <div className="assignment-footer">
        <div className={`due-date ${getDueDateColor()}`}>
          {assignment.is_late ? (
            <span>Overdue by {assignment.days_until_due} days</span>
          ) : (
            <span>Due in {assignment.days_until_due} days</span>
          )}
        </div>
        <div className="points">
          {assignment.grade !== null ? (
            <span>{assignment.grade}/{assignment.points_possible} pts</span>
          ) : (
            <span>{assignment.points_possible} pts</span>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## Testing

### Local Development
```bash
# Start Netlify dev server
netlify dev

# Test endpoint
curl "http://localhost:8888/api/student-assignments?student_id=YOUR_UUID&status=assigned"
```

### Manual Testing Checklist
- [ ] Request without student_id returns 400 error
- [ ] Request with valid student_id returns assignments
- [ ] Status filter works correctly
- [ ] Class_id filter works correctly
- [ ] Limit parameter respected (max 100)
- [ ] Sort parameter works for both due_date and assigned_date
- [ ] Time calculations are accurate (days_until_due, is_late)
- [ ] Graded assignments show feedback
- [ ] Invalid status values are ignored

---

## Deployment

### Environment Variables
Set these in Netlify dashboard (Site settings > Environment variables):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Build Command
No build required for serverless functions. Netlify automatically deploys `.mts` files.

### Deploy
```bash
# Deploy via Netlify CLI
netlify deploy --prod

# Or push to connected Git repository
git push origin main
```

---

## Troubleshooting

### Common Issues

**1. "Missing Supabase credentials" error**
- Ensure environment variables are set in Netlify dashboard
- Check variable names match exactly

**2. "Database error" responses**
- Verify student_id is a valid UUID in the database
- Check RLS policies are correctly configured
- Verify `student_assignments` table exists

**3. Empty results**
- Verify student has assignments in the database
- Check filters aren't too restrictive
- Confirm student_id is correct

**4. CORS errors in browser**
- Configure CORS headers if needed (currently allows all origins)
- Add specific domain restrictions for production

---

## Future Enhancements

### Planned Features
1. **JWT Authentication**: Replace student_id parameter with token validation
2. **Pagination**: Add cursor-based pagination for large result sets
3. **Advanced Filters**: Date range filtering, multiple statuses
4. **Aggregations**: Include summary statistics (total pending, average grade, etc.)
5. **Related Data**: Join with submissions and grades tables for complete view
6. **Caching**: Add Redis/Netlify caching for frequently accessed data

### Performance Improvements
1. Implement response caching with TTL
2. Add database query result caching
3. Consider GraphQL for flexible data fetching
4. Implement real-time updates via WebSockets

---

## Related Documentation

- [Assignment Schema Documentation](/database/003_enhanced_assignments_schema.sql)
- [Assignment API Quick Reference](/database/ASSIGNMENT_API_QUICK_REFERENCE.md)
- [Netlify Functions Best Practices](https://docs.netlify.com/functions/overview/)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Created**: October 20, 2025
**Version**: 1.0.0
**Maintainer**: AI Academy @ Centner Development Team
