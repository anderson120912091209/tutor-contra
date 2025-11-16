-- Add availability schedule for tutors
CREATE TABLE IF NOT EXISTS tutor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Add indexes
CREATE INDEX idx_tutor_availability_tutor ON tutor_availability(tutor_id);
CREATE INDEX idx_tutor_availability_day ON tutor_availability(day_of_week);

-- Add calendar integrations to tutor_profiles
ALTER TABLE tutor_profiles
ADD COLUMN google_calendar_enabled BOOLEAN DEFAULT false,
ADD COLUMN google_calendar_token JSONB,
ADD COLUMN google_calendar_id TEXT,
ADD COLUMN notion_calendar_enabled BOOLEAN DEFAULT false,
ADD COLUMN notion_calendar_token JSONB,
ADD COLUMN notion_database_id TEXT;

-- Comments
COMMENT ON TABLE tutor_availability IS 'Weekly recurring availability schedule for tutors';
COMMENT ON COLUMN tutor_availability.day_of_week IS '0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday';
COMMENT ON COLUMN tutor_profiles.google_calendar_token IS 'OAuth tokens for Google Calendar API';
COMMENT ON COLUMN tutor_profiles.notion_calendar_token IS 'OAuth tokens for Notion API';

-- RLS Policies
ALTER TABLE tutor_availability ENABLE ROW LEVEL SECURITY;

-- Tutors can manage their own availability
CREATE POLICY "Tutors can view their own availability"
ON tutor_availability FOR SELECT
TO authenticated
USING (
  tutor_id IN (
    SELECT id FROM tutor_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Tutors can insert their own availability"
ON tutor_availability FOR INSERT
TO authenticated
WITH CHECK (
  tutor_id IN (
    SELECT id FROM tutor_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Tutors can update their own availability"
ON tutor_availability FOR UPDATE
TO authenticated
USING (
  tutor_id IN (
    SELECT id FROM tutor_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Tutors can delete their own availability"
ON tutor_availability FOR DELETE
TO authenticated
USING (
  tutor_id IN (
    SELECT id FROM tutor_profiles WHERE user_id = auth.uid()
  )
);

-- Anyone can view tutor availability (for parents)
CREATE POLICY "Anyone can view tutor availability"
ON tutor_availability FOR SELECT
TO public
USING (is_available = true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_tutor_availability_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tutor_availability_timestamp
BEFORE UPDATE ON tutor_availability
FOR EACH ROW
EXECUTE FUNCTION update_tutor_availability_updated_at();

