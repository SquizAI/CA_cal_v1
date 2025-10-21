-- =====================================================
-- CALCULATE COURSE GRADE FUNCTION
-- =====================================================
-- Comprehensive function to calculate and store course grades
-- Called after grading assignments to update student's overall grade
-- =====================================================

-- Main course grade calculation function
CREATE OR REPLACE FUNCTION calculate_course_grade(
    p_student_id UUID,
    p_subject_key TEXT
)
RETURNS DECIMAL AS $$
DECLARE
    v_total_points_earned DECIMAL := 0;
    v_total_points_possible INTEGER := 0;
    v_percentage DECIMAL;
    v_letter_grade TEXT;
    v_current_quarter INTEGER;
    v_current_year TEXT;
    v_category_scores JSONB := '{}'::jsonb;
    v_category RECORD;
    v_category_avg DECIMAL;
BEGIN
    -- Determine current quarter and year
    -- This is a simplified version - adjust based on your school calendar logic
    v_current_year := EXTRACT(YEAR FROM NOW())::TEXT;
    v_current_quarter := EXTRACT(QUARTER FROM NOW());

    -- Calculate overall grade (simple average method)
    SELECT
        SUM(g.points_earned),
        SUM(g.points_possible)
    INTO
        v_total_points_earned,
        v_total_points_possible
    FROM grades g
    JOIN assignments a ON a.id = g.assignment_id
    WHERE g.student_id = p_student_id
    AND a.subject_key = p_subject_key
    AND a.status = 'published';

    -- Calculate percentage
    IF v_total_points_possible > 0 THEN
        v_percentage := ROUND((v_total_points_earned / v_total_points_possible) * 100, 2);
    ELSE
        v_percentage := NULL;
    END IF;

    -- Get letter grade
    IF v_percentage IS NOT NULL THEN
        v_letter_grade := get_letter_grade(v_percentage);
    ELSE
        v_letter_grade := NULL;
    END IF;

    -- Calculate category breakdowns if assignment_categories exist
    FOR v_category IN
        SELECT * FROM assignment_categories
        WHERE subject_key = p_subject_key OR subject_key IS NULL
    LOOP
        -- Get average for this category
        SELECT AVG(g.percentage) INTO v_category_avg
        FROM grades g
        JOIN assignments a ON a.id = g.assignment_id
        WHERE g.student_id = p_student_id
        AND a.subject_key = p_subject_key
        AND a.category = v_category.category_key
        AND a.status = 'published';

        IF v_category_avg IS NOT NULL THEN
            v_category_scores := jsonb_set(
                v_category_scores,
                ARRAY[v_category.category_key],
                to_jsonb(ROUND(v_category_avg, 2))
            );
        END IF;
    END LOOP;

    -- Upsert course grade record
    INSERT INTO course_grades (
        student_id,
        subject_key,
        quarter,
        semester,
        year,
        percentage,
        letter_grade,
        category_scores,
        calculated_at
    ) VALUES (
        p_student_id,
        p_subject_key,
        v_current_quarter,
        CASE WHEN v_current_quarter <= 2 THEN 1 ELSE 2 END,
        v_current_year,
        v_percentage,
        v_letter_grade,
        v_category_scores,
        NOW()
    )
    ON CONFLICT (student_id, subject_key, quarter, year)
    DO UPDATE SET
        percentage = EXCLUDED.percentage,
        letter_grade = EXCLUDED.letter_grade,
        category_scores = EXCLUDED.category_scores,
        calculated_at = NOW(),
        updated_at = NOW();

    RETURN v_percentage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION calculate_course_grade IS 'Calculates and stores overall course grade for a student in a subject';

-- =====================================================
-- WEIGHTED CATEGORY GRADE CALCULATION
-- =====================================================
-- Alternative function using weighted categories

CREATE OR REPLACE FUNCTION calculate_weighted_grade(
    p_student_id UUID,
    p_subject_key TEXT,
    p_quarter INTEGER,
    p_year TEXT
)
RETURNS TABLE (
    percentage DECIMAL,
    letter_grade TEXT,
    category_breakdown JSONB
) AS $$
DECLARE
    v_weighted_sum DECIMAL := 0;
    v_total_weight DECIMAL := 0;
    v_category RECORD;
    v_category_avg DECIMAL;
    v_category_scores JSONB := '{}'::jsonb;
    v_final_percentage DECIMAL;
    v_final_letter TEXT;
