-- Add availability schedule for parents
CREATE TABLE IF NOT EXISTS parent_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES parent_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Add indexes
CREATE INDEX idx_parent_availability_parent ON parent_availability(parent_id);
CREATE INDEX idx_parent_availability_day ON parent_availability(day_of_week);

-- Comments
COMMENT ON TABLE parent_availability IS 'Weekly recurring availability schedule for parents';
COMMENT ON COLUMN parent_availability.day_of_week IS '0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday';

-- RLS Policies
ALTER TABLE parent_availability ENABLE ROW LEVEL SECURITY;

-- Parents can manage their own availability
CREATE POLICY "Parents can view their own availability"
ON parent_availability FOR SELECT
TO authenticated
USING (
  parent_id IN (
    SELECT id FROM parent_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Parents can insert their own availability"
ON parent_availability FOR INSERT
TO authenticated
WITH CHECK (
  parent_id IN (
    SELECT id FROM parent_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Parents can update their own availability"
ON parent_availability FOR UPDATE
TO authenticated
USING (
  parent_id IN (
    SELECT id FROM parent_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Parents can delete their own availability"
ON parent_availability FOR DELETE
TO authenticated
USING (
  parent_id IN (
    SELECT id FROM parent_profiles WHERE user_id = auth.uid()
  )
);

-- Function to update updated_at timestamp
CREATE TRIGGER update_parent_availability_timestamp
BEFORE UPDATE ON parent_availability
FOR EACH ROW
EXECUTE FUNCTION update_tutor_availability_updated_at();

