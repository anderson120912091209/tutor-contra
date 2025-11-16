import type { TutorProfile } from "@/lib/types/database";
import { EducationDisplay } from "./education-display";
import { SocialLinksDisplay } from "./social-links-display";
import { PhotoGalleryDisplay } from "./photo-gallery-display";
import Image from "next/image";

interface ProfilePreviewProps {
  profile: TutorProfile;
}

export function ProfilePreview({ profile }: ProfilePreviewProps) {
  return (
    <div className="space-y-6 p-6">
      {/* Profile Photo */}
      {profile.avatar_photo_url && (
        <div className="flex justify-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={profile.avatar_photo_url}
              alt={profile.display_name}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="space-y-3 text-center">
        <h1 className="text-3xl font-bold">{profile.display_name}</h1>
        
        {profile.social_links && (
          <div className="flex justify-center">
            <SocialLinksDisplay socialLinks={profile.social_links} />
          </div>
        )}
        
        {profile.bio && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {profile.bio}
          </p>
        )}
        
        <div className="flex flex-wrap gap-3 pt-2">
          {profile.subjects.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.subjects.map((subject) => (
                <span
                  key={subject}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium"
                >
                  {subject}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm pt-2">
          {profile.location && (
            <div className="flex items-center gap-1.5">
              <span>📍</span>
              <span>{profile.location}</span>
            </div>
          )}
          
          {profile.years_experience && (
            <div className="flex items-center gap-1.5">
              <span>👨‍🏫</span>
              <span>{profile.years_experience} 年教學經驗</span>
            </div>
          )}
          
          {profile.teaches_online && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
              <span>💻</span>
              <span>提供線上教學</span>
            </div>
          )}
        </div>
      </section>

      {/* Photo Gallery */}
      {profile.gallery_photos && profile.gallery_photos.length > 0 && (
        <div className="pt-4">
          <PhotoGalleryDisplay
            photos={profile.gallery_photos}
            displayStyle={profile.gallery_display_style}
          />
        </div>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <div className="pt-4 border-t">
          <EducationDisplay education={profile.education} />
        </div>
      )}

      {/* Placeholder for future sections */}
      <div className="pt-6 border-t">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">教學成果</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">驗證時數</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">活躍學生</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">-</div>
              <div className="text-sm text-muted-foreground">平均評分</div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State Hint */}
      {(!profile.bio || profile.subjects.length === 0) && (
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <div className="font-medium text-yellow-900 mb-1">
                完善您的檔案
              </div>
              <div className="text-sm text-yellow-700">
                建議填寫個人簡介與教學科目，讓家長更容易找到您！
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

