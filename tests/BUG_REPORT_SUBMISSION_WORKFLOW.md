# Bug Report: Student Submission Workflow

**Project**: AI Academy @ Centner Calendar System
**Reporter**: QA Testing Specialist
**Date**: October 20, 2025
**Priority**: HIGH

---

## Bug #1: Quiz Submission Feature Not Implemented

**Severity**: CRITICAL
**Status**: OPEN
**Priority**: P0

### Description
Quiz submission functionality is completely missing from the student dashboard. Students cannot take quizzes digitally, blocking the core assessment workflow.

### Expected Behavior
1. Student navigates to "My Assignments"
2. Student clicks "Start Assignment" on a quiz
3. Quiz modal opens with:
   - Question display (multiple choice, true/false, etc.)
   - Answer selection interface
   - Navigation buttons (Next/Previous)
   - Progress bar
   - "Review Answers" button
4. Student completes quiz and submits
5. Auto-grading calculates score
6. Submission saved to database

### Actual Behavior
1. Student navigates to assignments
2. Student clicks "Start Assignment" on any assignment
3. Homework modal opens (not quiz-specific)
4. No quiz questions displayed
5. No quiz submission capability

### Steps to Reproduce
1. Login as student: `student1@aicentner.com`
2. Navigate to student dashboard
3. Look for quiz assignment
4. Click "Start Assignment"
5. Observe: Homework modal opens instead of quiz

### Root Cause
**Missing files**:
- `quiz-submission.js` component
- Quiz question renderer
- Quiz state management
- Quiz-specific API endpoint

**Evidence**:
```bash
# Search for quiz submission code
grep -r "openQuizModal" *.js
# Result: No matches found

# Search for quiz answer handling
grep -r "quiz_answers" *.js
# Result: Only in database schema, not in UI code
```

### Impact
- Teachers cannot assign digital quizzes
- Students must take paper-based quizzes
- No auto-grading capability
- Manual grading required for all assessments
- Reduced efficiency for both teachers and students

### Affected Components
- Student Dashboard UI
- Assignment modal
- Submission API
- Database (unused `quiz_answers` column)

### Environment
- Browser: All browsers
- URL: https://ai-academy-centner-calendar.netlify.app/student-dashboard.html
- User Type: Student

### Proposed Fix
Create new quiz submission module:

**File**: `/quiz-submission.js`
```javascript
// Proposed structure
const quizState = {
    currentQuestion: 0,
    answers: {},
    markedForReview: [],
    startTime: Date.now()
};

function openQuizModal(quizData) {
    // Render quiz interface
    // Show first question
    // Initialize state
}

function renderQuestion(index) {
    // Render question based on type
    // multiple_choice, true_false, multiple_select
}

function selectAnswer(questionId, answer) {
    // Save answer to state
    // Update UI
    // Auto-save draft
}

function submitQuiz() {
    // Validate all questions answered
    // Show review screen
    // POST to API with quiz_answers
}
```

**Estimated Effort**: 7-10 days

**Related Files**:
- `/homework-submission.js` (reference implementation)
- `/netlify/functions/submit-assignment.js` (needs update)
- `/database/migrations/20251020212637_enhanced_submissions_system.sql`

---

## Bug #2: Database Schema Not Utilized

**Severity**: MEDIUM
**Status**: OPEN
**Priority**: P1

### Description
Enhanced `submissions` table exists in database but is not being used by the application. API still uses legacy `homework_submissions` table, missing advanced features.

### Expected Behavior
- API uses `submissions` table
- Supports quiz_answers JSONB column
- Auto-calculates late status via trigger
- Tracks attempt numbers
- Stores auto-scores

### Actual Behavior
- API uses `homework_submissions` table
- No quiz support
- Manual late status calculation
- No attempt tracking
- No auto-scoring

### Steps to Reproduce
1. Submit homework assignment
2. Check API network request
3. Observe table name: `homework_submissions`
4. Query database:
```sql
SELECT COUNT(*) FROM submissions;
-- Returns 0 or NULL (table empty/unused)

SELECT COUNT(*) FROM homework_submissions;
-- Returns actual submission count
```

### Root Cause
**File**: `/netlify/functions/submit-assignment.js`
**Line**: 86

```javascript
// Current implementation
const { data: submission, error } = await supabase
    .from('homework_submissions')  // ❌ Wrong table
    .insert([submissionData])
    .select()
    .single();
```

