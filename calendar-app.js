// Main Calendar Application
// AI Academy @ Centner - School Calendar 2025-2026

// Global state
let currentMonth = 8; // September 2025 (0-indexed)
let currentYear = 2025;
let selectedGrade = 'all';
let selectedView = 'month';
let dayCounter = 0;
let aCounter = 0;
let bCounter = 0;

// Format date for display
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Get lesson for a specific day and subject
function getLesson(dayType, dayNum, subjectKey) {
    // Special handling for AI Awareness days
    if (dayNum <= 2 && curriculumMap['ai_awareness']) {
        const dayKey = `${dayNum}.${dayType}`;
        const aiLesson = curriculumMap['ai_awareness'][dayKey];
        if (aiLesson) return aiLesson;
    }
    
    if (!curriculumMap[subjectKey]) {
        console.log(`No curriculum found for subject: ${subjectKey}`);
        return null;
    }
    
    // Find the appropriate lesson based on day number and type
    // New format: "1.B-5.B" or "2.A-6.A"
    for (const [dayRange, lesson] of Object.entries(curriculumMap[subjectKey])) {
        if (dayRange.includes('-')) {
            // Parse range like "1.B-5.B" or "2.A-6.A"
            const parts = dayRange.split('-');
            if (parts.length === 2) {
                // Check if it's the new format with dots
                if (parts[0].includes('.') && parts[1].includes('.')) {
                    const startParts = parts[0].split('.');
                    const endParts = parts[1].split('.');
                    const startNum = Number(startParts[0]);
                    const startType = startParts[1];
                    const endNum = Number(endParts[0]);
                    const endType = endParts[1];
                    
                    // Check if current day matches the type and is within range
                    if (dayType === startType && dayType === endType) {
                        if (dayNum >= startNum && dayNum <= endNum) {
                            return lesson;
                        }
                    }
                } else {
                    // Fallback to old numeric format if still present
                    const [start, end] = dayRange.split('-').map(Number);
                    if (dayNum >= start && dayNum <= end) {
                        return lesson;
                    }
                }
            }
        } else {
            // Single day lesson - check for new format "1.B" or old format "1"
            if (dayRange.includes('.')) {
                const [num, type] = dayRange.split('.');
                if (Number(num) === dayNum && type === dayType) {
                    return lesson;
                }
            } else {
                const day = Number(dayRange);
                if (dayNum === day) {
                    return lesson;
                }
            }
        }
    }
    
    console.log(`No lesson found for ${subjectKey} on day ${dayNum}.${dayType}`);
    return null;
}

