-- Add onboarding_completed column to parent_profiles
ALTER TABLE parent_profiles
ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;

-- Add comment
COMMENT ON COLUMN parent_profiles.onboarding_completed IS 'Whether the parent has completed the onboarding wizard';

