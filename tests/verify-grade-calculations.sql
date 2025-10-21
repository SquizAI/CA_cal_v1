-- =====================================================
-- GRADE CALCULATION VERIFICATION SCRIPT
-- =====================================================
-- Run these queries to verify grade-based progress tracking
-- is calculating correctly
-- =====================================================

-- =====================================================
-- 1. VERIFY CATEGORY WEIGHTS SUM TO 100%
-- =====================================================

SELECT
    'Category Weights Check' AS test_name,
    SUM(weight) AS total_weight,
    CASE
        WHEN SUM(weight) = 100 THEN '✅ PASS'
        ELSE '❌ FAIL - Should sum to 100%'
    END AS status
FROM assignment_categories;

-- Expected output:
-- total_weight: 100
-- status: ✅ PASS

-- =====================================================
-- 2. VERIFY GRADE PERCENTAGE CALCULATION
-- =====================================================

SELECT
    'Grade Percentage Accuracy' AS test_name,
    g.id AS grade_id,
    g.points_earned,
    g.points_possible,
    g.percentage AS stored_percentage,
    ROUND((g.points_earned / g.points_possible) * 100, 2) AS calculated_percentage,
    CASE
        WHEN g.percentage = ROUND((g.points_earned / g.points_possible) * 100, 2)
        THEN '✅ PASS'
        ELSE '❌ FAIL'
    END AS status
FROM grades g
LIMIT 10;

-- All rows should show status: ✅ PASS

-- =====================================================
-- 3. VERIFY LETTER GRADE ASSIGNMENT
-- =====================================================

SELECT
    'Letter Grade Accuracy' AS test_name,
    g.percentage,
    g.letter_grade AS stored_letter,
    CASE
        WHEN g.percentage >= 90 THEN 'A'
        WHEN g.percentage >= 80 THEN 'B'
        WHEN g.percentage >= 70 THEN 'C'
        WHEN g.percentage >= 60 THEN 'D'
        ELSE 'F'
    END AS calculated_letter,
    CASE
        WHEN g.letter_grade = CASE
            WHEN g.percentage >= 90 THEN 'A'
            WHEN g.percentage >= 80 THEN 'B'
            WHEN g.percentage >= 70 THEN 'C'
            WHEN g.percentage >= 60 THEN 'D'
            ELSE 'F'
        END THEN '✅ PASS'
        ELSE '❌ FAIL'
    END AS status
FROM grades g
LIMIT 10;

-- All rows should show status: ✅ PASS

-- =====================================================
-- 4. VERIFY STUDENT GRADE SUMMARY VIEW
-- =====================================================

SELECT
    'Grade Summary View' AS test_name,
    COUNT(*) AS student_count,
    CASE
        WHEN COUNT(*) > 0 THEN '✅ PASS - View has data'
        ELSE '⚠️ WARN - View is empty'
    END AS status
FROM student_grade_summary;

-- Show sample data
SELECT
    student_name,
    subject_key,
    total_assignments,
    average_percentage,
    average_letter_grade
FROM student_grade_summary
ORDER BY student_name, subject_key
LIMIT 5;

-- =====================================================
-- 5. VERIFY WEIGHTED GRADE CALCULATION
-- =====================================================

-- Example: Calculate weighted grade for a test student
-- Replace [STUDENT_ID] and [SUBJECT_KEY] with actual values

WITH test_params AS (
    SELECT
        (SELECT id FROM centner_students WHERE email LIKE '%test%' LIMIT 1) AS student_id,
        '9th_ela' AS subject_key
),
category_averages AS (
    SELECT
        ac.category_name,
        ac.category_key,
        ac.weight,
        ROUND(AVG(g.percentage), 2) AS category_avg,
        COUNT(g.id) AS assignment_count
    FROM assignment_categories ac
    LEFT JOIN assignments a ON a.category = ac.category_key
    LEFT JOIN grades g ON g.assignment_id = a.id
    CROSS JOIN test_params tp
    WHERE g.student_id = tp.student_id
      AND a.subject_key = tp.subject_key
      AND a.status = 'published'
    GROUP BY ac.category_name, ac.category_key, ac.weight
)
SELECT
    'Weighted Grade Calculation' AS test_name,
    category_name,
    category_avg,
    weight,
    ROUND((category_avg * weight / 100), 2) AS weighted_contribution,
    assignment_count
FROM category_averages
WHERE category_avg IS NOT NULL
ORDER BY weight DESC;

