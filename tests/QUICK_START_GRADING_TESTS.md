# Quick Start Guide - Teacher Grading Workflow Tests

## Get Started in 5 Minutes

This guide will help you run the teacher grading workflow tests immediately.

---

## Prerequisites

1. **Node.js installed** (v16 or higher)
2. **Access to production site:** https://ai-academy-centner-calendar.netlify.app
3. **Test credentials:** teacher@centner.academy / TestPassword123!

---

## Step 1: Install Dependencies (30 seconds)

```bash
# Navigate to project directory
cd "/Users/mattysquarzoni/Documents/Documents - Matty's MacBook Pro/AI_content_cleen/AI_academy_content_generator_V2/SchoolCalendar2025-2026"

# Install Playwright and Supabase client
npm install --save-dev @playwright/test @supabase/supabase-js

# Install Chromium browser
npx playwright install chromium
```

---

## Step 2: Run Tests (2 minutes)

### Option A: Run All Tests (Automated)
```bash
# Make script executable (first time only)
chmod +x tests/run-grading-tests.sh

# Run complete test suite
./tests/run-grading-tests.sh
```

### Option B: Run Specific Scenario
```bash
# Run just one scenario
npx playwright test tests/teacher-grading-workflow.spec.js -g "Scenario 1"
```

### Option C: Run with Visual Browser (Headed Mode)
```bash
# Watch tests execute in real browser
npx playwright test tests/teacher-grading-workflow.spec.js --headed
```

---

## Step 3: View Results (30 seconds)

### Interactive HTML Report
```bash
npx playwright show-report test-results/html-report
```

### Quick Summary
```bash
cat test-results/grading-workflow/SUMMARY.md
```

---

## Common Test Commands

### Run All Tests
```bash
npx playwright test tests/teacher-grading-workflow.spec.js
```

### Run Specific Test
```bash
# Example: Run only dashboard tests
npx playwright test tests/teacher-grading-workflow.spec.js -g "View Submissions Dashboard"
```

### Debug Mode (Step Through Tests)
```bash
npx playwright test tests/teacher-grading-workflow.spec.js --debug
```

### Run Failed Tests Only
```bash
npx playwright test --last-failed
```

### Generate Report
```bash
npx playwright show-report
```

---

## Understanding Test Results

### ✓ Green = PASSED
Test executed successfully, all assertions passed

### ✗ Red = FAILED
Test failed, check:
1. Screenshot in `test-results/[test-name]/`
2. Video in `test-results/[test-name]/video.webm`
3. Trace in `test-results/[test-name]/trace.zip`

### ⚠ Yellow = SKIPPED
Test skipped (usually because no test data available)

---

## Quick Manual Test (5 minutes)

If you prefer manual testing:

1. Open: `tests/MANUAL_GRADING_TEST_CHECKLIST.md`
2. Login to: https://ai-academy-centner-calendar.netlify.app
3. Follow checklist step-by-step
4. Check off completed items
5. Document any issues

---

## Test Scenarios Overview

### ✓ Scenario 1: View Submissions Dashboard (6 tests)
Tests the grading dashboard, filters, and statistics

### ✓ Scenario 2: Grade Quiz - Auto-Graded (5 tests)
Tests automatic quiz grading and score calculation

### ✓ Scenario 3: Grade Homework - Manual (5 tests)
Tests manual grading with rubrics and file review

### ✓ Scenario 4: Grade History & Revisions (3 tests)
Tests updating grades and tracking changes

### ✓ Scenario 5: Late Submission Handling (2 tests)
Tests late badges and penalty calculations

### ✓ Scenario 6: Error Handling (3 tests)
Tests validation and edge cases

### ✓ Scenario 7: Course Grade Recalculation (2 tests)
Tests weighted average updates

**Total: 26 Tests**

---

## Troubleshooting

### Tests Won't Run

**Problem:** `npx: command not found`
**Solution:** Install Node.js from https://nodejs.org/

**Problem:** `playwright: command not found`
**Solution:** Run `npm install --save-dev @playwright/test`

**Problem:** Browser won't launch
**Solution:** Run `npx playwright install chromium`

### Tests Failing

**Problem:** Authentication errors
**Solution:** Check test credentials are correct in Supabase

**Problem:** Timeout errors
**Solution:** Increase timeout in `playwright.config.js`

**Problem:** Element not found
**Solution:** UI may have changed, update selectors in test file

