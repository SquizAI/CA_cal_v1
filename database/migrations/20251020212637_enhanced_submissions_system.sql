-- =====================================================
-- ENHANCED SUBMISSIONS SYSTEM - MIGRATION 2 OF 3
-- Migration: 20251020212637_enhanced_submissions_system.sql
-- =====================================================
-- Drops and recreates submissions table with enhanced features
-- Compatible with existing assignments, centner_students, teachers
-- =====================================================

-- =====================================================
-- DROP EXISTING SUBMISSIONS TABLE
-- =====================================================
-- WARNING: This will delete existing submission data
-- Backup data first if needed

DROP TABLE IF EXISTS submissions CASCADE;

-- =====================================================
-- CREATE ENHANCED SUBMISSIONS TABLE
-- =====================================================

CREATE TABLE submissions (
    -- Primary identifier
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign key relationships (compatible with existing tables)
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES centner_students(id) ON DELETE CASCADE,

    -- Submission metadata
    submitted_at TIMESTAMPTZ NULL, -- NULL for drafts
    is_late BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'graded')),

    -- Submission type and content
    submission_type TEXT NOT NULL CHECK (submission_type IN ('quiz_answers', 'file_upload', 'text_response', 'link')),

    -- Quiz submissions: {questionId: selectedAnswer, ...}
    quiz_answers JSONB DEFAULT '{}'::jsonb,

    -- Text submissions
    text_response TEXT,

    -- File uploads
    file_url TEXT,
    file_name TEXT,

    -- External links
    link_url TEXT,

    -- Attempt tracking
    attempt_number INTEGER NOT NULL DEFAULT 1,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_student_assignment_attempt UNIQUE (student_id, assignment_id, attempt_number),

    -- Validation: ensure appropriate fields are filled based on submission_type
    CONSTRAINT check_quiz_has_answers CHECK (
        submission_type != 'quiz_answers' OR
        (quiz_answers IS NOT NULL AND jsonb_typeof(quiz_answers) = 'object')
    ),
    CONSTRAINT check_text_has_response CHECK (
        submission_type != 'text_response' OR
        (text_response IS NOT NULL AND LENGTH(text_response) > 0)
    ),
    CONSTRAINT check_file_has_url CHECK (
        submission_type != 'file_upload' OR
        (file_url IS NOT NULL AND LENGTH(file_url) > 0)
    ),
    CONSTRAINT check_link_has_url CHECK (
        submission_type != 'link' OR
        (link_url IS NOT NULL AND LENGTH(link_url) > 0)
    ),
    CONSTRAINT check_submitted_has_timestamp CHECK (
        status = 'draft' OR submitted_at IS NOT NULL
    )
);

-- Add comments
COMMENT ON TABLE submissions IS 'Student assignment submissions with support for quiz answers, file uploads, text responses, and links';
COMMENT ON COLUMN submissions.submitted_at IS 'Timestamp when submission was finalized (NULL for drafts)';
COMMENT ON COLUMN submissions.is_late IS 'Automatically calculated based on due_date comparison';
COMMENT ON COLUMN submissions.quiz_answers IS 'JSONB object storing quiz answers as {questionId: selectedAnswer}';

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX idx_submissions_student_id ON submissions(student_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_student_assignment ON submissions(student_id, assignment_id);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at) WHERE submitted_at IS NOT NULL;
CREATE INDEX idx_submissions_is_late ON submissions(is_late) WHERE is_late = TRUE;

-- GIN index for JSONB quiz_answers
CREATE INDEX idx_submissions_quiz_answers ON submissions USING GIN (quiz_answers);

-- =====================================================
-- TRIGGER FUNCTIONS
-- =====================================================

-- Calculate late status
CREATE OR REPLACE FUNCTION calculate_submission_late_status()
RETURNS TRIGGER AS $$
DECLARE
    assignment_due_date TIMESTAMPTZ;
BEGIN
    -- Only calculate for submitted (not draft) submissions
    IF NEW.status != 'draft' AND NEW.submitted_at IS NOT NULL THEN
        -- Get the assignment due date
        SELECT due_date INTO assignment_due_date
        FROM assignments
        WHERE id = NEW.assignment_id;

        -- Convert date to timestamptz for comparison
        NEW.is_late := NEW.submitted_at > (assignment_due_date::timestamp + interval '23 hours 59 minutes 59 seconds')::timestamptz;
    ELSE
        NEW.is_late := FALSE;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Validate attempt number
CREATE OR REPLACE FUNCTION validate_submission_attempts()
RETURNS TRIGGER AS $$
DECLARE
    max_allowed_attempts INTEGER;
    current_attempts INTEGER;
BEGIN
    -- Default max_attempts if not defined in assignments table
    max_allowed_attempts := 3;

    -- Try to get max_attempts from assignments table if column exists
    BEGIN
        EXECUTE 'SELECT COALESCE(max_attempts, 3) FROM assignments WHERE id = $1'
        INTO max_allowed_attempts
        USING NEW.assignment_id;
    EXCEPTION WHEN undefined_column THEN
        max_allowed_attempts := 3; -- Default if column doesn't exist
    END;

    -- Count existing attempts
    SELECT COUNT(*) INTO current_attempts
    FROM submissions
    WHERE student_id = NEW.student_id
    AND assignment_id = NEW.assignment_id
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);

    -- Check if max attempts exceeded
    IF current_attempts >= max_allowed_attempts THEN
        RAISE EXCEPTION 'Maximum attempts (%) exceeded for this assignment', max_allowed_attempts;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions;
