# Grade-Based Progress Tracking - Implementation Guide

**Project**: AI Academy @ Centner Calendar System
**Priority**: CRITICAL
**Estimated Time**: 12-16 hours (2-3 days)
**Complexity**: Medium

---

## Overview

This guide provides step-by-step instructions to implement grade-based progress tracking in the student dashboard, replacing the current lesson-completion system with actual academic performance metrics.

---

## Current State vs. Target State

### Current (Incorrect)
- Progress = Lessons completed / Total lessons
- No grade display
- No category breakdown
- Generic progress bar

### Target (Correct)
- Progress = Weighted grade average across all subjects
- Subject cards showing percentage and letter grade
- Category breakdown (homework, quizzes, tests, participation)
- Color-coded progress bars based on performance

---

## Implementation Steps

### Step 1: Update Progress Statistics Function (30 min)

**File**: `/student-dashboard.html`
**Location**: Line 2744

**Replace**:
```javascript
// OLD CODE (REMOVE)
function updateProgressStats() {
    const allLessons = getAllLessons();
    const completed = allLessons.filter(l => l.completed).length;
    const total = allLessons.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById('completedCount').textContent = completed;
    document.getElementById('totalCount').textContent = total;
    document.getElementById('progressBar').style.width = `${percent}%`;
    document.getElementById('progressPercent').textContent = `${percent}%`;
}
```

**With**:
```javascript
// NEW CODE
async function updateProgressStats() {
    try {
        const studentId = currentStudent.id;

        // Fetch grade summary for all subjects
        const { data: subjects, error } = await supabase
            .from('student_grade_summary')
            .select('*')
            .eq('student_id', studentId);

        if (error) {
            console.error('Error fetching grade summary:', error);
            return;
        }

        if (!subjects || subjects.length === 0) {
            // No grades yet
            document.getElementById('overallGPA').textContent = 'N/A';
            document.getElementById('letterGrade').textContent = '-';
            document.getElementById('progressBar').style.width = '0%';
            document.getElementById('progressPercent').textContent = '0%';
            document.getElementById('totalSubjects').textContent = '0';
            return;
        }

        // Calculate overall GPA (simple average of all subjects)
        const totalPercentage = subjects.reduce((sum, s) => sum + (s.average_percentage || 0), 0);
        const overallGPA = totalPercentage / subjects.length;
        const letterGrade = getLetterGrade(overallGPA);

        // Update UI
        document.getElementById('overallGPA').textContent = `${overallGPA.toFixed(1)}%`;
        document.getElementById('letterGrade').textContent = letterGrade;
        document.getElementById('progressBar').style.width = `${overallGPA}%`;
        document.getElementById('progressPercent').textContent = `${overallGPA.toFixed(1)}%`;
        document.getElementById('totalSubjects').textContent = subjects.length;

        // Set progress bar color based on grade
        const progressBar = document.getElementById('progressBar');
        progressBar.className = 'progress-bar-fill ' + getGradeColorClass(overallGPA);

        console.log(`✅ Progress updated: ${overallGPA.toFixed(1)}% (${letterGrade}) across ${subjects.length} subjects`);

    } catch (error) {
        console.error('Failed to update progress stats:', error);
    }
}

// Helper: Get letter grade from percentage
function getLetterGrade(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
}

// Helper: Get color class for grade
function getGradeColorClass(percentage) {
    if (percentage >= 80) return 'grade-excellent'; // Green
    if (percentage >= 60) return 'grade-passing';   // Yellow
    return 'grade-failing'; // Red
}
```

**Update HTML** (Progress Section):
```html
<!-- Replace existing progress section -->
<div class="progress-header">
    <h2>Academic Progress</h2>
    <div class="progress-stats">
        <div class="stat-item">
            <span class="stat-label">Overall Grade</span>
            <span class="stat-value" id="overallGPA">--</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Letter Grade</span>
            <span class="stat-value" id="letterGrade">-</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Enrolled Subjects</span>
            <span class="stat-value" id="totalSubjects">0</span>
        </div>
    </div>
    <div class="progress-bar-container">
        <div class="progress-bar-fill" id="progressBar" style="width: 0%;">
            <span id="progressPercent">0%</span>
        </div>
    </div>
</div>
```

