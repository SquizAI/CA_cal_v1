# Developer Quick Reference - Student Submission Workflow

**Quick lookup guide for implementing and fixing submission features**

---

## File Locations

```
SchoolCalendar2025-2026/
├── homework-submission.js                     # ✅ Homework UI (598 lines)
├── quiz-submission.js                         # ❌ MISSING - Need to create
├── student-dashboard.html                     # Student interface
├── netlify/functions/
│   └── submit-assignment.js                   # ✅ API endpoint (166 lines)
├── database/migrations/
│   └── 20251020212637_enhanced_submissions... # ✅ Enhanced schema
└── tests/
    ├── student-submission-workflow.spec.js    # ✅ Automated tests
    ├── STUDENT_SUBMISSION_TEST_REPORT.md      # ✅ Full test results
    ├── MANUAL_SUBMISSION_TEST_CHECKLIST.md    # ✅ Manual testing
    └── RUN_SUBMISSION_TESTS.md                # ✅ Test execution
```

---

## Homework Submission - How It Works

### Client Side (homework-submission.js)

```javascript
// 1. Open modal
openHomeworkModal(assignmentData)
  → Displays tabs: File Upload | Text Response | Link
  → Loads draft from localStorage
  → Starts auto-save timer (30s)

// 2. Handle file uploads
handleFiles(files)
  → Validates: type, size (10MB), count (5)
  → Adds to uploadedFiles array
  → Renders file list

// 3. Save draft
saveDraft()
  → Saves to localStorage: hw_draft_{assignmentId}
  → Includes: textResponse, linkUrl, studentNotes
  → Does NOT save files (limitation)

// 4. Submit
submitHomework()
  → Validates: at least one submission method
  → Uploads files to Supabase Storage
  → POSTs to /.netlify/functions/submit-assignment
  → Clears draft on success
  → Reloads page
```

### Server Side (netlify/functions/submit-assignment.js)

```javascript
// API Endpoint: POST /.netlify/functions/submit-assignment

// 1. Validate request
if (!data.assignment_id || !data.student_id)
  → 400 Bad Request

// 2. Validate content
if (!data.file_urls?.length && !data.text_response && !data.link_url)
  → 400 Bad Request

// 3. Insert to database
await supabase
  .from('homework_submissions')  // ⚠️ Should use 'submissions'
  .insert([submissionData])

// 4. Return response
{
  success: true,
  submission_id: "uuid",
  submitted_at: "timestamp"
}
```

### Database (homework_submissions table)

```sql
-- Current table (legacy)
CREATE TABLE homework_submissions (
    id UUID PRIMARY KEY,
    assignment_id TEXT,      -- ⚠️ Should be UUID with FK
    student_id TEXT,         -- ⚠️ Should be UUID with FK
    submission_type TEXT,
    file_urls TEXT[],
    text_response TEXT,
    link_url TEXT,
    student_notes TEXT,
    submitted_at TIMESTAMPTZ,
    status TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- Enhanced table (available but unused)
CREATE TABLE submissions (
    id UUID PRIMARY KEY,
    assignment_id UUID REFERENCES assignments(id),
    student_id UUID REFERENCES centner_students(id),
    submission_type TEXT CHECK (...),
    quiz_answers JSONB,      -- ✅ For quiz support
    text_response TEXT,
    file_url TEXT,
    link_url TEXT,
    is_late BOOLEAN,         -- ✅ Auto-calculated
    attempt_number INTEGER,  -- ✅ Multiple attempts
    status TEXT CHECK (...)
);
```

---

## Quiz Submission - How It Should Work

### Proposed Structure

