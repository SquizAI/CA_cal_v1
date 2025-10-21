# Assign to Students - Quick Reference

## Endpoint
```
POST /.netlify/functions/assign-to-students
```

## Headers
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_TEACHER_JWT_TOKEN"
}
```

## Minimal Request
```json
{
  "lesson_key": "2025-10-20_9th_ela_1",
  "assignment_type": "homework",
  "title": "Chapter Reading",
  "due_date": "2025-10-25T23:59:59Z",
  "student_ids": ["student-uuid-1"]
}
```

## Full Request Example
```json
{
  "lesson_key": "2025-10-20_9th_ela_1",
  "assignment_type": "quiz",
  "title": "Literary Elements Quiz",
  "description": "Quiz on themes and character analysis",
  "instructions": "<p>Complete all questions within 30 minutes</p>",
  "points_possible": 100,
  "due_date": "2025-10-25T23:59:59Z",
  "student_ids": ["uuid-1", "uuid-2", "uuid-3"],
  "quiz_data": {
    "questions": [...],
    "time_limit_minutes": 30
  }
}
```

## Assignment Types
- `quiz` - Assessments with questions
- `homework` - General assignments
- `reading` - Reading assignments
- `video` - Video watching tasks
- `activity` - Hands-on activities

## Required Fields
✅ `lesson_key` (format: YYYY-MM-DD_subjectKey_period)
✅ `assignment_type` (one of 5 types above)
✅ `title` (string)
✅ `due_date` (ISO 8601 timestamp)
✅ `student_ids` (array of UUIDs)

## Optional Fields
- `description` - Brief description
- `instructions` - Detailed instructions (HTML supported)
- `points_possible` - Default: 100
- `quiz_data` - For quiz type
- `metadata` - Custom data

## Response (Success)
```json
{
  "success": true,
  "assignments_created": 3,
  "assignment_ids": ["id-1", "id-2", "id-3"],
  "assignment_details": {...},
  "students": [...]
}
```

## Common Errors

| Code | Error | Fix |
|------|-------|-----|
| 401 | Unauthorized | Add valid Bearer token |
| 403 | Forbidden | Must be teacher/admin |
| 400 | Missing field | Include all required fields |
| 400 | Invalid student IDs | Check student UUIDs exist |
| 409 | Duplicate | Assignment already exists |

## Quick Test (curl)
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/assign-to-students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "lesson_key": "2025-10-20_9th_ela_1",
    "assignment_type": "homework",
    "title": "Test Assignment",
    "due_date": "2025-10-25T23:59:59Z",
    "student_ids": ["student-uuid"]
  }'
```

## Database Check
```sql
SELECT * FROM student_assignments
WHERE lesson_key = '2025-10-20_9th_ela_1'
ORDER BY created_at DESC;
```

## Files
- **Function:** `assign-to-students.js`
- **Full Docs:** `assign-to-students.README.md`
- **Testing:** `assign-to-students.test.md`
- **Schema:** `database/003_enhanced_assignments_schema.sql`
