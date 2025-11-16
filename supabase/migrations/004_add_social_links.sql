-- Add social media links to tutor_profiles
ALTER TABLE tutor_profiles
ADD COLUMN social_links JSONB DEFAULT '{}'::jsonb;

-- Comment explaining the structure
COMMENT ON COLUMN tutor_profiles.social_links IS 'Social media links in JSON format: {"facebook": "url", "instagram": "url", "threads": "url", "github": "url"}';