**Add CSS**:
```css
.progress-bar-fill.grade-excellent {
    background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
}

.progress-bar-fill.grade-passing {
    background: linear-gradient(90deg, #eab308 0%, #ca8a04 100%);
}

.progress-bar-fill.grade-failing {
    background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
}

.stat-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
}
```

---

### Step 2: Add Subject Progress Cards (2 hours)

**File**: `/student-dashboard.html`
**Add After**: Progress section

**HTML Structure**:
```html
<!-- Add new section after progress -->
<div class="subject-progress-section">
    <h3>Subject Grades</h3>
    <div id="subjectProgressContainer" class="subject-progress-grid">
        <!-- Subject cards will be dynamically inserted here -->
    </div>
</div>
```

**JavaScript Function**:
```javascript
async function loadSubjectProgress() {
    try {
        const studentId = currentStudent.id;

        // Fetch detailed grade summary
        const { data: subjects, error } = await supabase
            .from('student_grade_summary')
            .select('*')
            .eq('student_id', studentId)
            .order('subject_key');

        if (error) {
            console.error('Error loading subject progress:', error);
            return;
        }

        const container = document.getElementById('subjectProgressContainer');
        container.innerHTML = '';

        if (!subjects || subjects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No grades available yet. Grades will appear here once your teachers post them.</p>
                </div>
            `;
            return;
        }

        // Create a card for each subject
        subjects.forEach(subject => {
            const card = createSubjectProgressCard(subject);
            container.appendChild(card);
        });

        console.log(`✅ Loaded ${subjects.length} subject progress cards`);

    } catch (error) {
        console.error('Failed to load subject progress:', error);
    }
}

function createSubjectProgressCard(subject) {
    const card = document.createElement('div');
    card.className = 'subject-progress-card';
    card.dataset.subjectKey = subject.subject_key;

    const percentage = subject.average_percentage || 0;
    const letterGrade = subject.average_letter_grade || '-';
    const gradeColor = getGradeColor(percentage);

    card.innerHTML = `
        <div class="subject-card-header">
            <div class="subject-icon" style="background-color: ${gradeColor};">
                <span class="subject-letter">${letterGrade}</span>
            </div>
            <div class="subject-info">
                <h4 class="subject-name">${formatSubjectName(subject.subject_key)}</h4>
                <p class="subject-stats">
                    ${subject.total_assignments} assignment${subject.total_assignments !== 1 ? 's' : ''} graded
                </p>
            </div>
        </div>

        <div class="subject-grade-display">
            <span class="subject-percentage">${percentage.toFixed(1)}%</span>
            <span class="subject-letter-badge ${getGradeClass(percentage)}">${letterGrade}</span>
        </div>

        <div class="subject-progress-bar-container">
            <div class="subject-progress-bar-fill"
                 style="width: ${percentage}%; background-color: ${gradeColor};">
            </div>
        </div>

        <div class="subject-grade-breakdown">
            <div class="breakdown-item">
                <span class="breakdown-label">A's</span>
                <span class="breakdown-value">${subject.a_count || 0}</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">B's</span>
                <span class="breakdown-value">${subject.b_count || 0}</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">C's</span>
                <span class="breakdown-value">${subject.c_count || 0}</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">D's</span>
                <span class="breakdown-value">${subject.d_count || 0}</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">F's</span>
                <span class="breakdown-value">${subject.f_count || 0}</span>
            </div>
        </div>

        <button class="view-details-btn" onclick="showCategoryBreakdown('${subject.subject_key}')">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Category Breakdown
        </button>

        <div class="last-updated">
            Last updated: ${formatDate(subject.last_grade_date)}
        </div>
    `;

    return card;
}

// Helper: Get color for grade
function getGradeColor(percentage) {
    if (percentage >= 80) return '#22c55e'; // Green
    if (percentage >= 60) return '#eab308'; // Yellow
    return '#ef4444'; // Red
}

// Helper: Get CSS class for grade
function getGradeClass(percentage) {
    if (percentage >= 80) return 'grade-a-b';
    if (percentage >= 60) return 'grade-c-d';
    return 'grade-f';
}

