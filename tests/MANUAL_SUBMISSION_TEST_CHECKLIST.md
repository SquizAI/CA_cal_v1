# Manual Test Checklist - Student Submission Workflow

**Tester**: ___________________
**Date**: ___________________
**Environment**: Production (https://ai-academy-centner-calendar.netlify.app)

---

## Pre-Test Setup

- [ ] Open browser (Chrome/Firefox/Safari)
- [ ] Clear localStorage: `localStorage.clear()`
- [ ] Open DevTools Console
- [ ] Navigate to: https://ai-academy-centner-calendar.netlify.app/student-dashboard.html

---

## Test 1: Student Login & Navigation

### 1.1 Login
- [ ] Auth modal appears automatically
- [ ] Enter email: `student1@aicentner.com`
- [ ] Enter password: `TestPassword123!`
- [ ] Click "Login" button
- [ ] Auth modal closes successfully
- [ ] Student dashboard loads

**Result**: PASS / FAIL
**Notes**: ___________________

---

### 1.2 Navigate to Assignments
- [ ] Look for "My Assignments" section/button
- [ ] Click to view assignments
- [ ] "Upcoming" tab visible
- [ ] "Submitted" tab visible
- [ ] "Graded" tab visible

**Result**: PASS / FAIL
**Notes**: ___________________

---

## Test 2: Homework Submission - File Upload

### 2.1 Open Homework Modal
- [ ] Find lesson with "Start Assignment" button
- [ ] Click "Start Assignment"
- [ ] Homework modal opens (verify with ID: `homeworkModal.active`)
- [ ] Modal displays:
  - [ ] Assignment title
  - [ ] Subject
  - [ ] Due date
  - [ ] Points possible
  - [ ] Period number

**Result**: PASS / FAIL
**Screenshot**: ___________________

---

### 2.2 Verify Modal Tabs
- [ ] "Upload Files" tab visible (with 📎 icon)
- [ ] "Text Response" tab visible (with 📝 icon)
- [ ] "Submit Link" tab visible (with 🔗 icon)
- [ ] "Upload Files" tab is active by default

**Result**: PASS / FAIL

---

### 2.3 File Upload via Browser
- [ ] Click on dropzone to open file browser
- [ ] Select a PDF file (< 10MB)
- [ ] File appears in file list
- [ ] File name displayed correctly
- [ ] File size displayed
- [ ] File icon shows (📄 for PDF)
- [ ] Remove button (×) visible

**Result**: PASS / FAIL

---

### 2.4 File Upload via Drag-and-Drop
- [ ] Drag a JPG/PNG file over dropzone
- [ ] Dropzone highlights (dragging class added)
- [ ] Drop file
- [ ] File appears in file list
- [ ] Image icon shows (🖼️)

**Result**: PASS / FAIL

---

### 2.5 File Validation Tests

#### Test 2.5a: Invalid File Type
- [ ] Try to upload .exe or .zip file
- [ ] Error message appears: "File type not allowed: {filename}"
- [ ] File NOT added to list

**Result**: PASS / FAIL

#### Test 2.5b: File Too Large
- [ ] Try to upload file > 10MB
- [ ] Error message: "File too large: {filename} (Max 10MB)"
- [ ] File NOT added to list

**Result**: PASS / FAIL
**Note**: To test, create large file: `dd if=/dev/zero of=large.pdf bs=1m count=15`

#### Test 2.5c: Too Many Files
- [ ] Upload 5 files successfully
- [ ] Try to upload 6th file
- [ ] Error message: "You can only upload up to 5 files"

**Result**: PASS / FAIL

---

### 2.6 Remove File
- [ ] Click remove button (×) on uploaded file
- [ ] File removed from list
- [ ] File count decreases

**Result**: PASS / FAIL

---

## Test 3: Text Response Submission

### 3.1 Switch to Text Response Tab
- [ ] Click "Text Response" tab
- [ ] Tab becomes active
- [ ] Textarea visible with placeholder
- [ ] Character counter shows "0 characters"

**Result**: PASS / FAIL

---

### 3.2 Type Text Response
- [ ] Type at least 100 characters
- [ ] Character counter updates in real-time
- [ ] Displays correct character count

**Example text**:
```
This is my homework response. I have completed all the required reading and analyzed the key concepts discussed in class. My findings show that...
```

**Result**: PASS / FAIL

---

### 3.3 Tab Persistence
- [ ] Switch to "Upload Files" tab
- [ ] Switch back to "Text Response" tab
- [ ] Text is still there (persisted)

**Result**: PASS / FAIL

---

## Test 4: Link Submission

### 4.1 Switch to Submit Link Tab
- [ ] Click "Submit Link" tab
- [ ] URL input field visible
- [ ] Placeholder shows: "https://docs.google.com/..."

**Result**: PASS / FAIL

---

### 4.2 Enter Valid URL
- [ ] Enter: `https://docs.google.com/document/d/test123`
- [ ] Link preview appears
- [ ] Shows "📄 Google Docs document"

**Result**: PASS / FAIL

---

### 4.3 Enter YouTube URL
- [ ] Clear previous URL
- [ ] Enter: `https://youtu.be/dQw4w9WgXcQ`
- [ ] Preview shows "📺 YouTube video"

**Result**: PASS / FAIL

---

### 4.4 Invalid URL
- [ ] Enter invalid URL: `not-a-url`
- [ ] Preview does NOT appear

**Result**: PASS / FAIL

---

## Test 5: Student Notes (Optional Field)

### 5.1 Add Student Notes
- [ ] Scroll to "Additional Notes" textarea
- [ ] Type: "Please review my work carefully. I spent extra time on this assignment."
- [ ] Text accepts input

**Result**: PASS / FAIL

---

## Test 6: Draft Functionality

### 6.1 Save Draft
- [ ] Add text response: "This is my draft"
- [ ] Click "💾 Save Draft" button
- [ ] Success message appears: "✅ Draft saved successfully!"
- [ ] Message auto-hides after 3 seconds

**Result**: PASS / FAIL

---

### 6.2 Verify localStorage
- [ ] Open DevTools Console
- [ ] Run: `localStorage.getItem('hw_draft_' + Object.keys(localStorage).find(k => k.startsWith('hw_draft_'))?.split('_')[2])`
- [ ] Draft data displays as JSON

**Expected**:
```json
{
  "textResponse": "This is my draft",
  "linkUrl": "",
  "studentNotes": "",
  "savedAt": "2025-10-20T..."
}
```

**Result**: PASS / FAIL

---

### 6.3 Close and Reopen Modal
- [ ] Close homework modal (click outside or close button)
- [ ] Reopen same assignment
- [ ] Draft data restored:
  - [ ] Text response still there
  - [ ] Link URL still there
  - [ ] Student notes still there

**Result**: PASS / FAIL

---

### 6.4 Auto-Save Test (30 seconds)
- [ ] Open homework modal
- [ ] Add text: "Testing auto-save"
- [ ] Wait 30 seconds WITHOUT clicking save
- [ ] Success message should auto-appear
- [ ] localStorage updated

**Result**: PASS / FAIL
**Note**: This test takes 30+ seconds

---

## Test 7: Submission - Empty Validation

### 7.1 Submit Empty Assignment
- [ ] Open fresh homework modal (clear draft first)
- [ ] Do NOT add any files, text, or link
- [ ] Click "✅ Submit Assignment"
- [ ] Error message appears
- [ ] Message: "Please provide at least one file, text response, or link before submitting."

**Result**: PASS / FAIL

---

## Test 8: Successful Homework Submission

### 8.1 Prepare Complete Submission
- [ ] Upload 1 PDF file
- [ ] Add text response (at least 50 chars)
- [ ] Add link: `https://docs.google.com/test`
- [ ] Add student notes: "This is my final submission"

**Result**: PASS / FAIL

---

### 8.2 Submit Assignment
- [ ] Click "✅ Submit Assignment"
- [ ] Confirmation dialog appears
- [ ] Message: "Are you sure you want to submit this assignment? You won't be able to edit it after submission."
- [ ] Click "OK"

**Result**: PASS / FAIL

---

### 8.3 File Upload Progress
- [ ] Loading overlay appears: "Submitting your homework..."
- [ ] Progress bar shows upload (if files present)
- [ ] Upload completes

**Result**: PASS / FAIL

---

### 8.4 Success Message
- [ ] Success message displays
- [ ] Message: "✅ Assignment Submitted Successfully!"
- [ ] "Your homework has been submitted. You can view it in your assignments list."

**Result**: PASS / FAIL

---

### 8.5 Modal Auto-Close
- [ ] Modal automatically closes after 2 seconds
- [ ] Page reloads
- [ ] Assignment status updated (if visible)

**Result**: PASS / FAIL

---

## Test 9: Database Verification (Dev Tools Required)

### 9.1 Check Network Tab
- [ ] Open DevTools > Network tab
- [ ] Submit assignment (repeat Test 8)
- [ ] Find POST request to: `/.netlify/functions/submit-assignment`
- [ ] Status: 200 OK
- [ ] Response body contains:
  - [ ] `"success": true`
  - [ ] `"submission_id": "uuid-..."`
  - [ ] `"submitted_at": "2025-..."`

**Result**: PASS / FAIL

---

### 9.2 Verify Request Payload
- [ ] Click on POST request
- [ ] Go to "Payload" or "Request" tab
- [ ] Verify JSON contains:
  - [ ] `assignment_id`
  - [ ] `student_id`
  - [ ] `submission_type: "homework"`
  - [ ] `file_urls` (array, if files uploaded)
  - [ ] `text_response`
  - [ ] `link_url`
  - [ ] `student_notes`
  - [ ] `submitted_at`

**Result**: PASS / FAIL

---

### 9.3 Verify Supabase Storage (Optional)
If you have Supabase dashboard access:

- [ ] Login to https://supabase.com/dashboard
- [ ] Navigate to project: `ai-academy-calendar`
- [ ] Go to Storage > Buckets
- [ ] Find bucket: `homework-submissions`
- [ ] Navigate to: `{student_id}/{assignment_id}/`
- [ ] Verify uploaded files exist
- [ ] File path format: `{timestamp}_{filename}`
- [ ] Files accessible via public URL

**Result**: PASS / FAIL

---

## Test 10: Late Submission Warning

### 10.1 Create Past-Due Assignment
**Note**: This requires setting up test data with past due date

- [ ] Open assignment with due date in the past
- [ ] Warning banner displays
- [ ] Message: "⚠️ Past Due! This assignment was due X day(s) ago. Late submissions may receive reduced points."
- [ ] Warning background: red/orange color

**Result**: PASS / FAIL
**Note**: May require test data setup

---

## Test 11: Error Scenarios

### 11.1 Network Offline Test
- [ ] Open DevTools > Network tab
- [ ] Set to "Offline" mode
- [ ] Try to submit assignment
- [ ] Error message appears
- [ ] Message: "Failed to submit homework. Please try again."
- [ ] Submit button re-enabled

**Result**: PASS / FAIL

---

### 11.2 Invalid API Response
**Note**: Requires backend modification or mock

- [ ] Modify API to return 500 error
- [ ] Try to submit
- [ ] Error message displays
- [ ] User can retry

**Result**: PASS / FAIL
**Note**: Optional advanced test

---

## Test 12: Cross-Browser Testing

### 12.1 Chrome
- [ ] All tests pass in Chrome

**Version**: ___________________
**Result**: PASS / FAIL

---

### 12.2 Firefox
- [ ] All tests pass in Firefox

**Version**: ___________________
**Result**: PASS / FAIL

---

### 12.3 Safari
- [ ] All tests pass in Safari

**Version**: ___________________
**Result**: PASS / FAIL

---

### 12.4 Mobile Browser (Optional)
- [ ] Tests pass on mobile Safari/Chrome
- [ ] File upload works on mobile
- [ ] Responsive design works

**Device**: ___________________
**Result**: PASS / FAIL

---

## Test 13: Quiz Submission (Expected to Fail - Not Implemented)

### 13.1 Look for Quiz Assignment
- [ ] Search for assignment of type "Quiz"
- [ ] Click "Start Assignment" on quiz
- [ ] Expected: Quiz modal opens with questions
- [ ] **ACTUAL**: Homework modal opens instead (no quiz UI)

**Result**: ❌ EXPECTED FAILURE

---

### 13.2 Quiz Features Not Found
- [ ] No quiz question renderer
- [ ] No answer selection UI
- [ ] No "Next Question" / "Previous Question" buttons
- [ ] No quiz progress bar
- [ ] No "Review Answers" screen
- [ ] No quiz-specific submit button

**Result**: ❌ EXPECTED - NOT IMPLEMENTED

---

## Summary

### Test Results

| Category | Pass | Fail | Skip |
|----------|------|------|------|
| Login & Navigation | ___ | ___ | ___ |
| File Upload | ___ | ___ | ___ |
| Text Response | ___ | ___ | ___ |
| Link Submission | ___ | ___ | ___ |
| Draft Functionality | ___ | ___ | ___ |
| Validation | ___ | ___ | ___ |
| Submission | ___ | ___ | ___ |
| Error Handling | ___ | ___ | ___ |
| Quiz (Expected Fail) | ___ | ___ | ___ |
| **TOTAL** | ___ | ___ | ___ |

---

### Critical Issues Found

1. ___________________
2. ___________________
3. ___________________

---

### Minor Issues Found

1. ___________________
2. ___________________
3. ___________________

---

### Recommendations

1. ___________________
2. ___________________
3. ___________________

---

### Tester Signature

**Name**: ___________________
**Date**: ___________________
**Time Spent**: ___________________

---

**Checklist Complete**
