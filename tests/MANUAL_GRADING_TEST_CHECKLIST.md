# Teacher Grading Workflow - Manual Testing Checklist

## Quick Reference for Manual QA Testing

This checklist provides step-by-step instructions for manually testing the teacher grading workflow without automated tools.

---

## Pre-Test Setup

### 1. Create Test Accounts
- [ ] Teacher account: `teacher@centner.academy`
- [ ] Student account: `student@centner.academy`
- [ ] Verify both can login successfully

### 2. Create Test Assignments
- [ ] Quiz: "Constitutional Rights Quiz" (100 points)
- [ ] Essay: "Checks and Balances Essay" (100 points, with rubric)
- [ ] Project: "Government Branch Presentation" (200 points)

### 3. Create Test Submissions
- [ ] Student submits quiz with answers
- [ ] Student submits essay with text + file
- [ ] Student submits project (late submission)

---

## Test Scenario 1: View Submissions Dashboard

### Access Grading Dashboard
1. [ ] Login as teacher
2. [ ] Click "Grading" tab in navigation
3. [ ] **Verify:** Grading dashboard loads
4. [ ] **Verify:** "Student Submissions" header visible
5. [ ] **Verify:** Statistics cards display (Pending, Graded, Late)

### Test Filters - Status
6. [ ] Select "Pending Review" from status filter
7. [ ] **Verify:** Only ungraded submissions show
8. [ ] Count pending submissions: ________
9. [ ] Select "Graded" from status filter
10. [ ] **Verify:** Only graded submissions show
11. [ ] Count graded submissions: ________
12. [ ] Select "All Statuses"
13. [ ] **Verify:** All submissions show
14. [ ] Count total submissions: ________

### Test Filters - Subject
15. [ ] Select "7th Civics" from subject filter
16. [ ] **Verify:** Only 7th Civics submissions show
17. [ ] Select "9th ELA" from subject filter
18. [ ] **Verify:** Only 9th ELA submissions show
19. [ ] Select "11th Government" from subject filter
20. [ ] **Verify:** Only 11th Government submissions show

### Test Filters - Assignment Type
21. [ ] Select "Quizzes" from type filter
22. [ ] **Verify:** Only quiz submissions show
23. [ ] Select "Essays" from type filter
24. [ ] **Verify:** Only essay submissions show
25. [ ] Select "Homework" from type filter
26. [ ] **Verify:** Only homework submissions show

### Test Sorting
27. [ ] Select "Sort by Due Date"
28. [ ] **Verify:** Submissions sorted by due date (earliest first)
29. [ ] Select "Sort by Submission Date"
30. [ ] **Verify:** Submissions sorted by when submitted
31. [ ] Select "Sort by Student Name"
32. [ ] **Verify:** Submissions sorted alphabetically

### Verify Statistics
33. [ ] Note "Pending" count: ________
34. [ ] Note "Graded" count: ________
35. [ ] Note "Late" count: ________
36. [ ] **Verify:** Counts match filtered results

**Scenario 1 Result:** PASS / FAIL
**Notes:** _________________________________________________

---

## Test Scenario 2: Grade Quiz (Auto-Graded)

### Open Quiz Submission
1. [ ] Filter for "Quizzes" type
2. [ ] Filter for "Pending Review" status
3. [ ] Click on first quiz submission card
4. [ ] **Verify:** Grading modal opens
5. [ ] **Verify:** Modal shows quiz title
6. [ ] **Verify:** Student name displayed
7. [ ] **Verify:** Submission date shown

### Review Auto-Graded Answers
8. [ ] Count number of questions: ________
9. [ ] For each question:
   - [ ] **Verify:** Question text visible
   - [ ] **Verify:** Student's answer highlighted
   - [ ] **Verify:** Correct answer shown
   - [ ] **Verify:** Green checkmark (correct) OR red X (incorrect)

### Check Auto-Score
10. [ ] Note auto-calculated score: ________ / ________
11. [ ] Calculate percentage: ________%
12. [ ] **Verify:** Percentage displayed matches calculation
13. [ ] **Verify:** Letter grade displayed (A/B/C/D/F)
14. [ ] Expected letter grade: ________
15. [ ] **Verify:** Matches expectation

