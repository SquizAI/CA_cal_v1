# Running Student Submission Workflow Tests

## Quick Start

```bash
# Navigate to project directory
cd /Users/mattysquarzoni/Documents/Documents\ -\ Matty\'s\ MacBook\ Pro/AI_content_cleen/AI_academy_content_generator_V2/SchoolCalendar2025-2026

# Install dependencies (if not already installed)
npm install

# Set Supabase service key environment variable
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# Run all submission tests
npx playwright test tests/student-submission-workflow.spec.js

# Run with UI mode (visual debugging)
npx playwright test tests/student-submission-workflow.spec.js --ui

# Run specific test scenario
npx playwright test tests/student-submission-workflow.spec.js -g "Homework Submission"

# Run in headed mode (see browser)
npx playwright test tests/student-submission-workflow.spec.js --headed

# Generate HTML report
npx playwright test tests/student-submission-workflow.spec.js --reporter=html
```

---

## Test File Overview

**Location**: `/tests/student-submission-workflow.spec.js`

**Test Scenarios**:

1. **Quiz Submission Workflow** (7 tests)
   - Student views assignments
   - Opens quiz interface
   - Answers questions
   - Submits quiz
   - Auto-grading
   - Database verification
   - **Expected Result**: Most tests will SKIP or FAIL (quiz not implemented)

2. **Homework Submission - File Upload** (7 tests)
   - Opens homework modal
   - Uploads files
   - File validation
   - Adds text response
   - Submits homework
   - Database verification
   - Storage verification
   - **Expected Result**: Most tests should PASS

3. **Draft Functionality** (3 tests)
   - Save draft
   - Auto-save
   - Resume from draft
   - **Expected Result**: Should PASS

4. **Error Handling** (5 tests)
   - Empty submission validation
   - File size validation
   - File type validation
   - Network errors
   - Late submission warning
   - **Expected Result**: Should PASS

5. **Supabase Storage Verification** (3 tests)
   - Bucket exists
   - File path structure
   - Public URL generation
   - **Expected Result**: Should PASS (if bucket configured)

6. **API Endpoint Testing** (3 tests)
   - Success case
   - Missing required fields
   - Empty submission
   - **Expected Result**: Should PASS

---

## Environment Setup

### Required Environment Variables

```bash
# .env file
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-key-here
TEST_URL=https://ai-academy-centner-calendar.netlify.app
```

### Optional Environment Variables

```bash
# For local testing
TEST_URL=http://localhost:3000

# For custom student credentials
TEST_STUDENT_EMAIL=student1@aicentner.com
TEST_STUDENT_PASSWORD=TestPassword123!
```

---

## Running Individual Test Scenarios

### Scenario 1: Quiz Tests (Expected to Fail)

```bash
npx playwright test tests/student-submission-workflow.spec.js -g "Quiz Submission"
```

**Expected Output**:
```
  ❌ 1.1: Student views assignment in "My Assignments"
  ⚠️  1.2: Student opens quiz interface (UI not found)
  ❌ 1.3: Verify quiz interface displays correctly
  ❌ 1.4: Student navigates between quiz questions
  ⚠️  1.5: Student submits quiz (NOT IMPLEMENTED)
```

---

### Scenario 2: Homework Tests (Expected to Pass)

```bash
npx playwright test tests/student-submission-workflow.spec.js -g "Homework Submission"
```

**Expected Output**:
```
  ✅ 2.1: Student opens homework submission modal
  ✅ 2.2: Student uploads file via file input
  ✅ 2.3: Verify file validation
  ✅ 2.4: Student adds text response
  ✅ 2.5: Student submits homework
  ✅ 2.6: Verify database record created
```

---

### Scenario 3: Draft Tests

```bash
npx playwright test tests/student-submission-workflow.spec.js -g "Draft Functionality"
```

**Expected Output**:
```
  ✅ 3.1: Student saves draft
  ⏱️  3.2: Auto-save triggers (requires 30s wait)
  ✅ 3.3: Resume from draft on modal reopen
```

---

### Scenario 4: Error Handling Tests

```bash
npx playwright test tests/student-submission-workflow.spec.js -g "Error Handling"
```

**Expected Output**:
```
  ✅ 4.1: Validation error - empty submission
  ✅ 4.2: File size validation error
  ✅ 4.3: File type validation error
  ⚠️  4.4: Network error handling
  ✅ 4.5: Late submission warning
```

---

### Scenario 5: Storage Tests

```bash
npx playwright test tests/student-submission-workflow.spec.js -g "Supabase Storage"
```

