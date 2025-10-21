# Assignment Distribution Workflow - Visual Diagrams

## Complete End-to-End Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TEACHER ASSIGNMENT WORKFLOW                       │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  Teacher Opens   │
│ Teacher Dashboard│
└────────┬─────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│  Step 1: AUTHENTICATION                                     │
│  ┌──────────────────────────────────────────┐              │
│  │ Login Modal                               │              │
│  │ - Email: teacher@aicentner.com           │              │
│  │ - Password: ********                     │              │
│  │ - Click "Sign In"                        │              │
│  └──────────────────────────────────────────┘              │
│                                                              │
│  Result: ✅ Auth modal closes, calendar appears            │
└────────┬───────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│  Step 2: NAVIGATE TO LESSON                                 │
│  ┌──────────────────────────────────────────┐              │
│  │ Calendar Grid                             │              │
│  │ - Select: October 2025                   │              │
│  │ - Click: October 6, 2025 cell            │              │
│  │ - Lesson: Period 3 - 7th Civics         │              │
│  └──────────────────────────────────────────┘              │
│                                                              │
│  Result: ✅ Enhancement panel slides in from right         │
└────────┬───────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│  Step 3: GENERATE QUIZ (Optional)                           │
│  ┌──────────────────────────────────────────┐              │
│  │ Enhancement Panel > Quiz Section         │              │
│  │ - Click "Generate Quiz with AI"          │              │
│  │ - AI Loading... (10-20s)                 │              │
│  │ - Quiz questions appear                  │              │
│  └──────────────────────────────────────────┘              │
│                                                              │
│  API Call:                                                   │
│  POST /.netlify/functions/generate-assessment               │
│  Body: { lesson: {...}, assessmentType: 'quiz-questions' } │
│                                                              │
│  Result: ✅ Quiz stored in lessonEnhancements object       │
└────────┬───────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│  Step 4: OPEN ASSIGNMENT MODAL                              │
│  ┌──────────────────────────────────────────┐              │
│  │ Enhancement Panel                         │              │
│  │ - Click "Assign to Students" button      │              │
│  └──────────────────────────────────────────┘              │
│                                                              │
│  JavaScript Function: openAssignModal()                     │
│  - Loads enrolled students for period                       │
│  - Pre-fills lesson info                                    │
│  - Shows quiz preview if available                          │
│                                                              │
│  Result: ✅ Modal overlays screen with form                │
└────────┬───────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│  Step 5: FILL ASSIGNMENT FORM                               │
│  ┌──────────────────────────────────────────┐              │
│  │ Assignment Modal Form                     │              │
│  │                                           │              │
│  │ [●] Quiz  [ ] Homework  [ ] Reading      │              │
│  │ [ ] Video [ ] Activity                   │              │
│  │                                           │              │
│  │ Title: [Constitution Quiz            ]   │              │
│  │                                           │              │
│  │ Instructions:                             │              │
│  │ [Complete all questions. 30 min limit.]  │              │
│  │                                           │              │
│  │ Due Date: [2025-10-25] Time: [23:59]     │              │
│  │ Points: [100]                             │              │
│  │                                           │              │
│  │ ☑ Select All Students (15 selected)      │              │
│  │ ☑ Alice Anderson                          │              │
│  │ ☑ Bob Brown                               │              │
│  │ ☑ Carol Chen                              │              │
│  │ ... (12 more students)                    │              │
│  │                                           │              │
│  │ [Cancel] [📤 Assign to Students]         │              │
│  └──────────────────────────────────────────┘              │
└────────┬───────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│  Step 6: SUBMIT ASSIGNMENT                                  │
│  ┌──────────────────────────────────────────┐              │
│  │ Validation:                               │              │
│  │ ✅ Assignment type selected               │              │
│  │ ✅ Title filled                           │              │
│  │ ✅ Due date set                           │              │
│  │ ✅ At least one student selected          │              │
│  └──────────────────────────────────────────┘              │
│                                                              │
│  JavaScript Function: submitAssignment()                    │
│  - Builds payload                                           │
│  - Gets auth token                                          │
│  - Calls API                                                │
│                                                              │
│  API Call:                                                   │
│  POST /.netlify/functions/assign-to-students                │
│  Headers: { Authorization: Bearer <token> }                 │
│  Body: {                                                     │
│    lesson_key: "2025-10-06_7th_civics_3",                  │
│    assignment_type: "quiz",                                 │
│    title: "Constitution Quiz",                              │
│    instructions: "Complete all questions...",               │
│    due_date: "2025-10-25T23:59:00Z",                       │
│    points_possible: 100,                                    │
│    student_ids: ["uuid1", "uuid2", ...],                   │
│    quiz_data: "{\"questions\": [...]}"                     │
│  }                                                           │
│                                                              │
│  Result: ✅ Loading spinner shows "Assigning to 15 students"│
└────────┬───────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│  Step 7: BACKEND PROCESSING                                 │
│  ┌──────────────────────────────────────────┐              │
│  │ assign-to-students.js                     │              │
│  │                                           │              │
│  │ 1. ✅ Verify Bearer token                 │              │
│  │ 2. ✅ Check user role (teacher/admin)     │              │
│  │ 3. ✅ Validate input fields                │              │
│  │ 4. ✅ Verify student IDs exist             │              │
│  │ 5. ✅ Verify all users are students        │              │
│  │ 6. ✅ Extract subject_key from lesson_key  │              │
│  │ 7. ✅ Build metadata object                │              │
│  │ 8. ✅ Bulk insert to database              │              │
│  └──────────────────────────────────────────┘              │
│                                                              │
│  Database Operation:                                         │
│  INSERT INTO student_assignments (                          │
│    teacher_id, student_id, lesson_key, subject_key,        │
│    assignment_type, title, instructions, due_date,          │
│    points_possible, status, metadata                        │
│  ) VALUES                                                    │
│    (teacher_uuid, student1_uuid, '2025-10-06_7th_civics_3',│
│     '7th_civics', 'quiz', 'Constitution Quiz', ..., 100,   │
│     'assigned', {...}),                                     │
│    (teacher_uuid, student2_uuid, ...),                      │
│    ... (13 more rows)                                       │
│                                                              │
│  Result: ✅ 15 records inserted                             │
└────────┬───────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│  Step 8: SUCCESS RESPONSE                                   │
│  ┌──────────────────────────────────────────┐              │
│  │ API Response (200 OK):                    │              │
│  │ {                                         │              │
│  │   "success": true,                        │              │
│  │   "message": "Successfully created 15...",│              │
│  │   "assignments_created": 15,              │              │
│  │   "assignment_ids": [...],                │              │
│  │   "students": [                           │              │
│  │     {                                     │              │
│  │       "assignment_id": "...",             │              │
│  │       "student_name": "Alice Anderson",   │              │
│  │       "student_email": "alice@...",       │              │
│  │       "title": "Constitution Quiz",       │              │
│  │       "type": "quiz",                     │              │
│  │       "due_date": "2025-10-25T23:59:00Z", │              │
│  │       "status": "assigned"                │              │
│  │     },                                    │              │
│  │     ... (14 more students)                │              │
│  │   ]                                       │              │
│  │ }                                         │              │
│  └──────────────────────────────────────────┘              │
│                                                              │
│  Frontend Display:                                           │
│  ┌──────────────────────────────────────────┐              │
│  │        ✅                                 │              │
│  │   Assignment Created!                     │              │
│  │ Successfully assigned to 15 students      │              │
│  └──────────────────────────────────────────┘              │
│                                                              │
│  Result: ✅ Success message auto-dismisses, modal closes    │
└────────┬───────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│  Step 9: STUDENT DASHBOARD                                  │
│  ┌──────────────────────────────────────────┐              │
│  │ Student logs in                           │              │
│  │ - Clicks "My Assignments"                │              │
│  │ - Tab: "Upcoming"                        │              │
│  └──────────────────────────────────────────┘              │
│                                                              │
│  API Call:                                                   │
│  GET /.netlify/functions/get-student-assignments            │
│    ?student_id=alice_uuid                                   │
│                                                              │
│  Database Query:                                             │
│  SELECT * FROM student_assignments                          │
│  WHERE student_id = 'alice_uuid'                            │
│    AND status IN ('assigned', 'submitted')                  │
│    AND due_date >= NOW()                                    │
│  ORDER BY due_date ASC                                      │
│                                                              │
│  API Response:                                               │
│  {                                                           │
│    "success": true,                                         │
│    "assignments": [                                         │
│      {                                                       │
│        "id": "...",                                         │
│        "title": "Constitution Quiz",                        │
│        "type": "quiz",                                      │
│        "due_date": "2025-10-25T23:59:00Z",                 │
│        "status": "assigned",                                │
│        "points_possible": 100,                              │
│        "subject_key": "7th_civics",                         │
│        "is_late": false,                                    │
│        "days_until_due": 5,                                 │
│        "hours_until_due": 13                                │
│      }                                                       │
│    ]                                                         │
│  }                                                           │
│                                                              │
│  Student Dashboard Display:                                  │
│  ┌──────────────────────────────────────────┐              │
│  │ 📚 My Assignments                         │              │
│  │ ┌────────────────────────────────────┐   │              │
│  │ │ [Upcoming] [Overdue] [Submitted]   │   │              │
│  │ └────────────────────────────────────┘   │              │
│  │                                           │              │
│  │ ┌────────────────────────────────────┐   │              │
│  │ │ 📝 Constitution Quiz                │   │              │
│  │ │ Civics • Due in 5 days              │   │              │
│  │ │ 100 points                          │   │              │
│  │ │ [View Quiz →]                       │   │              │
│  │ └────────────────────────────────────┘   │              │
│  └──────────────────────────────────────────┘              │
│                                                              │
│  Result: ✅ Student sees assignment immediately             │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                                │
└─────────────────────────────────────────────────────────────────┘