-- Then calculate final grade
WITH test_params AS (
    SELECT
        (SELECT id FROM centner_students WHERE email LIKE '%test%' LIMIT 1) AS student_id,
        '9th_ela' AS subject_key
),
category_averages AS (
    SELECT
        ac.weight,
        AVG(g.percentage) AS category_avg
    FROM assignment_categories ac
    LEFT JOIN assignments a ON a.category = ac.category_key
    LEFT JOIN grades g ON g.assignment_id = a.id
    CROSS JOIN test_params tp
    WHERE g.student_id = tp.student_id
      AND a.subject_key = tp.subject_key
      AND a.status = 'published'
    GROUP BY ac.weight
    HAVING AVG(g.percentage) IS NOT NULL
)
SELECT
    'Final Weighted Grade' AS test_name,
    ROUND(
        SUM(category_avg * weight / 100) * 100 / SUM(weight),
        2
    ) AS weighted_average,
    get_letter_grade(
        ROUND(
            SUM(category_avg * weight / 100) * 100 / SUM(weight),
            2
        )
    ) AS letter_grade
FROM category_averages;

-- =====================================================
-- 6. VERIFY FUNCTION: get_student_subject_average
-- =====================================================

-- Test with a real student
DO $$
DECLARE
    test_student_id UUID;
    test_subject_key TEXT := '9th_ela';
    result RECORD;
BEGIN
    -- Get a test student
    SELECT id INTO test_student_id
    FROM centner_students
    WHERE is_active = true
    LIMIT 1;

    -- Call function
    SELECT * INTO result
    FROM get_student_subject_average(test_student_id, test_subject_key);

    RAISE NOTICE 'Function Test: get_student_subject_average';
    RAISE NOTICE 'Student ID: %', test_student_id;
    RAISE NOTICE 'Subject: %', test_subject_key;
    RAISE NOTICE 'Average: %', result.average_percentage;
    RAISE NOTICE 'Letter: %', result.letter_grade;
    RAISE NOTICE 'Total Assignments: %', result.total_assignments;
END $$;

-- =====================================================
-- 7. VERIFY FUNCTION: calculate_weighted_course_grade
-- =====================================================

-- Test weighted calculation
SELECT
    'Weighted Grade Function Test' AS test_name,
    calculate_weighted_course_grade(
        (SELECT id FROM centner_students WHERE is_active = true LIMIT 1),
        '9th_ela',
        1,
        '2025'
    ) AS calculated_grade,
    CASE
        WHEN calculate_weighted_course_grade(
            (SELECT id FROM centner_students WHERE is_active = true LIMIT 1),
            '9th_ela',
            1,
            '2025'
        ) IS NOT NULL THEN '✅ PASS'
        ELSE '⚠️ WARN - No grades or calculation failed'
    END AS status;

-- =====================================================
-- 8. VERIFY TRIGGER: auto_update_course_grade
-- =====================================================

-- Check if course_grades table is populated
SELECT
    'Course Grades Table' AS test_name,
    COUNT(*) AS record_count,
    COUNT(DISTINCT student_id) AS unique_students,
    COUNT(DISTINCT subject_key) AS unique_subjects,
    CASE
        WHEN COUNT(*) > 0 THEN '✅ PASS - Table has data'
        ELSE '⚠️ WARN - Table is empty (trigger may not have fired)'
    END AS status
FROM course_grades;

-- Show sample course grades
SELECT
    cs.first_name || ' ' || cs.last_name AS student,
    cg.subject_key,
    cg.percentage,
    cg.letter_grade,
    cg.quarter,
    cg.year,
    cg.calculated_at
FROM course_grades cg
JOIN centner_students cs ON cs.id = cg.student_id
ORDER BY cg.calculated_at DESC
LIMIT 5;

-- =====================================================
-- 9. VERIFY GRADE HISTORY TRACKING
-- =====================================================

SELECT
    'Grade History Tracking' AS test_name,
    COUNT(*) AS history_entries,
    CASE
        WHEN COUNT(*) > 0 THEN '✅ PASS - Changes are tracked'
        ELSE '⚠️ INFO - No grade changes yet'
    END AS status
FROM grade_history;

-- Show recent grade changes
SELECT
    gh.changed_at,
    gh.previous_percentage,
    gh.new_percentage,
    gh.previous_percentage - gh.new_percentage AS change,
    gh.change_reason
FROM grade_history gh
ORDER BY gh.changed_at DESC
LIMIT 5;

-- =====================================================
-- 10. VERIFY DATA COMPLETENESS
-- =====================================================

-- Check for grades without assignments (orphaned)
SELECT
    'Orphaned Grades Check' AS test_name,
    COUNT(*) AS orphaned_count,
    CASE
        WHEN COUNT(*) = 0 THEN '✅ PASS - No orphaned grades'
        ELSE '❌ FAIL - Found orphaned grades'
    END AS status
FROM grades g
WHERE NOT EXISTS (
    SELECT 1 FROM assignments a WHERE a.id = g.assignment_id
);

-- Check for assignments without category
SELECT
    'Assignments Without Category' AS test_name,
    COUNT(*) AS missing_category_count,
    CASE
        WHEN COUNT(*) = 0 THEN '✅ PASS - All assignments categorized'
        ELSE '⚠️ WARN - Some assignments missing category'
    END AS status
FROM assignments
WHERE category IS NULL OR category = '';

