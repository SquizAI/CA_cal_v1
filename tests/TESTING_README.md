# Teacher Grading Workflow - Comprehensive E2E Tests

## Overview

This test suite provides comprehensive end-to-end testing for the teacher grading workflow in the AI Academy @ Centner Calendar System.

## Test Files

```
/Users/mattysquarzoni/Documents/Documents - Matty's MacBook Pro/AI_content_cleen/AI_academy_content_generator_V2/SchoolCalendar2025-2026/tests/
├── teacher-grading-workflow.spec.js  # Main test file
├── playwright.config.js              # Playwright configuration
├── test-data-setup.js               # Test data creation script
└── TESTING_README.md                 # This file
```

## Prerequisites

1. **Install Dependencies**
   ```bash
   npm install --save-dev @playwright/test @supabase/supabase-js
   npx playwright install chromium
   ```

2. **Environment Variables**
   Create a `.env` file with:
   ```
   VITE_SUPABASE_URL=https://qypmfilbkvxwyznnenge.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Test User Credentials**
   - Teacher: `teacher@centner.academy` / `TestPassword123!`
   - Student: `student@centner.academy` / `TestPassword123!`

## Test Scenarios

### Scenario 1: View Submissions Dashboard
- ✓ Teacher accesses grading tab
- ✓ Filter by status (Pending Review, Graded)
- ✓ Filter by subject (7th Civics, 9th ELA, 11th Government)
- ✓ Filter by assignment type (Quizzes, Homework, Projects)
- ✓ Sort by due date, submission date, student name
- ✓ View statistics (pending, graded, late counts)

### Scenario 2: Grade Quiz (Auto-Graded)
- ✓ Open quiz submission
- ✓ Review auto-graded quiz answers
- ✓ Override auto-score (optional)
- ✓ Add feedback and submit grade
- ✓ Verify database grade record
- ✓ Verify course grade recalculation

### Scenario 3: Grade Homework (Manual Grading)
- ✓ Open homework submission
- ✓ Review file uploads
- ✓ Use rubric scoring
- ✓ Manual points entry and letter grade calculation
- ✓ Add detailed feedback
- ✓ Submit grade

### Scenario 4: Grade History and Revisions
- ✓ View previously graded submission
- ✓ Update existing grade
- ✓ Verify grade history logged

### Scenario 5: Late Submission Handling
- ✓ Identify late submissions
- ✓ Apply late penalty if configured

### Scenario 6: Error Handling
- ✓ Invalid points (exceeds maximum)
- ✓ Invalid points (negative)
- ✓ Missing feedback warning

### Scenario 7: Course Grade Recalculation
- ✓ Verify course grade updates after grading
- ✓ Verify weighted category calculation

## Running Tests

### Run All Tests
```bash
npx playwright test tests/teacher-grading-workflow.spec.js
```

### Run Specific Scenario
```bash
npx playwright test tests/teacher-grading-workflow.spec.js -g "Scenario 1"
```

### Run in Headed Mode (See Browser)
```bash
npx playwright test tests/teacher-grading-workflow.spec.js --headed
```

### Run in Debug Mode
```bash
npx playwright test tests/teacher-grading-workflow.spec.js --debug
```

### Generate HTML Report
```bash
npx playwright test tests/teacher-grading-workflow.spec.js
npx playwright show-report test-results/html-report
```

## Test Data Setup

Before running tests, create test data:

```bash
node tests/test-data-setup.js
```

This creates:
- Test teacher account
- Test student account
- Sample assignments (quiz, homework, project)
- Sample submissions

## Database Verification Tests

The test suite includes direct database verification:

1. **Grades Table**
   - Points earned/possible
   - Percentage calculation
   - Letter grade assignment
   - Graded timestamp

2. **Grade History Table**
   - Previous values
   - New values
   - Change timestamp
   - Changed by teacher ID

3. **Course Grades Table**
   - Overall percentage
   - Letter grade
   - Category breakdown
   - Calculation timestamp

4. **Assignment Categories**
   - Category weights
   - Weight total = 100%

## API Endpoint Testing

Tests verify the `/netlify/functions/grade-assignment` endpoint:

### Request Validation
- ✓ Submission ID required
- ✓ Points or rubric scores required
- ✓ Authentication token required
- ✓ Teacher permission verified

### Response Verification
- ✓ Success status
- ✓ Grade ID returned
- ✓ Percentage calculated
- ✓ Letter grade assigned
- ✓ Course grade updated
- ✓ Class average calculated

### Error Handling
- ✓ 400 for validation errors
- ✓ 401 for missing auth
- ✓ 403 for permission denied
- ✓ 404 for submission not found
- ✓ 500 for server errors

## Expected Test Results

### Pass Criteria
All tests should pass with:
- Grading dashboard loads < 3 seconds
- Grade submission completes < 2 seconds
- Database updates verified
- Course grade recalculates automatically
- No console errors

### Performance Benchmarks
- Dashboard load: < 3s
- Filter application: < 1s
- Modal open: < 500ms
- Grade submission: < 2s
- Database query: < 500ms

## Debugging Failed Tests

1. **Check Screenshots**
   ```
   test-results/[test-name]/test-failed-1.png
   ```

2. **Watch Video Recording**
   ```
   test-results/[test-name]/video.webm
   ```

3. **Review Trace**
   ```bash
   npx playwright show-trace test-results/[test-name]/trace.zip
   ```

4. **Check Browser Console**
   Tests capture console logs for debugging

## Common Issues

### Authentication Failures
- Verify test credentials in Supabase Auth
- Check RLS policies allow test users

### Database Connection
- Verify Supabase URL and anon key
- Check network connectivity

### Timing Issues
- Increase timeout values in playwright.config.js
- Add explicit waits for slow operations

### Missing Test Data
- Run test-data-setup.js
- Verify assignments exist in database

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Grading Workflow Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      - name: Run tests
        run: npx playwright test tests/teacher-grading-workflow.spec.js
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

## Contributing

When adding new tests:
1. Follow existing naming conventions
2. Add descriptive console logs
3. Include database verification
4. Update this README

## Support

For issues or questions:
- Check test output logs
- Review Playwright documentation
- Verify Supabase schema matches expectations

## License

Internal testing for AI Academy @ Centner School Calendar System
