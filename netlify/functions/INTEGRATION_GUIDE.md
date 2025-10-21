# Student Assignments API - Integration Guide

## Quick Start

This guide shows how to integrate the `get-student-assignments` serverless function into your student dashboard.

---

## 1. Basic Integration (Vanilla JavaScript)

### HTML Structure
```html
<!-- Add to student-dashboard.html -->
<div id="assignments-container">
  <div class="assignments-header">
    <h2>My Assignments</h2>
    <div class="filter-buttons">
      <button data-filter="all" class="active">All</button>
      <button data-filter="assigned">Pending</button>
      <button data-filter="submitted">Submitted</button>
      <button data-filter="graded">Graded</button>
      <button data-filter="overdue">Overdue</button>
    </div>
  </div>
  <div id="assignments-list" class="assignments-grid">
    <!-- Assignments will be rendered here -->
  </div>
</div>
```

### JavaScript Implementation
```javascript
// Get authenticated student ID from session
const studentId = getAuthenticatedUserId(); // Replace with your auth function

// State management
let currentFilter = 'all';
let assignments = [];

// Fetch assignments from API
async function fetchAssignments(filter = 'all') {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      student_id: studentId,
      limit: 50,
      sort: 'due_date'
    });

    // Add status filter if not 'all'
    if (filter !== 'all') {
      params.append('status', filter);
    }

    // Make API request
    const response = await fetch(`/api/student-assignments?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      assignments = data.assignments;
      renderAssignments(assignments);
    } else {
      showError('Failed to load assignments');
    }
  } catch (error) {
    console.error('Error fetching assignments:', error);
    showError('Unable to load assignments. Please try again.');
  }
}

// Render assignments to the DOM
function renderAssignments(assignmentList) {
  const container = document.getElementById('assignments-list');

  if (assignmentList.length === 0) {
    container.innerHTML = '<p class="no-assignments">No assignments found.</p>';
    return;
  }

  container.innerHTML = assignmentList.map(assignment => `
    <div class="assignment-card ${assignment.status}" data-id="${assignment.id}">
      <div class="assignment-header">
        <h3>${assignment.title}</h3>
        <span class="assignment-type ${assignment.type}">${assignment.type}</span>
      </div>

      <div class="assignment-subject">
        <span class="subject-badge">${formatSubjectName(assignment.subject_key)}</span>
      </div>

      ${assignment.description ? `
        <p class="assignment-description">${assignment.description}</p>
      ` : ''}

      <div class="assignment-meta">
        <div class="due-date ${getDueDateClass(assignment)}">
          <i class="icon-calendar"></i>
          ${formatDueDate(assignment)}
        </div>
        <div class="points">
          <i class="icon-star"></i>
          ${formatPoints(assignment)}
        </div>
      </div>

      ${assignment.status === 'graded' && assignment.feedback ? `
        <div class="feedback">
          <strong>Feedback:</strong>
          <p>${assignment.feedback}</p>
        </div>
      ` : ''}

      <div class="assignment-actions">
        ${getActionButton(assignment)}
      </div>
    </div>
  `).join('');

  // Add event listeners to action buttons
  attachEventListeners();
}

// Format subject name for display
function formatSubjectName(subjectKey) {
  const subjectMap = {
    '7th_civics': 'Civics',
    '7th_ela': 'English',
    '7th_math': 'Pre-Algebra',
    '7th_science': 'Life Science',
    '9th_ela': 'English',
    '9th_world_history': 'World History',
    '9th_math': 'Geometry',
    '11th_us_gvmnt': 'U.S. Government',
    '11th_ela': 'American Lit',
    '11th_math': 'Pre-Calculus'
  };
  return subjectMap[subjectKey] || subjectKey;
}

// Format due date with time remaining
function formatDueDate(assignment) {
  const dueDate = new Date(assignment.due_date);
  const formatted = dueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  if (assignment.is_late) {
    return `<span class="overdue">Overdue: ${formatted}</span>`;
  }

  if (assignment.days_until_due === 0) {
    return `<span class="due-today">Due Today: ${formatted}</span>`;
  }

  if (assignment.days_until_due === 1) {
    return `<span class="due-soon">Due Tomorrow: ${formatted}</span>`;
  }

  return `Due ${formatted} (${assignment.days_until_due}d ${assignment.hours_until_due}h)`;
}

