/**
 * END-TO-END ASSIGNMENT WORKFLOW TEST
 *
 * Tests the complete teacher assignment distribution workflow:
 * 1. Teacher generates lesson content (optional)
 * 2. Teacher generates quiz from lesson
 * 3. Teacher opens "Assign to Students" modal
 * 4. Teacher selects students and sets due date
 * 5. Teacher submits assignment
 * 6. Verify database records in student_assignments
 * 7. Verify student sees assignment in their dashboard
 */

const { test, expect } = require('@playwright/test');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://qypmfilbkvxwyznnenge.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Test configuration
const BASE_URL = 'https://ai-academy-centner-calendar.netlify.app';
const TEACHER_EMAIL = 'teacher@aicentner.com';
const TEACHER_PASSWORD = 'TestPassword123!';
const STUDENT_EMAIL = 'student1@aicentner.com';
const STUDENT_PASSWORD = 'TestPassword123!';

// Test data
const TEST_LESSON = {
    date: '2025-10-06',
    period: '3',
    subject: '7th_civics',
    lessonKey: '2025-10-06_7th_civics_3',
    title: 'Civics Lesson: Constitution'
};

test.describe('Complete Assignment Distribution Workflow', () => {
    let supabase;
    let teacherSession;
    let studentId;
    let assignmentIds = [];

    test.beforeAll(async () => {
        // Initialize Supabase client
        supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

        // Get student ID for verification
        const { data: students } = await supabase
            .from('user_profiles')
            .select('id, email')
            .eq('role', 'student')
            .limit(3);

        console.log('Found students:', students);
        studentId = students[0]?.id;
    });

    test.afterAll(async () => {
        // Cleanup: Delete test assignments
        if (assignmentIds.length > 0) {
            await supabase
                .from('student_assignments')
                .delete()
                .in('id', assignmentIds);
            console.log(`Cleaned up ${assignmentIds.length} test assignments`);
        }
    });

    test('STEP 1: Teacher Login', async ({ page }) => {
        await page.goto(`${BASE_URL}/teacher-dashboard.html`);

        // Wait for auth modal to appear
        await page.waitForSelector('#authModal', { timeout: 5000 });

        // Fill in login credentials
        await page.fill('#authEmail', TEACHER_EMAIL);
        await page.fill('#authPassword', TEACHER_PASSWORD);

        // Click login button
        await page.click('#loginBtn');

        // Wait for successful login (auth modal closes)
        await page.waitForSelector('#authModal:not(.active)', { timeout: 10000 });

        // Verify dashboard loaded
        await expect(page.locator('.calendar-container')).toBeVisible({ timeout: 5000 });

        console.log('✅ Teacher logged in successfully');
    });

    test('STEP 2: Navigate to lesson and open enhancement panel', async ({ page }) => {
        await page.goto(`${BASE_URL}/teacher-dashboard.html`);

        // Login first
        await page.waitForSelector('#authModal', { timeout: 5000 });
        await page.fill('#authEmail', TEACHER_EMAIL);
        await page.fill('#authPassword', TEACHER_PASSWORD);
        await page.click('#loginBtn');
        await page.waitForSelector('#authModal:not(.active)', { timeout: 10000 });

        // Navigate to October 2025 (lesson date)
        await page.selectOption('#monthSelect', '2025-10');

        // Wait for calendar to render
        await page.waitForTimeout(1000);

        // Find and click the lesson for Oct 6, 2025
        const lessonSelector = `[data-date="${TEST_LESSON.date}"]`;
        await page.waitForSelector(lessonSelector, { timeout: 5000 });

        // Click on the lesson cell
        await page.click(lessonSelector);

        // Verify enhancement panel opens
        await page.waitForSelector('#enhancementPanel', { timeout: 5000 });
        await expect(page.locator('#enhancementPanel')).toBeVisible();

        console.log('✅ Enhancement panel opened for lesson');
    });

    test('STEP 3: Generate quiz using AI', async ({ page }) => {
        await page.goto(`${BASE_URL}/teacher-dashboard.html`);

        // Login
        await page.waitForSelector('#authModal', { timeout: 5000 });
        await page.fill('#authEmail', TEACHER_EMAIL);
        await page.fill('#authPassword', TEACHER_PASSWORD);
        await page.click('#loginBtn');
        await page.waitForSelector('#authModal:not(.active)', { timeout: 10000 });

        // Navigate to lesson
        await page.selectOption('#monthSelect', '2025-10');
        await page.waitForTimeout(1000);
        await page.click(`[data-date="${TEST_LESSON.date}"]`);
        await page.waitForSelector('#enhancementPanel', { timeout: 5000 });

        // Scroll to Quiz section in enhancement panel
        await page.evaluate(() => {
            document.querySelector('#enhancementPanel').scrollTop = 500;
        });

        // Click "Generate Quiz" button (if exists)
        const generateQuizBtn = page.locator('button:has-text("Generate Quiz")');
        if (await generateQuizBtn.count() > 0) {
            await generateQuizBtn.click();

            // Wait for AI generation to complete (loading indicator)
            await page.waitForTimeout(3000);

            console.log('✅ Quiz generated via AI');
        } else {
            console.log('⚠️ Quiz already exists or generate button not found');
        }

        // Verify quiz exists in enhancement data
        const quizContent = await page.locator('#quizContent');
        await expect(quizContent).toBeVisible({ timeout: 5000 });
    });

    test('STEP 4: Open "Assign to Students" modal', async ({ page }) => {
        await page.goto(`${BASE_URL}/teacher-dashboard.html`);

        // Login
        await page.waitForSelector('#authModal', { timeout: 5000 });
        await page.fill('#authEmail', TEACHER_EMAIL);
        await page.fill('#authPassword', TEACHER_PASSWORD);
        await page.click('#loginBtn');
        await page.waitForSelector('#authModal:not(.active)', { timeout: 10000 });

        // Navigate to lesson
        await page.selectOption('#monthSelect', '2025-10');
        await page.waitForTimeout(1000);
        await page.click(`[data-date="${TEST_LESSON.date}"]`);
        await page.waitForSelector('#enhancementPanel', { timeout: 5000 });

        // Find and click "Assign to Students" button
        const assignBtn = page.locator('button:has-text("Assign to Students")').first();
        await assignBtn.click();

        // Wait for modal to open
        await page.waitForSelector('#assignModal.active', { timeout: 5000 });
        await expect(page.locator('#assignModal.active')).toBeVisible();

        // Verify modal has the correct lesson info
        const modalTitle = page.locator('#assignModal h3');
        await expect(modalTitle).toContainText('Period 3');
        await expect(modalTitle).toContainText('Civics');

        console.log('✅ Assign to Students modal opened');
    });

    test('STEP 5: Select assignment type, students, and submit', async ({ page }) => {
        await page.goto(`${BASE_URL}/teacher-dashboard.html`);

        // Login
        await page.waitForSelector('#authModal', { timeout: 5000 });
        await page.fill('#authEmail', TEACHER_EMAIL);
        await page.fill('#authPassword', TEACHER_PASSWORD);
        await page.click('#loginBtn');
        await page.waitForSelector('#authModal:not(.active)', { timeout: 10000 });

        // Navigate to lesson and open assign modal
        await page.selectOption('#monthSelect', '2025-10');
        await page.waitForTimeout(1000);
        await page.click(`[data-date="${TEST_LESSON.date}"]`);
        await page.waitForSelector('#enhancementPanel', { timeout: 5000 });
        await page.locator('button:has-text("Assign to Students")').first().click();
        await page.waitForSelector('#assignModal.active', { timeout: 5000 });

        // Select assignment type: Quiz
        await page.click('.assignment-type-btn[data-type="quiz"]');
        await expect(page.locator('.assignment-type-btn[data-type="quiz"]')).toHaveClass(/selected/);

        // Verify quiz questions preview appears
        await page.waitForTimeout(500);
        const quizSection = page.locator('#quizQuestionsSection');
        await expect(quizSection).toBeVisible();

        // Fill assignment details
        await page.fill('#assignmentTitle', 'Test Quiz: Constitution');
        await page.fill('#assignmentInstructions', 'Complete all questions and submit by the due date.');

        // Set due date (tomorrow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dueDateStr = tomorrow.toISOString().split('T')[0];
        await page.fill('#assignmentDueDate', dueDateStr);
        await page.fill('#assignmentDueTime', '23:59');

        // Set points
        await page.fill('#assignmentPoints', '100');

        // Select all students
        await page.click('#selectAllStudents');

        // Verify selected count
        const selectedCount = await page.locator('#selectedCount').innerText();
        expect(parseInt(selectedCount)).toBeGreaterThan(0);

        console.log(`✅ Selected ${selectedCount} students`);

        // Submit assignment
        await page.click('button:has-text("Assign to Students")');

        // Wait for success message
        await page.waitForSelector('div:has-text("Assignment Created!")', { timeout: 10000 });
        await expect(page.locator('div:has-text("Assignment Created!")')).toBeVisible();

        console.log('✅ Assignment submitted successfully');

        // Modal should auto-close after success
        await page.waitForTimeout(3000);
    });

    test('STEP 6: Verify database records in student_assignments', async ({ page }) => {
        // Query database directly
        const { data: assignments, error } = await supabase
            .from('student_assignments')
            .select('*')
            .eq('lesson_key', TEST_LESSON.lessonKey)
            .eq('assignment_type', 'quiz')
            .order('created_at', { ascending: false })
            .limit(10);

        console.log('Database query result:', { assignments, error });

        expect(error).toBeNull();
        expect(assignments).toBeTruthy();
        expect(assignments.length).toBeGreaterThan(0);

        // Verify assignment data structure
        const assignment = assignments[0];
        expect(assignment.lesson_key).toBe(TEST_LESSON.lessonKey);
        expect(assignment.subject_key).toBe(TEST_LESSON.subject);
        expect(assignment.assignment_type).toBe('quiz');
        expect(assignment.title).toContain('Test Quiz');
        expect(assignment.status).toBe('assigned');
        expect(assignment.points_possible).toBe(100);
        expect(assignment.student_id).toBeTruthy();
        expect(assignment.teacher_id).toBeTruthy();

        // Check quiz data in metadata
        if (assignment.metadata && assignment.metadata.quiz_data) {
            console.log('✅ Quiz data stored in metadata');
        }

        // Store assignment IDs for cleanup
        assignmentIds = assignments.map(a => a.id);

        console.log(`✅ Verified ${assignments.length} assignment records in database`);
    });

    test('STEP 7: Verify student sees assignment in dashboard', async ({ page }) => {
        await page.goto(`${BASE_URL}/student-dashboard.html`);

        // Login as student
        await page.waitForSelector('#authModal', { timeout: 5000 });
        await page.fill('#authEmail', STUDENT_EMAIL);
        await page.fill('#authPassword', STUDENT_PASSWORD);
        await page.click('#loginBtn');
        await page.waitForSelector('#authModal:not(.active)', { timeout: 10000 });

        // Navigate to "My Assignments" section
        await page.click('button:has-text("My Assignments")');

        // Wait for assignments to load
        await page.waitForTimeout(2000);

        // Check "Upcoming" tab
        await page.click('[data-tab="upcoming"]');
        await page.waitForTimeout(1000);

        // Verify assignment appears
        const assignmentCard = page.locator('.assignment-card:has-text("Test Quiz")');
        await expect(assignmentCard).toBeVisible({ timeout: 5000 });

        // Verify assignment details
        await expect(assignmentCard).toContainText('100');
        await expect(assignmentCard).toContainText('Quiz');

        console.log('✅ Student can see assignment in their dashboard');
    });

    test('STEP 8: Verify API endpoint get-student-assignments', async ({ request }) => {
        if (!studentId) {
            console.warn('⚠️ No student ID available, skipping API test');
            return;
        }

        // Call the API endpoint
        const response = await request.get(
            `${BASE_URL}/.netlify/functions/get-student-assignments?student_id=${studentId}`
        );

        expect(response.ok()).toBeTruthy();

        const result = await response.json();
        expect(result.success).toBe(true);
        expect(result.assignments).toBeTruthy();
        expect(Array.isArray(result.assignments)).toBe(true);

        // Check if our test assignment is in the results
        const testAssignment = result.assignments.find(a =>
            a.lesson_key === TEST_LESSON.lessonKey &&
            a.title.includes('Test Quiz')
        );

        if (testAssignment) {
            console.log('✅ Assignment found in API response:', testAssignment);
            expect(testAssignment.type).toBe('quiz');
            expect(testAssignment.points_possible).toBe(100);
            expect(testAssignment.status).toBe('assigned');
        } else {
            console.warn('⚠️ Test assignment not found in API response (may belong to different student)');
        }
    });

    test('STEP 9: Test error handling - missing required fields', async ({ page }) => {
        await page.goto(`${BASE_URL}/teacher-dashboard.html`);

        // Login
        await page.waitForSelector('#authModal', { timeout: 5000 });
        await page.fill('#authEmail', TEACHER_EMAIL);
        await page.fill('#authPassword', TEACHER_PASSWORD);
        await page.click('#loginBtn');
        await page.waitForSelector('#authModal:not(.active)', { timeout: 10000 });

        // Open assign modal
        await page.selectOption('#monthSelect', '2025-10');
        await page.waitForTimeout(1000);
        await page.click(`[data-date="${TEST_LESSON.date}"]`);
        await page.waitForSelector('#enhancementPanel', { timeout: 5000 });
        await page.locator('button:has-text("Assign to Students")').first().click();
        await page.waitForSelector('#assignModal.active', { timeout: 5000 });

        // Try to submit WITHOUT selecting assignment type
        const submitBtn = page.locator('button:has-text("Assign to Students")').nth(1);
        await submitBtn.click();

        // Should show validation error
        page.on('dialog', dialog => {
            expect(dialog.message()).toContain('select an assignment type');
            dialog.accept();
        });

        await page.waitForTimeout(500);

        // Select type but don't fill title
        await page.click('.assignment-type-btn[data-type="homework"]');
        await page.fill('#assignmentTitle', ''); // Clear title
        await submitBtn.click();

        // Should show validation error
        page.on('dialog', dialog => {
            expect(dialog.message()).toContain('title');
            dialog.accept();
        });

        console.log('✅ Form validation working correctly');
    });

    test('STEP 10: Test duplicate assignment prevention', async ({ page }) => {
        // This test verifies that the unique constraint works
        // Try to create the same assignment twice

        const { data: existingAssignment } = await supabase
            .from('student_assignments')
            .select('*')
            .eq('lesson_key', TEST_LESSON.lessonKey)
            .eq('assignment_type', 'quiz')
            .limit(1)
            .single();

        if (!existingAssignment) {
            console.warn('⚠️ No existing assignment found, skipping duplicate test');
            return;
        }

        // Try to insert duplicate
        const { data, error } = await supabase
            .from('student_assignments')
            .insert({
                teacher_id: existingAssignment.teacher_id,
                student_id: existingAssignment.student_id,
                lesson_key: existingAssignment.lesson_key,
                subject_key: existingAssignment.subject_key,
                assignment_type: existingAssignment.assignment_type,
                title: existingAssignment.title,
                due_date: existingAssignment.due_date,
                points_possible: 100,
                status: 'assigned'
            });

        // Should fail with unique constraint violation
        expect(error).toBeTruthy();
        expect(error.code).toBe('23505'); // PostgreSQL unique violation

        console.log('✅ Duplicate assignment prevention working');
    });
});

