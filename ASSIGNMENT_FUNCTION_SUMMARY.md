# Assignment Function Summary
**Created:** October 20, 2025
**Function:** `assign-to-students.js`

## What Was Created

A complete Netlify serverless function system for teachers to assign work to students.

### Core Function
**File:** `/netlify/functions/assign-to-students.js` (413 lines)

**Purpose:** Teachers create assignments from lessons and distribute to individual or multiple students

**Endpoint:** `POST /.netlify/functions/assign-to-students`

### Documentation Files

1. **README** - `/netlify/functions/assign-to-students.README.md` (13 KB)
   - Comprehensive API documentation
   - All features and parameters explained
   - Integration examples
   - Security considerations
   - Troubleshooting guide

2. **Testing Guide** - `/netlify/functions/assign-to-students.test.md` (11 KB)
   - 9 detailed test cases
   - Error response examples
   - Database verification queries
   - Frontend integration code
   - curl command examples

3. **Quick Reference** - `/netlify/functions/ASSIGN_TO_STUDENTS_QUICK_REF.md` (2 KB)
   - One-page quick reference
   - Minimal and full request examples
   - Common errors and fixes
   - Quick test commands

4. **Test Script** - `/netlify/functions/test-assign-to-students.sh` (5 KB, executable)
   - Automated testing script
   - 9 test scenarios
   - Color-coded output
   - Usage: `./test-assign-to-students.sh [URL] [TOKEN] [STUDENT_UUID]`

---

## Key Features

### 1. Authentication & Authorization
- JWT Bearer token authentication
- Role-based access (teachers and admins only)
- Validates user identity via Supabase Auth

### 2. Assignment Types Supported
- **Quiz** - Assessments with embedded questions/answers
- **Homework** - General assignments
- **Reading** - Reading tasks with annotations
- **Video** - Video watching assignments
- **Activity** - Hands-on activities/projects

### 3. Validation
- Required field validation
- Assignment type validation
- Student existence check
- Student role verification (must be 'student')
- Due date format validation
- Points validation

### 4. Bulk Operations
- Assign to multiple students in single request
- Transaction-safe bulk insert
- Returns all created assignment IDs
- Efficient for large classes

### 5. Data Integrity
- Prevents duplicate assignments
- Auto-extracts subject_key from lesson_key
- Embeds quiz data in metadata for quiz assignments
- Validates lesson_key format

### 6. Error Handling
- Comprehensive error messages
- Proper HTTP status codes
- Missing student ID reporting
- Duplicate detection with conflict response

---

## Request Format

### Required Fields
```json
{
  "lesson_key": "YYYY-MM-DD_subjectKey_period",
  "assignment_type": "quiz|homework|reading|video|activity",
  "title": "Assignment title",
  "due_date": "ISO 8601 timestamp",
  "student_ids": ["uuid1", "uuid2", ...]
}
```

### Optional Fields
```json
{
  "description": "Brief description",
  "instructions": "HTML instructions",
  "points_possible": 100,
  "quiz_data": { /* quiz questions */ },
  "metadata": { /* custom data */ }
}
```

---

## Response Format

### Success (200)
```json
{
  "success": true,
  "message": "Successfully created N assignment(s)",
  "assignments_created": N,
  "assignment_ids": ["uuid1", "uuid2", ...],
  "assignment_details": {
    "lesson_key": "...",
    "subject_key": "...",
    "title": "...",
    "type": "...",
    "due_date": "...",
    "points_possible": 100
  },
  "students": [
    {
      "assignment_id": "...",
      "student_id": "...",
      "student_name": "...",
      "student_email": "...",
      "title": "...",
      "type": "...",
      "due_date": "...",
      "points_possible": 100,
      "status": "assigned"
    },
    ...
  ]
}
```

### Error Responses
- **401 Unauthorized** - Missing/invalid JWT token
- **403 Forbidden** - User is not teacher/admin
- **400 Bad Request** - Missing/invalid fields
- **409 Conflict** - Duplicate assignment
- **500 Internal Error** - Database/server error