// Helper: Format subject key to readable name
function formatSubjectName(subjectKey) {
    const names = {
        '9th_ela': '9th Grade ELA',
        '7th_civics': '7th Grade Civics',
        'math_algebra': 'Algebra I',
        'science_biology': 'Biology'
    };
    return names[subjectKey] || subjectKey.replace(/_/g, ' ').toUpperCase();
}

// Helper: Format date
function formatDate(dateString) {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}
```

**CSS Styles**:
```css
/* Subject Progress Section */
.subject-progress-section {
    margin-top: 2rem;
}

.subject-progress-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.subject-progress-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.subject-progress-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}

.subject-card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.subject-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
}

.subject-info {
    flex: 1;
}

.subject-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.25rem 0;
}

.subject-stats {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
}

.subject-grade-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.subject-percentage {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
}

.subject-letter-badge {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 1.25rem;
    font-weight: 700;
}

.subject-letter-badge.grade-a-b {
    background-color: #d1fae5;
    color: #065f46;
}

.subject-letter-badge.grade-c-d {
    background-color: #fef3c7;
    color: #92400e;
}

.subject-letter-badge.grade-f {
    background-color: #fee2e2;
    color: #991b1b;
}

.subject-progress-bar-container {
    height: 8px;
    background-color: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1rem;
}

.subject-progress-bar-fill {
    height: 100%;
    transition: width 0.5s ease;
    border-radius: 4px;
}

.subject-grade-breakdown {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.75rem;
    background-color: #f9fafb;
    border-radius: 8px;
}

.breakdown-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.breakdown-label {
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
}

.breakdown-value {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
}

.view-details-btn {
    width: 100%;
    padding: 0.75rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background-color 0.2s;
}

.view-details-btn:hover {
    background-color: #2563eb;
}

.btn-icon {
    width: 20px;
    height: 20px;
}

.last-updated {
    text-align: center;
    font-size: 0.75rem;
    color: #9ca3af;
    margin-top: 0.75rem;
}

.empty-state {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
}
```

---

### Step 3: Add Category Breakdown Modal (1.5 hours)

**HTML Modal Structure** (add to bottom of body):
```html
<!-- Category Breakdown Modal -->
<div id="categoryBreakdownModal" class="modal-overlay" style="display: none;">
    <div class="modal-content category-breakdown-modal">
        <div class="modal-header">
            <h3 id="categoryModalTitle">Grade Breakdown</h3>
            <button class="modal-close-btn" onclick="closeCategoryBreakdown()">
                <svg class="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div class="modal-body" id="categoryModalBody">
            <!-- Dynamic content -->
        </div>
    </div>