**Should be**:
```javascript
// Correct implementation
const { data: submission, error } = await supabase
    .from('submissions')  // ✅ Use enhanced table
    .insert([submissionData])
    .select()
    .single();
```

### Impact
- Missing features: attempt tracking, auto late detection
- Inconsistent data model
- Future migration complexity
- Unused database investment

### Affected Components
- Submit assignment API
- Database schema
- Data analytics/reporting

### Proposed Fix
1. Update API to use `submissions` table
2. Migrate existing data from `homework_submissions`
3. Update data model in API
4. Test thoroughly

**Estimated Effort**: 1-2 days

---

## Bug #3: No Submission History View

**Severity**: LOW
**Status**: OPEN
**Priority**: P2

### Description
Students cannot view their submission history, past grades, or teacher feedback. This creates a poor user experience and limits learning.

### Expected Behavior
1. Student navigates to "My Submissions" or "Submitted" tab
2. List of all past submissions displays
3. Each submission shows:
   - Assignment name
   - Submission date
   - Grade (if graded)
   - Teacher feedback
   - Submitted files (download links)
   - Option to resubmit (if allowed)

### Actual Behavior
- No submission history view
- Students can't see past submissions
- No access to grades/feedback
- No way to download submitted files

### Steps to Reproduce
1. Login as student
2. Submit homework assignment
3. Look for submitted assignments list
4. Observe: No history view available

### Root Cause
**Missing UI component** - No submission history page/section created

### Impact
- Poor UX
- Students can't track progress
- No feedback visibility
- Reduced transparency

### Proposed Fix
Add submission history component to student dashboard:

```javascript
async function loadSubmissionHistory() {
    const response = await fetch(
        `/.netlify/functions/get-student-submissions?student_id=${studentId}`
    );
    const submissions = await response.json();
    renderSubmissionList(submissions);
}
```

**Estimated Effort**: 2-3 days

---

## Bug #4: File Upload Not Saved in Draft

**Severity**: LOW
**Status**: OPEN
**Priority**: P3

### Description
When student uploads files and saves draft (or modal auto-saves), the uploaded files are lost when modal is closed. Student must re-upload files next time.

### Expected Behavior
1. Student uploads 3 files
2. Student saves draft or auto-save triggers
3. Student closes modal
4. Student reopens assignment
5. **Expected**: Files still listed (at minimum, file names shown)

### Actual Behavior
1. Student uploads 3 files
2. Student saves draft
3. Student closes modal
4. Student reopens assignment
5. **Actual**: File list empty, must re-upload

### Steps to Reproduce
1. Open homework modal
2. Upload 2-3 PDF files
3. Click "Save Draft"
4. Close modal
5. Reopen same assignment
6. Observe: File list empty

### Root Cause
**File**: `/homework-submission.js`
**Line**: 482-506

Draft only saves text fields:
```javascript
function saveDraft() {
    const draft = {
        textResponse,    // ✅ Saved
        linkUrl,         // ✅ Saved
        studentNotes,    // ✅ Saved
        // ❌ Missing: uploadedFiles metadata
        savedAt: new Date().toISOString()
    };
    localStorage.setItem(`hw_draft_${assignmentId}`, JSON.stringify(draft));
}
```

### Impact
- Minor UX issue
- Student frustration
- Time wasted re-uploading files

### Proposed Fix
Save file metadata (not actual files, but list for user reference):

```javascript
function saveDraft() {
    const draft = {
        textResponse,
        linkUrl,
        studentNotes,
        fileMetadata: uploadedFiles.map(f => ({
            name: f.name,
            size: f.size,
            type: f.type
        })),  // Save file info for display
        savedAt: new Date().toISOString()
    };
    localStorage.setItem(`hw_draft_${assignmentId}`, JSON.stringify(draft));
}

function loadDraft(assignmentId) {
    const draft = JSON.parse(localStorage.getItem(`hw_draft_${assignmentId}`));
    if (draft?.fileMetadata) {
        // Display message: "Previously selected files: file1.pdf, file2.pdf"
        // Note: Files must be re-uploaded (can't restore File objects)
    }
    return draft;
}
```

**Estimated Effort**: 4 hours

---

## Bug #5: Generic Network Error Messages

**Severity**: LOW
**Status**: OPEN
**Priority**: P3

