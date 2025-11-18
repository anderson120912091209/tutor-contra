-- Allow parents to insert students
-- This is required for the parent onboarding flow where they add their first student

CREATE POLICY "Parents can insert students"
  ON students FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM parent_profiles
      WHERE parent_profiles.id = students.parent_id
      AND parent_profiles.user_id = auth.uid()
    )
  );

-- Also ensure parents can update their own students (if they need to edit later)
CREATE POLICY "Parents can update their own students"
  ON students FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM parent_profiles
      WHERE parent_profiles.id = students.parent_id
      AND parent_profiles.user_id = auth.uid()
    )
  );

