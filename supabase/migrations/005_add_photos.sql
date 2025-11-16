-- Add photos and gallery settings to tutor_profiles
ALTER TABLE tutor_profiles
ADD COLUMN avatar_photo_url TEXT,
ADD COLUMN gallery_photos JSONB DEFAULT '[]'::jsonb,
ADD COLUMN gallery_display_style TEXT DEFAULT 'carousel' CHECK (gallery_display_style IN ('carousel', 'grid', 'hidden'));

-- Comment explaining the structure
COMMENT ON COLUMN tutor_profiles.avatar_photo_url IS 'Main profile photo URL';
COMMENT ON COLUMN tutor_profiles.gallery_photos IS 'Array of photo objects: [{"id": "uuid", "url": "...", "caption": "..."}]';
COMMENT ON COLUMN tutor_profiles.gallery_display_style IS 'How to display photos: carousel, grid, or hidden';

-- Create storage bucket for tutor photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tutor-photos', 'tutor-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Tutors can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tutor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Tutors can update their own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'tutor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Tutors can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'tutor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view tutor photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'tutor-photos');

