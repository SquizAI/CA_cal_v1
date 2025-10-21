-- =====================================================
-- ENHANCED ASSIGNMENT SYSTEM - MIGRATION 1 OF 3
-- Migration: 20251020212636_enhanced_assignments_system.sql
-- =====================================================
-- Creates student_assignments and assignment_templates tables
-- Compatible with existing centner_students and teachers tables
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- HELPER FUNCTION: update_updated_at_column
-- =====================================================
-- Create if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ENUM TYPES
-- =====================================================

-- Drop and recreate enum types
DROP TYPE IF EXISTS assignment_type CASCADE;
CREATE TYPE assignment_type AS ENUM (
    'quiz',
    'homework',
    'reading',
    'video',
    'activity'
);

DROP TYPE IF EXISTS assignment_status CASCADE;
CREATE TYPE assignment_status AS ENUM (
    'assigned',      -- Active assignment
    'submitted',     -- Student has submitted
    'graded',        -- Teacher has graded
    'overdue'        -- Past due date without submission
);

-- =====================================================
-- STUDENT_ASSIGNMENTS TABLE
-- =====================================================
-- Individual student assignments with submission and grading
CREATE TABLE IF NOT EXISTS student_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Relationship fields (using existing tables)
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES centner_students(id) ON DELETE CASCADE,

    -- Lesson identification
    lesson_key TEXT NOT NULL, -- Format: YYYY-MM-DD_subjectKey_period
    subject_key TEXT NOT NULL,

    -- Assignment details
    assignment_type assignment_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,

    -- Scheduling
    assigned_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_date TIMESTAMPTZ NOT NULL,

    -- Grading
    points_possible INTEGER NOT NULL DEFAULT 100 CHECK (points_possible > 0),
    points_earned DECIMAL(5,2) CHECK (points_earned >= 0 AND points_earned <= points_possible),

    -- Status tracking
    status assignment_status NOT NULL DEFAULT 'assigned',

    -- Submission details
    submission_text TEXT,
    submission_urls TEXT[],
    submitted_at TIMESTAMPTZ,

    -- Grading details
    feedback TEXT,
    rubric_scores JSONB,
    graded_at TIMESTAMPTZ,

    -- Metadata
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent duplicate assignments
    CONSTRAINT unique_student_assignment UNIQUE (student_id, lesson_key, assignment_type, title)
);

-- Add comments
COMMENT ON TABLE student_assignments IS 'Individual student assignments with submission and grading tracking';
COMMENT ON COLUMN student_assignments.lesson_key IS 'Format: YYYY-MM-DD_subjectKey_period (links to specific lesson)';
COMMENT ON COLUMN student_assignments.rubric_scores IS 'JSON object with rubric criteria scores';

-- =====================================================
-- ASSIGNMENT_TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS assignment_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,

    -- Template details
    name TEXT NOT NULL,
    assignment_type assignment_type NOT NULL,
    title_template TEXT NOT NULL,
    description_template TEXT,
    instructions_template TEXT,

    -- Default settings
    default_points INTEGER DEFAULT 100,
    default_duration_hours INTEGER DEFAULT 168,

    -- Resources
    attachment_urls TEXT[],
    rubric_template JSONB,

    -- Metadata
    subject_keys TEXT[],
    grade_levels INTEGER[],
    tags TEXT[],

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE assignment_templates IS 'Reusable assignment templates for bulk assignment creation';

-- =====================================================
-- INDEXES
-- =====================================================

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_student_assignments_student ON student_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_assignments_teacher ON student_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_student_assignments_lesson ON student_assignments(lesson_key);
CREATE INDEX IF NOT EXISTS idx_student_assignments_subject ON student_assignments(subject_key);
CREATE INDEX IF NOT EXISTS idx_student_assignments_status ON student_assignments(status);
CREATE INDEX IF NOT EXISTS idx_student_assignments_type ON student_assignments(assignment_type);