-- Check for invalid category values
SELECT
    'Invalid Category Values' AS test_name,
    COUNT(*) AS invalid_count,
    CASE
        WHEN COUNT(*) = 0 THEN '✅ PASS - All categories valid'
        ELSE '❌ FAIL - Found invalid categories'
    END AS status
FROM assignments a
WHERE a.category IS NOT NULL
  AND a.category != ''
  AND NOT EXISTS (
      SELECT 1 FROM assignment_categories ac
      WHERE ac.category_key = a.category
  );

-- =====================================================
-- 11. PERFORMANCE CHECK: Query Speed
-- =====================================================

-- Time how long it takes to fetch student grade summary
EXPLAIN ANALYZE
SELECT * FROM student_grade_summary
WHERE student_id = (SELECT id FROM centner_students LIMIT 1);

-- Expected: < 100ms for typical dataset

-- =====================================================
-- 12. COMPREHENSIVE STUDENT REPORT
-- =====================================================

-- Generate full grade report for a test student
WITH test_student AS (
    SELECT id, first_name || ' ' || last_name AS name
    FROM centner_students
    WHERE is_active = true
    LIMIT 1
)
SELECT
    ts.name AS student_name,
    a.subject_key,
    a.category,
    a.title AS assignment,
    g.points_earned || '/' || g.points_possible AS score,
    g.percentage || '%' AS percentage,
    g.letter_grade,
    g.graded_at
FROM test_student ts
JOIN grades g ON g.student_id = ts.id
JOIN assignments a ON a.id = g.assignment_id
ORDER BY a.subject_key, a.category, g.graded_at DESC;

-- =====================================================
-- 13. SUMMARY REPORT
-- =====================================================

-- Overall system health check
SELECT
    'System Health Summary' AS report_name,
    (SELECT COUNT(*) FROM centner_students WHERE is_active = true) AS active_students,
    (SELECT COUNT(*) FROM assignments WHERE status = 'published') AS published_assignments,
    (SELECT COUNT(*) FROM grades) AS total_grades,
    (SELECT COUNT(*) FROM course_grades) AS course_grade_records,
    (SELECT COUNT(DISTINCT student_id) FROM grades) AS students_with_grades,
    ROUND(
        (SELECT COUNT(DISTINCT student_id)::numeric FROM grades) /
        NULLIF((SELECT COUNT(*)::numeric FROM centner_students WHERE is_active = true), 0) * 100,
        2
    ) AS percentage_graded;

-- =====================================================
-- EXPECTED RESULTS SUMMARY
-- =====================================================

/*
✅ PASSING CRITERIA:

1. Category weights sum to 100%
2. All percentage calculations match formula
3. All letter grades match percentage ranges
4. student_grade_summary view has data
5. Weighted calculations return reasonable values (0-100)
6. Functions execute without errors
7. course_grades table populated
8. No orphaned grades
9. All assignments have valid categories
10. Queries execute in < 100ms

⚠️ WARNING CONDITIONS:

- Empty views (no grades yet)
- No course_grades records (trigger didn't fire)
- No grade history (no changes made)

❌ FAILING CONDITIONS:

- Orphaned grades exist
- Invalid category values
- Percentage calculations incorrect
- Letter grades incorrect
- Weights don't sum to 100%
*/

-- =====================================================
-- MANUAL VERIFICATION EXAMPLE
-- =====================================================

-- Pick a specific student and manually verify calculation
-- Replace these values with actual student data:

/*
MANUAL CALCULATION EXAMPLE:

Student: John Doe (ID: abc-123-xyz)
Subject: 9th ELA

Grades:
  Homework 1: 42/50 = 84%
  Homework 2: 46/50 = 92%
  Homework 3: 41/50 = 82%
  Quiz 1: 18/20 = 90%
  Quiz 2: 17/20 = 85%
  Quiz 3: 19/20 = 95%
  Quiz 4: 16/20 = 80%
  Test 1: 76/100 = 76%
  Test 2: 85/100 = 85%
  Participation: 95/100 = 95%

Category Averages:
  Homework: (84 + 92 + 82) / 3 = 86%
  Quizzes: (90 + 85 + 95 + 80) / 4 = 87.5%
  Tests: (76 + 85) / 2 = 80.5%
  Participation: 95%

Weighted Calculation:
  Homework:      86%   × 20% = 17.2
  Quizzes:       87.5% × 30% = 26.25
  Tests:         80.5% × 40% = 32.2
  Participation: 95%   × 10% = 9.5

  Total: 17.2 + 26.25 + 32.2 + 9.5 = 85.15%
  Letter Grade: B

DATABASE SHOULD RETURN: 85.15% (B)

Verify with:
*/

SELECT calculate_weighted_course_grade(
    'abc-123-xyz'::uuid,  -- Replace with actual student ID
    '9th_ela',
    1,
    '2025'
);

-- Expected: 85.15 (or very close due to rounding)

-- =====================================================
-- END OF VERIFICATION SCRIPT
-- =====================================================
