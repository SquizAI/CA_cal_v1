-- =====================================================
-- ENHANCED GRADES SYSTEM - MIGRATION 3 OF 3
-- Migration: 20251020212638_enhanced_grades_system.sql
-- =====================================================
-- Creates comprehensive grading system with:
-- - grades table with auto-calculated percentages
-- - grade_history for tracking changes
-- - grade_comments for detailed feedback
-- - course_grades for overall performance
-- - assignment_categories for weighted grading
-- =====================================================

-- =====================================================
-- MAIN GRADES TABLE
-- =====================================================

DROP TABLE IF EXISTS grades CASCADE;

CREATE TABLE grades (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Foreign key relationships
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
    student_id UUID NOT NULL REFERENCES centner_students(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE RESTRICT,

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

COMMENT ON TABLE grades IS 'Stores graded assignment results with auto-calculated percentages and letter grades';

-- =====================================================
-- GRADE HISTORY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS grade_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,

    -- Historical values
    previous_points_earned DECIMAL(10, 2),
    new_points_earned DECIMAL(10, 2),
    previous_percentage DECIMAL(5, 2),
    new_percentage DECIMAL(5, 2),

    -- Change metadata
    changed_by UUID REFERENCES teachers(id),
    change_reason TEXT,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE grade_history IS 'Tracks all changes to grades for accountability';

-- =====================================================
-- GRADE COMMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS grade_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,

    comment_text TEXT NOT NULL,
    comment_type TEXT CHECK (comment_type IN ('strength', 'improvement', 'general')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE grade_comments IS 'Detailed teacher comments and feedback on grades';

-- =====================================================
-- ASSIGNMENT CATEGORIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS assignment_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category_name TEXT NOT NULL,
    category_key TEXT NOT NULL UNIQUE,
    subject_key TEXT,

    -- Weighting
    weight DECIMAL(5, 2) NOT NULL CHECK (weight >= 0 AND weight <= 100),

    -- Metadata
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE assignment_categories IS 'Categories for assignments with grade weights (e.g., Homework 20%, Tests 40%)';

-- Insert default categories
INSERT INTO assignment_categories (category_name, category_key, weight, description)
VALUES
    ('Homework', 'homework', 20, 'Daily homework assignments'),
    ('Quizzes', 'quizzes', 30, 'Regular quizzes and short assessments'),
    ('Tests', 'tests', 40, 'Major tests and exams'),
    ('Participation', 'participation', 10, 'Class participation and engagement')
ON CONFLICT (category_key) DO NOTHING;

-- =====================================================
-- COURSE GRADES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS course_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL REFERENCES centner_students(id) ON DELETE CASCADE,
    subject_key TEXT NOT NULL,

    -- Grade period
    quarter INTEGER CHECK (quarter IN (1, 2, 3, 4)),
    semester INTEGER CHECK (semester IN (1, 2)),
    year TEXT NOT NULL,

    -- Overall grade
    percentage DECIMAL(5, 2),
    letter_grade TEXT,

    -- Category breakdowns (JSONB for flexibility)
    category_scores JSONB DEFAULT '{}',

    -- Metadata
    calculated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_student_course_period UNIQUE (student_id, subject_key, quarter, year)
);

COMMENT ON TABLE course_grades IS 'Aggregated course grades by grading period';

-- =====================================================
-- INDEXES
-- =====================================================

-- Grades indexes
CREATE INDEX idx_grades_assignment_id ON grades(assignment_id);
CREATE INDEX idx_grades_submission_id ON grades(submission_id);
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_teacher_id ON grades(teacher_id);
CREATE INDEX idx_grades_letter_grade ON grades(letter_grade);
CREATE INDEX idx_grades_graded_at ON grades(graded_at DESC);
CREATE INDEX idx_grades_student_assignment ON grades(student_id, assignment_id);
CREATE INDEX idx_grades_student_date ON grades(student_id, graded_at DESC);
CREATE INDEX idx_grades_rubric_scores ON grades USING GIN (rubric_scores);

-- History indexes
CREATE INDEX idx_grade_history_grade_id ON grade_history(grade_id);
CREATE INDEX idx_grade_history_changed_at ON grade_history(changed_at DESC);

-- Comments indexes
CREATE INDEX idx_grade_comments_grade_id ON grade_comments(grade_id);
CREATE INDEX idx_grade_comments_teacher_id ON grade_comments(teacher_id);

-- Course grades indexes
CREATE INDEX idx_course_grades_student_id ON course_grades(student_id);
CREATE INDEX idx_course_grades_subject ON course_grades(subject_key);
CREATE INDEX idx_course_grades_period ON course_grades(quarter, year);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get letter grade from percentage
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

-- Track grade changes
CREATE OR REPLACE FUNCTION track_grade_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.points_earned != NEW.points_earned THEN
        INSERT INTO grade_history (
            grade_id,
            previous_points_earned,
            new_points_earned,
            previous_percentage,
            new_percentage,
            changed_by
        ) VALUES (
            NEW.id,
            OLD.points_earned,
            NEW.points_earned,
            OLD.percentage,
            NEW.percentage,
            NEW.teacher_id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Get student's average grade in a subject
CREATE OR REPLACE FUNCTION get_student_subject_average(
    p_student_id UUID,
    p_subject_key TEXT
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
    AND a.subject_key = p_subject_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Get assignment class average
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

-- Calculate course grade with category weights
CREATE OR REPLACE FUNCTION calculate_weighted_course_grade(
    p_student_id UUID,
    p_subject_key TEXT,
    p_quarter INTEGER,
    p_year TEXT
)
RETURNS DECIMAL AS $$
DECLARE
    weighted_sum DECIMAL := 0;
    total_weight DECIMAL := 0;
    category RECORD;
    category_avg DECIMAL;
BEGIN
    -- For each category, calculate average and apply weight
    FOR category IN
        SELECT * FROM assignment_categories
        WHERE subject_key = p_subject_key OR subject_key IS NULL
    LOOP
        -- Get average for this category
        SELECT AVG(g.percentage) INTO category_avg
        FROM grades g
        JOIN assignments a ON a.id = g.assignment_id
        WHERE g.student_id = p_student_id
        AND a.subject_key = p_subject_key
        AND a.status = 'published';

        IF category_avg IS NOT NULL THEN
            weighted_sum := weighted_sum + (category_avg * category.weight / 100);
            total_weight := total_weight + category.weight;
        END IF;
    END LOOP;

    IF total_weight > 0 THEN
        RETURN ROUND(weighted_sum * 100 / total_weight, 2);
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at
DROP TRIGGER IF EXISTS update_grades_updated_at ON grades;
CREATE TRIGGER update_grades_updated_at
    BEFORE UPDATE ON grades
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_grade_comments_updated_at ON grade_comments;
CREATE TRIGGER update_grade_comments_updated_at
    BEFORE UPDATE ON grade_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_course_grades_updated_at ON course_grades;
CREATE TRIGGER update_course_grades_updated_at
    BEFORE UPDATE ON course_grades
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Track grade changes
DROP TRIGGER IF EXISTS track_grade_changes_trigger ON grades;
CREATE TRIGGER track_grade_changes_trigger
    AFTER UPDATE ON grades
    FOR EACH ROW
    EXECUTE FUNCTION track_grade_changes();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_categories ENABLE ROW LEVEL SECURITY;

-- Grades policies
DROP POLICY IF EXISTS "teachers_read_grades" ON grades;
CREATE POLICY "teachers_read_grades"
ON grades FOR SELECT TO authenticated
USING (
    teacher_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM assignments a
        WHERE a.id = grades.assignment_id
        AND a.teacher_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "teachers_insert_grades" ON grades;
CREATE POLICY "teachers_insert_grades"
ON grades FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM assignments a
        WHERE a.id = assignment_id
        AND a.teacher_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "teachers_update_grades" ON grades;
CREATE POLICY "teachers_update_grades"
ON grades FOR UPDATE TO authenticated
USING (teacher_id = auth.uid());

DROP POLICY IF EXISTS "students_read_own_grades" ON grades;
CREATE POLICY "students_read_own_grades"
ON grades FOR SELECT TO authenticated
USING (student_id = auth.uid());

-- Course grades policies
DROP POLICY IF EXISTS "students_read_own_course_grades" ON course_grades;
CREATE POLICY "students_read_own_course_grades"
ON course_grades FOR SELECT TO authenticated
USING (student_id = auth.uid());

DROP POLICY IF EXISTS "teachers_manage_course_grades" ON course_grades;
CREATE POLICY "teachers_manage_course_grades"
ON course_grades FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM teachers
        WHERE id = auth.uid()
    )
);

-- Grade comments policies
DROP POLICY IF EXISTS "teachers_manage_comments" ON grade_comments;
CREATE POLICY "teachers_manage_comments"
ON grade_comments FOR ALL TO authenticated
USING (teacher_id = auth.uid());

DROP POLICY IF EXISTS "students_read_comments" ON grade_comments;
CREATE POLICY "students_read_comments"
ON grade_comments FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM grades
        WHERE grades.id = grade_comments.grade_id
        AND grades.student_id = auth.uid()
    )
);

-- Categories - everyone can read
DROP POLICY IF EXISTS "everyone_read_categories" ON assignment_categories;
CREATE POLICY "everyone_read_categories"
ON assignment_categories FOR SELECT TO authenticated
USING (true);

-- History - teachers only
DROP POLICY IF EXISTS "teachers_read_history" ON grade_history;
CREATE POLICY "teachers_read_history"
ON grade_history FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM grades g
        WHERE g.id = grade_history.grade_id
        AND g.teacher_id = auth.uid()
    )
);

