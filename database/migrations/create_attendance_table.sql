-- Migration: Create Attendance Table
-- Date: 2025-10-20
-- Project: qypmfilbkvxwyznnenge
-- Purpose: Track student attendance with participation and effort grading

-- Create attendance table with participation and effort grading
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    date DATE NOT NULL,
    period INTEGER NOT NULL CHECK (period BETWEEN 1 AND 4),
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'tardy', 'excused')),
    participation_grade INTEGER CHECK (participation_grade BETWEEN 0 AND 5),
    effort_grade INTEGER CHECK (effort_grade BETWEEN 0 AND 5),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    teacher_email TEXT,
    CONSTRAINT unique_student_date_period UNIQUE (student_id, date, period)
);

-- Create indexes for performance
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_period ON attendance(period);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);

-- Create trigger for automatic updated_at timestamp
CREATE OR REPLACE FUNCTION update_attendance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_attendance_updated_at
    BEFORE UPDATE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION update_attendance_updated_at();

-- Enable Row Level Security
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow authenticated users to SELECT
CREATE POLICY "authenticated_users_select_attendance"
ON attendance FOR SELECT TO authenticated
USING (true);

-- RLS Policy: Allow authenticated users to INSERT
CREATE POLICY "authenticated_users_insert_attendance"
ON attendance FOR INSERT TO authenticated
WITH CHECK (true);

-- RLS Policy: Allow authenticated users to UPDATE
CREATE POLICY "authenticated_users_update_attendance"
ON attendance FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Add helpful comments to table
COMMENT ON TABLE attendance IS 'Attendance records with participation and effort grades. Participation and effort each contribute 5% to the formative grade (40% total).';
COMMENT ON COLUMN attendance.participation_grade IS 'Daily participation grade (0-5), contributes 5% to overall grade';
COMMENT ON COLUMN attendance.effort_grade IS 'Daily effort grade (0-5), contributes 5% to overall grade';
COMMENT ON COLUMN attendance.period IS 'Class period (1-4)';
COMMENT ON COLUMN attendance.status IS 'Attendance status: present, absent, tardy, or excused';

-- Migration applied successfully on 2025-10-20
-- Status: COMPLETE
