// CSV Data parsed from the official school calendar
const csvData = `Date,A/B Day,Notes
9/3/2025,A,First Day of School
9/4/2025,B,
9/5/2025,A,
9/8/2025,B,Day 1 - First official day count
9/9/2025,A,
9/10/2025,B,
9/11/2025,A,
9/12/2025,B,
9/15/2025,A,
9/16/2025,B,
9/17/2025,A,
9/18/2025,B,
9/19/2025,A,
9/22/2025,B,
9/23/2025,,No School - Teacher Workday
9/24/2025,A,
9/25/2025,B,
9/26/2025,A,
9/29/2025,B,
9/30/2025,A,
10/1/2025,B,
10/2/2025,,No School - PD Day
10/3/2025,A,
10/6/2025,B,
10/7/2025,A,
10/8/2025,B,
10/9/2025,A,
10/10/2025,B,
10/13/2025,A,
10/14/2025,B,
10/15/2025,A,
10/16/2025,B,
10/17/2025,A,
10/20/2025,B,
10/21/2025,A,
10/22/2025,B,
10/23/2025,A,
10/24/2025,B,
10/27/2025,A,
10/28/2025,B,
10/29/2025,A,
10/30/2025,B,
10/31/2025,A,Noon Dismissal - Halloween
11/3/2025,B,
11/4/2025,A,
11/5/2025,B,Q1 Exam Day 1
11/6/2025,A,Q1 Exam Day 2
11/7/2025,B,
11/10/2025,A,
11/11/2025,,No School - Veterans Day
11/12/2025,B,
11/13/2025,A,
11/14/2025,B,
11/17/2025,A,
11/18/2025,B,
11/19/2025,A,
11/20/2025,B,
11/21/2025,A,
11/24/2025,,Thanksgiving Break
11/25/2025,,Thanksgiving Break
11/26/2025,,Thanksgiving Break
11/27/2025,,Thanksgiving Break
11/28/2025,,Thanksgiving Break
12/1/2025,B,
12/2/2025,A,
12/3/2025,B,
12/4/2025,A,
12/5/2025,B,Noon Dismissal
12/8/2025,A,
12/9/2025,B,
12/10/2025,A,
12/11/2025,B,
12/12/2025,A,
12/15/2025,B,
12/16/2025,A,
12/17/2025,B,
12/18/2025,A,
12/19/2025,B,Noon Dismissal - Winter Break Begins
12/22/2025,,Winter Break
12/23/2025,,Winter Break
12/24/2025,,Winter Break
12/25/2025,,Winter Break - Christmas
12/26/2025,,Winter Break
12/29/2025,,Winter Break
12/30/2025,,Winter Break
12/31/2025,,Winter Break
1/1/2026,,Winter Break - New Year
1/2/2026,,Winter Break
1/5/2026,,No School - Teacher Workday
1/6/2026,A,
1/7/2026,B,
1/8/2026,A,
1/9/2026,B,
1/12/2026,A,
1/13/2026,B,
1/14/2026,A,
1/15/2026,B,
1/16/2026,A,
1/19/2026,,No School - MLK Day
1/20/2026,B,
1/21/2026,A,
1/22/2026,B,
1/23/2026,A,
1/26/2026,B,
1/27/2026,A,
1/28/2026,B,Midterm Day 1
1/29/2026,A,Midterm Day 2
1/30/2026,B,
2/2/2026,A,
2/3/2026,B,
2/4/2026,A,
2/5/2026,B,
2/6/2026,A,
2/9/2026,B,
2/10/2026,A,
2/11/2026,B,
2/12/2026,A,
2/13/2026,B,
2/16/2026,,No School - Presidents Day
2/17/2026,A,
2/18/2026,B,
2/19/2026,A,
2/20/2026,B,
2/23/2026,A,
2/24/2026,B,
2/25/2026,A,
2/26/2026,B,
2/27/2026,A,
3/2/2026,B,
3/3/2026,A,
3/4/2026,B,
3/5/2026,A,
3/6/2026,B,
3/9/2026,A,
3/10/2026,B,
3/11/2026,A,
3/12/2026,B,
3/13/2026,A,
3/16/2026,B,
3/17/2026,A,
3/18/2026,B,
3/19/2026,A,
3/20/2026,B,
3/23/2026,,Spring Break
3/24/2026,,Spring Break
3/25/2026,,Spring Break
3/26/2026,,Spring Break
3/27/2026,,Spring Break
3/30/2026,A,
3/31/2026,B,
4/1/2026,A,
4/2/2026,B,
4/3/2026,,No School - PD Day
4/6/2026,A,
4/7/2026,B,
4/8/2026,A,Q3 Exam Day 1
4/9/2026,B,Q3 Exam Day 2
4/10/2026,A,
4/13/2026,B,
4/14/2026,A,
4/15/2026,B,
4/16/2026,A,
4/17/2026,B,
4/20/2026,A,
4/21/2026,B,
4/22/2026,A,
4/23/2026,B,
4/24/2026,A,
4/27/2026,B,
4/28/2026,A,
4/29/2026,B,
4/30/2026,A,
5/1/2026,B,
5/4/2026,A,
5/5/2026,B,
5/6/2026,A,
5/7/2026,B,
5/8/2026,A,
5/11/2026,B,
5/12/2026,A,
5/13/2026,B,
5/14/2026,A,
5/15/2026,B,
5/18/2026,A,
5/19/2026,B,
5/20/2026,A,
5/21/2026,B,
5/22/2026,A,Noon Dismissal
5/25/2026,,No School - Memorial Day
5/26/2026,B,
5/27/2026,A,
5/28/2026,B,
5/29/2026,A,
6/1/2026,B,
6/2/2026,A,
6/3/2026,B,Finals Day 1
6/4/2026,A,Finals Day 2
6/5/2026,B,Finals Day 3
6/8/2026,A,CLEP/Test Prep Week
6/9/2026,B,CLEP/Test Prep Week
6/10/2026,A,CLEP/Test Prep Week
6/11/2026,B,Last Day - Noon Dismissal`;

// Parse CSV into a schedule object
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const schedule = {};
    lines.slice(1).forEach(line => {
        const [date, dayType, notes] = line.split(',');
        const dateObj = new Date(date);
        schedule[date] = { dayType: dayType || '', notes: notes || '' };
    });
    return schedule;
}

const schoolSchedule = parseCSV(csvData);

// Period Schedule (from AI Lab actual schedule)
const periodSchedule = {
    'A': {
        'Period 1 (8:18-9:48)': {
            '9': 'ELA - Literature & Composition',
            '11': 'Pre-Calculus'
        },
        'Period 2 (9:51-11:21)': {
            '7': 'Life Science (Discovery Box)',
            '11': 'US Government'
        },
        'Period 3 (12:12-1:42)': {
            '7': 'English Language Arts'
        }
    },
    'B': {
        'Period 1 (8:18-9:48)': {
            '9': 'World History',
            '11': 'American Literature'
        },
        'Period 2 (9:51-11:21)': {
            '7': 'Pre-Algebra'
        },
        'Period 3 (12:12-1:42)': {
            '7': 'Civics',
            '9': 'Algebra I'
        }
    }
};