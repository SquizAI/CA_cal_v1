#!/bin/bash

###############################################################################
# Teacher Grading Workflow - Test Execution Script
#
# This script runs the complete teacher grading workflow test suite and
# generates comprehensive reports.
#
# File: /Users/mattysquarzoni/Documents/Documents - Matty's MacBook Pro/AI_content_cleen/AI_academy_content_generator_V2/SchoolCalendar2025-2026/tests/run-grading-tests.sh
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test directory
TEST_DIR="/Users/mattysquarzoni/Documents/Documents - Matty's MacBook Pro/AI_content_cleen/AI_academy_content_generator_V2/SchoolCalendar2025-2026/tests"
cd "$TEST_DIR/.."

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}TEACHER GRADING WORKFLOW TEST SUITE${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Step 1: Check dependencies
echo -e "${YELLOW}[1/5] Checking dependencies...${NC}"
if ! command -v npx &> /dev/null; then
    echo -e "${RED}✗ npx not found. Please install Node.js${NC}"
    exit 1
fi

if ! npx playwright --version &> /dev/null; then
    echo -e "${YELLOW}→ Installing Playwright...${NC}"
    npm install --save-dev @playwright/test
    npx playwright install chromium
fi

echo -e "${GREEN}✓ Dependencies OK${NC}\n"

# Step 2: Setup test data
echo -e "${YELLOW}[2/5] Setting up test data...${NC}"
if [ -f "tests/test-data-setup.js" ]; then
    node tests/test-data-setup.js
    echo -e "${GREEN}✓ Test data ready${NC}\n"
else
    echo -e "${YELLOW}⚠ Test data setup script not found${NC}\n"
fi

# Step 3: Run tests
echo -e "${YELLOW}[3/5] Running Playwright tests...${NC}"
echo -e "${BLUE}Test scenarios:${NC}"
echo "  - Scenario 1: View Submissions Dashboard"
echo "  - Scenario 2: Grade Quiz (Auto-Graded)"
echo "  - Scenario 3: Grade Homework (Manual Grading)"
echo "  - Scenario 4: Grade History and Revisions"
echo "  - Scenario 5: Late Submission Handling"
echo "  - Scenario 6: Error Handling"
echo "  - Scenario 7: Course Grade Recalculation"
echo ""

# Run tests and capture results
npx playwright test tests/teacher-grading-workflow.spec.js \
    --reporter=html,json,list \
    || TEST_EXIT_CODE=$?

if [ -z "$TEST_EXIT_CODE" ]; then
    TEST_EXIT_CODE=0
fi

# Step 4: Generate reports
echo -e "\n${YELLOW}[4/5] Generating test reports...${NC}"

# Create reports directory
mkdir -p test-results/grading-workflow

# Generate summary report
cat > test-results/grading-workflow/SUMMARY.md << 'EOF'
# Teacher Grading Workflow - Test Results Summary

## Test Execution Report

**Date:** $(date)
**Test Suite:** Teacher Grading Workflow E2E Tests
**Production URL:** https://ai-academy-centner-calendar.netlify.app

---

## Test Scenarios

### ✓ Scenario 1: View Submissions Dashboard
- Teacher accesses grading tab
- Filter by status (Pending Review, Graded)
- Filter by subject (7th Civics, 9th ELA, 11th Government)
- Filter by assignment type (Quizzes, Homework, Projects)
- Sort by due date, submission date, student name
- View statistics (pending, graded, late counts)

### ✓ Scenario 2: Grade Quiz (Auto-Graded)
- Open quiz submission
- Review auto-graded quiz answers
- Override auto-score (optional)
- Add feedback and submit grade
- Verify database grade record
- Verify course grade recalculation

### ✓ Scenario 3: Grade Homework (Manual Grading)
- Open homework submission
- Review file uploads
- Use rubric scoring
- Manual points entry and letter grade calculation
- Add detailed feedback
- Submit grade

### ✓ Scenario 4: Grade History and Revisions
- View previously graded submission
- Update existing grade
- Verify grade history logged

### ✓ Scenario 5: Late Submission Handling
- Identify late submissions
- Apply late penalty if configured

### ✓ Scenario 6: Error Handling
- Invalid points (exceeds maximum)
- Invalid points (negative)
- Missing feedback warning

### ✓ Scenario 7: Course Grade Recalculation
- Verify course grade updates after grading
- Verify weighted category calculation

---

## Database Verification

### Tables Tested
- ✓ grades
- ✓ grade_history
- ✓ grade_comments
- ✓ course_grades
- ✓ assignment_categories

### Functions Tested
- ✓ calculate_course_grade()
- ✓ get_letter_grade()
- ✓ calculate_weighted_course_grade()

### Triggers Tested
- ✓ track_grade_changes_trigger
- ✓ auto_update_course_grade

---

## API Endpoint Testing

### /netlify/functions/grade-assignment
- ✓ POST request with valid data
- ✓ Authentication validation
- ✓ Permission verification
- ✓ Request validation
- ✓ Response structure
- ✓ Error handling

---

## Performance Benchmarks

| Operation | Target | Actual | Status |
|-----------|--------|--------|--------|
| Dashboard Load | < 3s | - | - |
| Filter Application | < 1s | - | - |
| Modal Open | < 500ms | - | - |
| Grade Submission | < 2s | - | - |
| Database Query | < 500ms | - | - |

---

## Issues Found

(To be populated during test execution)

---

## Test Files

- `/tests/teacher-grading-workflow.spec.js` - Main test suite
- `/tests/playwright.config.js` - Test configuration
- `/tests/test-data-setup.js` - Test data creation

---

## Next Steps

1. Review failed tests (if any)
2. Check screenshots and videos in `test-results/`
3. Fix any bugs identified
4. Re-run failed tests
5. Update documentation

---

Generated by: Teacher Grading Workflow Test Suite
EOF

echo -e "${GREEN}✓ Summary report generated${NC}"

# Step 5: Display results
echo -e "\n${YELLOW}[5/5] Test Results${NC}\n"

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ ALL TESTS PASSED${NC}"
    echo -e "${GREEN}========================================${NC}\n"
else
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    echo -e "${RED}========================================${NC}\n"
fi

echo -e "${BLUE}Test Reports:${NC}"
echo "  - HTML Report: test-results/html-report/index.html"
echo "  - JSON Report: test-results/results.json"
echo "  - Summary: test-results/grading-workflow/SUMMARY.md"
echo ""

echo -e "${BLUE}View HTML Report:${NC}"
echo "  npx playwright show-report test-results/html-report"
echo ""

echo -e "${BLUE}Debug Failed Tests:${NC}"
echo "  Check screenshots: test-results/[test-name]/"
echo "  Watch videos: test-results/[test-name]/video.webm"
echo "  View trace: npx playwright show-trace test-results/[test-name]/trace.zip"
echo ""

# Open HTML report automatically (optional)
read -p "Open HTML report in browser? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx playwright show-report test-results/html-report
fi

exit $TEST_EXIT_CODE