// Create day cell for calendar grid
function createDayCell(date, currentDayCount, currentACount, currentBCount) {
    const cell = document.createElement('div');
    cell.className = 'day-cell';
    
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    const scheduleInfo = schoolSchedule[dateStr];
    
    // Check if it's a weekend
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        cell.classList.add('weekend');
        cell.innerHTML = `<div class="day-number">${date.getDate()}</div>`;
        return cell;
    }
    
    // Don't show school content before Sept 8
    const sep8 = new Date('2025-09-08');
    if (date < sep8) {
        cell.classList.add('no-school');
        cell.innerHTML = `
            <div class="day-number">${date.getDate()}</div>
            <div class="text-xs text-gray-600">School starts Sept 8</div>
        `;
        return cell;
    }
    
    // Check if there's no school
    if (!scheduleInfo || !scheduleInfo.dayType) {
        cell.classList.add('no-school');
        cell.innerHTML = `
            <div class="day-number">${date.getDate()}</div>
            ${scheduleInfo?.notes ? `<div class="text-xs text-gray-600">${scheduleInfo.notes}</div>` : ''}
        `;
        return cell;
    }
    
    const dayType = scheduleInfo.dayType;
    const dayNum = dayType === 'A' ? currentACount : currentBCount;
    
    // Add appropriate class
    cell.classList.add(dayType.toLowerCase() + '-day');
    
    // Check for special days
    if (scheduleInfo.notes && scheduleInfo.notes.includes('Exam')) {
        cell.classList.add('test-day');
    }
    
    // Check if it's the last week (June 8-11)
    const lastWeekStart = new Date('2026-06-08');
    const lastWeekEnd = new Date('2026-06-11');
    const isLastWeek = date >= lastWeekStart && date <= lastWeekEnd;
    
    // Build cell content  
    // Use the total day count for display
    let cellContent = `
        <div class="day-number">${date.getDate()}</div>
        <div class="day-label ${dayType.toLowerCase()}-label">${currentDayCount}.${dayType}</div>
    `;
    
    if (isLastWeek) {
        cellContent += `<div class="period-info">
            <div class="period-title">CLEP/Test Prep</div>
            <div>Final reviews & exams</div>
        </div>`;
    } else {
        // Add period information based on selected grade
        const periods = periodSchedule[dayType];
        if (selectedGrade === 'all') {
            cellContent += '<div class="period-info">';
            Object.entries(periods).forEach(([period, grades]) => {
                const periodTime = period.split(' ')[0] + ' ' + period.split(' ')[1];
                cellContent += `<div><span class="period-title">${periodTime}:</span> `;
                const gradeList = Object.entries(grades).map(([g, subj]) => {
                    // Shorten subject names for display
                    const shortSubj = subj.replace('Literature & Composition', 'ELA')
                        .replace('Life Science (Discovery Box)', 'Science')
                        .replace('English Language Arts', 'ELA')
                        .replace('American Literature', 'Am. Lit');
                    return `${g}: ${shortSubj}`;
                }).join(', ');
                cellContent += gradeList + '</div>';
            });
            cellContent += '</div>';
        } else {
            cellContent += '<div class="period-info">';
            Object.entries(periods).forEach(([period, grades]) => {
                if (grades[selectedGrade]) {
                    const periodTime = period.split('(')[1].split(')')[0];
                    cellContent += `<div><span class="period-title">${periodTime}:</span> ${grades[selectedGrade]}</div>`;
                }
            });
            cellContent += '</div>';
        }
    }
    
    if (scheduleInfo.notes) {
        cellContent += `<div class="text-xs text-orange-600 font-semibold mt-1">${scheduleInfo.notes}</div>`;
    }
    
    cell.innerHTML = cellContent;
    
    // Add click handler for lesson details - pass the total day count
    cell.addEventListener('click', () => showLessonDetails(date, dayType, currentDayCount, currentDayCount, isLastWeek));
    
    return cell;
}