Teacher Browser                     Backend API                    Database
─────────────────                   ───────────                    ────────

┌─────────────┐
│ Teacher UI  │
│             │
│ Form Data:  │
│ - Type      │
│ - Title     │
│ - Students  │
│ - Due Date  │
└──────┬──────┘
       │
       │ POST /assign-to-students
       │ Bearer: <auth_token>
       │ Body: { lesson_key, title, student_ids, ... }
       │
       ▼
   ┌────────────────┐
   │ Netlify Edge   │
   │ Function       │
   └────────┬───────┘
            │
            │ 1. Verify JWT token
            │
            ▼
   ┌────────────────────┐
   │ Supabase Auth      │────── getUser(token)
   │                    │◄────── User object
   └────────────────────┘
            │
            │ 2. Check user role
            │
            ▼
   ┌────────────────────┐
   │ user_profiles      │────── SELECT role WHERE id=teacher_id
   │ Table              │◄────── role='teacher'
   └────────────────────┘
            │
            │ 3. Validate student IDs
            │
            ▼
   ┌────────────────────┐
   │ user_profiles      │────── SELECT * WHERE id IN (student_ids)
   │ Table              │◄────── 15 student records
   └────────────────────┘
            │
            │ 4. Build insert payload
            │
            ▼
   ┌────────────────────┐
   │ student_assignments│────── INSERT 15 rows
   │ Table              │
   │                    │       Each row:
   │ Row 1:             │       - teacher_id
   │ Row 2:             │       - student_id
   │ Row 3:             │       - lesson_key
   │ ...                │       - assignment_type
   │ Row 15:            │       - title, due_date, etc.
   └────────┬───────────┘
            │
            │ 5. Return assignment IDs
            │
            ▼
   ┌────────────────┐
   │ Response:      │
   │ {              │
   │   success: true│
   │   ids: [...]   │
   │ }              │
   └────────┬───────┘
            │
            ▼
