-- Migration: Create grades table
-- Description: Creates the grades table with auto-calculated fields, RLS policies, and views
-- Date: 2025-10-20

-- =====================================================
-- MAIN GRADES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS grades (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Foreign key relationships
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,

    -- Scoring fields
    points_earned DECIMAL(10, 2) NOT NULL CHECK (points_earned >= 0),
    points_possible INTEGER NOT NULL CHECK (points_possible > 0),
    percentage DECIMAL(5, 2) GENERATED ALWAYS AS (
        ROUND((points_earned / points_possible) * 100, 2)
    ) STORED,
    letter_grade TEXT GENERATED ALWAYS AS (
        CASE
            WHEN (points_earned / points_possible) * 100 >= 90 THEN 'A'
            WHEN (points_earned / points_possible) * 100 >= 80 THEN 'B'
            WHEN (points_earned / points_possible) * 100 >= 70 THEN 'C'
            WHEN (points_earned / points_possible) * 100 >= 60 THEN 'D'
            ELSE 'F'
        END
    ) STORED,

    -- Feedback and detailed scoring
    teacher_feedback TEXT,
    rubric_scores JSONB DEFAULT '{}',

    -- Metadata
    graded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_points CHECK (points_earned <= points_possible),
    CONSTRAINT valid_rubric_scores CHECK (jsonb_typeof(rubric_scores) = 'object'),
    CONSTRAINT unique_grade_per_submission UNIQUE (submission_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_grades_assignment_id ON grades(assignment_id);
CREATE INDEX idx_grades_submission_id ON grades(submission_id);
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_teacher_id ON grades(teacher_id);
CREATE INDEX idx_grades_letter_grade ON grades(letter_grade);
CREATE INDEX idx_grades_graded_at ON grades(graded_at DESC);
CREATE INDEX idx_grades_student_assignment ON grades(student_id, assignment_id);
CREATE INDEX idx_grades_student_date ON grades(student_id, graded_at DESC);
CREATE INDEX idx_grades_rubric_scores ON grades USING GIN (rubric_scores);

-- =====================================================
-- FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_letter_grade(percentage_value DECIMAL)
RETURNS TEXT AS $$
BEGIN
    RETURN CASE
        WHEN percentage_value >= 90 THEN 'A'
        WHEN percentage_value >= 80 THEN 'B'
        WHEN percentage_value >= 70 THEN 'C'
        WHEN percentage_value >= 60 THEN 'D'
        ELSE 'F'
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION trigger_progress_update()
RETURNS TRIGGER AS $$
BEGIN
    RAISE NOTICE 'Progress recalculation triggered for student % on assignment %',
        NEW.student_id, NEW.assignment_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_grades_updated_at
    BEFORE UPDATE ON grades
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_progress_recalculation
    AFTER INSERT OR UPDATE ON grades
    FOR EACH ROW
    EXECUTE FUNCTION trigger_progress_update();

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_all_grades"
ON grades FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    )
);

CREATE POLICY "teachers_read_class_grades"
ON grades FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM assignments a
        JOIN classes c ON c.id = a.class_id
        WHERE a.id = grades.assignment_id
        AND c.teacher_id = auth.uid()
    )
);

CREATE POLICY "teachers_insert_grades"
ON grades FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid()
        AND role = 'teacher'
    )
    AND EXISTS (
        SELECT 1 FROM assignments a
        JOIN classes c ON c.id = a.class_id
        WHERE a.id = assignment_id
        AND c.teacher_id = auth.uid()
    )
);

CREATE POLICY "teachers_update_own_grades"
ON grades FOR UPDATE TO authenticated
USING (
    teacher_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM assignments a
        JOIN classes c ON c.id = a.class_id
        WHERE a.id = grades.assignment_id
        AND c.teacher_id = auth.uid()
    )
);

CREATE POLICY "teachers_delete_class_grades"
ON grades FOR DELETE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM assignments a
        JOIN classes c ON c.id = a.class_id
        WHERE a.id = grades.assignment_id
        AND c.teacher_id = auth.uid()
    )
);

