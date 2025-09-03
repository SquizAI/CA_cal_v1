// Parse the actual school calendar from CSV data
const schoolCalendar = {
    // School year info
    startDate: '2025-09-03',
    endDate: '2026-06-11',
    lastWeekStart: '2026-06-08',
    
    // Quarter dates
    quarters: {
        Q1: { start: '2025-09-03', end: '2025-11-07', days: 46 },
        Q2: { start: '2025-11-10', end: '2026-01-30', days: 42 },
        Q3: { start: '2026-02-02', end: '2026-04-10', days: 43 },
        Q4: { start: '2026-04-13', end: '2026-06-11', days: 43 }
    },
    
    // Total school days: 174 (not 180 as originally thought)
    totalDays: 174,
    aDays: 87,
    bDays: 87,
    
    // Special days with correct dates
    specialDays: new Map([
        // No School Days
        ['2025-09-23', { type: 'No School', name: 'No School' }],
        ['2025-10-02', { type: 'No School', name: 'No School' }],
        ['2025-11-11', { type: 'No School', name: 'Veterans Day' }],
        ['2026-01-05', { type: 'No School', name: 'No School' }],
        ['2026-01-19', { type: 'No School', name: 'MLK Day' }],
        ['2026-02-16', { type: 'No School', name: 'Presidents Day' }],
        ['2026-04-03', { type: 'No School', name: 'No School' }],
        ['2026-05-25', { type: 'No School', name: 'Memorial Day' }],
        ['2026-06-12', { type: 'No School', name: 'Summer Break Begins' }],
        
        // Thanksgiving Break (Nov 24-28)
        ['2025-11-24', { type: 'No School', name: 'Thanksgiving Break' }],
        ['2025-11-25', { type: 'No School', name: 'Thanksgiving Break' }],
        ['2025-11-26', { type: 'No School', name: 'Thanksgiving Break' }],
        ['2025-11-27', { type: 'No School', name: 'Thanksgiving Break' }],
        ['2025-11-28', { type: 'No School', name: 'Thanksgiving Break' }],
        
        // Winter Break (Dec 22 - Jan 2)
        ['2025-12-22', { type: 'No School', name: 'Winter Break' }],
        ['2025-12-23', { type: 'No School', name: 'Winter Break' }],
        ['2025-12-24', { type: 'No School', name: 'Winter Break' }],
        ['2025-12-25', { type: 'No School', name: 'Winter Break' }],
        ['2025-12-26', { type: 'No School', name: 'Winter Break' }],
        ['2025-12-29', { type: 'No School', name: 'Winter Break' }],
        ['2025-12-30', { type: 'No School', name: 'Winter Break' }],
        ['2025-12-31', { type: 'No School', name: 'Winter Break' }],
        ['2026-01-01', { type: 'No School', name: 'Winter Break' }],
        ['2026-01-02', { type: 'No School', name: 'Winter Break' }],
        
        // Spring Break (Mar 23-27)
        ['2026-03-23', { type: 'No School', name: 'Spring Break' }],
        ['2026-03-24', { type: 'No School', name: 'Spring Break' }],
        ['2026-03-25', { type: 'No School', name: 'Spring Break' }],
        ['2026-03-26', { type: 'No School', name: 'Spring Break' }],
        ['2026-03-27', { type: 'No School', name: 'Spring Break' }],
        
        // Noon Dismissal Days
        ['2025-10-31', { type: 'Noon Dismissal', name: 'Halloween - Noon Dismissal' }],
        ['2025-12-05', { type: 'Noon Dismissal', name: 'Noon Dismissal' }],
        ['2025-12-19', { type: 'Noon Dismissal', name: 'Winter Break Eve - Noon Dismissal' }],
        ['2026-05-22', { type: 'Noon Dismissal', name: 'Noon Dismissal' }],
        ['2026-06-11', { type: 'Noon Dismissal', name: 'Last Day - Noon Dismissal' }]
    ]),
    
    // A/B Day Schedule (parsed from CSV)
    daySchedule: [
        // September 2025
        { date: '2025-09-03', type: 'A', dayNum: 1 },
        { date: '2025-09-04', type: 'B', dayNum: 1 },
        { date: '2025-09-05', type: 'A', dayNum: 2 },
        { date: '2025-09-08', type: 'B', dayNum: 2 },
        { date: '2025-09-09', type: 'A', dayNum: 3 },
        { date: '2025-09-10', type: 'B', dayNum: 3 },
        { date: '2025-09-11', type: 'A', dayNum: 4 },
        { date: '2025-09-12', type: 'B', dayNum: 4 },
        { date: '2025-09-15', type: 'A', dayNum: 5 },
        { date: '2025-09-16', type: 'B', dayNum: 5 },
        { date: '2025-09-17', type: 'A', dayNum: 6 },
        { date: '2025-09-18', type: 'B', dayNum: 6 },
        { date: '2025-09-19', type: 'A', dayNum: 7 },
        { date: '2025-09-22', type: 'B', dayNum: 7 },
        // Skip Sep 23 (No School)
        { date: '2025-09-24', type: 'A', dayNum: 8 },
        { date: '2025-09-25', type: 'B', dayNum: 8 },
        { date: '2025-09-26', type: 'A', dayNum: 9 },
        { date: '2025-09-29', type: 'B', dayNum: 9 },
        { date: '2025-09-30', type: 'A', dayNum: 10 },
        // Continue pattern...
    ]
};

