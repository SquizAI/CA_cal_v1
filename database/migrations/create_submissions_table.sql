-- =====================================================
-- Migration: Create Submissions Table
-- Description: Store student assignment submissions with support for multiple submission types
-- Author: Database Architecture Specialist
-- Date: 2025-10-20
-- =====================================================

-- Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
    -- Primary identifier
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign key relationships
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Submission metadata
    submitted_at TIMESTAMPTZ NULL, -- NULL for drafts, set when submitted
    is_late BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'graded')),

    -- Submission type and content
    submission_type TEXT NOT NULL CHECK (submission_type IN ('quiz_answers', 'file_upload', 'text_response', 'link')),

    -- Quiz submissions: {questionId: selectedAnswer, questionId2: selectedAnswer2, ...}
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

-- =====================================================
-- INDEXES
-- =====================================================

-- Performance indexes
CREATE INDEX idx_submissions_assignment_id ON public.submissions(assignment_id);
CREATE INDEX idx_submissions_student_id ON public.submissions(student_id);
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_submissions_student_assignment ON public.submissions(student_id, assignment_id);
CREATE INDEX idx_submissions_submitted_at ON public.submissions(submitted_at) WHERE submitted_at IS NOT NULL;
CREATE INDEX idx_submissions_is_late ON public.submissions(is_late) WHERE is_late = TRUE;

-- GIN index for JSONB quiz_answers for efficient querying
CREATE INDEX idx_submissions_quiz_answers ON public.submissions USING GIN (quiz_answers);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE TRIGGER update_submissions_updated_at
    BEFORE UPDATE ON public.submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Calculate is_late status based on due_date
CREATE OR REPLACE FUNCTION calculate_submission_late_status()
RETURNS TRIGGER AS $$
DECLARE
    assignment_due_date TIMESTAMPTZ;
BEGIN
    -- Only calculate for submitted (not draft) submissions
    IF NEW.status != 'draft' AND NEW.submitted_at IS NOT NULL THEN
        -- Get the assignment due date
        SELECT due_date INTO assignment_due_date
        FROM public.assignments
        WHERE id = NEW.assignment_id;

        -- Set is_late based on comparison
        NEW.is_late := NEW.submitted_at > assignment_due_date;
    ELSE
        -- Drafts are not late
        NEW.is_late := FALSE;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_submission_late_status_trigger
    BEFORE INSERT OR UPDATE OF submitted_at, status ON public.submissions
    FOR EACH ROW
    EXECUTE FUNCTION calculate_submission_late_status();

-- Validate attempt number doesn't exceed max_attempts
CREATE OR REPLACE FUNCTION validate_submission_attempts()
RETURNS TRIGGER AS $$
DECLARE
    max_allowed_attempts INTEGER;
    current_attempts INTEGER;
BEGIN
    -- Get max_attempts for the assignment
    SELECT max_attempts INTO max_allowed_attempts
    FROM public.assignments
    WHERE id = NEW.assignment_id;

    -- Count existing attempts for this student/assignment
    SELECT COUNT(*) INTO current_attempts
    FROM public.submissions
    WHERE student_id = NEW.student_id
    AND assignment_id = NEW.assignment_id
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid); -- Exclude current record on update

    -- Check if max attempts exceeded
    IF current_attempts >= max_allowed_attempts THEN
        RAISE EXCEPTION 'Maximum attempts (%) exceeded for this assignment', max_allowed_attempts;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_submission_attempts_trigger
    BEFORE INSERT ON public.submissions
    FOR EACH ROW
    EXECUTE FUNCTION validate_submission_attempts();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Students can view only their own submissions
CREATE POLICY "students_read_own_submissions"
ON public.submissions
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Students can insert their own submissions
CREATE POLICY "students_create_own_submissions"
ON public.submissions
FOR INSERT
TO authenticated
WITH CHECK (student_id = auth.uid());

-- Students can update their own draft submissions
CREATE POLICY "students_update_own_draft_submissions"
ON public.submissions
FOR UPDATE
TO authenticated
USING (
    student_id = auth.uid()
    AND status = 'draft'
)
WITH CHECK (
    student_id = auth.uid()
);

-- Teachers can view submissions for their assignments
CREATE POLICY "teachers_read_class_submissions"
ON public.submissions
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.assignments a
        JOIN public.classes c ON a.class_id = c.id
        WHERE a.id = submissions.assignment_id
        AND c.teacher_id = auth.uid()
    )
);

