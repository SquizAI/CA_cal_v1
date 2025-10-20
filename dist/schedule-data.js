// Parsed School Calendar for 2025-2026
const schoolCalendar = {
    startDate: '2025-09-03',
    endDate: '2026-06-11',
    
    quarters: {
        Q1: { start: '2025-09-03', end: '2025-11-07', days: 46 },
        Q2: { start: '2025-11-10', end: '2026-01-30', days: 42 },
        Q3: { start: '2026-02-02', end: '2026-04-10', days: 43 },
        Q4: { start: '2026-04-13', end: '2026-06-11', days: 43 }
    },
    
    totalDays: 174,
    aDays: 87,
    bDays: 87,
    
    // All no-school days and breaks
    noSchoolDays: new Set([
        '2025-09-23', '2025-10-02', '2025-11-11', '2026-01-05', '2026-01-19',
        '2026-02-16', '2026-04-03', '2026-05-25',
        // Thanksgiving Break
        '2025-11-24', '2025-11-25', '2025-11-26', '2025-11-27', '2025-11-28',
        // Winter Break
        '2025-12-22', '2025-12-23', '2025-12-24', '2025-12-25', '2025-12-26',
        '2025-12-29', '2025-12-30', '2025-12-31', '2026-01-01', '2026-01-02',
        // Spring Break
        '2026-03-23', '2026-03-24', '2026-03-25', '2026-03-26', '2026-03-27',
        // Summer starts
        '2026-06-12'
    ]),
    
    noonDismissals: new Set([
        '2025-10-31', '2025-12-05', '2025-12-19', '2026-05-22', '2026-06-11'
    ]),
    
    // Test schedule aligned with quarters
    testDays: {
        'Q1 Review': '2025-11-05',
        'Q1 Exam': '2025-11-06',
        'Midterm Review': '2026-01-28',
        'Midterm Exam': '2026-01-29',
        'Q3 Review': '2026-04-08',
        'Q3 Exam': '2026-04-09',
        'Q4 Review': '2026-06-03',
        'Q4 Exam': '2026-06-04',
        'Final Review': '2026-06-05'
    }
};

// Function to determine if a date is an A or B day
function getABDay(dateStr) {
    // Parse as local date to avoid timezone issues
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const startDate = new Date(2025, 8, 3); // Sept 3, 2025
    const dayOfWeek = date.getDay();

    // Skip weekends FIRST
    if (dayOfWeek === 0 || dayOfWeek === 6) return null;

    // Skip non-school days
    if (schoolCalendar.noSchoolDays.has(dateStr)) return null;

    // Count actual school days from start
    let schoolDayCount = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= date) {
        const currentYear = currentDate.getFullYear();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
        const currentDay = String(currentDate.getDate()).padStart(2, '0');
        const currentStr = `${currentYear}-${currentMonth}-${currentDay}`;
        const currentDayOfWeek = currentDate.getDay();

        // Skip weekends and no-school days
        if (currentDayOfWeek !== 0 && currentDayOfWeek !== 6 && !schoolCalendar.noSchoolDays.has(currentStr)) {
            schoolDayCount++;
            if (currentStr === dateStr) break;
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Pattern: 1.A, 1.B, 2.A, 2.B, 3.A, 3.B...
    // Odd school days = A, Even school days = B
    return schoolDayCount > 0 ? (schoolDayCount % 2 === 1 ? 'A' : 'B') : null;
}

// Get the day pair number (1.A/1.B = 1, 2.A/2.B = 2, etc.)
function getDayNumber(dateStr, dayType) {
    // Parse as local date to avoid timezone issues
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const startDate = new Date(2025, 8, 3); // Sept 3, 2025

    // Don't return day numbers for dates before school starts
    if (date < startDate) return 0;

    let totalSchoolDays = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= date) {
        const currentYear = currentDate.getFullYear();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
        const currentDay = String(currentDate.getDate()).padStart(2, '0');
        const currentStr = `${currentYear}-${currentMonth}-${currentDay}`;
        const dayOfWeek = currentDate.getDay();
        
        // Skip weekends and no-school days
        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !schoolCalendar.noSchoolDays.has(currentStr)) {
            totalSchoolDays++;
        }
        
        if (currentStr === dateStr) break;
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Calculate the pair number: Days 1-2 = pair 1, Days 3-4 = pair 2, etc.
    return Math.ceil(totalSchoolDays / 2);
}

