-- Enable Row Level Security
ALTER TABLE tutor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Tutor Profiles Policies
-- Public can read tutor profiles (for public profile page)
CREATE POLICY "Tutor profiles are viewable by everyone"
  ON tutor_profiles FOR SELECT
  USING (true);

-- Tutors can insert their own profile
CREATE POLICY "Tutors can insert their own profile"
  ON tutor_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Tutors can update their own profile
CREATE POLICY "Tutors can update their own profile"
  ON tutor_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Parent Profiles Policies
-- Parents can view their own profile
CREATE POLICY "Parents can view their own profile"
  ON parent_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Parents can insert their own profile
CREATE POLICY "Parents can insert their own profile"
  ON parent_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Parents can update their own profile
CREATE POLICY "Parents can update their own profile"
  ON parent_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Students Policies
-- Tutors can view their own students
CREATE POLICY "Tutors can view their own students"
  ON students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tutor_profiles
      WHERE tutor_profiles.id = students.tutor_id
      AND tutor_profiles.user_id = auth.uid()
    )
  );

-- Parents can view their own students
CREATE POLICY "Parents can view their own students"
  ON students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_profiles
      WHERE parent_profiles.id = students.parent_id
      AND parent_profiles.user_id = auth.uid()
    )
  );

-- Tutors can insert students
CREATE POLICY "Tutors can insert students"
  ON students FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tutor_profiles
      WHERE tutor_profiles.id = students.tutor_id
      AND tutor_profiles.user_id = auth.uid()
    )
  );

-- Tutors can update their own students
CREATE POLICY "Tutors can update their own students"
  ON students FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tutor_profiles
      WHERE tutor_profiles.id = students.tutor_id
      AND tutor_profiles.user_id = auth.uid()
    )
  );

-- Lessons Policies
-- Tutors can view their own lessons
CREATE POLICY "Tutors can view their own lessons"
  ON lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tutor_profiles
      WHERE tutor_profiles.id = lessons.tutor_id
      AND tutor_profiles.user_id = auth.uid()
    )
  );

-- Parents can view lessons for their students
CREATE POLICY "Parents can view lessons for their students"
  ON lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      JOIN parent_profiles ON parent_profiles.id = students.parent_id
      WHERE students.id = lessons.student_id
      AND parent_profiles.user_id = auth.uid()
    )
  );

-- Tutors can insert lessons for their students
CREATE POLICY "Tutors can insert lessons"
  ON lessons FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tutor_profiles
      WHERE tutor_profiles.id = lessons.tutor_id
      AND tutor_profiles.user_id = auth.uid()
    )
  );

-- Tutors can update their own lessons
CREATE POLICY "Tutors can update their own lessons"
  ON lessons FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tutor_profiles
      WHERE tutor_profiles.id = lessons.tutor_id
      AND tutor_profiles.user_id = auth.uid()
    )
  );

-- Lesson Confirmations Policies
-- Tutors can view confirmations for their lessons
CREATE POLICY "Tutors can view confirmations for their lessons"
  ON lesson_confirmations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lessons
      JOIN tutor_profiles ON tutor_profiles.id = lessons.tutor_id
      WHERE lessons.id = lesson_confirmations.lesson_id
      AND tutor_profiles.user_id = auth.uid()
    )
  );

-- Parents can view confirmations for their students' lessons
CREATE POLICY "Parents can view confirmations for their students lessons"
  ON lesson_confirmations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lessons
      JOIN students ON students.id = lessons.student_id
      JOIN parent_profiles ON parent_profiles.id = students.parent_id
      WHERE lessons.id = lesson_confirmations.lesson_id
      AND parent_profiles.user_id = auth.uid()
    )
  );

-- System can insert lesson confirmations (typically via API)
CREATE POLICY "Authenticated users can insert lesson confirmations"
  ON lesson_confirmations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Tutors and parents can update confirmations
CREATE POLICY "Tutors and parents can update lesson confirmations"
  ON lesson_confirmations FOR UPDATE
  USING (
    -- Tutor owns the lesson
    EXISTS (
      SELECT 1 FROM lessons
      JOIN tutor_profiles ON tutor_profiles.id = lessons.tutor_id
      WHERE lessons.id = lesson_confirmations.lesson_id
      AND tutor_profiles.user_id = auth.uid()
    )
    OR
    -- Parent owns the student
    EXISTS (
      SELECT 1 FROM lessons
      JOIN students ON students.id = lessons.student_id
      JOIN parent_profiles ON parent_profiles.id = students.parent_id
      WHERE lessons.id = lesson_confirmations.lesson_id
      AND parent_profiles.user_id = auth.uid()
    )
  );

-- Testimonials Policies
-- Public can view public testimonials
CREATE POLICY "Public testimonials are viewable by everyone"
  ON testimonials FOR SELECT
  USING (is_public = true);

-- Tutors can view testimonials about them
CREATE POLICY "Tutors can view their testimonials"
  ON testimonials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tutor_profiles
      WHERE tutor_profiles.id = testimonials.tutor_id
      AND tutor_profiles.user_id = auth.uid()
    )
  );

-- Parents can view their own testimonials
CREATE POLICY "Parents can view their own testimonials"
  ON testimonials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_profiles
      WHERE parent_profiles.id = testimonials.parent_id
      AND parent_profiles.user_id = auth.uid()
    )
  );

-- Parents can insert testimonials
CREATE POLICY "Parents can insert testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM parent_profiles
      WHERE parent_profiles.id = testimonials.parent_id
      AND parent_profiles.user_id = auth.uid()
    )
  );

-- Parents can update their own testimonials
CREATE POLICY "Parents can update their own testimonials"
  ON testimonials FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM parent_profiles
      WHERE parent_profiles.id = testimonials.parent_id
      AND parent_profiles.user_id = auth.uid()
    )
  );