**Expected Output**:
```
  ✅ 5.1: Verify Supabase Storage bucket exists
  ✅ 5.2: Verify file upload path structure
  ✅ 5.3: Verify public URL generation
```

---

### Scenario 6: API Tests

```bash
npx playwright test tests/student-submission-workflow.spec.js -g "API Endpoint"
```

**Expected Output**:
```
  ✅ 6.1: POST /submit-assignment - Success case
  ✅ 6.2: POST /submit-assignment - Missing required fields
  ✅ 6.3: POST /submit-assignment - Empty submission
```

---

## Debugging Failed Tests

### View Test Results in Browser

```bash
# Generate and open HTML report
npx playwright test tests/student-submission-workflow.spec.js --reporter=html
npx playwright show-report
```

### Run Single Test with Debug Mode

```bash
# Debug specific test
npx playwright test tests/student-submission-workflow.spec.js -g "Student submits homework" --debug
```

### View Screenshots on Failure

Screenshots automatically saved to:
```
test-results/
  student-submission-workflow-spec-js-homework-submission/
    test-failed-1.png
```

### View Trace Files

```bash
# Run with trace
npx playwright test tests/student-submission-workflow.spec.js --trace on

# View trace
npx playwright show-trace test-results/.../trace.zip
```

---

## Common Issues & Solutions

### Issue 1: Browser Not Installed

**Error**: `Executable doesn't exist at .../chromium-1179/chrome-mac/Chromium.app`

**Solution**:
```bash
npx playwright install chromium
```

---

### Issue 2: Authentication Failed

**Error**: `Timeout waiting for #authModal:not(.active)`

**Possible Causes**:
- Incorrect credentials
- Auth service down
- Network issue

**Solution**:
- Verify credentials in test file
- Check Supabase auth settings
- Run test with `--headed` to see what's happening

---

### Issue 3: Element Not Found

**Error**: `Locator.click: Timeout 5000ms exceeded`

**Possible Causes**:
- Element selector changed
- Page not fully loaded
- Element hidden/disabled

**Solution**:
```bash
# Run with longer timeout
npx playwright test tests/student-submission-workflow.spec.js --timeout=60000

# Or update test file timeouts
```

---

### Issue 4: Database Connection Failed

**Error**: `Error: connect ECONNREFUSED`

**Solution**:
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check Supabase project is active
- Verify network connection

---

### Issue 5: File Upload Failed

**Error**: `ENOENT: no such file or directory`

**Solution**:
- Verify test fixtures directory exists: `tests/fixtures/`
- Create test file:
  ```bash
  mkdir -p tests/fixtures
  echo "Test PDF content" > tests/fixtures/test-homework.pdf
  ```

---

## Expected Test Results Summary

Based on current implementation:

| Test Scenario | Expected Pass Rate | Notes |
|---------------|-------------------|-------|
| Quiz Submission | 0% (0/7) | Not implemented |
| Homework Submission | 85% (6/7) | Fully functional |
| Draft Functionality | 100% (3/3) | Working |
| Error Handling | 80% (4/5) | Basic validation works |
| Storage Verification | 100% (3/3) | If bucket configured |
| API Endpoint | 100% (3/3) | API working |
| **Overall** | **63% (19/30)** | Homework ready, Quiz missing |

---

## Continuous Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Student Submission Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test tests/student-submission-workflow.spec.js
        env:
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Test Data Cleanup

After running tests, clean up test data:

```bash
# Manual cleanup via Supabase SQL Editor
DELETE FROM homework_submissions
WHERE assignment_id LIKE 'test-%'
OR student_id LIKE 'test-%';

# Or run cleanup script (if created)
node tests/helpers/cleanup-test-data.js
```

---

## Next Steps

1. **Fix Quiz Implementation**
   - Create `quiz-submission.js`
   - Implement quiz UI components
   - Update API to support quiz submissions

2. **Enhance Test Coverage**
   - Add visual regression tests
   - Add performance tests
   - Add accessibility tests

3. **Database Migration**
   - Apply `enhanced_submissions_system.sql`
   - Migrate from `homework_submissions` to `submissions` table
   - Update API to use new schema

4. **Add Auto-Grading**
   - Implement `calculate_quiz_score()` function
   - Add server-side validation
   - Store auto-score in database

---

## Support

For issues or questions:

1. Check test report: `tests/STUDENT_SUBMISSION_TEST_REPORT.md`
2. Review manual checklist: `tests/MANUAL_SUBMISSION_TEST_CHECKLIST.md`
3. Examine code comments in test file
4. Check Playwright documentation: https://playwright.dev/

---

**Last Updated**: October 20, 2025