// Get CSS class based on due date urgency
function getDueDateClass(assignment) {
  if (assignment.is_late) return 'overdue';
  if (assignment.days_until_due <= 1) return 'urgent';
  if (assignment.days_until_due <= 3) return 'soon';
  return 'normal';
}

// Format points display
function formatPoints(assignment) {
  if (assignment.grade !== null) {
    const percentage = (assignment.grade / assignment.points_possible * 100).toFixed(1);
    return `${assignment.grade}/${assignment.points_possible} (${percentage}%)`;
  }
  return `${assignment.points_possible} points`;
}

// Get appropriate action button based on status
function getActionButton(assignment) {
  switch (assignment.status) {
    case 'assigned':
    case 'overdue':
      return `<button class="btn-primary" onclick="startAssignment('${assignment.id}')">
        Start Assignment
      </button>`;
    case 'submitted':
      return `<button class="btn-secondary" onclick="viewSubmission('${assignment.id}')">
        View Submission
      </button>`;
    case 'graded':
      return `<button class="btn-success" onclick="viewGrade('${assignment.id}')">
        View Grade
      </button>`;
    default:
      return '';
  }
}

// Handle filter button clicks
function setupFilterButtons() {
  document.querySelectorAll('.filter-buttons button').forEach(button => {
    button.addEventListener('click', (e) => {
      // Update active state
      document.querySelectorAll('.filter-buttons button').forEach(btn =>
        btn.classList.remove('active')
      );
      e.target.classList.add('active');

      // Fetch with new filter
      const filter = e.target.dataset.filter;
      currentFilter = filter;
      fetchAssignments(filter);
    });
  });
}

// Action handlers (implement based on your app)
function startAssignment(assignmentId) {
  // Navigate to assignment page
  window.location.href = `/assignment.html?id=${assignmentId}`;
}

function viewSubmission(assignmentId) {
  // Navigate to submission view
  window.location.href = `/submission.html?id=${assignmentId}`;
}

function viewGrade(assignmentId) {
  // Navigate to grade view
  window.location.href = `/grade.html?id=${assignmentId}`;
}

// Error display
function showError(message) {
  const container = document.getElementById('assignments-list');
  container.innerHTML = `
    <div class="error-message">
      <i class="icon-alert"></i>
      <p>${message}</p>
      <button onclick="fetchAssignments(currentFilter)">Retry</button>
    </div>
  `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  setupFilterButtons();
  fetchAssignments('all');

  // Auto-refresh every 5 minutes
  setInterval(() => fetchAssignments(currentFilter), 5 * 60 * 1000);
});
```

---

## 2. CSS Styling

```css
/* Assignment Cards */
.assignments-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.assignments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.filter-buttons button {
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-buttons button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.filter-buttons button:hover {
  border-color: #3b82f6;
}

.assignments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.assignment-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.assignment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
}

