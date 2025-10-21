# Manual Test Checklist - Assignment Distribution Workflow

**Test URL**: https://ai-academy-centner-calendar.netlify.app
**Test Date**: ___________
**Tester Name**: ___________

---

## Pre-Test Setup

- [ ] Test teacher account credentials available
- [ ] Test student account credentials available
- [ ] Browser: Chrome/Firefox/Safari (circle one)
- [ ] Screen size: Desktop / Tablet / Mobile (circle one)
- [ ] Network: Fast / Slow / Offline (circle one)

---

## Test Flow 1: Complete Assignment Creation (Happy Path)

### Step 1: Teacher Login
- [ ] Navigate to `/teacher-dashboard.html`
- [ ] Auth modal appears automatically
- [ ] Enter email: `teacher@aicentner.com`
- [ ] Enter password: `[test password]`
- [ ] Click "Sign In" button
- [ ] Modal closes, calendar appears
- [ ] **PASS / FAIL** (circle one)
- **Notes**: ___________________________________________

---

### Step 2: Navigate to Target Lesson
- [ ] Select month: October 2025 from dropdown
- [ ] Calendar renders lessons for October
- [ ] Find lesson cell for October 6, 2025
- [ ] Verify lesson shows: Period 3, 7th Grade Civics
- [ ] Click on the lesson cell
- [ ] Enhancement panel slides in from right
- [ ] **PASS / FAIL**
- **Notes**: ___________________________________________

---

### Step 3: Generate Quiz (Optional)
- [ ] Scroll to "Quiz" section in enhancement panel
- [ ] Click "Generate Quiz with AI" button
- [ ] Loading spinner appears
- [ ] Wait for AI generation (10-20 seconds)
- [ ] Quiz questions appear with answers
- [ ] Verify at least 2 questions generated
- [ ] Verify questions are relevant to lesson
- [ ] **PASS / FAIL**
- **Notes**: ___________________________________________

---

### Step 4: Open Assignment Modal
- [ ] Click "Assign to Students" button in enhancement panel
- [ ] Assignment modal opens and overlays screen
- [ ] Modal title shows: "Assign to Students"
- [ ] Modal subtitle shows correct lesson date, period, subject
- [ ] Lesson title pre-filled in assignment title field
- [ ] Assignment type selector shows 5 options: Quiz, Homework, Reading, Video, Activity
- [ ] Student list loads (check count shown)
- [ ] **PASS / FAIL**
- **Notes**: ___________________________________________

---

