# School Calendar System - E2E Test Suite

Comprehensive Playwright end-to-end tests for the AI Academy @ Centner School Calendar System.

## Table of Contents

- [Overview](#overview)
- [Assignment Workflow Tests](#assignment-workflow-tests)
- [Test Coverage](#test-coverage)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Assignment Workflow Tests

**NEW**: Complete end-to-end testing for teacher assignment distribution workflow.

### Quick Links
- **[Automated Test Suite](./e2e-assignment-workflow.spec.js)** - 10 Playwright tests
- **[Test Report](./ASSIGNMENT_WORKFLOW_TEST_REPORT.md)** - Comprehensive analysis & results
- **[Manual Checklist](./MANUAL_TEST_CHECKLIST.md)** - 50+ manual test cases

### Quick Start

```bash
# Run assignment workflow tests
npx playwright test tests/e2e-assignment-workflow.spec.js

# Run specific step
npx playwright test tests/e2e-assignment-workflow.spec.js -g "STEP 5"

# Run with UI
npx playwright test tests/e2e-assignment-workflow.spec.js --ui
```

### What's Tested
- ✅ Teacher login & authentication
- ✅ AI lesson content generation
- ✅ AI quiz generation
- ✅ Assignment modal UI
- ✅ Form validation & submission
- ✅ Database record creation
- ✅ Student dashboard display
- ✅ API endpoint validation
- ✅ Error handling
- ✅ Duplicate prevention

See **[ASSIGNMENT_WORKFLOW_TEST_REPORT.md](./ASSIGNMENT_WORKFLOW_TEST_REPORT.md)** for detailed test results.

## Overview

This test suite validates all critical user workflows in the School Calendar application:

- **Authentication** - Login, logout, session persistence
- **Student Workflows** - View calendar, submit assignments, request reschedules
- **Teacher Workflows** - Manage calendar, approve requests, view analytics
- **Calendar Operations** - Navigation, filtering, event display
- **Rich Content** - Curriculum display with objectives, materials, AI tools

## Test Coverage

### Authentication Tests (7 tests)
- ✓ Display login modal on first load
- ✓ Login as student
- ✓ Login as teacher
- ✓ Session persistence on reload
- ✓ Logout functionality
- ✓ Invalid credentials error handling
- ✓ Role-based access control

### Calendar Display Tests (8 tests)
- ✓ Render calendar grid
- ✓ Display current month/year
- ✓ Navigate previous/next month
- ✓ Filter by grade level
- ✓ Highlight today's date
- ✓ Color-coded event types
- ✓ A/B day filtering
- ✓ Responsive grid layout

### Rich Content Display Tests (4 tests)
- ✓ Open event modal on click
- ✓ Display learning objectives
- ✓ Display materials and AI tools
- ✓ Display vocabulary and standards
- ✓ Close modal functionality

### Student Submission Tests (4 tests)
- ✓ Show submission section for assignments
- ✓ Text input in submission form
- ✓ File upload with drag-drop
- ✓ Submit and save draft buttons
- ✓ View submission history

### Student Reschedule Request Tests (9 tests)
- ✓ Display "My Requests" button
- ✓ Open/close requests modal
- ✓ Enable drag-and-drop for students
- ✓ Show reschedule reason modal
- ✓ Validate minimum character requirement
- ✓ Update badge counter
- ✓ Display pending requests
- ✓ Cancel pending requests
- ✓ View request status updates

### Teacher Approval Tests (8 tests)
- ✓ Show admin controls
- ✓ Display pending approvals badge
- ✓ Open/close approval queue modal
- ✓ Display reschedule requests
- ✓ Approve/deny buttons for each request
- ✓ Enable drag-and-drop for teachers
- ✓ Update calendar after approval
- ✓ Display quick stats panel

### Search and Filter Tests (3 tests)
- ✓ Search events by keyword
- ✓ Switch view modes (month/week/list)
- ✓ Filter by grade level

### Responsive Design Tests (3 tests)
- ✓ Mobile viewport (375x667)
- ✓ Tablet viewport (768x1024)
- ✓ Desktop viewport (1920x1080)

### Error Handling Tests (2 tests)
- ✓ Loading indicator display
- ✓ Network error handling
- ✓ Toast notifications

### Accessibility Tests (2 tests)
- ✓ Proper ARIA labels and roles
- ✓ Keyboard navigation

**Total: 50+ comprehensive tests**

## Setup

### Prerequisites

1. **Node.js** (v16 or higher)
2. **Playwright** installed
3. **Test database** with demo users configured
4. **Development server** running on `http://localhost:3000`

### Installation

```bash
# Navigate to project directory
cd SchoolCalendar2025-2026

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Install Playwright dependencies
npx playwright install-deps
```

### Environment Configuration

Create a `.env.test` file:

```env
TEST_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Ensure your test database has these demo users:

```sql
-- Student Account
Email: student@demo.com
Password: demo123456
Role: student

-- Teacher Account
Email: teacher@demo.com
Password: demo123456
Role: teacher

-- Admin Account
Email: admin@demo.com
Password: demo123456
Role: admin
```

## Running Tests

### All Tests

```bash
# Run all tests
npm test

# Or using Playwright directly
npx playwright test
```

### Specific Test File

```bash
# Run only calendar E2E tests
npx playwright test tests/calendar-e2e.spec.js
```

### Specific Test Suite

```bash
# Run only authentication tests
npx playwright test --grep "Authentication Tests"
```

### Single Test

```bash
# Run a specific test by name
npx playwright test --grep "should successfully login as student"
```

### Different Browsers

```bash
# Run on Chrome only
npx playwright test --project=chromium

# Run on Firefox only
npx playwright test --project=firefox

# Run on Safari (WebKit) only
npx playwright test --project=webkit

# Run on all browsers
npx playwright test --project=chromium --project=firefox --project=webkit
```

### Debug Mode

```bash
# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode with inspector
npx playwright test --debug

# Run specific test in debug mode
npx playwright test --debug --grep "should successfully login"
```

### UI Mode (Interactive)

```bash
# Open Playwright UI for interactive testing
npx playwright test --ui
```

## Test Results

### View HTML Report

```bash
# Generate and open HTML report
npx playwright show-report
```

Reports are saved in `test-results/html/`

### View Screenshots

Failed test screenshots are saved in:
- `test-results/`

### View Videos

Test execution videos (on failure) are saved in:
- `test-results/`

## Test Structure

```
tests/
├── calendar-e2e.spec.js          # Main test suite
├── helpers/
│   └── test-utils.js             # Helper functions
├── fixtures/
│   └── test-data.js              # Test data & seed scripts
└── README.md                     # This file

test-results/
├── html/                         # HTML test reports
├── screenshots/                  # Failure screenshots
└── videos/                       # Failure videos
```

## Writing Tests

### Basic Test Template

```javascript
import { test, expect } from '@playwright/test';
import { loginAs, waitForCalendarLoad } from './helpers/test-utils.js';

test.describe('My Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'student');
    await waitForCalendarLoad(page);
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const element = page.locator('#myElement');

    // Act
    await element.click();

    // Assert
    await expect(element).toHaveText('Expected Text');
  });
});
```

### Using Helper Functions

```javascript
import {
  loginAs,
  logout,
  waitForCalendarLoad,
  openEventModal,
  closeEventModal,
  submitAssignment,
  takeScreenshot
} from './helpers/test-utils.js';