.assignment-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.assignment-type {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.assignment-type.quiz { background: #dbeafe; color: #1e40af; }
.assignment-type.homework { background: #fef3c7; color: #92400e; }
.assignment-type.reading { background: #dcfce7; color: #166534; }
.assignment-type.video { background: #fce7f3; color: #9f1239; }
.assignment-type.activity { background: #e0e7ff; color: #3730a3; }

.subject-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
}

.assignment-description {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  margin: 12px 0;
}

.assignment-meta {
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 14px;
}

.due-date {
  display: flex;
  align-items: center;
  gap: 6px;
}

.due-date.overdue { color: #dc2626; font-weight: 600; }
.due-date.urgent { color: #ea580c; font-weight: 600; }
.due-date.soon { color: #ca8a04; }
.due-date.normal { color: #6b7280; }

.points {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
}

.feedback {
  margin: 12px 0;
  padding: 12px;
  background: #f0fdf4;
  border-left: 4px solid #22c55e;
  border-radius: 4px;
  font-size: 14px;
}

.feedback strong {
  color: #166534;
  display: block;
  margin-bottom: 4px;
}

.assignment-actions {
  margin-top: 16px;
}

.assignment-actions button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #f3f4f6;
  color: #1f2937;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-success {
  background: #22c55e;
  color: white;
}

.btn-success:hover {
  background: #16a34a;
}

.no-assignments,
.error-message {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.error-message button {
  margin-top: 12px;
  padding: 8px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* Responsive Design */
@media (max-width: 768px) {
  .assignments-grid {
    grid-template-columns: 1fr;
  }

  .assignments-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .filter-buttons {
    width: 100%;
    overflow-x: auto;
  }
}
```

---

## 3. Advanced Features

### Subject-Specific Filtering
```javascript
// Add subject filter dropdown
async function fetchAssignmentsBySubject(subjectKey) {
  const params = new URLSearchParams({
    student_id: studentId,
    class_id: subjectKey,
    limit: 50,
    sort: 'due_date'
  });

  const response = await fetch(`/api/student-assignments?${params.toString()}`);
  const data = await response.json();

  if (data.success) {
    renderAssignments(data.assignments);
  }
}
```

### Real-time Updates with Polling
```javascript
let pollInterval;

function startPolling(intervalMs = 30000) {
  pollInterval = setInterval(() => {
    fetchAssignments(currentFilter);
  }, intervalMs);
}

function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval);
  }
}

// Start polling when page is visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopPolling();
  } else {
    startPolling();
  }
});
```

### Assignment Summary Widget
```javascript
async function renderAssignmentSummary() {
  const response = await fetch(`/api/student-assignments?student_id=${studentId}&limit=100`);
  const data = await response.json();

  if (data.success) {
    const summary = {
      pending: data.assignments.filter(a => a.status === 'assigned').length,
      overdue: data.assignments.filter(a => a.status === 'overdue').length,
      submitted: data.assignments.filter(a => a.status === 'submitted').length,
      graded: data.assignments.filter(a => a.status === 'graded').length
    };

    document.getElementById('summary-widget').innerHTML = `
      <div class="summary-card">
        <div class="summary-item pending">
          <span class="count">${summary.pending}</span>
          <span class="label">Pending</span>
        </div>
        <div class="summary-item overdue">
          <span class="count">${summary.overdue}</span>
          <span class="label">Overdue</span>
        </div>
        <div class="summary-item submitted">
          <span class="count">${summary.submitted}</span>
          <span class="label">Submitted</span>
        </div>
        <div class="summary-item graded">
          <span class="count">${summary.graded}</span>
          <span class="label">Graded</span>
        </div>
      </div>
    `;
  }
}
```

---

## 4. Testing

### Test Data Setup
```javascript
// Create test assignment via Supabase
async function createTestAssignment() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data, error } = await supabase.rpc('bulk_create_assignments', {
    p_teacher_id: 'teacher-uuid',
    p_student_ids: ['student-uuid'],
    p_lesson_key: '2025-10-20_9th_ela_2',
    p_assignment_type: 'quiz',
    p_title: 'Test Quiz',
    p_description: 'Test assignment',
    p_instructions: 'Complete the quiz',
    p_due_date: new Date(Date.now() + 86400000).toISOString(), // Due tomorrow
    p_points_possible: 100
  });

  console.log('Test assignment created:', data);
}
```

### Manual Testing Checklist
- [ ] Assignments display correctly
- [ ] Filters work (all, assigned, submitted, graded, overdue)
- [ ] Due date colors match urgency
- [ ] Action buttons appear based on status
- [ ] Graded assignments show feedback
- [ ] Subject badges display correctly
- [ ] Responsive layout works on mobile
- [ ] Error handling displays properly
- [ ] Loading states work

---

## 5. Troubleshooting

### Issue: No assignments displayed
**Solution**: Check browser console for errors, verify student_id is valid

### Issue: "Method not allowed" error
**Solution**: Ensure you're using GET request, not POST

### Issue: Slow loading
**Solution**: Reduce limit parameter, check database indexes

### Issue: Stale data
**Solution**: Implement cache busting or reduce polling interval

---

## Next Steps

1. Deploy the function to Netlify
2. Test with real student data
3. Integrate into existing dashboard
4. Add authentication token validation
5. Implement assignment submission flow

---

**Need Help?** Check the [README_get-student-assignments.md](./README_get-student-assignments.md) for detailed API documentation.