```javascript
// quiz-submission.js (TO BE CREATED)

// State management
const quizState = {
    quizId: null,
    assignmentId: null,
    currentQuestion: 0,
    totalQuestions: 0,
    answers: {},              // { questionId: answer }
    markedForReview: [],      // [questionId, ...]
    startTime: null,
    timeSpent: 0
};

// Initialize quiz
function openQuizModal(quizData) {
    quizState.quizId = quizData.id;
    quizState.totalQuestions = quizData.questions.length;
    quizState.startTime = Date.now();

    renderQuizModal();
    loadDraft();              // Load from localStorage
    renderQuestion(0);
    startAutoSave();
}

// Render question based on type
function renderQuestion(index) {
    const question = quizData.questions[index];

    switch(question.type) {
        case 'multiple_choice':
            return renderMultipleChoice(question);
        case 'multiple_select':
            return renderCheckboxes(question);
        case 'true_false':
            return renderTrueFalse(question);
        case 'short_answer':
            return renderTextInput(question);
    }
}

// Save answer
function selectAnswer(questionId, answer) {
    quizState.answers[questionId] = answer;
    updateProgressBar();
    saveDraft();              // Auto-save to localStorage
}

// Navigation
function nextQuestion() {
    if (quizState.currentQuestion < quizState.totalQuestions - 1) {
        quizState.currentQuestion++;
        renderQuestion(quizState.currentQuestion);
    }
}

function previousQuestion() {
    if (quizState.currentQuestion > 0) {
        quizState.currentQuestion--;
        renderQuestion(quizState.currentQuestion);
    }
}

// Review screen
function showReviewScreen() {
    const unanswered = findUnansweredQuestions();
    if (unanswered.length > 0) {
        alert(`You have ${unanswered.length} unanswered questions.`);
        // Highlight unanswered in review
    }
    renderReviewScreen();
}

// Submit quiz
async function submitQuiz() {
    if (!confirm('Submit quiz? You cannot change answers after submission.')) {
        return;
    }

    quizState.timeSpent = Date.now() - quizState.startTime;

    const response = await fetch('/.netlify/functions/submit-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            assignment_id: quizState.assignmentId,
            student_id: currentStudent.id,
            submission_type: 'quiz_answers',
            quiz_answers: quizState.answers,
            time_spent: quizState.timeSpent
        })
    });

    const result = await response.json();
    if (result.success) {
        clearDraft();
        showSuccessMessage();
    }
}
```

### API Update Required

```javascript
// netlify/functions/submit-assignment.js

// Add quiz_answers handling
if (data.submission_type === 'quiz_answers') {
    // Auto-grade quiz
    const score = calculateQuizScore(data.quiz_answers, quizMetadata);

    submissionData.quiz_answers = data.quiz_answers;
    submissionData.auto_score = score;
    submissionData.time_spent = data.time_spent;
}

// Auto-grading function
function calculateQuizScore(studentAnswers, quizMetadata) {
    let correct = 0;
    const questions = quizMetadata.questions;

    questions.forEach(q => {
        const studentAnswer = studentAnswers[q.id];

        if (q.type === 'multiple_choice' || q.type === 'true_false') {
            if (studentAnswer === q.correct_answer) {
                correct++;
            }
        } else if (q.type === 'multiple_select') {
            if (arraysEqual(studentAnswer, q.correct_answers)) {
                correct++;
            }
        }
    });

    return Math.round((correct / questions.length) * 100);
}
```

---

## Common Code Patterns

### localStorage Draft Management

```javascript
// Save draft
const draft = {
    textResponse: 'student input...',
    linkUrl: 'https://...',
    savedAt: new Date().toISOString()
};
localStorage.setItem(`hw_draft_${assignmentId}`, JSON.stringify(draft));

// Load draft
const draftJson = localStorage.getItem(`hw_draft_${assignmentId}`);
const draft = draftJson ? JSON.parse(draftJson) : null;

// Clear draft (on successful submission)
localStorage.removeItem(`hw_draft_${assignmentId}`);
```

### File Upload to Supabase Storage

```javascript
const fileName = `${Date.now()}_${file.name}`;
const filePath = `${studentId}/${assignmentId}/${fileName}`;

const { data, error } = await supabase.storage
    .from('homework-submissions')
    .upload(filePath, file);

const { data: urlData } = supabase.storage
    .from('homework-submissions')
    .getPublicUrl(filePath);

return urlData.publicUrl;
```

### Error Handling

```javascript
try {
    await submitHomework();
} catch (error) {
    console.error('Submission error:', error);

    if (!navigator.onLine) {
        showError('No internet connection. Draft saved.');
    } else if (error.message.includes('timeout')) {
        showError('Request timed out. Please retry.');
    } else {
        showError('Submission failed. Please try again.');
    }
}
```

---

## Validation Rules

### Client-Side

```javascript
// File validation
const MAX_FILE_SIZE = 10 * 1024 * 1024;  // 10MB
const MAX_FILES = 5;
const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
];

// URL validation
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Submission validation
if (uploadedFiles.length === 0 && !textResponse && !linkUrl) {
    throw new Error('At least one submission method required');
}
```

### Server-Side

```javascript
// Required fields
if (!data.assignment_id || !data.student_id) {
    return { statusCode: 400, error: 'Missing required fields' };
}

// At least one submission method
if (!data.file_urls?.length && !data.text_response && !data.link_url) {
    return { statusCode: 400, error: 'No content provided' };
}
```

---

## Database Queries

### Insert Submission

