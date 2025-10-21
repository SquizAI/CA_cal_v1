# Assignment Management Integration Guide

## Overview
This guide explains how to integrate the assignment management system into `teacher-dashboard.html`.

## Files Created
1. **assignments-integration.html** - Contains all the code (CSS, HTML, JavaScript)
2. **This guide** - Step-by-step integration instructions

## Integration Status
✅ Tab button added (line 1449-1451 in teacher-dashboard.html)
✅ renderView case added (line 2141-2143 in teacher-dashboard.html)
⏳ CSS styles need to be added
⏳ Modal HTML needs to be added
⏳ JavaScript functions need to be added

## Step 1: Add CSS Styles

**Location:** Before `</style>` at line 1893 in teacher-dashboard.html

**What to add:** All CSS from assignments-integration.html between the first `<style>` and `</style>` tags (lines 9-532)

**How to verify:** Look for classes like `.assignments-container`, `.assignment-card`, etc. in the browser inspector

## Step 2: Add Modal HTML

**Location:** Before `</body>` at the end of teacher-dashboard.html

**What to add:** The modal HTML from assignments-integration.html (lines 537-552)

```html
<!-- Assignment Details Modal -->
<div id="assignmentDetailsModal" class="assignment-details-modal">
    <div class="assignment-details-content">
        <div class="assignment-details-header">
            <div>
                <h2 id="modalAssignmentTitle"></h2>
                <p id="modalAssignmentMeta"></p>
            </div>
            <button class="assignment-details-close" onclick="closeAssignmentDetailsModal()">&times;</button>
        </div>
        <div class="assignment-details-body" id="assignmentDetailsBody">
            <!-- Content populated by JavaScript -->
        </div>
    </div>
</div>
```

## Step 3: Add JavaScript Functions

**Location:** In the main `<script>` section, after the existing functions (around line 7700)

**What to add:** All JavaScript from assignments-integration.html (lines 558-end)

Key functions being added:
- `renderAssignmentsView()` - Main rendering function
- `loadAssignments()` - Fetch from Supabase
- `fetchAssignmentAnalytics()` - Get stats per assignment
- `viewAssignmentDetails()` - Show detail modal
- `extendDeadline()` - Update due dates
- `sendReminder()` - Email incomplete students
- `downloadGradebook()` - Export CSV

## Database Schema Expected

The code expects these Supabase tables:

### student_assignments
```sql
- id (uuid, primary key)
- title (text)
- type (text) - quiz, homework, test, project
- subject (text)
- due_date (timestamp)
- created_by (uuid) - references auth.users(id)
- assignment_id (uuid) - parent assignment if exists
- student_id (uuid) - references students(id)
```

### submissions
```sql
- id (uuid, primary key)
- student_assignment_id (uuid) - references student_assignments(id)
- status (text) - in-progress, submitted
- submitted_at (timestamp)
```

### grades
```sql
- id (uuid, primary key)
- submission_id (uuid) - references submissions(id)
- score (integer) - 0-100
```

### students
```sql
- id (uuid, primary key)
- name (text)
- email (text)
```

## Testing Checklist

After integration:

- [ ] Click "Assignments" tab - should show loading state then assignment cards
- [ ] Verify quick stats display (Total, Due This Week, Pending Grading, Avg Completion)
- [ ] Test filters (Subject, Type, Status, Search)
- [ ] Click "View Details" on an assignment - modal should open
- [ ] Check student progress table in modal
- [ ] Test "Extend Deadline" button
- [ ] Test "Download Gradebook CSV" button
- [ ] Verify mobile responsive layout

## Troubleshooting

### No assignments showing
- Check browser console for errors
- Verify Supabase connection (check SUPABASE_URL and SUPABASE_ANON_KEY)
- Ensure user is authenticated
- Check that `student_assignments` table exists and has data with `created_by` matching current user ID

### Modal not opening
- Verify modal HTML was added
- Check that `assignmentDetailsModal` element exists in DOM
- Look for JavaScript errors in console

### Styling issues
- Ensure all CSS was copied correctly
- Check for conflicts with existing styles
- Verify responsive breakpoints (@media queries)

## Feature Overview

### Quick Stats Dashboard
Shows at-a-glance metrics:
- Total assignments created
- Assignments due this week
- Submissions pending grading
- Average class completion rate

### Assignment Cards
Each card displays:
- Assignment title and type badge
- Subject and student count
- Due date with countdown timer
- Visual progress bar
- Completion stats (not started/in progress/submitted/graded)
- Average score (if graded)
- Action buttons

### Assignment Details Modal
Deep dive into each assignment:
- Full student list with status
- Individual submission dates
- Scores and grading status
- Days until due / late indicators
- Bulk actions:
  - Send reminder to incomplete students
  - Extend deadline for all
  - Download gradebook CSV

### Filters and Search
- Filter by subject (Math, ELA, Science, History, Civics, Government)
- Filter by type (Quiz, Homework, Test, Project)
- Filter by status (Active, Overdue, Completed)
- Real-time search by assignment title or student name
- Sort by due date or completion rate

## Next Steps

1. Add the CSS, HTML, and JavaScript as outlined above
2. Test in development
3. Create sample assignments in Supabase to verify functionality
4. Deploy to production

## Support

If you encounter issues during integration:
1. Check the browser console for errors
2. Verify all code was copied correctly
3. Ensure Supabase tables exist with correct schema
4. Test authentication is working
5. Review this guide for missed steps