// Updated curriculum mapping for 87 A days and 87 B days
const curriculum = {
    // 7th Grade Science (A Days)
    '7th_science': {
        '1-5': '7_sci_1.1: Cell Theory & Structure',
        '6-10': '7_sci_1.2: Human Body Systems',
        '11-15': '7_sci_1.3: Genetics & Heredity',
        '16-20': '7_sci_2.1: Biodiversity & Classification',
        '21': 'Q1 EXAM REVIEW',
        '22': 'Q1 EXAM',
        '23-27': '7_sci_2.2: Ecosystems & Energy Flow',
        '28-32': '7_sci_2.3: Human Impact on Environment',
        '33-37': '7_sci_3.1: Evolution & Natural Selection',
        '38-40': '7_sci_3.2: Adaptation & Survival',
        '41': 'MIDTERM REVIEW',
        '42': 'MIDTERM EXAM',
        '43-47': '7_sci_4.1: Earth Systems & Cycles',
        '48-52': '7_sci_4.2: Weather & Climate',
        '53-57': '7_sci_5.1: Matter & Energy',
        '58-62': '7_sci_5.2: Chemical Reactions',
        '63': 'Q3 EXAM REVIEW',
        '64': 'Q3 EXAM',
        '65-69': '7_sci_6.1: Forces & Motion',
        '70-74': '7_sci_6.2: Energy Transformations',
        '75-79': '7_sci_7.1: Scientific Method & Inquiry',
        '80-82': '7_sci_7.2: EOC Review',
        '83': 'Q4 EXAM REVIEW',
        '84': 'Q4 EXAM',
        '85': 'FINAL EXAM REVIEW',
        '86': 'FINAL EXAM',
        '87': 'PORTFOLIO PRESENTATIONS'
    },
    
    // 7th Grade Civics (B Days)
    '7th_civics': {
        '1-5': '7_civ_1.1: Foundations of Government',
        '6-10': '7_civ_1.2: Declaration & Constitution',
        '11-15': '7_civ_1.3: Bill of Rights',
        '16-20': '7_civ_2.1: Three Branches',
        '21': 'Q1 EXAM REVIEW',
        '22': 'Q1 EXAM',
        '23-27': '7_civ_2.2: Checks and Balances',
        '28-32': '7_civ_2.3: Federalism',
        '33-37': '7_civ_3.1: Citizenship & Rights',
        '38-40': '7_civ_3.2: Civil Rights Movement',
        '41': 'MIDTERM REVIEW',
        '42': 'MIDTERM EXAM',
        '43-47': '7_civ_4.1: Political Parties',
        '48-52': '7_civ_4.2: Elections & Voting',
        '53-57': '7_civ_5.1: State & Local Government',
        '58-62': '7_civ_5.2: Public Policy',
        '63': 'Q3 EXAM REVIEW',
        '64': 'Q3 EXAM',
        '65-69': '7_civ_6.1: Economics & Government',
        '70-74': '7_civ_6.2: Foreign Policy',
        '75-79': '7_civ_7.1: Current Events',
        '80-82': '7_civ_7.2: EOC Review',
        '83': 'Q4 EXAM REVIEW',
        '84': 'Q4 EXAM',
        '85': 'FINAL EXAM REVIEW',
        '86': 'FINAL EXAM',
        '87': 'CIVIC ACTION PRESENTATIONS'
    },
    
    // 9th Grade ELA (A Days)
    '9th_ela': {
        '1-5': '9_ela_1.1: Literary Elements',
        '6-10': '9_ela_1.2: Narrative Structure',
        '11-15': '9_ela_1.3: Character Analysis',
        '16-20': '9_ela_2.1: Theme Development',
        '21': 'Q1 EXAM REVIEW',
        '22': 'Q1 EXAM',
        '23-27': '9_ela_2.2: Romeo & Juliet Act I',
        '28-32': '9_ela_2.3: Romeo & Juliet Act II-III',
        '33-37': '9_ela_3.1: Romeo & Juliet Act IV-V',
        '38-40': '9_ela_3.2: Essay Structure',
        '41': 'MIDTERM REVIEW',
        '42': 'MIDTERM EXAM',
        '43-47': '9_ela_4.1: Argument Writing',
        '48-52': '9_ela_4.2: Research Methods',
        '53-57': '9_ela_5.1: Poetry Forms',
        '58-62': '9_ela_5.2: Poetic Devices',
        '63': 'Q3 EXAM REVIEW',
        '64': 'Q3 EXAM',
        '65-69': '9_ela_6.1: Novel Study',
        '70-74': '9_ela_6.2: Literary Criticism',
        '75-79': '9_ela_7.1: Final Project',
        '80-82': '9_ela_7.2: EOC Review',
        '83': 'Q4 EXAM REVIEW',
        '84': 'Q4 EXAM',
        '85': 'FINAL EXAM REVIEW',
        '86': 'FINAL EXAM',
        '87': 'PORTFOLIO PRESENTATIONS'
    },
    
    // 9th Grade World History (B Days)
    '9th_history': {
        '1-5': '9_hist_1.1: Ancient Civilizations',
        '6-10': '9_hist_1.2: Classical Greece & Rome',
        '11-15': '9_hist_1.3: Fall of Rome',
        '16-20': '9_hist_2.1: Medieval Europe',
        '21': 'Q1 EXAM REVIEW',
        '22': 'Q1 EXAM',
        '23-27': '9_hist_2.2: Renaissance',
        '28-32': '9_hist_2.3: Reformation',
        '33-37': '9_hist_3.1: Age of Exploration',
        '38-40': '9_hist_3.2: Colonial Era',
        '41': 'MIDTERM REVIEW',
        '42': 'MIDTERM EXAM',
        '43-47': '9_hist_4.1: Enlightenment',
        '48-52': '9_hist_4.2: Revolutions',
        '53-57': '9_hist_5.1: Industrial Revolution',
        '58-62': '9_hist_5.2: Imperialism',
        '63': 'Q3 EXAM REVIEW',
        '64': 'Q3 EXAM',
        '65-69': '9_hist_6.1: World War I',
        '70-74': '9_hist_6.2: World War II',
        '75-79': '9_hist_7.1: Cold War',
        '80-82': '9_hist_7.2: Modern World',
        '83': 'Q4 EXAM REVIEW',
        '84': 'Q4 EXAM',
        '85': 'FINAL EXAM REVIEW',
        '86': 'FINAL EXAM',
        '87': 'HISTORY FAIR PRESENTATIONS'
    },
    
    // 11th Grade PreCalculus (A Days)
    '11th_precalc': {
        '1-5': '11_calc_1.1: Functions & Graphs',
        '6-10': '11_calc_1.2: Polynomial Functions',
        '11-15': '11_calc_1.3: Rational Functions',
        '16-20': '11_calc_2.1: Exponential Functions',
        '21': 'Q1 EXAM REVIEW',
        '22': 'Q1 EXAM',
        '23-27': '11_calc_2.2: Logarithmic Functions',
        '28-32': '11_calc_2.3: Trigonometric Functions',
        '33-37': '11_calc_3.1: Trigonometric Identities',
        '38-40': '11_calc_3.2: Vectors',
        '41': 'MIDTERM REVIEW',
        '42': 'MIDTERM EXAM',
        '43-47': '11_calc_4.1: Sequences & Series',
        '48-52': '11_calc_4.2: Limits Introduction',
        '53-57': '11_calc_5.1: Derivative Concepts',
        '58-62': '11_calc_5.2: Basic Derivatives',
        '63': 'Q3 EXAM REVIEW',
        '64': 'Q3 EXAM',
        '65-69': '11_calc_6.1: Applications of Derivatives',
        '70-74': '11_calc_6.2: Integration Intro',
        '75-79': '11_calc_7.1: Calculus Applications',
        '80-82': '11_calc_7.2: CLEP Prep',
        '83': 'Q4 EXAM REVIEW',
        '84': 'Q4 EXAM',
        '85': 'FINAL EXAM REVIEW',
        '86': 'FINAL EXAM',
        '87': 'CLEP PRACTICE EXAM'
    },
    
    // 11th Grade Economics (B Days)
    '11th_econ': {
        '1-5': '11_econ_1.1: Economic Fundamentals',
        '6-10': '11_econ_1.2: Supply & Demand',
        '11-15': '11_econ_1.3: Market Structures',
        '16-20': '11_econ_2.1: Consumer Economics',
        '21': 'Q1 EXAM REVIEW',
        '22': 'Q1 EXAM',
        '23-27': '11_econ_2.2: Business & Labor',
        '28-32': '11_econ_2.3: Money & Banking',
        '33-37': '11_econ_3.1: Federal Reserve',
        '38-40': '11_econ_3.2: Fiscal Policy',
        '41': 'MIDTERM REVIEW',
        '42': 'MIDTERM EXAM',
        '43-47': '11_econ_4.1: Economic Indicators',
        '48-52': '11_econ_4.2: International Trade',
        '53-57': '11_econ_5.1: Globalization',
        '58-62': '11_econ_5.2: Economic Development',
        '63': 'Q3 EXAM REVIEW',
        '64': 'Q3 EXAM',
        '65-69': '11_econ_6.1: Personal Finance',
        '70-74': '11_econ_6.2: Investing',
        '75-79': '11_econ_7.1: Economic Systems',
        '80-82': '11_econ_7.2: CLEP Prep',
        '83': 'Q4 EXAM REVIEW',
        '84': 'Q4 EXAM',
        '85': 'FINAL EXAM REVIEW',
        '86': 'FINAL EXAM',
        '87': 'CLEP PRACTICE EXAM'
    }
};

