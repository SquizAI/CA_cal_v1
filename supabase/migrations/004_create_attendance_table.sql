-- Create attendance table with daily participation and effort grading
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    date DATE NOT NULL,
    period INTEGER NOT NULL CHECK (period IN (1, 2, 3, 4)),
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'tardy', 'excused')),

    -- Daily formative grades (0-5 scale)
    -- These contribute to overall grade:
    -- 5% Participation + 5% Effort = 10% of Formative (40% total)
    participation_grade INTEGER CHECK (participation_grade >= 0 AND participation_grade <= 5),
    effort_grade INTEGER CHECK (effort_grade >= 0 AND effort_grade <= 5),

    -- Teacher notes
    notes TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    teacher_email TEXT,

    -- Ensure one attendance record per student per period per day
    UNIQUE(student_id, date, period)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_period ON attendance(period);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);

-- Add RLS policies
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Allow teachers to view all attendance
CREATE POLICY "Teachers can view all attendance"
    ON attendance
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow teachers to insert attendance
CREATE POLICY "Teachers can create attendance"
    ON attendance
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow teachers to update attendance
CREATE POLICY "Teachers can update attendance"
    ON attendance
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_attendance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER attendance_updated_at
    BEFORE UPDATE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION update_attendance_updated_at();

-- Add comment to table
COMMENT ON TABLE attendance IS 'Daily attendance records with participation and effort grades (0-5 scale). Participation (5%) and Effort (5%) contribute to Formative grade (40% total).';
COMMENT ON COLUMN attendance.participation_grade IS 'Daily participation grade 0-5 (contributes 5% to overall grade)';
COMMENT ON COLUMN attendance.effort_grade IS 'Daily effort grade 0-5 (contributes 5% to overall grade)';
