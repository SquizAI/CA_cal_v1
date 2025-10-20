-- AI Academy @ Centner - Curriculum Sequencing & Standards Mastery Tracking
-- Migration: 005_curriculum_sequencing_schema.sql

-- =====================================================
-- LESSON PROGRESS TRACKING
-- =====================================================
-- Track which lessons have been taught, when, and to whom
CREATE TABLE lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Lesson identification
    subject_key TEXT NOT NULL, -- e.g., '7th_civics'
    lesson_code TEXT NOT NULL, -- e.g., '7_civics_1.1.1'
    day_key TEXT NOT NULL, -- e.g., '1.A'

    -- Class/section info
    period INTEGER CHECK (period IN (1, 2, 3, 4)),
    day_type TEXT CHECK (day_type IN ('A', 'B')),
    grade_level INTEGER CHECK (grade_level IN (7, 9, 11)),

    -- Teaching info
    teacher_id UUID REFERENCES user_profiles(id),
    taught_date DATE, -- When this lesson was actually taught
    scheduled_date DATE, -- Original scheduled date

    -- Status tracking
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'skipped', 'rescheduled')),

    -- Content completion
    objectives_covered TEXT[], -- Which objectives were actually covered
    time_spent_minutes INTEGER,

    -- Notes
    teacher_notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(subject_key, lesson_code, period, day_type)
);

-- =====================================================
-- STANDARDS MASTERY TRACKING
-- =====================================================
-- Track student mastery of individual standards over time
CREATE TABLE standard_mastery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Student & Standard
    student_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    standard_code TEXT NOT NULL, -- e.g., 'SS.912.CG.1.1', 'MA.912.AR.1.1'
    subject_key TEXT NOT NULL,

    -- Mastery level (0-4 scale matching standards-based grading)
    -- 0 = Not assessed
    -- 1 = Beginning (below expectations)
    -- 2 = Developing (approaching expectations)
    -- 3 = Proficient (meets expectations)
    -- 4 = Advanced (exceeds expectations)
    mastery_level INTEGER DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 4),

    -- Evidence sources
    evidence_count INTEGER DEFAULT 0, -- How many assignments/assessments contributed
    last_assessed_date DATE,

    -- Detailed tracking
    scores JSONB DEFAULT '[]'::jsonb, -- Array of {date, score, assignment_id, type}

    -- Flags
    needs_practice BOOLEAN DEFAULT FALSE,
    needs_reteach BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(student_id, standard_code, subject_key)
);

-- =====================================================
-- ASSIGNMENT TO STANDARDS MAPPING
-- =====================================================
-- Links assignments to specific standards they assess
CREATE TABLE assignment_standards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    standard_code TEXT NOT NULL,

    -- Weight of this standard in the assignment (0.0 - 1.0)
    weight DECIMAL(3,2) DEFAULT 1.0 CHECK (weight BETWEEN 0 AND 1),

    -- Which questions assess this standard
    question_numbers INTEGER[],

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(assignment_id, standard_code)
);

-- =====================================================
-- CURRICULUM PACING GUIDE
-- =====================================================
-- Flexible pacing recommendations and adjustments
CREATE TABLE pacing_adjustments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- What's being adjusted
    subject_key TEXT NOT NULL,
    lesson_code TEXT,
    standard_code TEXT,

    -- Pacing recommendation
    suggested_days INTEGER, -- How many days should be spent
    actual_days INTEGER, -- How many days were actually spent

    -- Reason for adjustment
    reason TEXT, -- 'student_needs', 'assessment_results', 'teacher_discretion', etc.
    notes TEXT,

    -- Who made the adjustment
    adjusted_by UUID REFERENCES user_profiles(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ASSIGNMENT GENERATION CONTEXT
-- =====================================================
-- Store context for AI assignment generation
CREATE TABLE assignment_generation_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Generation metadata
    teacher_id UUID REFERENCES user_profiles(id),
    subject_key TEXT NOT NULL,

    -- Context used for generation
    standards_addressed TEXT[], -- Which standards this assignment covers
    lessons_covered TEXT[], -- Which lessons this assesses
    student_needs JSONB, -- {student_id: [needs_practice_on: [standard1, standard2]]}

    -- Generated assignment
    assignment_id UUID REFERENCES assignments(id),

    -- AI generation details
    prompt_used TEXT,
    model_used TEXT DEFAULT 'claude-sonnet-4-5',
    generation_time_ms INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_lesson_progress_subject ON lesson_progress(subject_key, status);
CREATE INDEX idx_lesson_progress_teacher ON lesson_progress(teacher_id, taught_date);
CREATE INDEX idx_lesson_progress_date ON lesson_progress(taught_date);

CREATE INDEX idx_standard_mastery_student ON standard_mastery(student_id, subject_key);
CREATE INDEX idx_standard_mastery_standard ON standard_mastery(standard_code, mastery_level);
CREATE INDEX idx_standard_mastery_needs ON standard_mastery(needs_practice) WHERE needs_practice = true;

CREATE INDEX idx_assignment_standards_assignment ON assignment_standards(assignment_id);
CREATE INDEX idx_assignment_standards_standard ON assignment_standards(standard_code);

CREATE INDEX idx_pacing_subject ON pacing_adjustments(subject_key);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE standard_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacing_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_generation_log ENABLE ROW LEVEL SECURITY;

-- Lesson Progress: Teachers can view/edit their own lessons
CREATE POLICY "Teachers can manage lesson progress" ON lesson_progress
    FOR ALL USING (
        teacher_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('admin')
        )
    );