CREATE POLICY "students_read_own_grades"
ON grades FOR SELECT TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "parents_read_children_grades"
ON grades FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM student_parent_relationships spr
        WHERE spr.student_id = grades.student_id
        AND spr.parent_id = auth.uid()
        AND spr.status = 'active'
    )
);

-- =====================================================
-- VIEWS
-- =====================================================

CREATE OR REPLACE VIEW student_grade_summary AS
SELECT
    g.student_id,
    up.full_name AS student_name,
    c.id AS class_id,
    c.name AS class_name,
    c.subject,
    COUNT(g.id) AS total_assignments,
    ROUND(AVG(g.percentage), 2) AS average_percentage,
    get_letter_grade(AVG(g.percentage)) AS average_letter_grade,
    SUM(g.points_earned) AS total_points_earned,
    SUM(g.points_possible) AS total_points_possible,
    ROUND((SUM(g.points_earned) / NULLIF(SUM(g.points_possible), 0)) * 100, 2) AS cumulative_percentage,
    COUNT(CASE WHEN g.letter_grade = 'A' THEN 1 END) AS a_count,
    COUNT(CASE WHEN g.letter_grade = 'B' THEN 1 END) AS b_count,
    COUNT(CASE WHEN g.letter_grade = 'C' THEN 1 END) AS c_count,
    COUNT(CASE WHEN g.letter_grade = 'D' THEN 1 END) AS d_count,
    COUNT(CASE WHEN g.letter_grade = 'F' THEN 1 END) AS f_count,
    MIN(g.graded_at) AS first_grade_date,
    MAX(g.graded_at) AS last_grade_date
FROM grades g
JOIN assignments a ON a.id = g.assignment_id
JOIN classes c ON c.id = a.class_id
JOIN user_profiles up ON up.id = g.student_id
GROUP BY g.student_id, up.full_name, c.id, c.name, c.subject;

CREATE OR REPLACE VIEW class_grade_summary AS
SELECT
    c.id AS class_id,
    c.name AS class_name,
    c.subject,
    c.grade_level,
    a.id AS assignment_id,
    a.title AS assignment_title,
    a.assignment_type,
    COUNT(g.id) AS total_submissions,
    ROUND(AVG(g.percentage), 2) AS average_percentage,
    ROUND(MIN(g.percentage), 2) AS min_percentage,
    ROUND(MAX(g.percentage), 2) AS max_percentage,
    ROUND(STDDEV(g.percentage), 2) AS std_deviation,
    COUNT(CASE WHEN g.letter_grade = 'A' THEN 1 END) AS a_count,
    COUNT(CASE WHEN g.letter_grade = 'B' THEN 1 END) AS b_count,
    COUNT(CASE WHEN g.letter_grade = 'C' THEN 1 END) AS c_count,
    COUNT(CASE WHEN g.letter_grade = 'D' THEN 1 END) AS d_count,
    COUNT(CASE WHEN g.letter_grade = 'F' THEN 1 END) AS f_count
FROM classes c
JOIN assignments a ON a.class_id = c.id
LEFT JOIN grades g ON g.assignment_id = a.id
GROUP BY c.id, c.name, c.subject, c.grade_level, a.id, a.title, a.assignment_type;