-- Teachers can update submissions for grading
CREATE POLICY "teachers_update_class_submissions"
ON public.submissions
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.assignments a
        JOIN public.classes c ON a.class_id = c.id
        WHERE a.id = submissions.assignment_id
        AND c.teacher_id = auth.uid()
    )
);

-- Admins have full access
CREATE POLICY "admins_all_submissions"
ON public.submissions
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    )
);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get latest submission for a student/assignment
CREATE OR REPLACE FUNCTION get_latest_submission(
    p_student_id UUID,
    p_assignment_id UUID
)
RETURNS public.submissions AS $$
BEGIN
    RETURN (
        SELECT s.*
        FROM public.submissions s
        WHERE s.student_id = p_student_id
        AND s.assignment_id = p_assignment_id
        ORDER BY s.attempt_number DESC
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Check if student can submit (respects max_attempts)
CREATE OR REPLACE FUNCTION can_student_submit(
    p_student_id UUID,
    p_assignment_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    max_allowed_attempts INTEGER;
    current_attempts INTEGER;
BEGIN
    -- Get max_attempts for the assignment
    SELECT max_attempts INTO max_allowed_attempts
    FROM public.assignments
    WHERE id = p_assignment_id;

    -- Count existing submitted attempts (not drafts)
    SELECT COUNT(*) INTO current_attempts
    FROM public.submissions
    WHERE student_id = p_student_id
    AND assignment_id = p_assignment_id
    AND status IN ('submitted', 'graded');

    RETURN current_attempts < max_allowed_attempts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Get submission statistics for an assignment
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
BEGIN
    RETURN QUERY
    WITH student_count AS (
        SELECT COUNT(DISTINCT e.student_id) as total
        FROM public.enrollments e
        JOIN public.assignments a ON e.class_id = a.class_id
        WHERE a.id = p_assignment_id
        AND e.status = 'active'
    ),
    submission_stats AS (
        SELECT
            COUNT(*) FILTER (WHERE status = 'submitted') as submitted,
            COUNT(*) FILTER (WHERE status = 'draft') as drafts,
            COUNT(*) FILTER (WHERE status = 'graded') as graded,
            COUNT(*) FILTER (WHERE is_late = TRUE) as late,
            COUNT(*) FILTER (WHERE is_late = FALSE AND status != 'draft') as on_time
        FROM public.submissions
        WHERE assignment_id = p_assignment_id
    )
    SELECT
        sc.total::INTEGER,
        ss.submitted::INTEGER,
        ss.drafts::INTEGER,
        ss.graded::INTEGER,
        ss.late::INTEGER,
        ss.on_time::INTEGER,
        CASE
            WHEN sc.total > 0 THEN ROUND((ss.submitted::NUMERIC / sc.total::NUMERIC) * 100, 2)
            ELSE 0
        END
    FROM student_count sc, submission_stats ss;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.submissions IS 'Student assignment submissions with support for quiz answers, file uploads, text responses, and links';
COMMENT ON COLUMN public.submissions.id IS 'Unique identifier for the submission';
COMMENT ON COLUMN public.submissions.assignment_id IS 'Reference to the assignment being submitted';
COMMENT ON COLUMN public.submissions.student_id IS 'Reference to the student submitting';
COMMENT ON COLUMN public.submissions.submitted_at IS 'Timestamp when submission was finalized (NULL for drafts)';
COMMENT ON COLUMN public.submissions.is_late IS 'Automatically calculated based on due_date comparison';
COMMENT ON COLUMN public.submissions.status IS 'Current status: draft, submitted, or graded';
COMMENT ON COLUMN public.submissions.submission_type IS 'Type of submission: quiz_answers, file_upload, text_response, or link';
COMMENT ON COLUMN public.submissions.quiz_answers IS 'JSONB object storing quiz answers as {questionId: selectedAnswer}';
COMMENT ON COLUMN public.submissions.text_response IS 'Text content for written assignments';
COMMENT ON COLUMN public.submissions.file_url IS 'URL to uploaded file in Supabase Storage';
COMMENT ON COLUMN public.submissions.file_name IS 'Original filename of uploaded file';
COMMENT ON COLUMN public.submissions.link_url IS 'External URL for link submissions';
COMMENT ON COLUMN public.submissions.attempt_number IS 'Attempt number for this assignment (supports multiple attempts)';