-- =====================================================
-- VIEWS
-- =====================================================

-- Student grade summary view
CREATE OR REPLACE VIEW student_grade_summary AS
SELECT
    g.student_id,
    cs.first_name || ' ' || cs.last_name AS student_name,
    a.subject_key,
    COUNT(g.id) AS total_assignments,
    ROUND(AVG(g.percentage), 2) AS average_percentage,
    get_letter_grade(AVG(g.percentage)) AS average_letter_grade,
    SUM(g.points_earned) AS total_points_earned,
    SUM(g.points_possible) AS total_points_possible,
    COUNT(CASE WHEN g.letter_grade = 'A' THEN 1 END) AS a_count,
    COUNT(CASE WHEN g.letter_grade = 'B' THEN 1 END) AS b_count,
    COUNT(CASE WHEN g.letter_grade = 'C' THEN 1 END) AS c_count,
    COUNT(CASE WHEN g.letter_grade = 'D' THEN 1 END) AS d_count,
    COUNT(CASE WHEN g.letter_grade = 'F' THEN 1 END) AS f_count,
    MAX(g.graded_at) AS last_grade_date
FROM grades g
JOIN assignments a ON a.id = g.assignment_id
JOIN centner_students cs ON cs.id = g.student_id
GROUP BY g.student_id, cs.first_name, cs.last_name, a.subject_key;

-- Recent grades feed
CREATE OR REPLACE VIEW recent_grades_feed AS
SELECT
    g.id,
    g.student_id,
    cs.first_name || ' ' || cs.last_name AS student_name,
    g.assignment_id,
    a.title AS assignment_title,
    a.subject_key,
    g.points_earned,
    g.points_possible,
    g.percentage,
    g.letter_grade,
    g.teacher_id,
    t.first_name || ' ' || t.last_name AS teacher_name,
    g.graded_at,
    g.teacher_feedback IS NOT NULL AS has_feedback
FROM grades g
JOIN assignments a ON a.id = g.assignment_id
JOIN centner_students cs ON cs.id = g.student_id
JOIN teachers t ON t.id = g.teacher_id
ORDER BY g.graded_at DESC;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