```javascript
const { data, error } = await supabase
    .from('submissions')
    .insert({
        assignment_id: assignmentId,
        student_id: studentId,
        submission_type: 'homework',
        text_response: textResponse,
        file_urls: fileUrls,
        submitted_at: new Date().toISOString(),
        status: 'submitted'
    })
    .select()
    .single();
```

### Get Student Submissions

```javascript
const { data, error } = await supabase
    .from('submissions')
    .select('*, assignments(*)')
    .eq('student_id', studentId)
    .order('submitted_at', { ascending: false });
```

### Get Assignment Statistics

```javascript
const { data, error } = await supabase
    .rpc('get_assignment_submission_stats', {
        p_assignment_id: assignmentId
    });

// Returns:
// {
//   total_students: 25,
//   submitted_count: 20,
//   draft_count: 3,
//   graded_count: 15,
//   late_count: 5
// }
```

---

## Testing Commands

```bash
# Run all tests
npx playwright test tests/student-submission-workflow.spec.js

# Run specific scenario
npx playwright test -g "Homework Submission"

# Run with UI
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed

# Generate report
npx playwright test --reporter=html
npx playwright show-report
```

---

## Environment Variables

```bash
# .env file
SUPABASE_URL=https://qypmfilbkvxwyznnenge.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...
SUPABASE_ANON_KEY=eyJhbGc...

# For local development
TEST_URL=http://localhost:3000
TEST_STUDENT_EMAIL=student1@aicentner.com
TEST_STUDENT_PASSWORD=TestPassword123!
```

---

## Common Issues & Fixes

### Issue: "File not found" error

```bash
# Ensure fixtures directory exists
mkdir -p tests/fixtures

# Create test file
echo "Test content" > tests/fixtures/test-homework.pdf
```

### Issue: "localStorage not defined" in tests

```javascript
// Use page.evaluate for localStorage in Playwright
await page.evaluate(() => {
    localStorage.setItem('key', 'value');
});
```

### Issue: CORS errors in API

```javascript
// Ensure CORS headers in serverless function
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
};
```

### Issue: File upload fails

```javascript
// Check Supabase Storage bucket policy
// Bucket must allow public uploads or authenticated uploads
// Path: Storage > homework-submissions > Policies
```

---

## Key Functions Reference

### homework-submission.js

| Function | Purpose | Line |
|----------|---------|------|
| `openHomeworkModal()` | Display homework modal | 22 |
| `handleFiles()` | Validate and add files | 238 |
| `uploadFilesToSupabase()` | Upload to storage | 341 |
| `submitHomework()` | Submit to API | 391 |
| `saveDraft()` | Save to localStorage | 482 |
| `loadDraft()` | Load from localStorage | 508 |
| `startAutoSave()` | Start 30s timer | 517 |

### netlify/functions/submit-assignment.js

| Function | Purpose | Line |
|----------|---------|------|
| `handler()` | Main API handler | 12 |
| Validation | Check required fields | 47-68 |
| Database insert | Insert submission | 86-90 |
| Error handling | Return errors | 92-164 |

---

## Implementation Checklist

### To Implement Quiz Submission:

- [ ] Create `quiz-submission.js` file
- [ ] Build question renderer for all types
- [ ] Implement answer state management
- [ ] Add navigation (Next/Previous)
- [ ] Create review screen
- [ ] Implement draft save/load for quizzes
- [ ] Update API to accept quiz_answers
- [ ] Add auto-grading function
- [ ] Migrate to `submissions` table
- [ ] Write tests for quiz workflow
- [ ] Update documentation

### To Migrate Database:

- [ ] Backup existing data
- [ ] Apply enhanced schema migration
- [ ] Update API to use `submissions` table
- [ ] Migrate data from `homework_submissions`
- [ ] Test thoroughly
- [ ] Remove old table (after verification)

---

## Quick Links

- **Test Report**: `/tests/STUDENT_SUBMISSION_TEST_REPORT.md`
- **Manual Checklist**: `/tests/MANUAL_SUBMISSION_TEST_CHECKLIST.md`
- **Bug Report**: `/tests/BUG_REPORT_SUBMISSION_WORKFLOW.md`
- **Run Guide**: `/tests/RUN_SUBMISSION_TESTS.md`
- **Executive Summary**: `/tests/SUBMISSION_WORKFLOW_EXECUTIVE_SUMMARY.md`

---

## Need Help?

1. Check detailed test report for code examples
2. Review existing `homework-submission.js` for patterns
3. Run automated tests to verify changes
4. Use manual checklist for thorough testing

---

**Last Updated**: October 20, 2025
**Maintained By**: QA Team