### Step 5: Fill Assignment Form
- [ ] Select assignment type: **Quiz**
- [ ] Quiz type button turns blue (selected state)
- [ ] Quiz questions preview section appears below
- [ ] Verify quiz questions display correctly
- [ ] Edit assignment title: "Constitution Quiz"
- [ ] Add instructions: "Complete all questions. You have 30 minutes."
- [ ] Set due date: (tomorrow's date)
- [ ] Set due time: 23:59
- [ ] Set points: 100
- [ ] **PASS / FAIL**
- **Notes**: ___________________________________________

---

### Step 6: Select Students
- [ ] Click "Select All Students" checkbox
- [ ] All student checkboxes become checked
- [ ] Selected count updates (e.g., "15 selected")
- [ ] Uncheck one student
- [ ] Selected count decreases
- [ ] Re-check the student
- [ ] **Alternative**: Manually select 3 specific students
- [ ] **PASS / FAIL**
- **Notes**: ___________________________________________

---

### Step 7: Submit Assignment
- [ ] Click "Assign to Students" button (blue button at bottom)
- [ ] Loading overlay appears with spinner
- [ ] Shows message: "Assigning to X students..."
- [ ] Wait for completion (2-5 seconds)
- [ ] Success message appears: "Assignment Created!"
- [ ] Shows: "Successfully assigned to X students"
- [ ] Success message auto-dismisses after 2 seconds
- [ ] Modal closes automatically
- [ ] **PASS / FAIL**
- **Notes**: ___________________________________________

---

### Step 8: Verify in Teacher Grading Dashboard
- [ ] Click "Grading Dashboard" tab/button
- [ ] Assignment list loads
- [ ] Find your assignment: "Constitution Quiz"
- [ ] Verify: Correct number of students assigned
- [ ] Verify: Status shows "assigned"
- [ ] Verify: Due date matches
- [ ] Verify: Points possible = 100
- [ ] **PASS / FAIL**
- **Notes**: ___________________________________________

---

### Step 9: Student Login
- [ ] Open new browser tab/window
- [ ] Navigate to `/student-dashboard.html`
- [ ] Login with student account
- [ ] Dashboard loads successfully
- [ ] **PASS / FAIL**
- **Notes**: ___________________________________________

---

### Step 10: Verify Student Sees Assignment
- [ ] Click "My Assignments" section/tab
- [ ] Assignments load automatically
- [ ] Click "Upcoming" tab
- [ ] Find assignment: "Constitution Quiz"
- [ ] Verify: Shows correct due date
- [ ] Verify: Shows "100 points"
- [ ] Verify: Shows "Quiz" badge/icon
- [ ] Verify: Shows subject (Civics)
- [ ] Click on assignment card
- [ ] Assignment details modal/page opens
- [ ] Quiz questions visible
- [ ] **PASS / FAIL**
- **Notes**: ___________________________________________

---

## Test Flow 2: Error Validation

### Test 2.1: Submit Without Assignment Type
- [ ] Open assign modal
- [ ] DO NOT select assignment type
- [ ] Fill title, due date, select students
- [ ] Click submit
- [ ] **Expected**: Alert: "Please select an assignment type"
- [ ] **PASS / FAIL**

### Test 2.2: Submit Without Title
- [ ] Select assignment type
- [ ] Clear/delete title field
- [ ] Fill due date, select students
- [ ] Click submit
- [ ] **Expected**: Alert: "Please enter an assignment title"
- [ ] **PASS / FAIL**

### Test 2.3: Submit Without Due Date
- [ ] Select type and fill title
- [ ] Clear due date field
- [ ] Select students
- [ ] Click submit
- [ ] **Expected**: Alert: "Please select a due date"
- [ ] **PASS / FAIL**

### Test 2.4: Submit Without Students
- [ ] Select type, fill title and due date
- [ ] Uncheck all students
- [ ] Click submit
- [ ] **Expected**: Alert: "Please select at least one student"
- [ ] **PASS / FAIL**

---

## Test Flow 3: Quiz Type Assignment

### Test 3.1: Quiz Type Available When Quiz Exists
- [ ] Open lesson WITH quiz data
- [ ] Open assign modal
- [ ] Verify: Quiz button is enabled (not greyed out)
- [ ] Click Quiz button
- [ ] Verify: Quiz questions preview appears
- [ ] Verify: Questions are readable and formatted
- [ ] **PASS / FAIL**

### Test 3.2: Quiz Type Disabled When No Quiz
- [ ] Open lesson WITHOUT quiz data
- [ ] Open assign modal
- [ ] Verify: Quiz button is greyed out/disabled
- [ ] Hover over quiz button
- [ ] Verify: Tooltip shows "No quiz available"
- [ ] Try clicking quiz button
- [ ] **Expected**: Nothing happens (disabled)
- [ ] **PASS / FAIL**

---

## Test Flow 4: Other Assignment Types

### Test 4.1: Homework Assignment
- [ ] Open assign modal
- [ ] Select type: Homework
- [ ] Verify: Homework button becomes selected (blue)
- [ ] Verify: Quiz section does NOT appear
- [ ] Fill form fields
- [ ] Submit successfully
- [ ] Verify in student dashboard: Shows "Homework" badge
- [ ] **PASS / FAIL**

### Test 4.2: Reading Assignment
- [ ] Select type: Reading
- [ ] Complete and submit
- [ ] Verify in student dashboard: Shows "Reading" badge
- [ ] **PASS / FAIL**

### Test 4.3: Video Assignment
- [ ] Select type: Video
- [ ] Complete and submit
- [ ] Verify in student dashboard: Shows "Video" badge
- [ ] **PASS / FAIL**

### Test 4.4: Activity Assignment
- [ ] Select type: Activity
- [ ] Complete and submit
- [ ] Verify in student dashboard: Shows "Activity" badge
- [ ] **PASS / FAIL**

---

## Test Flow 5: Student Selection Variations

### Test 5.1: Select All Then Deselect One
- [ ] Click "Select All Students"
- [ ] Verify: Count = total students
- [ ] Uncheck one specific student
- [ ] Submit assignment
- [ ] Verify: Assignment NOT in that student's dashboard
- [ ] Verify: Assignment IS in other students' dashboards
- [ ] **PASS / FAIL**

### Test 5.2: Select Only One Student
- [ ] Uncheck all students
- [ ] Check only one student
- [ ] Verify: Count = "1 selected"
- [ ] Submit assignment
- [ ] Verify: Only that student sees assignment
- [ ] **PASS / FAIL**

---

## Test Flow 6: Due Date Variations

### Test 6.1: Due Date Today
- [ ] Set due date: (today's date)
- [ ] Set due time: 23:59
- [ ] Submit assignment
- [ ] Student dashboard: Should show in "Upcoming"
- [ ] Verify: Shows "Due today" or hours remaining
- [ ] **PASS / FAIL**

### Test 6.2: Due Date Tomorrow
- [ ] Set due date: (tomorrow)
- [ ] Submit assignment
- [ ] Student dashboard: Shows "Due tomorrow" or "1 day"
- [ ] **PASS / FAIL**

### Test 6.3: Due Date Next Week
- [ ] Set due date: (7 days from now)
- [ ] Submit assignment
- [ ] Student dashboard: Shows "Due in 7 days"
- [ ] **PASS / FAIL**

---

## Test Flow 7: Data Persistence

### Test 7.1: Refresh Teacher Dashboard
- [ ] Create assignment
- [ ] Close modal
- [ ] Refresh browser (F5 or Cmd+R)
- [ ] Navigate back to grading dashboard
- [ ] Verify: Assignment still appears
- [ ] Verify: All details correct
- [ ] **PASS / FAIL**

### Test 7.2: Refresh Student Dashboard
- [ ] View assignment as student
- [ ] Refresh browser
- [ ] Navigate back to "My Assignments"
- [ ] Verify: Assignment still appears
- [ ] Verify: All details correct
- [ ] **PASS / FAIL**

### Test 7.3: Cross-Browser Test
- [ ] Create assignment in Chrome
- [ ] Login as student in Firefox
- [ ] Verify: Assignment appears correctly
- [ ] **PASS / FAIL**

---

## Test Flow 8: Multiple Assignments for Same Lesson

### Test 8.1: Create Quiz and Homework for Same Lesson
- [ ] Assign a Quiz for Oct 6 lesson
- [ ] Immediately assign Homework for same Oct 6 lesson
- [ ] Verify: Both assignments created successfully
- [ ] Student dashboard: Shows both assignments
- [ ] Verify: Different assignment types displayed
- [ ] **PASS / FAIL**

---

## Test Flow 9: Notifications (If Implemented)

### Test 9.1: Student Receives Assignment Notification
- [ ] Create assignment
- [ ] Login as student
- [ ] Check notifications bell/icon
- [ ] Verify: Notification appears
- [ ] Verify: Shows assignment title
- [ ] Verify: Shows due date
- [ ] Click notification
- [ ] Verify: Navigates to assignment details
- [ ] **PASS / FAIL** / **N/A (Not Implemented)**

---

## Test Flow 10: Edge Cases

### Test 10.1: Very Long Assignment Title
- [ ] Enter title: (100+ characters)
- [ ] Submit assignment
- [ ] Verify: Title displays correctly in student dashboard
- [ ] Verify: No text overflow/truncation issues
- [ ] **PASS / FAIL**

### Test 10.2: Special Characters in Instructions
- [ ] Enter instructions with: `<b>Bold</b>`, line breaks, emojis 📚
- [ ] Submit assignment
- [ ] Student view: Verify formatting preserved
- [ ] **PASS / FAIL**

### Test 10.3: 1000 Points Assignment
- [ ] Set points_possible: 1000
- [ ] Submit assignment
- [ ] Verify: Saves correctly
- [ ] **PASS / FAIL**

### Test 10.4: Late Night Due Time
- [ ] Set due time: 02:30 AM
- [ ] Submit assignment
- [ ] Verify: Time displays correctly
- [ ] **PASS / FAIL**

---

## Browser Compatibility Tests

| Test | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| Teacher login | ☐ | ☐ | ☐ | ☐ |
| Open modal | ☐ | ☐ | ☐ | ☐ |
| Submit assignment | ☐ | ☐ | ☐ | ☐ |
| Student view | ☐ | ☐ | ☐ | ☐ |

---

## Mobile Responsiveness Tests (Optional)

### iPhone/Android
- [ ] Modal fits on screen without horizontal scroll
- [ ] Student checkboxes are tap-friendly
- [ ] Date picker works on mobile
- [ ] Submit button accessible without scrolling
- [ ] **PASS / FAIL** / **N/A**

---

## Performance Tests

### Test 11.1: Large Student List (50+ students)
- [ ] Select period with 50+ enrolled students
- [ ] Open assign modal
- [ ] Verify: Student list loads within 2 seconds
- [ ] Scroll through student list smoothly
- [ ] Select all students
- [ ] Submit assignment
- [ ] Verify: Completes within 5 seconds
- [ ] **PASS / FAIL** / **N/A (Not enough students)**

---

## Accessibility Tests (Optional)

- [ ] Tab through form fields with keyboard only
- [ ] Submit form using Enter key
- [ ] Close modal with Escape key
- [ ] Screen reader compatibility
- [ ] Color contrast meets WCAG standards
- [ ] **PASS / FAIL** / **N/A**

---

## Test Summary

**Total Tests Run**: _____ / 50
**Passed**: _____
**Failed**: _____
**N/A**: _____

**Critical Issues Found**: _____
**Minor Issues Found**: _____

**Overall Status**: PASS / FAIL / NEEDS FIXES (circle one)

---

## Issues Log

| # | Severity | Description | Steps to Reproduce | Screenshot |
|---|----------|-------------|-------------------|----------|
| 1 | High/Med/Low | | | |
| 2 | High/Med/Low | | | |
| 3 | High/Med/Low | | | |
| 4 | High/Med/Low | | | |

---

## Sign-off

**Tester Signature**: ___________________
**Date**: ___________________
**Approved for Production**: YES / NO / WITH CONDITIONS

**Notes**: ___________________________________________________
_______________________________________________________________
_______________________________________________________________