### Database Issues

**Problem:** Database connection failed
**Solution:** Verify Supabase URL and anon key in environment

**Problem:** RLS policy errors
**Solution:** Check test user has proper permissions

---

## File Locations

All test files are in:
```
/Users/mattysquarzoni/Documents/Documents - Matty's MacBook Pro/AI_content_cleen/AI_academy_content_generator_V2/SchoolCalendar2025-2026/tests/
```

### Key Files
- `teacher-grading-workflow.spec.js` - Main test suite (47KB)
- `playwright.config.js` - Configuration
- `run-grading-tests.sh` - Test runner script
- `MANUAL_GRADING_TEST_CHECKLIST.md` - Manual testing guide
- `GRADING_WORKFLOW_TEST_REPORT.md` - Results template
- `GRADING_WORKFLOW_EXECUTIVE_SUMMARY.md` - Overview document

---

## What Gets Tested

### UI Testing
- Dashboard loads
- Filters work
- Modals open
- Forms submit
- Statistics update

### Database Testing
- Grades saved correctly
- Percentages calculated
- Letter grades assigned
- History tracked
- Course grades updated

### API Testing
- Endpoint responds
- Authentication works
- Validation enforces rules
- Errors handled properly

### Performance Testing
- Dashboard < 3s
- Filters < 1s
- Submissions < 2s

---

## Expected Results

### All Tests Pass ✓
- **Great!** Your grading workflow is working perfectly
- Review the HTML report for details
- Document any performance observations

### Some Tests Fail ✗
- Check screenshots in `test-results/`
- Review failed test video recordings
- Use Playwright trace viewer for debugging
- Fix issues and re-run: `npx playwright test --last-failed`

### Tests Skipped ⚠
- Usually means no test data available
- Run `node tests/test-data-setup.js` to create data
- Some tests may require specific conditions

---

## Next Steps After Testing

### If All Tests Pass
1. ✓ Document test run date
2. ✓ Archive results for records
3. ✓ Schedule next test run
4. ✓ Monitor production performance

### If Tests Fail
1. ✗ Document failures in bug tracker
2. ✗ Prioritize critical issues
3. ✗ Fix bugs
4. ✗ Re-run tests
5. ✗ Verify fixes

---

## Getting Help

### Check These Resources
1. Playwright Trace Viewer: `npx playwright show-trace [trace.zip]`
2. Test screenshots in `test-results/`
3. Console logs in test output
4. Database state in Supabase dashboard

### Documentation
- `TESTING_README.md` - Full testing guide
- `GRADING_WORKFLOW_TEST_REPORT.md` - Detailed test report template
- `MANUAL_GRADING_TEST_CHECKLIST.md` - Manual testing steps

---

## Performance Tips

### Run Tests Faster
```bash
# Run in parallel (if tests are independent)
npx playwright test --workers=4

# Skip videos (saves time and space)
npx playwright test --config playwright.config.js
```

### Save Resources
```bash
# Run headless (no browser window)
npx playwright test tests/teacher-grading-workflow.spec.js

# Run specific browser only
npx playwright test --project=chromium
```

---

## CI/CD Integration

### GitHub Actions Example
Add to `.github/workflows/test.yml`:

```yaml
name: Grading Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test tests/teacher-grading-workflow.spec.js
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

---

## Success Checklist

Before considering tests complete:

- [ ] All 26 tests executed
- [ ] Results documented
- [ ] Screenshots reviewed (if any failures)
- [ ] Database state verified
- [ ] Performance benchmarks noted
- [ ] Bugs logged (if any)
- [ ] Report generated
- [ ] Stakeholders notified

---

## Summary

You now have a complete testing suite for the teacher grading workflow!

**Quick Commands:**
```bash
# Install
npm install --save-dev @playwright/test
npx playwright install chromium

# Run
./tests/run-grading-tests.sh

# View Results
npx playwright show-report
```

**Time Estimates:**
- Setup: 1 minute
- Test execution: 2-5 minutes
- Review results: 2-3 minutes
- **Total: ~10 minutes**

---

**Questions?** Check the full documentation in:
- `TESTING_README.md`
- `GRADING_WORKFLOW_EXECUTIVE_SUMMARY.md`
- `GRADING_WORKFLOW_TEST_REPORT.md`

**Ready to test?** Run: `./tests/run-grading-tests.sh`

Good luck! 🚀