CREATE TRIGGER update_submissions_updated_at
    BEFORE UPDATE ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS calculate_submission_late_status_trigger ON submissions;
CREATE TRIGGER calculate_submission_late_status_trigger
    BEFORE INSERT OR UPDATE OF submitted_at, status ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION calculate_submission_late_status();

DROP TRIGGER IF EXISTS validate_submission_attempts_trigger ON submissions;
CREATE TRIGGER validate_submission_attempts_trigger
    BEFORE INSERT ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION validate_submission_attempts();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Students can view only their own submissions
DROP POLICY IF EXISTS "students_read_own_submissions" ON submissions;
CREATE POLICY "students_read_own_submissions"
ON submissions FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Students can insert their own submissions
DROP POLICY IF EXISTS "students_create_own_submissions" ON submissions;
CREATE POLICY "students_create_own_submissions"
ON submissions FOR INSERT
TO authenticated
WITH CHECK (student_id = auth.uid());

-- Students can update their own draft submissions
DROP POLICY IF EXISTS "students_update_own_draft_submissions" ON submissions;
CREATE POLICY "students_update_own_draft_submissions"
ON submissions FOR UPDATE
TO authenticated
USING (student_id = auth.uid() AND status = 'draft')
WITH CHECK (student_id = auth.uid());

-- Teachers can view submissions for their assignments
DROP POLICY IF EXISTS "teachers_read_class_submissions" ON submissions;
CREATE POLICY "teachers_read_class_submissions"
ON submissions FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM assignments a
        WHERE a.id = submissions.assignment_id
        AND a.teacher_id = auth.uid()
    )
);

-- Teachers can update submissions for grading
DROP POLICY IF EXISTS "teachers_update_class_submissions" ON submissions;
CREATE POLICY "teachers_update_class_submissions"
ON submissions FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM assignments a
        WHERE a.id = submissions.assignment_id
        AND a.teacher_id = auth.uid()
    )
);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get latest submission
CREATE OR REPLACE FUNCTION get_latest_submission(
    p_student_id UUID,
    p_assignment_id UUID
)
RETURNS submissions AS $$
BEGIN
    RETURN (
        SELECT s.*
        FROM submissions s
        WHERE s.student_id = p_student_id
        AND s.assignment_id = p_assignment_id
        ORDER BY s.attempt_number DESC
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Check if student can submit
CREATE OR REPLACE FUNCTION can_student_submit(
    p_student_id UUID,
    p_assignment_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    max_allowed_attempts INTEGER;
    current_attempts INTEGER;
BEGIN
    -- Default max_attempts
    max_allowed_attempts := 3;

    -- Try to get from assignments table
    BEGIN
        EXECUTE 'SELECT COALESCE(max_attempts, 3) FROM assignments WHERE id = $1'
        INTO max_allowed_attempts
        USING p_assignment_id;
    EXCEPTION WHEN undefined_column THEN
        max_allowed_attempts := 3;
    END;

    -- Count existing submitted attempts
    SELECT COUNT(*) INTO current_attempts
    FROM submissions
    WHERE student_id = p_student_id
    AND assignment_id = p_assignment_id
    AND status IN ('submitted', 'graded');

    RETURN current_attempts < max_allowed_attempts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Get assignment submission stats
CREATE OR REPLACE FUNCTION get_assignment_submission_stats(
    p_assignment_id UUID
)
RETURNS TABLE (
    total_students INTEGER,
    submitted_count INTEGER,
    draft_count INTEGER,
    graded_count INTEGER,
    late_count INTEGER,
    on_time_count INTEGER,
    submission_rate NUMERIC
) AS $$
DECLARE
    total_count INTEGER := 0;
BEGIN
    -- Get count of students who should submit (simplified - all active students)
    SELECT COUNT(*) INTO total_count
    FROM centner_students
    WHERE is_active = true;

    RETURN QUERY
    WITH submission_stats AS (
        SELECT
            COUNT(*) FILTER (WHERE status = 'submitted') as submitted,
            COUNT(*) FILTER (WHERE status = 'draft') as drafts,
            COUNT(*) FILTER (WHERE status = 'graded') as graded,
            COUNT(*) FILTER (WHERE is_late = TRUE) as late,
            COUNT(*) FILTER (WHERE is_late = FALSE AND status != 'draft') as on_time
        FROM submissions
        WHERE assignment_id = p_assignment_id
    )
    SELECT
        total_count::INTEGER,
        ss.submitted::INTEGER,
        ss.drafts::INTEGER,
        ss.graded::INTEGER,
        ss.late::INTEGER,
        ss.on_time::INTEGER,
        CASE
            WHEN total_count > 0 THEN ROUND((ss.submitted::NUMERIC / total_count::NUMERIC) * 100, 2)
            ELSE 0
        END
    FROM submission_stats ss;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