┌─────────────────┐
│ Teacher UI      │
│ Success message │
│ Modal closes    │
└─────────────────┘

Student Browser
─────────────────

┌─────────────┐
│ Student UI  │
│             │
│ Loads       │
│ My Assign-  │
│ ments       │
└──────┬──────┘
       │
       │ GET /get-student-assignments?student_id=alice_uuid
       │
       ▼
   ┌────────────────┐
   │ Netlify Edge   │
   │ Function       │
   └────────┬───────┘
            │
            │ Query assignments
            │
            ▼
   ┌────────────────────┐
   │ student_assignments│────── SELECT * WHERE student_id='alice_uuid'
   │ Table (RLS)        │       AND status IN ('assigned', 'submitted')
   │                    │       AND due_date >= NOW()
   │                    │◄────── 1 assignment record
   └────────┬───────────┘
            │
            │ Format response
            │
            ▼
   ┌────────────────┐
   │ Response:      │
   │ {              │
   │   assignments: │
   │   [{ quiz }]   │
   │ }              │
   └────────┬───────┘
            │
            ▼
┌─────────────────┐
│ Student UI      │
│ Display quiz    │
│ card            │
└─────────────────┘
```

---

## Database Schema Visual

```
┌──────────────────────────────────────────────────────────────┐
│                  student_assignments TABLE                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Primary Key:                                                 │
│  ├─ id                UUID (auto-generated)                   │
│                                                               │
│  Foreign Keys:                                                │
│  ├─ teacher_id        UUID → auth.users(id)                  │
│  ├─ student_id        UUID → auth.users(id)                  │
│                                                               │
│  Lesson Identification:                                       │
│  ├─ lesson_key        TEXT (2025-10-06_7th_civics_3)         │
│  ├─ subject_key       TEXT (7th_civics) [auto-extracted]     │
│                                                               │
│  Assignment Details:                                          │
│  ├─ assignment_type   ENUM (quiz|homework|reading|...)       │
│  ├─ title             TEXT (Constitution Quiz)               │
│  ├─ description       TEXT (optional)                         │
│  ├─ instructions      TEXT (Complete all questions...)        │
│                                                               │
│  Scheduling:                                                  │
│  ├─ assigned_date     TIMESTAMPTZ (NOW())                    │
│  ├─ due_date          TIMESTAMPTZ (2025-10-25T23:59:00Z)     │
│                                                               │
│  Grading:                                                     │
│  ├─ points_possible   INTEGER (100)                           │
│  ├─ points_earned     DECIMAL(5,2) (nullable)                │
│                                                               │
│  Status:                                                      │
│  ├─ status            ENUM (assigned|submitted|graded|overdue)│
│                                                               │
│  Submission:                                                  │
│  ├─ submission_text   TEXT (nullable)                         │
│  ├─ submission_urls   TEXT[] (nullable)                       │
│  ├─ submitted_at      TIMESTAMPTZ (nullable)                 │
│                                                               │
│  Grading:                                                     │
│  ├─ feedback          TEXT (nullable)                         │
│  ├─ rubric_scores     JSONB (nullable)                        │
│  ├─ graded_at         TIMESTAMPTZ (nullable)                 │
│                                                               │
│  Metadata:                                                    │
│  ├─ metadata          JSONB (quiz_data, lesson_code, etc.)   │
│  ├─ created_at        TIMESTAMPTZ (NOW())                    │
│  ├─ updated_at        TIMESTAMPTZ (NOW())                    │
│                                                               │
│  Unique Constraint:                                           │
│  └─ UNIQUE (student_id, lesson_key, assignment_type, title)  │
│                                                               │
└──────────────────────────────────────────────────────────────┘

                            Indexes