---

## Database Integration

### Table Used: `student_assignments`

Key columns:
- `id` - UUID primary key
- `teacher_id` - References auth.users
- `student_id` - References auth.users
- `lesson_key` - Lesson identifier
- `subject_key` - Auto-extracted from lesson_key
- `assignment_type` - ENUM type
- `title` - Assignment title
- `description` - Brief description
- `instructions` - Rich HTML content
- `assigned_date` - Auto-set to NOW()
- `due_date` - Teacher-specified
- `points_possible` - Default 100
- `status` - Default 'assigned'
- `metadata` - JSONB for quiz_data and custom fields

### Automatic Features

**Database Triggers:**
1. Auto-extract subject_key from lesson_key
2. Create student notification on insert
3. Update status when submitted/graded
4. Auto-update updated_at timestamp

**Unique Constraint:**
Prevents duplicates based on: `(student_id, lesson_key, assignment_type, title)`

---

## Usage Examples

### JavaScript/React
```javascript
const result = await fetch('/.netlify/functions/assign-to-students', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`
  },
  body: JSON.stringify({
    lesson_key: '2025-10-20_9th_ela_1',
    assignment_type: 'quiz',
    title: 'Chapter Quiz',
    due_date: '2025-10-25T23:59:59Z',
    student_ids: studentIds,
    quiz_data: { questions: [...] }
  })
});
```

### curl
```bash
curl -X POST https://site.netlify.app/.netlify/functions/assign-to-students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "lesson_key": "2025-10-20_9th_ela_1",
    "assignment_type": "homework",
    "title": "Chapter 5 Questions",
    "due_date": "2025-10-25T23:59:59Z",
    "student_ids": ["student-uuid"]
  }'
```

---

## Testing

### Manual Testing
Use the test script:
```bash
./netlify/functions/test-assign-to-students.sh \
  https://your-site.netlify.app \
  YOUR_JWT_TOKEN \
  STUDENT_UUID
```

### Database Verification
```sql
SELECT
    sa.id,
    sa.title,
    sa.assignment_type,
    sa.status,
    up.first_name || ' ' || up.last_name as student_name,
    sa.due_date,
    sa.created_at
FROM student_assignments sa
JOIN user_profiles up ON sa.student_id = up.id
WHERE sa.lesson_key = '2025-10-20_9th_ela_1'
ORDER BY sa.created_at DESC;
```

---

## Environment Variables Required

Set these in Netlify dashboard or `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important:** The function uses the service role key for admin operations, allowing it to bypass RLS policies for bulk operations.

---

## Security Features

1. **JWT Authentication** - All requests require valid Bearer token
2. **Role Validation** - Only teachers and admins can create assignments
3. **Student Verification** - Validates students exist and have correct role
4. **Input Sanitization** - All inputs validated before database operations
5. **SQL Injection Protection** - Uses parameterized queries via Supabase client
6. **Row Level Security** - Database RLS policies control access
7. **Service Role Protection** - Service key never exposed to frontend

---

## Performance Considerations

- **Bulk Inserts:** Single transaction for all students (recommended: <50 students per request)
- **Student Validation:** Single query validates all students
- **Indexed Queries:** Database indexes on key fields (student_id, teacher_id, lesson_key)
- **Transaction Safety:** All-or-nothing insert (rollback on any failure)

---

## Integration with Other Functions

Works alongside:
- `generate-assessment.js` - Generate quiz content with AI
- `generate-assignment.js` - AI-powered assignment generation
- `get-student-assignments.mts` - Students retrieve their assignments
- `grade-assignment.js` - Teachers grade submitted assignments
- `submit-assignment.js` - Students submit completed work

---

## Common Use Cases

1. **Daily Reading Quiz**
   ```json
   {
     "lesson_key": "2025-10-20_9th_ela_1",
     "assignment_type": "quiz",
     "title": "Daily Reading Quiz",
     "points_possible": 20,
     "due_date": "2025-10-21T08:00:00Z",
     "student_ids": [...all_students]
   }
   ```