### Override Auto-Score (Optional Test)
16. [ ] Locate points slider or input
17. [ ] Note original score: ________
18. [ ] Change score to: ________ (pick different value)
19. [ ] **Verify:** Warning message appears
20. [ ] **Verify:** Letter grade updates automatically
21. [ ] New letter grade: ________

### Add Feedback
22. [ ] Locate feedback textarea
23. [ ] Type feedback: "Great work on questions 1-5! Review question 6 concept."
24. [ ] **Verify:** Character counter updates
25. [ ] Character count: ________

### Submit Grade
26. [ ] Click "Submit Grade" button
27. [ ] **Watch network tab:** POST to `/grade-assignment`
28. [ ] **Verify:** Success message appears
29. [ ] **Verify:** Modal closes
30. [ ] **Verify:** Submission card now shows "Graded" badge

### Verify in Database (Supabase)
31. [ ] Open Supabase Dashboard
32. [ ] Navigate to Table Editor → `grades`
33. [ ] Find latest grade record
34. [ ] **Verify:** `points_earned` = ________
35. [ ] **Verify:** `points_possible` = ________
36. [ ] **Verify:** `percentage` = ________
37. [ ] **Verify:** `letter_grade` = ________
38. [ ] **Verify:** `teacher_feedback` contains your text
39. [ ] **Verify:** `graded_at` timestamp is recent

### Verify Course Grade Update
40. [ ] Navigate to Table Editor → `course_grades`
41. [ ] Find student's course grade record
42. [ ] **Verify:** `percentage` updated
43. [ ] **Verify:** `calculated_at` timestamp is recent

**Scenario 2 Result:** PASS / FAIL
**Notes:** _________________________________________________

---

## Test Scenario 3: Grade Homework (Manual Grading)

### Open Homework Submission
1. [ ] Filter for "Homework" or "Essays" type
2. [ ] Filter for "Pending Review" status
3. [ ] Click on first homework submission card
4. [ ] **Verify:** Grading modal opens
5. [ ] **Verify:** Assignment title displayed
6. [ ] **Verify:** Student name visible

### Review Submission Content
7. [ ] **Verify:** Submission text displayed
8. [ ] Read first 100 characters: _____________________________
9. [ ] Count attached files: ________
10. [ ] For each file:
    - [ ] **Verify:** File name displayed
    - [ ] **Verify:** File type icon shown (PDF/DOC/JPG/etc)
    - [ ] Click download link
    - [ ] **Verify:** File downloads successfully

### Test Rubric Scoring (if available)
11. [ ] **Check:** Does assignment have rubric? YES / NO
12. [ ] If YES, list rubric criteria:
    - Criterion 1: ________________ (max: ___ pts)
    - Criterion 2: ________________ (max: ___ pts)
    - Criterion 3: ________________ (max: ___ pts)
13. [ ] Adjust each criterion slider
14. [ ] Set scores:
    - Criterion 1: _____ points
    - Criterion 2: _____ points
    - Criterion 3: _____ points
15. [ ] **Verify:** Total points updates automatically
16. [ ] Total: ________
17. [ ] **Verify:** Percentage calculated
18. [ ] Percentage: ________%

### Manual Points Entry
19. [ ] If no rubric, locate points input field
20. [ ] Enter points earned: ________ (choose value)
21. [ ] Max points possible: ________
22. [ ] **Verify:** Percentage auto-calculates
23. [ ] Calculated percentage: ________%
24. [ ] **Verify:** Letter grade auto-assigns
25. [ ] Letter grade: ________

### Test Different Point Values
26. [ ] Enter 95 points → **Verify:** Grade = A
27. [ ] Enter 85 points → **Verify:** Grade = B
28. [ ] Enter 75 points → **Verify:** Grade = C
29. [ ] Enter 65 points → **Verify:** Grade = D
30. [ ] Enter 50 points → **Verify:** Grade = F
31. [ ] Enter final score: ________

### Add Detailed Feedback
32. [ ] Locate feedback textarea
33. [ ] Type multi-paragraph feedback:
    ```
    Excellent work overall!

    Strengths:
    - Clear organization
    - Strong analysis
    - Proper citations

    Areas for improvement:
    - Add more specific examples in paragraph 3
    - Expand conclusion

    Keep up the great work!
    ```
34. [ ] **Verify:** Character counter updates
35. [ ] Final character count: ________