</div>
```

**JavaScript Function**:
```javascript
async function showCategoryBreakdown(subjectKey) {
    try {
        const studentId = currentStudent.id;

        // Show loading state
        const modal = document.getElementById('categoryBreakdownModal');
        const title = document.getElementById('categoryModalTitle');
        const body = document.getElementById('categoryModalBody');

        title.textContent = `Grade Breakdown: ${formatSubjectName(subjectKey)}`;
        body.innerHTML = '<div class="loading">Loading breakdown...</div>';
        modal.style.display = 'flex';

        // Fetch all grades for this subject
        const { data: grades, error: gradesError } = await supabase
            .from('grades')
            .select(`
                id,
                percentage,
                points_earned,
                points_possible,
                letter_grade,
                graded_at,
                assignments!inner(
                    title,
                    category,
                    subject_key
                )
            `)
            .eq('student_id', studentId)
            .eq('assignments.subject_key', subjectKey)
            .order('graded_at', { ascending: false });

        if (gradesError) throw gradesError;

        // Fetch category information
        const { data: categories, error: catError } = await supabase
            .from('assignment_categories')
            .select('*')
            .order('weight', { ascending: false });

        if (catError) throw catError;

        // Group grades by category
        const gradesByCategory = {};
        grades.forEach(grade => {
            const cat = grade.assignments.category;
            if (!gradesByCategory[cat]) {
                gradesByCategory[cat] = [];
            }
            gradesByCategory[cat].push(grade);
        });

        // Build breakdown HTML
        let html = '';

        // Overall summary
        const overallAvg = grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length;
        html += `
            <div class="overall-summary">
                <div class="summary-stat">
                    <span class="summary-label">Overall Average</span>
                    <span class="summary-value">${overallAvg.toFixed(1)}%</span>
                </div>
                <div class="summary-stat">
                    <span class="summary-label">Letter Grade</span>
                    <span class="summary-value">${getLetterGrade(overallAvg)}</span>
                </div>
                <div class="summary-stat">
                    <span class="summary-label">Total Assignments</span>
                    <span class="summary-value">${grades.length}</span>
                </div>
            </div>
        `;

        // Category breakdowns
        html += '<div class="category-list">';

        categories.forEach(category => {
            const catGrades = gradesByCategory[category.category_key] || [];
            const catAverage = catGrades.length > 0
                ? catGrades.reduce((sum, g) => sum + g.percentage, 0) / catGrades.length
                : null;

            const catColor = catAverage ? getGradeColor(catAverage) : '#9ca3af';

            html += `
                <div class="category-breakdown-item">
                    <div class="category-header">
                        <div class="category-title">
                            <div class="category-icon" style="background-color: ${catColor};">
                                <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                                    ${getCategoryIcon(category.category_key)}
                                </svg>
                            </div>
                            <div>
                                <h4 class="category-name">${category.category_name}</h4>
                                <p class="category-weight">${category.weight}% of final grade</p>
                            </div>
                        </div>
                        <div class="category-stats">
                            <div class="category-average" style="color: ${catColor};">
                                ${catAverage ? catAverage.toFixed(1) + '%' : 'No grades'}
                            </div>
                            <div class="category-count">
                                ${catGrades.length} graded
                            </div>
                        </div>
                    </div>

                    ${catGrades.length > 0 ? `
                        <div class="category-progress-bar">
                            <div class="category-progress-fill"
                                 style="width: ${catAverage}%; background-color: ${catColor};">
                            </div>
                        </div>

                        <div class="assignment-list-compact">
                            ${catGrades.map(grade => `
                                <div class="assignment-grade-item">
                                    <div class="assignment-grade-info">
                                        <span class="assignment-grade-title">${grade.assignments.title}</span>
                                        <span class="assignment-grade-date">${formatDate(grade.graded_at)}</span>
                                    </div>
                                    <div class="assignment-grade-score">
                                        <span class="grade-points">${grade.points_earned}/${grade.points_possible}</span>
                                        <span class="grade-percentage ${getGradeClass(grade.percentage)}">
                                            ${grade.percentage.toFixed(1)}%
                                        </span>
                                        <span class="grade-letter">${grade.letter_grade}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="no-grades-message">
                            <p>No assignments graded in this category yet.</p>
                        </div>
                    `}
                </div>
            `;
        });

        html += '</div>';

        body.innerHTML = html;

    } catch (error) {
        console.error('Error showing category breakdown:', error);
        document.getElementById('categoryModalBody').innerHTML = `
            <div class="error-message">
                <p>Failed to load grade breakdown. Please try again.</p>
            </div>
        `;
    }
}

function closeCategoryBreakdown() {
    document.getElementById('categoryBreakdownModal').style.display = 'none';
}

// Helper: Get icon SVG for category
function getCategoryIcon(categoryKey) {
    const icons = {
        homework: '<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />',
        quizzes: '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />',
        tests: '<path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />',
        participation: '<path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />'
    };
    return icons[categoryKey] || icons.homework;
}
```

**CSS Styles**:
```css
/* Category Breakdown Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 1rem;
}

.category-breakdown-modal {
    background: white;
    border-radius: 16px;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
}

.modal-close-btn {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: #6b7280;
    transition: color 0.2s;
}

.modal-close-btn:hover {
    color: #111827;
}

.close-icon {
    width: 24px;
    height: 24px;
}

.modal-body {
    padding: 1.5rem;
    overflow-y: auto;
}

.overall-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
}

.summary-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.summary-label {
    font-size: 0.875rem;
    opacity: 0.9;
    margin-bottom: 0.5rem;
}

.summary-value {
    font-size: 2rem;
    font-weight: 700;
}

.category-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.category-breakdown-item {
    background: #f9fafb;
    border-radius: 12px;
    padding: 1.5rem;
}

.category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.category-title {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.category-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.category-icon .icon {
    width: 24px;
    height: 24px;
}

.category-name {
    margin: 0 0 0.25rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
}

.category-weight {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
}

.category-stats {
    text-align: right;
}

.category-average {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
}

.category-count {
    font-size: 0.875rem;
    color: #6b7280;
}

.category-progress-bar {
    height: 8px;
    background-color: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1rem;
}

.category-progress-fill {
    height: 100%;
    transition: width 0.5s ease;
    border-radius: 4px;
}

.assignment-list-compact {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.assignment-grade-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: white;
    border-radius: 8px;
}

.assignment-grade-info {
    display: flex;
    flex-direction: column;
}

.assignment-grade-title {
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
}

.assignment-grade-date {
    font-size: 0.75rem;
    color: #9ca3af;
}

.assignment-grade-score {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.grade-points {
    font-size: 0.875rem;
    color: #6b7280;
}

.grade-percentage {
    font-size: 1.25rem;
    font-weight: 700;
}

.grade-percentage.grade-a-b {
    color: #059669;
}

.grade-percentage.grade-c-d {
    color: #d97706;
}

.grade-percentage.grade-f {
    color: #dc2626;
}

.grade-letter {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-weight: 700;
    font-size: 0.875rem;
    background-color: #e5e7eb;
    color: #374151;
}

.no-grades-message,
.error-message {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
}

.loading {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
}
```

---

### Step 4: Initialize on Page Load (15 min)

**Update Dashboard Init Function**:

```javascript
// Update existing window.onload or DOMContentLoaded
async function initStudentDashboard() {
    try {
        // Check authentication
        checkAuth();

        // Load curriculum data
        await loadCurriculumData();

        // Load lesson overrides
        await loadLessonOverrides();

        // Initialize calendar
        initializeCalendar();

        // NEW: Load grade-based progress
        await updateProgressStats();
        await loadSubjectProgress();

        // Set up real-time grade updates
        subscribeToGradeUpdates();

        // Existing code...
        populateCourseList();
        loadUpcomingAssignments();

        console.log('✅ Student dashboard initialized');

    } catch (error) {
        console.error('Dashboard initialization failed:', error);
    }
}

// Real-time updates via Supabase subscription
function subscribeToGradeUpdates() {
    const studentId = currentStudent.id;

    const subscription = supabase
        .channel('grade-updates')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'grades',
                filter: `student_id=eq.${studentId}`
            },
            (payload) => {
                console.log('📊 New grade received:', payload);

                // Show notification
                showGradeNotification(payload.new);

                // Refresh progress displays
                updateProgressStats();
                loadSubjectProgress();
            }
        )
        .subscribe();

    console.log('✅ Subscribed to grade updates');
}

function showGradeNotification(grade) {
    // Simple notification (you can enhance this)
    const notification = document.createElement('div');
    notification.className = 'grade-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <strong>New Grade Posted!</strong>
            <p>You received ${grade.percentage}% (${grade.letter_grade})</p>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}
```

**Add Notification CSS**:
```css
.grade-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
}

.grade-notification.show {
    opacity: 1;
    transform: translateY(0);
}

.notification-content strong {
    display: block;
    color: #111827;
    margin-bottom: 0.25rem;
}

.notification-content p {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
}
```

---

### Step 5: Testing Checklist (1 hour)

1. **Functional Tests**:
   - [ ] Progress bar shows grade-based percentage
   - [ ] Letter grade displays correctly (A, B, C, D, F)
   - [ ] Subject cards appear for all enrolled classes
   - [ ] Click "View Details" opens category breakdown
   - [ ] Category breakdown shows correct averages
   - [ ] Individual assignment grades listed correctly
   - [ ] Color coding works (green ≥80%, yellow ≥60%, red <60%)

2. **Data Accuracy Tests**:
   - [ ] Manual grade calculation matches display
   - [ ] Weighted averages correct (verify with calculator)
   - [ ] Empty categories show "No grades yet"
   - [ ] Missing subjects handled gracefully

3. **Real-Time Tests**:
   - [ ] New grade triggers notification
   - [ ] Progress updates without page refresh
   - [ ] Subject cards update immediately

4. **Performance Tests**:
   - [ ] Dashboard loads in < 3 seconds
   - [ ] No console errors
   - [ ] Smooth animations

5. **Responsive Tests**:
   - [ ] Works on mobile (< 640px)
   - [ ] Works on tablet (640-1024px)
   - [ ] Works on desktop (> 1024px)

---

### Step 6: Database Verification Queries

Run these queries to verify data integrity:

```sql
-- 1. Check if student has grades
SELECT
    s.first_name || ' ' || s.last_name AS student,
    COUNT(g.id) AS total_grades,
    ROUND(AVG(g.percentage), 2) AS overall_avg
FROM centner_students s
LEFT JOIN grades g ON g.student_id = s.id
WHERE s.id = '[STUDENT_ID]'
GROUP BY s.id, s.first_name, s.last_name;

-- 2. Verify student_grade_summary view
SELECT * FROM student_grade_summary
WHERE student_id = '[STUDENT_ID]';

-- 3. Check category weights sum to 100%
SELECT
    SUM(weight) AS total_weight
FROM assignment_categories;
-- Should return 100

-- 4. Verify weighted grade calculation
SELECT calculate_weighted_course_grade(
    '[STUDENT_ID]'::uuid,
    '9th_ela',
    1,
    '2025'
);

-- 5. Check for orphaned grades (should be 0)
SELECT COUNT(*) FROM grades g
WHERE NOT EXISTS (
    SELECT 1 FROM assignments a WHERE a.id = g.assignment_id
);
```

---

## Deployment Steps

1. **Backup Current Code**:
   ```bash
   cp student-dashboard.html student-dashboard.html.backup
   ```

2. **Apply Changes**:
   - Update HTML structure
   - Add new JavaScript functions
   - Add CSS styles

3. **Test Locally**:
   ```bash
   # Serve locally
   python3 -m http.server 8000
   # Open http://localhost:8000/student-dashboard.html
   ```

4. **Test with Real Data**:
   - Login as test student
   - Verify all features work
   - Check console for errors

5. **Deploy to Staging**:
   ```bash
   git add student-dashboard.html
   git commit -m "feat: Add grade-based progress tracking"
   git push origin staging
   ```

6. **User Acceptance Testing**:
   - Share staging URL with teachers/students
   - Gather feedback
   - Fix any issues

7. **Deploy to Production**:
   ```bash
   git checkout main
   git merge staging
   git push origin main
   # Netlify auto-deploys
   ```

---

## Troubleshooting

### Issue: Progress shows 0% for student with grades

**Check**:
1. Verify student_id in localStorage matches database
2. Check RLS policies allow student to read their grades
3. Look for console errors

**Fix**:
```javascript
// Add debug logging
console.log('Student ID:', currentStudent.id);
const { data, error } = await supabase...
console.log('Query result:', { data, error });
```

### Issue: Category breakdown doesn't load

**Check**:
1. Assignments have correct category values
2. Category values match assignment_categories.category_key
3. Check for typos (homework vs Homework)

**Fix**:
```sql
-- Normalize category values
UPDATE assignments
SET category = LOWER(TRIM(category));
```

### Issue: Real-time updates not working

**Check**:
1. Supabase Realtime is enabled
2. RLS policies allow subscription
3. WebSocket connection established

**Fix**:
```javascript
// Check subscription status
subscription.on('status', (status) => {
    console.log('Subscription status:', status);
});
```

---

## Success Metrics

**Before Implementation**:
- Student confusion: "Where are my grades?"
- Progress meaningless (lesson completion)
- No visibility into academic performance

**After Implementation**:
- Clear grade display for every subject
- Accurate weighted averages
- Category-level breakdown visible
- Real-time grade notifications
- Color-coded visual feedback

**KPIs**:
- 95%+ students can answer "What's my current grade in ELA?"
- < 5 support tickets about grade confusion per month
- 90%+ student satisfaction with grade transparency

---

## Next Features (Future Enhancements)

1. **Grade Trends**:
   - Line chart showing grade over time
   - Identify improvement or decline

2. **Predictive Analytics**:
   - "If you get 90% on next test, your grade will be 85%"
   - "You need 85% on remaining assignments for an A"

3. **Assignment Planner**:
   - Show upcoming assignments
   - Estimate time needed based on past submissions

4. **Parent Integration**:
   - Email digest of grades
   - Alert for grades below threshold

---

**Implementation Guide Prepared By**: Claude Code
**Date**: 2025-10-21
**Estimated Total Time**: 12-16 hours
**Priority**: CRITICAL