// Show lesson details in modal
function showLessonDetails(date, dayType, dayNum, totalDayCount, isLastWeek) {
    const modal = document.getElementById('lessonModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = `Day ${totalDayCount}.${dayType}`;
    modalDate.textContent = formatDate(date);
    
    let content = '';
    
    if (isLastWeek) {
        content = `
            <div class="lesson-section">
                <h4 class="lesson-title">CLEP Exam Preparation Week</h4>
                <div class="lesson-details">
                    <p><strong>Focus:</strong> Final review and CLEP exam preparation</p>
                    <ul>
                        <li>Review all major concepts from the year</li>
                        <li>Practice CLEP exam questions</li>
                        <li>Individual study sessions</li>
                        <li>One-on-one tutoring available</li>
                        <li>Portfolio completion and presentation</li>
                        <li>Final assessments and make-up work</li>
                    </ul>
                    <div class="lesson-metadata">
                        <span>📚 All subjects</span>
                        <span>✏️ Test preparation</span>
                        <span>🎯 CLEP focus</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        const periods = periodSchedule[dayType];
        
        // Show lessons for selected grade or all grades
        if (selectedGrade === 'all') {
            // Show all periods and grades
            Object.entries(periods).forEach(([period, grades]) => {
                content += `<h3 class="text-lg font-bold mb-2 text-gray-800">${period}</h3>`;
                
                Object.entries(grades).forEach(([grade, subject]) => {
                    content += `<div class="lesson-section">`;
                    content += `<h4 class="lesson-title">${grade}th Grade: ${subject}</h4>`;
                    
                    // Special handling for AI Awareness Days (Sept 8-9)
                    const isAIAwarenessDay = (date >= new Date('2025-09-08') && date <= new Date('2025-09-09'));
                    
                    if (isAIAwarenessDay && totalDayCount <= 2) {
                        const dayKey = `${totalDayCount}.${dayType}`;
                        const aiLesson = curriculumMap['ai_awareness'][dayKey];
                        if (aiLesson) {
                            content += `
                                <div class="lesson-details">
                                    <p><strong>Special Event:</strong> ${aiLesson.title}</p>
                                    <p><strong>Learning Objectives:</strong></p>
                                    <ul>${aiLesson.objectives.map(obj => `<li>${obj}</li>`).join('')}</ul>
                                    <p><strong>Materials Needed:</strong> ${aiLesson.materials}</p>
                                    <p><strong>Activities:</strong></p>
                                    <ul>${aiLesson.activities.map(act => `<li>${act}</li>`).join('')}</ul>
                                    <p><strong>Assessment:</strong> ${aiLesson.assessment}</p>
                                    <p><strong>Standards:</strong> <span class="text-sm text-blue-600">${aiLesson.standards}</span></p>`;
                            
                            // Add period-specific details if available
                            if (aiLesson.details && aiLesson.details[period]) {
                                const periodDetails = aiLesson.details[period];
                                if (periodDetails[grade]) {
                                    content += `
                                        <div class="mt-4 p-3 bg-blue-50 rounded">
                                            <p><strong>Period-Specific Activities:</strong></p>
                                            <p class="text-sm">${periodDetails[grade]}</p>
                                        </div>
                                    `;
                                }
                            }
                            
                            content += `
                                    <div class="lesson-metadata">
                                        <span>🤖 AI Awareness</span>
                                        <span>📐 ${grade}th Grade</span>
                                        <span>📅 Day ${totalDayCount}.${dayType}</span>
                                    </div>
                                </div>
                            `;
                        }
                    } else {
                        // Get lesson details based on subject
                        let subjectKey = '';
                        if (grade === '7' && subject.includes('Science')) subjectKey = '7th_science';
                        else if (grade === '7' && subject.includes('ELA')) subjectKey = '7th_ela';
                        else if (grade === '7' && subject.includes('Algebra')) subjectKey = '7th_math';
                        else if (grade === '7' && subject.includes('Civics')) subjectKey = '7th_civics';
                        else if (grade === '9' && subject.includes('ELA')) subjectKey = '9th_ela';
                        else if (grade === '9' && subject.includes('History')) subjectKey = '9th_history';
                        else if (grade === '9' && subject.includes('Geometry')) subjectKey = '9th_geometry';
                        else if (grade === '9' && subject.includes('Algebra')) subjectKey = '9th_algebra';
                        else if (grade === '11' && subject.includes('Pre-Calc')) subjectKey = '11th_precalc';
                        else if (grade === '11' && subject.includes('Government')) subjectKey = '11th_gov';
                        else if (grade === '11' && (subject.includes('Literature') || subject.includes('ELA'))) subjectKey = '11th_ela';
                        else if (grade === '11' && subject.includes('Economics')) subjectKey = '11th_econ';
                        
                        // Use totalDayCount for lesson retrieval since lessons are mapped by total day count
                        const lesson = getLesson(dayType, totalDayCount, subjectKey);
                        
                        if (lesson) {
                            content += `
                            <div class="lesson-details">
                                <p><strong>Unit:</strong> ${lesson.code} - ${lesson.title}</p>
                                <p><strong>Learning Objectives:</strong></p>
                                <ul>${lesson.objectives.map(obj => `<li>${obj}</li>`).join('')}</ul>
                                <p><strong>Materials Needed:</strong> ${lesson.materials}</p>
                                <p><strong>Class Activities:</strong></p>
                                <ul>${lesson.activities.map(act => `<li>${act}</li>`).join('')}</ul>
                                <p><strong>Assessment:</strong> ${lesson.assessment}</p>
                                <p><strong>Florida Standards:</strong> <span class="text-sm text-blue-600">${lesson.standards}</span></p>
                                <div class="lesson-metadata">
                                    <span>📐 ${grade}th Grade</span>
                                    <span>📚 ${subject}</span>
                                    <span>📅 Day ${totalDayCount}.${dayType}</span>
                                </div>
                            </div>
                        `;
                        } else {
                            content += `
                                <div class="lesson-details">
                                    <p><strong>Day ${totalDayCount}.${dayType} Curriculum</strong></p>
                                    <p class="text-gray-600">📚 ${subject}</p>
                                    <p class="text-sm text-gray-500 mt-2">Detailed lesson plan in development</p>
                                    <div class="lesson-metadata">
                                        <span>📐 ${grade}th Grade</span>
                                        <span>📅 Day ${totalDayCount}.${dayType}</span>
                                    </div>
                                </div>
                            `;
                        }
                    }
                    content += `</div>`;
                });
            });
        } else {
            // Show only selected grade
            Object.entries(periods).forEach(([period, grades]) => {
                if (grades[selectedGrade]) {
                    const subject = grades[selectedGrade];
                    content += `<div class="lesson-section">`;
                    content += `<h4 class="lesson-title">${period}: ${subject}</h4>`;
                    
                    // Get lesson details based on subject
                    let subjectKey = '';
                    if (selectedGrade === '7' && subject.includes('Science')) subjectKey = '7th_science';
                    else if (selectedGrade === '7' && subject.includes('ELA')) subjectKey = '7th_ela';
                    else if (selectedGrade === '7' && subject.includes('Algebra')) subjectKey = '7th_math';
                    else if (selectedGrade === '7' && subject.includes('Civics')) subjectKey = '7th_civics';
                    else if (selectedGrade === '9' && subject.includes('ELA')) subjectKey = '9th_ela';
                    else if (selectedGrade === '9' && subject.includes('History')) subjectKey = '9th_history';
                    else if (selectedGrade === '9' && subject.includes('Algebra')) subjectKey = '9th_algebra';
                    else if (selectedGrade === '11' && subject.includes('Pre-Calc')) subjectKey = '11th_precalc';
                    else if (selectedGrade === '11' && subject.includes('Government')) subjectKey = '11th_gov';
                    else if (selectedGrade === '11' && (subject.includes('Literature') || subject.includes('ELA'))) subjectKey = '11th_ela';
                    else if (selectedGrade === '11' && subject.includes('Economics')) subjectKey = '11th_econ';
                    
                    // Use totalDayCount for single grade view too
                    const lesson = getLesson(dayType, totalDayCount, subjectKey);
                    
                    if (lesson) {
                        content += `
                            <div class="lesson-details">
                                <p><strong>Unit:</strong> ${lesson.code} - ${lesson.title}</p>
                                <p><strong>Learning Objectives:</strong></p>
                                <ul>${lesson.objectives.map(obj => `<li>${obj}</li>`).join('')}</ul>
                                <p><strong>Materials Needed:</strong> ${lesson.materials}</p>
                                <p><strong>Class Activities:</strong></p>
                                <ul>${lesson.activities.map(act => `<li>${act}</li>`).join('')}</ul>
                                <p><strong>Assessment:</strong> ${lesson.assessment}</p>
                                <p><strong>Florida Standards:</strong> <span class="text-sm text-blue-600">${lesson.standards}</span></p>
                                <div class="lesson-metadata">
                                    <span>📐 ${selectedGrade}th Grade</span>
                                    <span>📚 ${subject}</span>
                                    <span>📅 Day ${totalDayCount}.${dayType}</span>
                                </div>
                            </div>
                        `;
                    } else {
                        content += `
                            <div class="lesson-details">
                                <p><strong>Day ${dayCounter} Curriculum</strong></p>
                                <p class="text-gray-600">📚 ${subject}</p>
                                <p class="text-sm text-gray-500 mt-2">Detailed lesson plan in development</p>
                                <div class="lesson-metadata">
                                    <span>📐 ${selectedGrade}th Grade</span>
                                    <span>📅 Day ${totalDayCount}.${dayType}</span>
                                </div>
                            </div>
                        `;
                    }
                    content += `</div>`;
                }
            });
        }
    }
    
    modalBody.innerHTML = content;
    modal.classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('lessonModal').classList.remove('show');
}

// Render calendar
function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthYearElem = document.getElementById('currentMonth');
    
    // Clear grid
    grid.innerHTML = '';
    
    // Add weekday headers
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    weekdays.forEach(day => {
        const header = document.createElement('div');
        header.className = 'weekday-header';
        header.textContent = day;
        grid.appendChild(header);
    });
    
    // Get first day of month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'day-cell weekend';
        grid.appendChild(emptyCell);
    }
    
    // Calculate running totals for days up to current month
    let runningDayCount = 0;
    let runningACount = 0;
    let runningBCount = 0;
    
    const sep8 = new Date('2025-09-08');
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    
    // Count all school days from Sep 8 up to current month
    for (let d = new Date(sep8); d < currentMonthStart; d.setDate(d.getDate() + 1)) {
        const dateStr = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
        const info = schoolSchedule[dateStr];
        if (info && info.dayType) {
            runningDayCount++;
            if (info.dayType === 'A') runningACount++;
            else if (info.dayType === 'B') runningBCount++;
        }
    }
    
    // Add days of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        const scheduleInfo = schoolSchedule[dateStr];
        
        // Increment counters BEFORE creating cell for correct numbering
        if (date >= sep8 && scheduleInfo && scheduleInfo.dayType) {
            runningDayCount++;
            if (scheduleInfo.dayType === 'A') runningACount++;
            else if (scheduleInfo.dayType === 'B') runningBCount++;
        }
        
        // Use the incremented counts for this cell
        const cell = createDayCell(date, runningDayCount, runningACount, runningBCount);
        grid.appendChild(cell);
    }
    
    // Update month/year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    monthYearElem.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Also render mobile accordion view
    renderAccordionView();
}

// Render accordion view for mobile
function renderAccordionView() {
    const container = document.getElementById('accordionContainer');
    container.innerHTML = '';
    
    // Get all school days for current month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    let tempDayCounter = 0;
    let tempACounter = 0;
    let tempBCounter = 0;
    
    // Count all days up to current month
    const startDate = new Date('2025-09-08');
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const sep8 = new Date('2025-09-08');
    
    for (let d = new Date(startDate); d < currentMonthStart; d.setDate(d.getDate() + 1)) {
        const dateStr = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
        const info = schoolSchedule[dateStr];
        if (info && info.dayType && d >= sep8) {
            tempDayCounter++;
            if (info.dayType === 'A') tempACounter++;
            else if (info.dayType === 'B') tempBCounter++;
        }
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        const scheduleInfo = schoolSchedule[dateStr];
        
        // Skip weekends and no-school days
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6 || !scheduleInfo || !scheduleInfo.dayType) {
            continue;
        }
        
        if (date >= sep8) {
            tempDayCounter++;
            const dayType = scheduleInfo.dayType;
            if (dayType === 'A') tempACounter++;
            else if (dayType === 'B') tempBCounter++;
        }
        
        const dayType = scheduleInfo.dayType;
        
        // Create accordion item
        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item';
        
        const header = document.createElement('div');
        header.className = 'accordion-header';
        header.innerHTML = `
            <div>
                <strong>${formatDate(date)}</strong>
                <div class="text-sm text-gray-600">Day ${tempDayCounter}.${dayType}</div>
                ${scheduleInfo.notes ? `<div class="text-xs text-orange-600">${scheduleInfo.notes}</div>` : ''}
            </div>
            <span>▼</span>
        `;
        
        const content = document.createElement('div');
        content.className = 'accordion-content';
        
        const body = document.createElement('div');
        body.className = 'accordion-body';
        
        // Add lesson content
        const periods = periodSchedule[dayType];
        let bodyContent = '';
        
        if (selectedGrade === 'all') {
            Object.entries(periods).forEach(([period, grades]) => {
                bodyContent += `<h4 class="font-bold mb-2">${period}</h4>`;
                Object.entries(grades).forEach(([grade, subject]) => {
                    bodyContent += `<div class="mb-2">
                        <span class="font-semibold">${grade}th:</span> ${subject}
                    </div>`;
                });
            });
        } else {
            Object.entries(periods).forEach(([period, grades]) => {
                if (grades[selectedGrade]) {
                    bodyContent += `<div class="mb-2">
                        <span class="font-semibold">${period}:</span> ${grades[selectedGrade]}
                    </div>`;
                }
            });
        }
        
        // Add view details button with correct dayCounter
        bodyContent += `<button class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm" 
            onclick="showLessonDetails(new Date('${date}'), '${dayType}', ${tempDayCounter}, ${tempDayCounter}, false)">
            View Full Lesson Details
        </button>`;
        
        body.innerHTML = bodyContent;
        content.appendChild(body);
        
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            content.classList.toggle('show');
        });
        
        accordionItem.appendChild(header);
        accordionItem.appendChild(content);
        container.appendChild(accordionItem);
    }
}

// Initialize calendar on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial month to September 2025
    currentMonth = 8;
    currentYear = 2025;
    
    renderCalendar();
    
    // Navigation buttons
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        // Don't go before September 2025
        if (currentYear < 2025 || (currentYear === 2025 && currentMonth < 8)) {
            currentMonth = 8;
            currentYear = 2025;
        }
        renderCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        // Don't go after June 2026
        if (currentYear > 2026 || (currentYear === 2026 && currentMonth > 5)) {
            currentMonth = 5;
            currentYear = 2026;
        }
        renderCalendar();
    });
    
    // Grade filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedGrade = btn.dataset.grade;
            renderCalendar();
        });
    });
    
    // View selectors (future implementation)
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedView = btn.dataset.view;
            // TODO: Implement week and day views
            if (selectedView === 'week') {
                alert('Week view coming soon! This will show a detailed weekly schedule.');
            } else if (selectedView === 'day') {
                alert('Day view coming soon! This will show today\'s detailed schedule.');
            }
            renderCalendar();
        });
    });
    
    // Modal close handlers
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('lessonModal');
        if (event.target === modal) {
            closeModal();
        }
    });
});