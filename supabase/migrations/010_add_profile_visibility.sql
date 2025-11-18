-- Add visibility column to tutor_profiles table
CREATE TYPE profile_visibility AS ENUM ('public', 'restricted', 'private');

ALTER TABLE tutor_profiles
ADD COLUMN visibility profile_visibility DEFAULT 'public'::profile_visibility;

-- Add comment
COMMENT ON COLUMN tutor_profiles.visibility IS 'Profile visibility settings: public (searchable), restricted (link/match only), private (hidden)';

