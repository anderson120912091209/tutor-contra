-- University Email Verification System
-- Adds support for verifying tutor university affiliation via email

-- Create university_verifications table
CREATE TABLE university_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  university_id TEXT NOT NULL,
  university_name TEXT NOT NULL,
  verification_email TEXT NOT NULL,
  verification_token TEXT NOT NULL UNIQUE,
  token_expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add university_verified field to tutor_profiles for quick lookup
ALTER TABLE tutor_profiles 
ADD COLUMN IF NOT EXISTS university_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS university_verified_at TIMESTAMPTZ;

-- Create indexes for better performance
CREATE INDEX idx_university_verifications_tutor_id ON university_verifications(tutor_id);
CREATE INDEX idx_university_verifications_token ON university_verifications(verification_token);
CREATE INDEX idx_university_verifications_email ON university_verifications(verification_email);
CREATE INDEX idx_university_verifications_expires_at ON university_verifications(token_expires_at);

-- Add updated_at trigger
CREATE TRIGGER update_university_verifications_updated_at 
  BEFORE UPDATE ON university_verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE university_verifications ENABLE ROW LEVEL SECURITY;

-- Tutors can view their own verification records
CREATE POLICY "Tutors can view their own verification records"
  ON university_verifications
  FOR SELECT
  USING (
    tutor_id IN (
      SELECT id FROM tutor_profiles WHERE user_id = auth.uid()
    )
  );

-- Tutors can insert their own verification records
CREATE POLICY "Tutors can insert their own verification records"
  ON university_verifications
  FOR INSERT
  WITH CHECK (
    tutor_id IN (
      SELECT id FROM tutor_profiles WHERE user_id = auth.uid()
    )
  );

-- Tutors can update their own verification records
CREATE POLICY "Tutors can update their own verification records"
  ON university_verifications
  FOR UPDATE
  USING (
    tutor_id IN (
      SELECT id FROM tutor_profiles WHERE user_id = auth.uid()
    )
  );

-- Function to automatically update tutor_profiles.university_verified when verification is completed
CREATE OR REPLACE FUNCTION update_tutor_university_verified()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verified = true AND OLD.verified = false THEN
    UPDATE tutor_profiles
    SET 
      university_verified = true,
      university_verified_at = NEW.verified_at
    WHERE id = NEW.tutor_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update tutor_profiles when verification is completed
CREATE TRIGGER update_tutor_university_verified_trigger
  AFTER UPDATE ON university_verifications
  FOR EACH ROW
  WHEN (NEW.verified = true AND OLD.verified = false)
  EXECUTE FUNCTION update_tutor_university_verified();