2. **Homework Assignment**
   ```json
   {
     "lesson_key": "2025-10-20_9th_ela_1",
     "assignment_type": "homework",
     "title": "Chapter 5 Analysis",
     "instructions": "<ol><li>Read chapter 5</li><li>Answer questions 1-10</li></ol>",
     "points_possible": 50,
     "due_date": "2025-10-22T23:59:59Z",
     "student_ids": [...struggling_students]
   }
   ```

3. **Video Assignment**
   ```json
   {
     "lesson_key": "2025-10-20_9th_ela_1",
     "assignment_type": "video",
     "title": "Watch: Theme Analysis",
     "metadata": {
       "video_url": "https://example.com/video",
       "duration_minutes": 15
     },
     "points_possible": 25,
     "due_date": "2025-10-23T23:59:59Z",
     "student_ids": [...all_students]
   }
   ```

---

## Troubleshooting

### "Unauthorized" Error
- Check Authorization header format: `Bearer YOUR_TOKEN`
- Verify token is not expired
- Ensure user is logged in

### "Invalid student IDs" Error
- Verify UUIDs are correct
- Check students exist in database
- Ensure users have 'student' role

### "Duplicate assignment" Error
- Assignment with same student/lesson/type/title exists
- Change title or check existing assignments first
- Consider updating existing assignment instead

### Function Not Found (404)
- Verify Netlify deployment completed
- Check function is in `netlify/functions/` directory
- Ensure function filename is correct
- Review Netlify function logs

---

## File Locations

All files are in the project root:

```
/netlify/functions/
├── assign-to-students.js              # Main function (413 lines)
├── assign-to-students.README.md       # Full documentation (13 KB)
├── assign-to-students.test.md         # Testing guide (11 KB)
├── ASSIGN_TO_STUDENTS_QUICK_REF.md   # Quick reference (2 KB)
└── test-assign-to-students.sh         # Test script (5 KB, executable)

/database/
└── 003_enhanced_assignments_schema.sql # Database schema

/
└── ASSIGNMENT_FUNCTION_SUMMARY.md     # This file
```

---

## Next Steps

1. **Deploy to Netlify**
   ```bash
   git add netlify/functions/assign-to-students.js
   git commit -m "Add assign-to-students serverless function"
   git push
   ```

2. **Set Environment Variables** in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. **Test the Function**
   ```bash
   ./netlify/functions/test-assign-to-students.sh \
     https://your-site.netlify.app \
     YOUR_TEACHER_TOKEN \
     STUDENT_UUID
   ```

4. **Integrate with Frontend**
   - Add assignment creation UI
   - Connect to function endpoint
   - Handle success/error responses
   - Display created assignments

5. **Monitor Usage**
   - Check Netlify function logs
   - Monitor database for assignments
   - Review student notifications

---

## Dependencies

All required dependencies are already installed in `package.json`:

- `@supabase/supabase-js` - Supabase client
- `dotenv` - Environment variables (development)

No additional packages needed.

---

## Best Practices

1. **Always validate inputs** on frontend before API call
2. **Use loading states** during assignment creation
3. **Show confirmation** when assignments created successfully
4. **Handle errors gracefully** with user-friendly messages
5. **Keep student batches** under 50 for optimal performance
6. **Set due dates** in UTC timezone
7. **Include quiz_data** for quiz type assignments
8. **Test thoroughly** before production use

---

## License & Credits

Part of **AI Academy Content Generator V2**

Created: October 20, 2025

Function follows Netlify serverless function best practices and integrates with existing Supabase database schema.

---

## Support

For questions or issues:

1. Review the documentation files
2. Check the test script output
3. Examine Netlify function logs
4. Verify database schema is up to date
5. Ensure environment variables are set correctly

**Key Documentation Files:**
- Full API Docs: `assign-to-students.README.md`
- Testing Guide: `assign-to-students.test.md`
- Quick Ref: `ASSIGN_TO_STUDENTS_QUICK_REF.md`