-- Standard Mastery: Students can view own, teachers can view all
CREATE POLICY "Students can view own mastery" ON standard_mastery
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can manage standard mastery" ON standard_mastery
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('teacher', 'admin')
        )
    );

-- Assignment Standards: Public read, teachers can manage
CREATE POLICY "Everyone can view assignment standards" ON assignment_standards
    FOR SELECT USING (true);

CREATE POLICY "Teachers can manage assignment standards" ON assignment_standards
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM assignments a
            WHERE a.id = assignment_standards.assignment_id
            AND a.teacher_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Pacing: Teachers can manage
CREATE POLICY "Teachers can manage pacing" ON pacing_adjustments
    FOR ALL USING (
        adjusted_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('teacher', 'admin')
        )
    );

-- Assignment Generation Log: Teachers can view their own
CREATE POLICY "Teachers can view own generation logs" ON assignment_generation_log
    FOR SELECT USING (
        teacher_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Teachers can create generation logs" ON assignment_generation_log
    FOR INSERT WITH CHECK (teacher_id = auth.uid());

-- =====================================================
-- TRIGGERS
-- =====================================================
CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON lesson_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_standard_mastery_updated_at BEFORE UPDATE ON standard_mastery
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pacing_updated_at BEFORE UPDATE ON pacing_adjustments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to update standard mastery based on assignment score
CREATE OR REPLACE FUNCTION update_standard_mastery_from_submission()
RETURNS TRIGGER AS $$
DECLARE
    standard_rec RECORD;
    mastery_score INTEGER;
    percentage DECIMAL;
BEGIN
    -- Only process when graded
    IF NEW.status = 'graded' AND NEW.points_earned IS NOT NULL THEN
        -- Get assignment details
        FOR standard_rec IN
            SELECT
                ast.standard_code,
                ast.weight,
                a.subject_id,
                s.subject_key,
                a.total_points
            FROM assignment_standards ast
            JOIN assignments a ON a.id = ast.assignment_id
            JOIN subjects s ON s.id = a.subject_id
            WHERE ast.assignment_id = NEW.assignment_id
        LOOP
            -- Calculate percentage for this standard
            percentage = (NEW.points_earned / NULLIF(standard_rec.total_points, 0)) * standard_rec.weight;

            -- Convert to mastery level (0-4 scale)
            mastery_score = CASE
                WHEN percentage >= 0.90 THEN 4 -- Advanced
                WHEN percentage >= 0.75 THEN 3 -- Proficient
                WHEN percentage >= 0.60 THEN 2 -- Developing
                WHEN percentage >= 0.40 THEN 1 -- Beginning
                ELSE 0 -- Not assessed / insufficient evidence
            END;

            -- Update or insert standard mastery
            INSERT INTO standard_mastery (
                student_id,
                standard_code,
                subject_key,
                mastery_level,
                evidence_count,
                last_assessed_date,
                scores,
                needs_practice,
                needs_reteach
            ) VALUES (
                NEW.student_id,
                standard_rec.standard_code,
                standard_rec.subject_key,
                mastery_score,
                1,
                CURRENT_DATE,
                jsonb_build_array(
                    jsonb_build_object(
                        'date', CURRENT_DATE,
                        'score', mastery_score,
                        'percentage', percentage,
                        'assignment_id', NEW.assignment_id,
                        'type', 'assignment'
                    )
                ),
                mastery_score < 3,
                mastery_score < 2
            )
            ON CONFLICT (student_id, standard_code, subject_key)
            DO UPDATE SET
                -- Use weighted average of all scores
                mastery_level = (
                    (standard_mastery.mastery_level * standard_mastery.evidence_count + mastery_score) /
                    (standard_mastery.evidence_count + 1)
                )::INTEGER,
                evidence_count = standard_mastery.evidence_count + 1,
                last_assessed_date = CURRENT_DATE,
                scores = standard_mastery.scores || jsonb_build_array(
                    jsonb_build_object(
                        'date', CURRENT_DATE,
                        'score', mastery_score,
                        'percentage', percentage,
                        'assignment_id', NEW.assignment_id,
                        'type', 'assignment'
                    )
                ),
                needs_practice = (
                    (standard_mastery.mastery_level * standard_mastery.evidence_count + mastery_score) /
                    (standard_mastery.evidence_count + 1)
                ) < 3,
                needs_reteach = (
                    (standard_mastery.mastery_level * standard_mastery.evidence_count + mastery_score) /
                    (standard_mastery.evidence_count + 1)
                ) < 2,
                updated_at = NOW();
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update mastery when assignments are graded
CREATE TRIGGER update_mastery_on_grade AFTER INSERT OR UPDATE ON submissions
    FOR EACH ROW EXECUTE FUNCTION update_standard_mastery_from_submission();

-- Function to get students who need practice on specific standards
CREATE OR REPLACE FUNCTION get_students_needing_practice(
    p_subject_key TEXT,
    p_standard_code TEXT DEFAULT NULL
)
RETURNS TABLE (
    student_id UUID,
    student_name TEXT,
    standard_code TEXT,
    mastery_level INTEGER,
    last_assessed DATE,
    evidence_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        sm.student_id,
        up.first_name || ' ' || up.last_name AS student_name,
        sm.standard_code,
        sm.mastery_level,
        sm.last_assessed_date,
        sm.evidence_count
    FROM standard_mastery sm
    JOIN user_profiles up ON up.id = sm.student_id
    WHERE sm.subject_key = p_subject_key
    AND sm.needs_practice = true
    AND (p_standard_code IS NULL OR sm.standard_code = p_standard_code)
    ORDER BY sm.mastery_level ASC, sm.last_assessed_date ASC NULLS FIRST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get upcoming lessons that need assignments
CREATE OR REPLACE FUNCTION get_upcoming_lessons_needing_assignments(
    p_subject_key TEXT,
    p_days_ahead INTEGER DEFAULT 7
)
RETURNS TABLE (
    lesson_code TEXT,
    day_key TEXT,
    scheduled_date DATE,
    title TEXT,
    standards TEXT,
    has_assignment BOOLEAN,
    students_need_practice INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        lp.lesson_code,
        lp.day_key,
        lp.scheduled_date,
        'Lesson ' || lp.lesson_code AS title,
        '' AS standards, -- Will be populated from curriculum data
        EXISTS (
            SELECT 1 FROM assignments a
            WHERE a.day_key = lp.day_key
            AND a.subject_id = (SELECT id FROM subjects WHERE subject_key = p_subject_key LIMIT 1)
        ) AS has_assignment,
        0 AS students_need_practice -- Will be calculated based on standard mastery
    FROM lesson_progress lp
    WHERE lp.subject_key = p_subject_key
    AND lp.scheduled_date BETWEEN CURRENT_DATE AND CURRENT_DATE + p_days_ahead
    AND lp.status = 'upcoming'
    ORDER BY lp.scheduled_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE lesson_progress IS 'Track which lessons have been taught and their status';
COMMENT ON TABLE standard_mastery IS 'Student mastery levels for individual standards over time';
COMMENT ON TABLE assignment_standards IS 'Maps assignments to the standards they assess';
COMMENT ON TABLE pacing_adjustments IS 'Track pacing changes and recommendations';
COMMENT ON TABLE assignment_generation_log IS 'Log AI-generated assignments for context and improvement';