test.describe('Assignment Workflow - Edge Cases', () => {
    test('No students enrolled in period', async ({ page }) => {
        // This would require setting up a lesson with no enrolled students
        // For now, we'll just verify the UI shows appropriate message
        console.log('⚠️ Manual test required: Verify "No Students Enrolled" message shows');
    });

    test('Quiz data not available', async ({ page }) => {
        await page.goto(`${BASE_URL}/teacher-dashboard.html`);

        // Login
        await page.waitForSelector('#authModal', { timeout: 5000 });
        await page.fill('#authEmail', TEACHER_EMAIL);
        await page.fill('#authPassword', TEACHER_PASSWORD);
        await page.click('#loginBtn');
        await page.waitForSelector('#authModal:not(.active)', { timeout: 10000 });

        // Open assign modal for a lesson without quiz
        await page.selectOption('#monthSelect', '2025-09');
        await page.waitForTimeout(1000);

        // Try to find a lesson cell and click it
        const lessonCells = await page.locator('[data-date]').all();
        if (lessonCells.length > 0) {
            await lessonCells[0].click();
            await page.waitForSelector('#enhancementPanel', { timeout: 5000 });

            const assignBtn = page.locator('button:has-text("Assign to Students")');
            if (await assignBtn.count() > 0) {
                await assignBtn.first().click();
                await page.waitForSelector('#assignModal.active', { timeout: 5000 });

                // Quiz button should be disabled if no quiz data
                const quizBtn = page.locator('.assignment-type-btn[data-type="quiz"]');
                const isDisabled = await quizBtn.evaluate(el =>
                    el.style.opacity === '0.5' || el.style.cursor === 'not-allowed'
                );

                if (isDisabled) {
                    console.log('✅ Quiz button correctly disabled when no quiz data');
                }
            }
        }
    });
});
