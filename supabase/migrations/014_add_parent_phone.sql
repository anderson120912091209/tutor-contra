-- Add phone column to parent_profiles
ALTER TABLE parent_profiles
ADD COLUMN phone TEXT;

-- Add comment
COMMENT ON COLUMN parent_profiles.phone IS 'Contact phone number for the parent';

