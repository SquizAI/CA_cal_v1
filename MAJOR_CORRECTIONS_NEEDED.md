# 20 Major Corrections Needed for AI Academy @ Centner Calendar

## CRITICAL ISSUES TO FIX:

### 1. **A/B Day Counting is WRONG**
- School starts Sep 3 (Wednesday) which is A day
- Sep 4 (Thursday) is B day  
- Sep 5 (Friday) is A day
- **Sep 8 (Monday) should be 1.B NOT 1.A** - this is where the real counting starts
- The pattern from CSV is: Wed(A), Thu(B), Fri(A), Mon(B), Tue(A), Wed(B), Thu(A), Fri(B)

### 2. **Remove ALL Weekend Rendering**
- Calendar is showing lessons on Saturdays and Sundays
- School is ONLY Monday-Friday
- Weekend cells should be grayed out with no content

### 3. **Day Numbering System is Completely Wrong**
- Format should be: `[DayNumber].[Period].[DayType]`
- Example: `1.1.b` = Day 1, Period 1, B day
- Sep 8 = 1.B (Day 1 B day) - MONDAY
- Sep 9 = 2.A (Day 2 A day) - TUESDAY  
- Sep 10 = 3.B (Day 3 B day) - WEDNESDAY
- Sep 11 = 4.A (Day 4 A day) - THURSDAY
- Sep 12 = 5.B (Day 5 B day) - FRIDAY

### 4. **No School Days Not Properly Excluded**
- Sep 23, Oct 2, Nov 11, Jan 5, Jan 19, Feb 16, Apr 3, May 25 are NO SCHOOL
- These should NOT advance the day count
- These should be clearly marked and have NO lessons

### 5. **Breaks Not Properly Handled**
- Thanksgiving Break (Nov 24-28) - entire week off
- Winter Break (Dec 22 - Jan 2) - two weeks off
- Spring Break (Mar 23-27) - entire week off
- These should NOT have any lessons or day counts

### 6. **Last Week (June 8-11) Still Has Regular Lessons**
- Should be ONLY test prep and CLEP exams
- NO regular curriculum
- Special schedule for finals week

### 7. **Test Days Not Aligned with CSV Data**
- Q1 Exam should be around Nov 5-6
- Midterm should be around Jan 28-29
- Q3 Exam should be around Apr 8-9
- Finals should be June 3-5

### 8. **Period Structure Not Clear**
- Each day should show 3-4 periods
- Period 1: 7th grade subject
- Period 2: 9th grade subject  
- Period 3: 11th grade subject
- Period 4: Electives/Study Hall (if applicable)

### 9. **Grade Filter Not Working Properly**
- Should filter to show ONLY selected grade's schedule
- Currently showing all grades regardless of filter

### 10. **Mobile View is Broken**
- Accordion not working
- Calendar grid not responsive
- Text too small on mobile devices

### 11. **Modal Popup Lost Formatting**
- Original had nice formatting with lesson details
- New version lost all the lesson plan details
- Need to restore objectives, activities, assessments

### 12. **CSV Data Not Being Used Correctly**
- We have the exact A/B pattern in the CSV
- Should parse CSV directly for day types
- Not using a calculated pattern

### 13. **Total Day Count Wrong**
- Should be 174 total school days (87 A, 87 B)
- Currently counting weekends and breaks

### 14. **Noon Dismissal Days Not Marked**
- Oct 31, Dec 5, Dec 19, May 22, June 11
- These should be clearly marked as half days

### 15. **View Switching Broken**
- Day view showing month layout
- Week view not showing 5-day school week
- Month view has wrong grid structure

### 16. **Lesson Codes Not Persistent**
- 1.1.a should always mean the same lesson
- Currently recalculating based on view
- Need consistent mapping

### 17. **Missing Discovery Box Integration**
- 7th grade science should reference Discovery Box materials
- No hands-on activity indicators

### 18. **No Summer Term Indicated**
- June 12 starts summer break
- Should be clearly marked as end of school year

### 19. **Header Too Large/Bulky**
- Takes up too much screen space
- Navigation controls not intuitive
- Spinning animation was terrible (good we removed it)

### 20. **Centner Branding Inconsistent**
- Colors should be consistent throughout
- Logo/branding should be prominent but not overwhelming
- Need better visual hierarchy

## PROPOSED SOLUTION:

Go back to the ORIGINAL calendar structure that was working:
1. Parse CSV file directly for exact A/B schedule
2. Use the modal popup for lesson details (it was working perfectly)
3. Keep the simple, clean layout without excessive animations
4. Properly number days starting from Sep 8 as Day 1
5. Show only Monday-Friday in calendar grid
6. Implement proper grade filtering
7. Add mobile responsive design WITHOUT breaking desktop
8. Include all detailed lesson plans in expandable format
9. Mark special days clearly (no school, breaks, tests, noon dismissal)
10. Make last week (June 8-11) exclusively test prep/CLEP

## NEXT STEPS:
1. Revert to working version
2. Apply these corrections systematically
3. Test each correction before moving to next
4. Validate against CSV data
5. Deploy only when all corrections are verified