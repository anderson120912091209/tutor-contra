-- Modify students table to support parent-only creation (no tutor yet)
-- and align with new schema requirements

-- 1. Make tutor_id nullable (since students are created by parents before matching)
ALTER TABLE students ALTER COLUMN tutor_id DROP NOT NULL;

-- 2. Rename level to grade_level for clarity
ALTER TABLE students RENAME COLUMN level TO grade_level;

-- 3. Add notes column
ALTER TABLE students ADD COLUMN notes TEXT;

-- 4. Add comments
COMMENT ON COLUMN students.tutor_id IS 'The tutor teaching this student. Null if not yet matched.';
COMMENT ON COLUMN students.grade_level IS 'Grade level of the student (e.g. Primary 4, Grade 10)';
COMMENT ON COLUMN students.notes IS 'Notes about the student (learning needs, etc.)';

