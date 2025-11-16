-- Add education field to tutor_profiles
ALTER TABLE tutor_profiles
ADD COLUMN education JSONB DEFAULT '[]'::jsonb;

-- Education structure example:
-- [
--   {
--     "university": "國立台灣大學",
--     "degree": "學士",
--     "major": "資訊工程學系",
--     "startYear": 2015,
--     "endYear": 2019,
--     "universityId": "ntu"
--   }
-- ]

-- Add index for better query performance
CREATE INDEX idx_tutor_profiles_education ON tutor_profiles USING GIN (education);

COMMENT ON COLUMN tutor_profiles.education IS 'Array of education entries with university, degree, major, and years';