### Description
When submission fails due to network issues, error message is generic and unhelpful. No retry mechanism or offline detection.

### Expected Behavior
- Specific error messages for different failure types
- Offline detection with clear message
- "Retry" button for failed submissions
- Submission queued for when connection restored

### Actual Behavior
Generic error: "Failed to submit homework. Please try again."

### Steps to Reproduce
1. Open homework modal
2. Open DevTools > Network tab
3. Set to "Offline" mode
4. Try to submit assignment
5. Observe generic error message

### Root Cause
**File**: `/homework-submission.js`
**Line**: 474-479

```javascript
} catch (error) {
    console.error('Submission error:', error);
    hideLoadingOverlay();
    submitBtn.disabled = false;
    showError('Failed to submit homework. Please try again.');  // ❌ Generic
}
```

### Proposed Fix
Add specific error handling:

```javascript
} catch (error) {
    console.error('Submission error:', error);
    hideLoadingOverlay();
    submitBtn.disabled = false;

    // Check if offline
    if (!navigator.onLine) {
        showError('No internet connection. Your draft has been saved. Please try again when online.');
        return;
    }

    // Check for specific errors
    if (error.message.includes('timeout')) {
        showError('Request timed out. Please check your connection and try again.', {
            showRetry: true,
            onRetry: () => submitHomework()
        });
        return;
    }

    // Generic fallback
    showError('Failed to submit homework. Please try again or contact support.', {
        showRetry: true
    });
}
```

**Estimated Effort**: 1 day

---

## Bug #6: No Late Submission Flag in Current Table

**Severity**: LOW
**Status**: OPEN (Resolved in new schema)
**Priority**: P3

### Description
The current `homework_submissions` table doesn't have an `is_late` column or automatic late detection. Teacher must manually check submission dates.

### Expected Behavior
- Submission automatically flagged as late if submitted after due date
- `is_late` boolean field in database
- Late submissions highlighted in teacher grading view

### Actual Behavior
- No `is_late` field in `homework_submissions` table
- Manual comparison of dates required

### Root Cause
Using legacy table without enhanced features

### Solution
This is resolved in the enhanced `submissions` table schema:

```sql
-- Enhanced schema includes:
is_late BOOLEAN DEFAULT FALSE,

-- With automatic calculation via trigger:
CREATE TRIGGER calculate_submission_late_status_trigger
    BEFORE INSERT OR UPDATE OF submitted_at, status ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION calculate_submission_late_status();
```

**Fix**: Migrate to new schema (see Bug #2)

---

## Priority Summary

| Priority | Count | Bugs |
|----------|-------|------|
| P0 (Critical) | 1 | #1 Quiz Not Implemented |
| P1 (High) | 1 | #2 Database Schema |
| P2 (Medium) | 1 | #3 Submission History |
| P3 (Low) | 3 | #4 File Draft, #5 Errors, #6 Late Flag |
| **Total** | **6** | **6 bugs identified** |

---

## Recommended Fix Order

1. **Week 1**: Bug #1 - Implement Quiz Submission (7-10 days)
2. **Week 2**: Bug #2 - Database Migration (1-2 days)
3. **Week 2**: Bug #3 - Submission History (2-3 days)
4. **Week 3**: Bug #5 - Error Handling (1 day)
5. **Week 3**: Bug #4 - File Draft Metadata (4 hours)

**Total Estimated Effort**: 15-20 days (3-4 weeks)

---

## Testing Recommendations

After fixes:
1. Run full automated test suite: `npx playwright test tests/student-submission-workflow.spec.js`
2. Execute manual checklist: See `/tests/MANUAL_SUBMISSION_TEST_CHECKLIST.md`
3. Perform cross-browser testing (Chrome, Firefox, Safari)
4. Test on mobile devices
5. Load test with large files (10MB uploads)
6. Test with slow network (throttle to 3G)

---

## Related Documentation

- Full Test Report: `/tests/STUDENT_SUBMISSION_TEST_REPORT.md`
- Manual Checklist: `/tests/MANUAL_SUBMISSION_TEST_CHECKLIST.md`
- Test Execution Guide: `/tests/RUN_SUBMISSION_TESTS.md`
- Executive Summary: `/tests/SUBMISSION_WORKFLOW_EXECUTIVE_SUMMARY.md`

---

**Report End**
**Last Updated**: October 20, 2025