### Submit Grade
36. [ ] Click "Submit Grade" button
37. [ ] **Verify:** API request sent (check network tab)
38. [ ] **Verify:** Success message appears
39. [ ] **Verify:** Modal closes
40. [ ] **Verify:** Statistics update (Pending count decreases)

**Scenario 3 Result:** PASS / FAIL
**Notes:** _________________________________________________

---

## Test Scenario 4: Grade History and Revisions

### View Previously Graded Submission
1. [ ] Filter for "Graded" status
2. [ ] Click on a graded submission
3. [ ] **Verify:** Modal shows "Update Grade" instead of "Submit Grade"
4. [ ] **Verify:** Current grade displayed
5. [ ] Current grade: ________
6. [ ] **Verify:** Previous feedback shown
7. [ ] Previous feedback preview: _____________________________

### Update Grade
8. [ ] Note original points: ________
9. [ ] Change points to: ________ (add +5 points)
10. [ ] **Verify:** Percentage updates
11. [ ] New percentage: ________%
12. [ ] **Verify:** Letter grade updates if changed
13. [ ] New letter grade: ________

### Update Feedback
14. [ ] Add to existing feedback: "Updated: Added 5 extra credit points for exceptional research."
15. [ ] **Verify:** Character count updates

### Submit Update
16. [ ] Click "Update Grade" button
17. [ ] **Verify:** Update confirmation appears
18. [ ] **Verify:** Modal closes

### Verify Grade History (Database)
19. [ ] Open Supabase Dashboard
20. [ ] Navigate to `grade_history` table
21. [ ] Find latest history record
22. [ ] **Verify:** `previous_points_earned` = ________ (original)
23. [ ] **Verify:** `new_points_earned` = ________ (updated)
24. [ ] **Verify:** `changed_by` = teacher ID
25. [ ] **Verify:** `changed_at` timestamp is recent

**Scenario 4 Result:** PASS / FAIL
**Notes:** _________________________________________________

---

## Test Scenario 5: Late Submission Handling

### Identify Late Submissions
1. [ ] Check statistics: Late count = ________
2. [ ] Look for "Late" badges on submission cards
3. [ ] Count cards with late badge: ________
4. [ ] **Verify:** Counts match

### Grade Late Submission
5. [ ] Click on late submission card
6. [ ] **Verify:** "LATE" indicator in modal
7. [ ] **Verify:** Days late displayed
8. [ ] Days late: ________

### Check Late Penalty (if configured)
9. [ ] **Check:** Is late penalty configured? YES / NO
10. [ ] If YES:
    - [ ] Policy: ________% per day
    - [ ] Maximum penalty: ________%
    - [ ] **Verify:** Penalty calculation shown
    - [ ] Original max points: ________
    - [ ] Penalty amount: ________
    - [ ] Adjusted max points: ________

### Submit Grade
11. [ ] Enter points or use rubric
12. [ ] Add feedback mentioning late submission
13. [ ] Submit grade
14. [ ] **Verify:** Grade saved successfully

**Scenario 5 Result:** PASS / FAIL
**Notes:** _________________________________________________

---

## Test Scenario 6: Error Handling

### Test Invalid Points (Exceeds Maximum)
1. [ ] Open any pending submission
2. [ ] Note max points: ________
3. [ ] Enter points: ________ (10 points over max)
4. [ ] Try to submit
5. [ ] **Verify:** Error message appears
6. [ ] Error message: _____________________________
7. [ ] **Verify:** Grade does NOT submit

### Test Invalid Points (Negative)
8. [ ] Enter points: -5
9. [ ] Try to submit
10. [ ] **Verify:** Error message appears
11. [ ] Error message: _____________________________
12. [ ] **Verify:** Grade does NOT submit

### Test Missing Feedback
13. [ ] Enter valid points: ________
14. [ ] Leave feedback field empty
15. [ ] Try to submit
16. [ ] **Check:** Warning appears? YES / NO
17. [ ] If YES, warning message: _____________________________

### Test Network Failure
18. [ ] Open submission
19. [ ] Open browser DevTools → Network tab
20. [ ] Enable "Offline" mode
21. [ ] Enter grade and try to submit
22. [ ] **Verify:** Error message appears
23. [ ] **Verify:** Grade not lost (can retry)
24. [ ] Disable "Offline" mode
25. [ ] Retry submission
26. [ ] **Verify:** Grade submits successfully

**Scenario 6 Result:** PASS / FAIL
**Notes:** _________________________________________________