-- Date indexes
CREATE INDEX IF NOT EXISTS idx_student_assignments_due_date ON student_assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_student_assignments_assigned_date ON student_assignments(assigned_date);

-- Composite indexes
CREATE INDEX IF NOT EXISTS idx_student_assignments_student_status ON student_assignments(student_id, status);
CREATE INDEX IF NOT EXISTS idx_student_assignments_teacher_lesson ON student_assignments(teacher_id, lesson_key);
CREATE INDEX IF NOT EXISTS idx_student_assignments_student_due ON student_assignments(student_id, due_date) WHERE status IN ('assigned', 'submitted');

-- Template indexes
CREATE INDEX IF NOT EXISTS idx_assignment_templates_teacher ON assignment_templates(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignment_templates_type ON assignment_templates(assignment_type);

-- GIN indexes
CREATE INDEX IF NOT EXISTS idx_student_assignments_rubric ON student_assignments USING GIN (rubric_scores);
CREATE INDEX IF NOT EXISTS idx_assignment_templates_tags ON assignment_templates USING GIN (tags);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Extract subject_key from lesson_key
CREATE OR REPLACE FUNCTION extract_subject_key(lesson_key TEXT)
RETURNS TEXT AS $$
BEGIN
    -- lesson_key format: YYYY-MM-DD_subjectKey_period
    -- Extract the middle parts (subject and grade)
    RETURN split_part(lesson_key, '_', 2) || '_' || split_part(lesson_key, '_', 3);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Auto-populate subject_key trigger function
CREATE OR REPLACE FUNCTION auto_populate_subject_key()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.subject_key IS NULL OR NEW.subject_key = '' THEN
        NEW.subject_key := extract_subject_key(NEW.lesson_key);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-update assignment status
CREATE OR REPLACE FUNCTION auto_update_assignment_status()
RETURNS TRIGGER AS $$
BEGIN
    -- When submission is added, update status
    IF NEW.submitted_at IS NOT NULL AND (OLD.submitted_at IS NULL OR OLD IS NULL) THEN
        NEW.status := 'submitted';
    END IF;

    -- When graded, update status
    IF NEW.points_earned IS NOT NULL AND NEW.graded_at IS NOT NULL AND (OLD.graded_at IS NULL OR OLD IS NULL) THEN
        NEW.status := 'graded';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update overdue assignments
CREATE OR REPLACE FUNCTION update_overdue_assignments()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE student_assignments
    SET status = 'overdue'
    WHERE status = 'assigned'
        AND due_date < NOW()
        AND submitted_at IS NULL;

    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Get student assignment summary
CREATE OR REPLACE FUNCTION get_student_assignment_summary(p_student_id UUID)
RETURNS TABLE (
    total_assignments BIGINT,
    assigned_count BIGINT,
    submitted_count BIGINT,
    graded_count BIGINT,
    overdue_count BIGINT,
    average_score DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_assignments,
        COUNT(*) FILTER (WHERE status = 'assigned')::BIGINT as assigned_count,
        COUNT(*) FILTER (WHERE status = 'submitted')::BIGINT as submitted_count,
        COUNT(*) FILTER (WHERE status = 'graded')::BIGINT as graded_count,
        COUNT(*) FILTER (WHERE status = 'overdue')::BIGINT as overdue_count,
        AVG(points_earned / points_possible * 100) FILTER (WHERE status = 'graded') as average_score
    FROM student_assignments
    WHERE student_id = p_student_id;
END;
$$ LANGUAGE plpgsql;

-- Bulk create assignments
CREATE OR REPLACE FUNCTION bulk_create_assignments(
    p_teacher_id UUID,
    p_student_ids UUID[],
    p_lesson_key TEXT,
    p_assignment_type assignment_type,
    p_title TEXT,
    p_description TEXT,
    p_instructions TEXT,
    p_due_date TIMESTAMPTZ,
    p_points_possible INTEGER DEFAULT 100
)
RETURNS TABLE (
    assignment_id UUID,
    student_id UUID,
    created BOOLEAN
) AS $$
DECLARE
    student_id_iter UUID;
    new_assignment_id UUID;
    subject_key_extracted TEXT;
BEGIN
    subject_key_extracted := extract_subject_key(p_lesson_key);

    FOREACH student_id_iter IN ARRAY p_student_ids
    LOOP
        BEGIN
            INSERT INTO student_assignments (
                teacher_id, student_id, lesson_key, subject_key,
                assignment_type, title, description, instructions,
                due_date, points_possible, status
            ) VALUES (
                p_teacher_id, student_id_iter, p_lesson_key, subject_key_extracted,
                p_assignment_type, p_title, p_description, p_instructions,
                p_due_date, p_points_possible, 'assigned'
            )
            RETURNING id INTO new_assignment_id;

            RETURN QUERY SELECT new_assignment_id, student_id_iter, TRUE;

        EXCEPTION WHEN unique_violation THEN
            SELECT id INTO new_assignment_id
            FROM student_assignments
            WHERE student_id = student_id_iter
                AND lesson_key = p_lesson_key
                AND assignment_type = p_assignment_type
                AND title = p_title;

            RETURN QUERY SELECT new_assignment_id, student_id_iter, FALSE;
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Updated_at triggers
DROP TRIGGER IF EXISTS update_student_assignments_updated_at ON student_assignments;
CREATE TRIGGER update_student_assignments_updated_at
    BEFORE UPDATE ON student_assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assignment_templates_updated_at ON assignment_templates;
CREATE TRIGGER update_assignment_templates_updated_at
    BEFORE UPDATE ON assignment_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-populate subject_key
DROP TRIGGER IF EXISTS set_subject_key_from_lesson_key ON student_assignments;
CREATE TRIGGER set_subject_key_from_lesson_key
    BEFORE INSERT OR UPDATE ON student_assignments
    FOR EACH ROW
    EXECUTE FUNCTION auto_populate_subject_key();

-- Auto-update status
DROP TRIGGER IF EXISTS auto_status_update ON student_assignments;
CREATE TRIGGER auto_status_update
    BEFORE UPDATE ON student_assignments
    FOR EACH ROW
    EXECUTE FUNCTION auto_update_assignment_status();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE student_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_templates ENABLE ROW LEVEL SECURITY;

-- Students view own assignments
DROP POLICY IF EXISTS "students_view_own_assignments" ON student_assignments;
CREATE POLICY "students_view_own_assignments"
ON student_assignments FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Teachers view their assignments
DROP POLICY IF EXISTS "teachers_view_own_assignments" ON student_assignments;
CREATE POLICY "teachers_view_own_assignments"
ON student_assignments FOR SELECT
TO authenticated
USING (teacher_id = auth.uid());

-- Students submit assignments
DROP POLICY IF EXISTS "students_submit_assignments" ON student_assignments;
CREATE POLICY "students_submit_assignments"
ON student_assignments FOR UPDATE
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- Teachers create assignments
DROP POLICY IF EXISTS "teachers_create_assignments" ON student_assignments;
CREATE POLICY "teachers_create_assignments"
ON student_assignments FOR INSERT
TO authenticated
WITH CHECK (teacher_id = auth.uid());

-- Teachers update assignments
DROP POLICY IF EXISTS "teachers_update_assignments" ON student_assignments;
CREATE POLICY "teachers_update_assignments"
ON student_assignments FOR UPDATE
TO authenticated
USING (teacher_id = auth.uid());

-- Teachers delete assignments
DROP POLICY IF EXISTS "teachers_delete_assignments" ON student_assignments;
CREATE POLICY "teachers_delete_assignments"
ON student_assignments FOR DELETE
TO authenticated
USING (teacher_id = auth.uid());

-- Templates: teachers manage their own
DROP POLICY IF EXISTS "teachers_manage_templates" ON assignment_templates;
CREATE POLICY "teachers_manage_templates"
ON assignment_templates FOR ALL
TO authenticated
USING (teacher_id = auth.uid());

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