┌──────────────────────────────────────────────────────────────┐
│ ├─ idx_student_assignments_student (student_id)              │
│ ├─ idx_student_assignments_teacher (teacher_id)              │
│ ├─ idx_student_assignments_lesson (lesson_key)               │
│ ├─ idx_student_assignments_status (status)                   │
│ ├─ idx_student_assignments_student_status (student_id,status)│
│ └─ idx_student_assignments_student_due (student_id,due_date) │
└──────────────────────────────────────────────────────────────┘

                         Triggers
┌──────────────────────────────────────────────────────────────┐
│ ├─ auto_populate_subject_key() - Extracts from lesson_key    │
│ ├─ auto_update_assignment_status() - Updates on submit/grade │
│ ├─ notify_new_assignment() - Creates notification            │
│ └─ update_updated_at_column() - Updates timestamp            │
└──────────────────────────────────────────────────────────────┘

                      RLS Policies
┌──────────────────────────────────────────────────────────────┐
│ Students:                                                     │
│ ├─ SELECT: student_id = auth.uid()                           │
│ └─ UPDATE: student_id = auth.uid() (submission fields only)  │
│                                                               │
│ Teachers:                                                     │
│ ├─ SELECT: teacher_id = auth.uid() OR role='admin'           │
│ ├─ INSERT: teacher_id = auth.uid() OR role='admin'           │
│ ├─ UPDATE: teacher_id = auth.uid() OR role='admin'           │
│ └─ DELETE: teacher_id = auth.uid() OR role='admin'           │
└──────────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
┌────────────────────────────────────────────────────────────┐
│                   ERROR SCENARIOS                           │
└────────────────────────────────────────────────────────────┘

Frontend Validation Errors:
───────────────────────────

User Action           Validation Check          Response
────────────          ────────────────          ────────

Click Submit    →     Assignment type?    →     ❌ Alert: "Select type"
                      ✅ Selected

Click Submit    →     Title filled?       →     ❌ Alert: "Enter title"
                      ✅ Filled

Click Submit    →     Due date set?       →     ❌ Alert: "Select due date"
                      ✅ Set

Click Submit    →     Students selected?  →     ❌ Alert: "Select students"
                      ✅ ≥ 1 selected
                            │
                            ▼
                      Submit to API


Backend API Errors:
──────────────────

Request               Validation                Response
───────               ──────────                ────────

POST /assign     →    Auth token valid?    →   401 Unauthorized
                      ✅ Valid token
                            │
                            ▼
                      User role?           →   403 Forbidden (not teacher)
                      ✅ teacher/admin
                            │
                            ▼
                      lesson_key exists?   →   400 Bad Request
                      ✅ Exists
                            │
                            ▼
                      Valid assignment_type? →  400 Bad Request
                      ✅ Valid enum
                            │
                            ▼
                      Student IDs exist?   →   400 Bad Request
                      ✅ All exist          →   (missing_ids: [...])
                            │
                            ▼
                      All are students?    →   400 Bad Request
                      ✅ All students       →   (invalid_users: [...])
                            │
                            ▼
                      Duplicate assignment? →  409 Conflict
                      ✅ Unique
                            │
                            ▼
                      Database insert      →   500 Server Error
                      ✅ Success
                            │
                            ▼
                      200 OK
                      { success: true, ... }
```

---

**Diagrams Version**: 1.0
**Last Updated**: 2025-10-20
**Maintained By**: QA Team