BEGIN
    -- For each category, calculate average and apply weight
    FOR v_category IN
        SELECT * FROM assignment_categories
        WHERE subject_key = p_subject_key OR subject_key IS NULL
    LOOP
        -- Get average for this category
        SELECT AVG(g.percentage) INTO v_category_avg
        FROM grades g
        JOIN assignments a ON a.id = g.assignment_id
        WHERE g.student_id = p_student_id
        AND a.subject_key = p_subject_key
        AND a.category = v_category.category_key
        AND a.status = 'published';

        IF v_category_avg IS NOT NULL THEN
            -- Add to weighted sum
            v_weighted_sum := v_weighted_sum + (v_category_avg * v_category.weight / 100);
            v_total_weight := v_total_weight + v_category.weight;

            -- Store in category breakdown
            v_category_scores := jsonb_set(
                v_category_scores,
                ARRAY[v_category.category_key],
                jsonb_build_object(
                    'average', ROUND(v_category_avg, 2),
                    'weight', v_category.weight
                )
            );
        END IF;
    END LOOP;

    -- Calculate final weighted percentage
    IF v_total_weight > 0 THEN
        v_final_percentage := ROUND(v_weighted_sum * 100 / v_total_weight, 2);
        v_final_letter := get_letter_grade(v_final_percentage);
    ELSE
        v_final_percentage := NULL;
        v_final_letter := NULL;
    END IF;

    RETURN QUERY SELECT v_final_percentage, v_final_letter, v_category_scores;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION calculate_weighted_grade IS 'Calculates grade using weighted category averages';

-- =====================================================
-- BATCH UPDATE COURSE GRADES
-- =====================================================
-- Function to recalculate all course grades for a subject

CREATE OR REPLACE FUNCTION batch_update_course_grades(
    p_subject_key TEXT
)
RETURNS TABLE (
    student_id UUID,
    student_name TEXT,
    old_percentage DECIMAL,
    new_percentage DECIMAL,
    grade_change TEXT
) AS $$
DECLARE
    v_student RECORD;
    v_old_percentage DECIMAL;
    v_new_percentage DECIMAL;
BEGIN
    FOR v_student IN
        SELECT DISTINCT
            cs.id,
            cs.first_name || ' ' || cs.last_name AS name
        FROM centner_students cs
        JOIN grades g ON g.student_id = cs.id
        JOIN assignments a ON a.id = g.assignment_id
        WHERE a.subject_key = p_subject_key
        AND cs.is_active = true
    LOOP
        -- Get old percentage
        SELECT cg.percentage INTO v_old_percentage
        FROM course_grades cg
        WHERE cg.student_id = v_student.id
        AND cg.subject_key = p_subject_key
        ORDER BY cg.calculated_at DESC
        LIMIT 1;

        -- Calculate new percentage
        v_new_percentage := calculate_course_grade(v_student.id, p_subject_key);

        -- Return comparison
        RETURN QUERY SELECT
            v_student.id,
            v_student.name,
            v_old_percentage,
            v_new_percentage,
            CASE
                WHEN v_old_percentage IS NULL THEN 'NEW'
                WHEN v_new_percentage > v_old_percentage THEN 'IMPROVED'
                WHEN v_new_percentage < v_old_percentage THEN 'DECLINED'
                ELSE 'UNCHANGED'
            END;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION batch_update_course_grades IS 'Recalculates course grades for all students in a subject';

-- =====================================================
-- TRIGGER TO AUTO-UPDATE COURSE GRADES
-- =====================================================
-- Automatically recalculate course grade when a new grade is added

CREATE OR REPLACE FUNCTION trigger_update_course_grade()
RETURNS TRIGGER AS $$
DECLARE
    v_subject_key TEXT;
BEGIN
    -- Get subject_key from assignment
    SELECT a.subject_key INTO v_subject_key
    FROM assignments a
    WHERE a.id = NEW.assignment_id;

    -- Recalculate course grade
    PERFORM calculate_course_grade(NEW.student_id, v_subject_key);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS auto_update_course_grade ON grades;
CREATE TRIGGER auto_update_course_grade
    AFTER INSERT OR UPDATE ON grades
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_course_grade();

COMMENT ON TRIGGER auto_update_course_grade ON grades IS 'Automatically updates course grade when assignment is graded';
