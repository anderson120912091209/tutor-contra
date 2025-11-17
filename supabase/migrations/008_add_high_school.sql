-- Add high school information to tutor_profiles
-- This includes high school name and the education system they studied

ALTER TABLE tutor_profiles 
ADD COLUMN IF NOT EXISTS high_school TEXT,
ADD COLUMN IF NOT EXISTS high_school_system TEXT,
ADD COLUMN IF NOT EXISTS high_school_system_other TEXT;

-- Add comment for documentation
COMMENT ON COLUMN tutor_profiles.high_school IS 'High school name (e.g., 建國中學)';
COMMENT ON COLUMN tutor_profiles.high_school_system IS 'Education system: IB, AP, 學測, 高職, A-Levels, or 其他';
COMMENT ON COLUMN tutor_profiles.high_school_system_other IS 'Custom education system when high_school_system is 其他';