---

## Test Scenario 7: Course Grade Recalculation

### Before Grading
1. [ ] Open Supabase Dashboard
2. [ ] Query course_grades table:
   ```sql
   SELECT percentage, letter_grade, calculated_at
   FROM course_grades
   WHERE student_id = '[student_id]'
   AND subject_key = '7th_civics';
   ```
3. [ ] Before percentage: ________%
4. [ ] Before letter grade: ________
5. [ ] Before timestamp: ________

### Grade Assignment
6. [ ] Grade a new assignment for the student
7. [ ] Points earned: ________
8. [ ] Points possible: ________
9. [ ] Submit grade

### After Grading
10. [ ] Re-query course_grades table (same query as step 2)
11. [ ] After percentage: ________%
12. [ ] After letter grade: ________
13. [ ] After timestamp: ________
14. [ ] **Verify:** Timestamp updated
15. [ ] **Verify:** Percentage changed (if applicable)

### Verify Weighted Calculation
16. [ ] Query assignment_categories:
    ```sql
    SELECT category_key, weight FROM assignment_categories;
    ```
17. [ ] List categories and weights:
    - ____________: ____%
    - ____________: ____%
    - ____________: ____%
    - ____________: ____%
18. [ ] **Verify:** Total weight = 100%

19. [ ] Manually calculate weighted grade:
    ```
    Course Grade = (Category1_Avg × Weight1) +
                   (Category2_Avg × Weight2) +
                   (Category3_Avg × Weight3) +
                   (Category4_Avg × Weight4)
    ```
20. [ ] Manual calculation: ________%
21. [ ] Database value: ________%
22. [ ] **Verify:** Values match (within 0.1%)

**Scenario 7 Result:** PASS / FAIL
**Notes:** _________________________________________________

---

## Performance Testing

### Dashboard Load Time
1. [ ] Clear browser cache
2. [ ] Login as teacher
3. [ ] Start timer
4. [ ] Click "Grading" tab
5. [ ] Stop timer when submissions fully loaded
6. [ ] Load time: ________ seconds
7. [ ] **Target:** < 3 seconds
8. [ ] Result: PASS / FAIL

### Filter Application Time
9. [ ] Start timer
10. [ ] Change status filter
11. [ ] Stop timer when results update
12. [ ] Filter time: ________ seconds
13. [ ] **Target:** < 1 second
14. [ ] Result: PASS / FAIL

### Modal Open Time
15. [ ] Start timer
16. [ ] Click submission card
17. [ ] Stop timer when modal fully renders
18. [ ] Modal time: ________ milliseconds
19. [ ] **Target:** < 500ms
20. [ ] Result: PASS / FAIL

### Grade Submission Time
21. [ ] Fill out grade
22. [ ] Start timer
23. [ ] Click submit
24. [ ] Stop timer when success message appears
25. [ ] Submit time: ________ seconds
26. [ ] **Target:** < 2 seconds
27. [ ] Result: PASS / FAIL

**Performance Result:** PASS / FAIL
**Notes:** _________________________________________________

---

## Final Checklist

### All Scenarios Complete
- [ ] Scenario 1: View Submissions Dashboard
- [ ] Scenario 2: Grade Quiz (Auto-Graded)
- [ ] Scenario 3: Grade Homework (Manual Grading)
- [ ] Scenario 4: Grade History and Revisions
- [ ] Scenario 5: Late Submission Handling
- [ ] Scenario 6: Error Handling
- [ ] Scenario 7: Course Grade Recalculation
- [ ] Performance Testing

### Overall Assessment
- Total Tests: ________
- Tests Passed: ________
- Tests Failed: ________
- Pass Rate: ________%

### Critical Issues Found
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### Recommendations
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

---

## Sign-off

**Tester Name:** _____________________
**Date:** _____________________
**Time Spent:** ________ minutes

**Overall Result:** PASS / FAIL

**Next Steps:**
- [ ] Document bugs in issue tracker
- [ ] Re-test failed scenarios after fixes
- [ ] Final validation before production release

---

**File Location:**
`/Users/mattysquarzoni/Documents/Documents - Matty's MacBook Pro/AI_content_cleen/AI_academy_content_generator_V2/SchoolCalendar2025-2026/tests/MANUAL_GRADING_TEST_CHECKLIST.md`