// Last week special activities (June 8-11, 2026)
const lastWeekSchedule = {
    '2026-06-08': { // Monday A Day
        type: 'A',
        activities: {
            'Period 1': 'CLEP English Literature Practice Exam',
            'Period 2': 'CLEP PreCalculus Practice Exam', 
            'Period 3': 'AP Biology Practice Exam',
            'Period 4': 'Portfolio Review & Completion'
        }
    },
    '2026-06-09': { // Tuesday B Day
        type: 'B',
        activities: {
            'Period 1': 'AP World History Practice Exam',
            'Period 2': 'CLEP Economics Practice Exam',
            'Period 3': 'Florida EOC Practice Tests',
            'Period 4': 'Test Score Analysis & Planning'
        }
    },
    '2026-06-10': { // Wednesday A Day
        type: 'A',
        activities: {
            'Period 1': 'Final Portfolio Presentations',
            'Period 2': 'CLEP Test Registration & Scheduling',
            'Period 3': 'Summer Learning Plans',
            'Period 4': 'Academic Awards Preparation'
        }
    },
    '2026-06-11': { // Thursday B Day - Noon Dismissal
        type: 'B',
        activities: {
            'Period 1': 'Awards & Recognition Ceremony',
            'Period 2': 'Final Portfolio Submissions',
            'Noon': 'Celebration & Farewell'
        }
    }
};

