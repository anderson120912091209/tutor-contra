export type UserRole = "tutor" | "parent";

export type LessonStatus = "scheduled" | "completed" | "cancelled";

export type ConfirmationStatus = "verified" | "disputed" | "no_show" | "unconfirmed";

export interface Education {
  university: string;
  universityId: string;
  degree: string;
  major: string;
  startYear: number;
  endYear?: number;
  website?: string; // Store website URL for logo fetching
  country?: string; // Store country for display
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  threads?: string;
  github?: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
}

export type GalleryDisplayStyle = 'carousel' | 'grid' | 'hidden';

export interface CalendarTokens {
  access_token: string;
  refresh_token: string;
  expiry_date: number;
}

export interface AvailabilitySlot {
  id: string;
  tutor_id: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string; // HH:MM format
  end_time: string;   // HH:MM format
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface TutorProfile {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  subjects: string[];
  location: string | null;
  teaches_online: boolean;
  years_experience: number | null;
  avatar_url: string | null;
  avatar_photo_url: string | null;
  public_slug: string;
  education: Education[];
  social_links: SocialLinks;
  gallery_photos: GalleryPhoto[];
  gallery_display_style: GalleryDisplayStyle;
  google_calendar_enabled: boolean;
  google_calendar_token: CalendarTokens | null;
  google_calendar_id: string | null;
  notion_calendar_enabled: boolean;
  notion_calendar_token: CalendarTokens | null;
  notion_database_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ParentProfile {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  parent_id: string;
  name: string;
  grade_level: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  tutor_id: string;
  student_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: LessonStatus;
  notes: string | null;
  google_calendar_event_id: string | null;
  notion_page_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface LessonConfirmation {
  id: string;
  lesson_id: string;
  confirmed_by_parent_at: string | null;
  confirmation_status: ConfirmationStatus;
  parent_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  tutor_id: string;
  parent_id: string;
  lesson_id: string;
  rating: number;
  content: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}