test('submit assignment workflow', async ({ page }) => {
  // Login
  await loginAs(page, 'student');

  // Navigate to event
  await waitForCalendarLoad(page);
  await openEventModal(page, 'Algebra Quiz');

  // Submit assignment
  await submitAssignment(page, {
    text: 'My answer to the quiz',
    files: ['./test-files/assignment.pdf'],
    saveAsDraft: false
  });

  // Verify success
  await expect(page.locator('#toast')).toContainText('submitted');

  // Screenshot for documentation
  await takeScreenshot(page, 'assignment-submitted');
});
```

### Test Data Fixtures

```javascript
import { TEST_EVENTS, generateRandomEvent } from './fixtures/test-data.js';

test('create event', async ({ page }) => {
  const newEvent = generateRandomEvent({
    title: 'My Custom Event',
    grade_level: 9
  });

  // Use newEvent data in test
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run tests
        run: npm test
        env:
          TEST_URL: http://localhost:3000
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: test-results/
```

## Best Practices

### 1. Use Data Attributes

Prefer `data-testid` attributes over classes or text:

```html
<button data-testid="submit-btn">Submit</button>
```

```javascript
await page.click('[data-testid="submit-btn"]');
```

### 2. Wait for Elements

Always wait for elements before interacting:

```javascript
// Good
await page.waitForSelector('#myElement');
await page.click('#myElement');

// Bad
await page.click('#myElement'); // Might fail if element not ready
```

### 3. Use Helper Functions

Don't repeat yourself - use helper functions:

```javascript
// Good
await loginAs(page, 'student');

// Bad
await page.goto('http://localhost:3000');
await page.fill('#loginEmail', 'student@demo.com');
await page.fill('#loginPassword', 'demo123456');
await page.click('button[type="submit"]');
```

### 4. Clean Up After Tests

```javascript
test.afterEach(async ({ page }) => {
  // Logout
  await logout(page);

  // Clear cookies
  await page.context().clearCookies();
});
```

### 5. Use Descriptive Test Names

```javascript
// Good
test('should display error when submitting assignment without required fields', ...);

// Bad
test('test assignment', ...);
```

## Troubleshooting

### Tests Timeout

```bash
# Increase timeout in playwright.config.js
timeout: 60 * 1000, // 60 seconds
```

### Tests Fail on CI but Pass Locally

- Check environment variables
- Ensure database is seeded
- Verify browser versions match

### Cannot Find Element

```javascript
// Debug: Print page content
console.log(await page.content());

// Debug: Take screenshot
await page.screenshot({ path: 'debug.png' });

// Debug: Check if element exists
console.log(await page.locator('#myElement').count());
```

### Login Fails

- Verify demo users exist in database
- Check Supabase credentials in `.env`
- Ensure auth session is not cached

### Drag and Drop Not Working

Drag-and-drop is complex in Playwright. Use the helper:

```javascript
await dragEventToDate(page, 'event-123', '2025-11-10');
```

## MCP Playwright Tools

This project can also use Playwright via MCP (Model Context Protocol) tools:

```javascript
// Navigate to page
await mcp.playwright_navigate({ url: 'http://localhost:3000' });

// Click element
await mcp.playwright_click({ selector: '#loginBtn' });

// Fill input
await mcp.playwright_fill({
  selector: '#email',
  value: 'student@demo.com'
});

// Take screenshot
await mcp.playwright_screenshot({
  name: 'calendar-view',
  savePng: true
});
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [Selectors Guide](https://playwright.dev/docs/selectors)

## Support

For questions or issues with tests:

1. Check test logs: `test-results/`
2. Review screenshots of failures
3. Run in debug mode: `npx playwright test --debug`
4. Check database state
5. Verify environment variables

## Contributing

When adding new features, please:

1. Write corresponding E2E tests
2. Follow existing test structure
3. Use helper functions
4. Add descriptive test names
5. Update this README if needed

---

**Happy Testing!** 🧪✨