// Updated curriculum for 174 days (87 A days, 87 B days)
const updatedCurriculum = {
    // A Day Classes (87 days total)
    '9th_ela': {
        '1-5': '9_ela_1.1.1: Literary Elements',
        '6-10': '9_ela_1.1.2: Narrative Structure',
        '11-15': '9_ela_1.1.3: Character Analysis',
        '16-20': '9_ela_1.2.1: Theme Development',
        '21': 'Q1 EXAM REVIEW',
        '22': 'Q1 EXAM',
        '23-27': '9_ela_2.1.1: Romeo & Juliet Act I',
        '28-32': '9_ela_2.1.2: Romeo & Juliet Act II-III',
        '33-37': '9_ela_2.1.3: Romeo & Juliet Act IV-V',
        '38-40': '9_ela_3.1.1: Essay Structure',
        '41': 'MIDTERM REVIEW',
        '42': 'MIDTERM EXAM',
        '43-47': '9_ela_3.1.2: Argument Writing',
        '48-52': '9_ela_3.1.3: Research Methods',
        '53-57': '9_ela_4.1.1: Poetry Forms',
        '58-62': '9_ela_4.1.2: Poetic Devices',
        '63': 'Q3 EXAM REVIEW',
        '64': 'Q3 EXAM',
        '65-69': '9_ela_5.1.1: Novel Study',
        '70-74': '9_ela_5.1.2: Literary Criticism',
        '75-79': '9_ela_5.1.3: Final Project',
        '80-82': '9_ela_6.1.1: EOC Review',
        '83': 'Q4 EXAM REVIEW',
        '84': 'Q4 EXAM',
        '85': 'FINAL EXAM REVIEW',
        '86': 'FINAL EXAM',
        '87': 'CLEP PREP/PORTFOLIO REVIEW'
    },
    
    // Last week (June 8-11) curriculum for all subjects
    lastWeekActivities: {
        'June 8 (A Day)': {
            period1: 'CLEP English Literature Practice Exam',
            period2: 'CLEP Precalculus Practice Exam',
            period3: 'AP Biology Practice Exam Section'
        },
        'June 9 (B Day)': {
            period1: 'AP World History Practice Exam',
            period2: 'CLEP American Literature Practice',
            period3: 'FSA Math Practice Test'
        },
        'June 10 (A Day)': {
            period1: 'Portfolio Presentations',
            period2: 'CLEP Test Registration',
            period3: 'Summer Prep & Goal Setting'
        },
        'June 11 (B Day - Noon Dismissal)': {
            period1: 'Awards & Recognition',
            period2: 'Final Portfolios Due',
            period3: 'Celebration & Farewell'
        }
    }
};

// Test dates aligned with quarter ends
const testSchedule = {
    Q1: {
        endDate: '2025-11-07',
        examDates: {
            review: '2025-11-05', // Wednesday A Day
            exam: '2025-11-06'    // Thursday A Day
        }
    },
    Q2: {
        endDate: '2026-01-30',
        examDates: {
            midtermReview: '2026-01-28', // Wednesday B Day
            midtermExam: '2026-01-29'    // Thursday A Day
        }
    },
    Q3: {
        endDate: '2026-04-10',
        examDates: {
            review: '2026-04-08', // Wednesday A Day
            exam: '2026-04-09'    // Thursday B Day
        }
    },
    Q4: {
        endDate: '2026-06-11',
        examDates: {
            review: '2026-06-03', // Wednesday B Day
            exam: '2026-06-04',   // Thursday A Day
            finalReview: '2026-06-05', // Friday B Day
            eocPractice: '2026-06-08', // Monday A Day (Last week)
            clepPrep: '2026-06-09-11'  // Tue-Thu (Last week)
        }
    }
};

module.exports = { schoolCalendar, updatedCurriculum, testSchedule };