// Function to get lesson for a specific day
function getLesson(subject, dateStr) {
    // Check if it's the last week
    const date = new Date(dateStr);
    if (date >= new Date('2026-06-08') && date <= new Date('2026-06-11')) {
        const daySchedule = lastWeekSchedule[dateStr];
        if (daySchedule) {
            return Object.entries(daySchedule.activities)
                .map(([period, activity]) => `${period}: ${activity}`)
                .join('<br>');
        }
        return '';
    }
    
    // Check if it's a test day
    for (const [testName, testDate] of Object.entries(schoolCalendar.testDays)) {
        if (testDate === dateStr) {
            return `<strong>${testName}</strong>`;
        }
    }
    
    // Get regular lesson
    const dayType = getABDay(dateStr);
    if (!dayType) return '';
    
    const dayNumber = getDayNumber(dateStr, dayType);
    if (!dayNumber) return '';
    
    const subjectCurriculum = curriculum[subject];
    if (!subjectCurriculum) return '';
    
    // Find the lesson for this day number
    for (const [range, lesson] of Object.entries(subjectCurriculum)) {
        if (range.includes('-')) {
            const [start, end] = range.split('-').map(Number);
            if (dayNumber >= start && dayNumber <= end) {
                return lesson;
            }
        } else {
            const singleDay = parseInt(range);
            if (dayNumber === singleDay) {
                return lesson;
            }
        }
    }
    
    return '';
}

// Generate window.scheduleData for curriculum-sequencing.html
(function() {
    const scheduleData = [];
    const startDate = new Date('2025-09-03');
    const endDate = new Date('2026-06-11');

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        const dayOfWeek = currentDate.getDay();

        const dayType = getABDay(dateStr);
        const dayNumber = dayType ? getDayNumber(dateStr, dayType) : 0;
        const isSchoolDay = dayType !== null;

        scheduleData.push({
            date: dateStr,
            isSchoolDay,
            dayType,
            dayNumber,
            dayOfWeek,
            isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
            isNoSchool: schoolCalendar.noSchoolDays.has(dateStr),
            isNoonDismissal: schoolCalendar.noonDismissals.has(dateStr)
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Expose globally
    window.scheduleData = scheduleData;
    window.schoolCalendar = schoolCalendar;
    window.getABDay = getABDay;
    window.getDayNumber = getDayNumber;
    window.getLesson = getLesson;
})();