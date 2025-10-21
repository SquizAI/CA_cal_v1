/**
 * Playwright Configuration for Teacher Grading Workflow Tests
 *
 * File: /Users/mattysquarzoni/Documents/Documents - Matty's MacBook Pro/AI_content_cleen/AI_academy_content_generator_V2/SchoolCalendar2025-2026/tests/playwright.config.js
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',

    // Test timeout
    timeout: 60000, // 60 seconds per test

    // Expect timeout
    expect: {
        timeout: 10000
    },

    // Run tests in parallel
    fullyParallel: false, // Run sequentially to avoid conflicts

    // Fail the build on CI if you accidentally left test.only in the source code
    forbidOnly: !!process.env.CI,

    // Retry on CI only
    retries: process.env.CI ? 2 : 0,

    // Opt out of parallel tests on CI
    workers: process.env.CI ? 1 : 1,

    // Reporter to use
    reporter: [
        ['html', { outputFolder: 'test-results/html-report' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['list']
    ],

    // Shared settings for all the projects below
    use: {
        // Base URL
        baseURL: 'https://ai-academy-centner-calendar.netlify.app',

        // Collect trace when retrying the failed test
        trace: 'on-first-retry',

        // Screenshot on failure
        screenshot: 'only-on-failure',

        // Video on failure
        video: 'retain-on-failure',

        // Browser context options
        viewport: { width: 1280, height: 720 },

        // Ignore HTTPS errors
        ignoreHTTPSErrors: true,

        // Default timeout for actions
        actionTimeout: 10000,

        // Default timeout for navigation
        navigationTimeout: 30000
    },

    // Configure projects for major browsers
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // Enable slow-mo to see what's happening
                launchOptions: {
                    slowMo: 100
                }
            },
        },

        // Uncomment to test in other browsers
        // {
        //     name: 'firefox',
        //     use: { ...devices['Desktop Firefox'] },
        // },
        // {
        //     name: 'webkit',
        //     use: { ...devices['Desktop Safari'] },
        // },
    ],

    // Run local dev server before starting the tests (if needed)
    // webServer: {
    //     command: 'npm run dev',
    //     port: 3000,
    //     reuseExistingServer: !process.env.CI,
    // },
});