CREATE OR REPLACE VIEW assignment_grade_summary AS
SELECT
    a.id AS assignment_id,
    a.title AS assignment_title,
    a.assignment_type,
    a.points_possible AS max_points,
    c.id AS class_id,
    c.name AS class_name,
    COUNT(g.id) AS graded_count,
    ROUND(AVG(g.percentage), 2) AS average_percentage,
    get_letter_grade(AVG(g.percentage)) AS average_letter_grade,
    ROUND(MIN(g.percentage), 2) AS min_percentage,
    ROUND(MAX(g.percentage), 2) AS max_percentage,
    ROUND(STDDEV(g.percentage), 2) AS std_deviation,
    ROUND(AVG(g.points_earned), 2) AS avg_points_earned,
    COUNT(CASE WHEN g.letter_grade = 'A' THEN 1 END) AS a_count,
    COUNT(CASE WHEN g.letter_grade = 'B' THEN 1 END) AS b_count,
    COUNT(CASE WHEN g.letter_grade = 'C' THEN 1 END) AS c_count,
    COUNT(CASE WHEN g.letter_grade = 'D' THEN 1 END) AS d_count,
    COUNT(CASE WHEN g.letter_grade = 'F' THEN 1 END) AS f_count,
    MAX(g.graded_at) AS last_graded_at
FROM assignments a
JOIN classes c ON c.id = a.class_id
LEFT JOIN grades g ON g.assignment_id = a.id
GROUP BY a.id, a.title, a.assignment_type, a.points_possible, c.id, c.name;

CREATE OR REPLACE VIEW recent_grades_feed AS
SELECT
    g.id,
    g.student_id,
    up.full_name AS student_name,
    g.assignment_id,
    a.title AS assignment_title,
    a.assignment_type,
    c.id AS class_id,
    c.name AS class_name,
    g.points_earned,
    g.points_possible,
    g.percentage,
    g.letter_grade,
    g.teacher_id,
    tp.full_name AS teacher_name,
    g.graded_at,
    g.teacher_feedback IS NOT NULL AS has_feedback
FROM grades g
JOIN assignments a ON a.id = g.assignment_id
JOIN classes c ON c.id = a.class_id
JOIN user_profiles up ON up.id = g.student_id
JOIN user_profiles tp ON tp.id = g.teacher_id
ORDER BY g.graded_at DESC;

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION get_student_class_average(
    p_student_id UUID,
    p_class_id UUID
)
RETURNS TABLE(
    average_percentage DECIMAL,
    letter_grade TEXT,
    total_assignments INTEGER,
    total_points_earned DECIMAL,
    total_points_possible INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ROUND(AVG(g.percentage), 2) AS average_percentage,
        get_letter_grade(AVG(g.percentage)) AS letter_grade,
        COUNT(g.id)::INTEGER AS total_assignments,
        SUM(g.points_earned) AS total_points_earned,
        SUM(g.points_possible)::INTEGER AS total_points_possible
    FROM grades g
    JOIN assignments a ON a.id = g.assignment_id
    WHERE g.student_id = p_student_id
    AND a.class_id = p_class_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION get_assignment_class_average(p_assignment_id UUID)
RETURNS TABLE(
    average_percentage DECIMAL,
    average_letter_grade TEXT,
    total_graded INTEGER,
    highest_score DECIMAL,
    lowest_score DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ROUND(AVG(g.percentage), 2) AS average_percentage,
        get_letter_grade(AVG(g.percentage)) AS average_letter_grade,
        COUNT(g.id)::INTEGER AS total_graded,
        MAX(g.percentage) AS highest_score,
        MIN(g.percentage) AS lowest_score
    FROM grades g
    WHERE g.assignment_id = p_assignment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION validate_rubric_scores(
    p_rubric_scores JSONB,
    p_points_earned DECIMAL
)
RETURNS BOOLEAN AS $$
DECLARE
    rubric_total DECIMAL := 0;
    criterion JSONB;
BEGIN
    IF p_rubric_scores = '{}'::JSONB THEN
        RETURN TRUE;
    END IF;

    FOR criterion IN SELECT jsonb_array_elements(p_rubric_scores)
    LOOP
        rubric_total := rubric_total + (criterion->>'score')::DECIMAL;
    END LOOP;

    RETURN ABS(rubric_total - p_points_earned) < 0.01;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE grades IS 'Stores graded assignment results with auto-calculated percentages and letter grades';
COMMENT ON COLUMN grades.rubric_scores IS 'JSONB field containing breakdown of scores by rubric criteria';
