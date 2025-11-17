import type { TutorProfile } from "@/lib/types/database";
import { SocialLinksDisplay } from "./social-links-display";
import { UniversityLogoImage } from "./university-logo-image";
import Image from "next/image";

interface ProfilePreviewProps {
  profile: TutorProfile;
}

// Helper function to render bio with highlighted keywords
function renderBioWithHighlights(bio: string) {
  // Keywords to highlight (can be made editable later)
  const keywords = ['IB', 'AP', 'SAT', 'ACT', '學測', '指考', '托福', 'TOEFL', 'IELTS', '雅思'];
  
  let parts: Array<{ text: string; highlight: boolean }> = [{ text: bio, highlight: false }];
  
  keywords.forEach(keyword => {
    const newParts: Array<{ text: string; highlight: boolean }> = [];
    parts.forEach(part => {
      if (part.highlight) {
        newParts.push(part);
      } else {
        const splits = part.text.split(new RegExp(`(${keyword})`, 'gi'));
        splits.forEach(split => {
          if (split.toLowerCase() === keyword.toLowerCase()) {
            newParts.push({ text: split, highlight: true });
          } else if (split) {
            newParts.push({ text: split, highlight: false });
          }
        });
      }
    });
    parts = newParts;
  });
  
  return parts;
}

export function ProfilePreview({ profile }: ProfilePreviewProps) {
  const bioHighlights = profile.bio ? renderBioWithHighlights(profile.bio) : [];
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f3ef" }}>
      {/* Header Banner */}
      <div 
        className="relative h-48 overflow-hidden"
        style={{
          background: profile.gallery_photos && profile.gallery_photos.length > 0
            ? `url(${profile.gallery_photos[0].url})`
            : 'linear-gradient(135deg, #e0c3d8 0%, #d4b5d5 50%, #c8a7d1 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 -mt-16 pb-16">
        <div className="flex gap-8 items-start">
          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0">
            {/* Brand Icon / Logo Placeholder */}
            <div className="mb-6">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-md"
                style={{ backgroundColor: "#e07a3f" }}
              >
                👨‍🏫
              </div>
            </div>

            {/* Name */}
            <h1 className="text-4xl font-bold mb-8" style={{ color: "#2c2c2c" }}>
              {profile.display_name}
            </h1>

            {/* Avatar */}
            {profile.avatar_photo_url && (
              <div className="mb-8">
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={profile.avatar_photo_url}
                    alt={profile.display_name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Contact Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4" style={{ color: "#2c2c2c" }}>
                聯絡方式
              </h2>
              
              {profile.location && (
                <div className="flex items-start gap-3">
                  <span className="text-lg">📍</span>
                  <div>
                    <div className="text-sm font-medium" style={{ color: "#6b6b6b" }}>地點</div>
                    <div className="text-base" style={{ color: "#2c2c2c" }}>{profile.location}</div>
                  </div>
                </div>
              )}
              
              {profile.years_experience && (
                <div className="flex items-start gap-3">
                  <span className="text-lg">📚</span>
                  <div>
                    <div className="text-sm font-medium" style={{ color: "#6b6b6b" }}>教學年資</div>
                    <div className="text-base" style={{ color: "#2c2c2c" }}>{profile.years_experience} 年</div>
                  </div>
                </div>
              )}
              
              {profile.teaches_online && (
                <div className="flex items-start gap-3">
                  <span className="text-lg">💻</span>
                  <div>
                    <div className="text-sm font-medium" style={{ color: "#6b6b6b" }}>授課方式</div>
                    <div className="text-base" style={{ color: "#2c2c2c" }}>提供線上教學</div>
                  </div>
                </div>
              )}

              {profile.social_links && (
                <div className="flex items-start gap-3">
                  <span className="text-lg">🔗</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-2" style={{ color: "#6b6b6b" }}>社群媒體</div>
                    <SocialLinksDisplay socialLinks={profile.social_links} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 pt-20">
            {/* Bio with Highlighted Keywords */}
            {profile.bio && (
              <div className="mb-12">
                <div className="flex items-start gap-2 mb-6">
                  <span className="text-2xl">👋</span>
                  <p className="text-base leading-relaxed flex-1" style={{ color: "#4a4a4a" }}>
                    {bioHighlights.map((part, idx) => (
                      part.highlight ? (
                        <span 
                          key={idx}
                          className="font-semibold px-1 rounded"
                          style={{ color: "#2c2c2c", backgroundColor: "#ffe8cc" }}
                        >
                          {part.text}
                        </span>
                      ) : (
                        <span key={idx}>{part.text}</span>
                      )
                    ))}
                  </p>
                </div>
              </div>
            )}

            {/* Teaching Subjects */}
            {profile.subjects.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6" style={{ color: "#2c2c2c" }}>
                  教學科目
                </h2>
                <div className="flex flex-wrap gap-3">
                  {profile.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="px-4 py-2 rounded-lg text-sm font-medium border"
                      style={{ 
                        color: "#2c2c2c",
                        backgroundColor: "white",
                        borderColor: "#e0e0e0"
                      }}
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education Background */}
            {profile.education && profile.education.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: "#2c2c2c" }}>
                    學歷背景
                  </h2>
                  {profile.university_verified && (
                    <span 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        color: "#10b981",
                        backgroundColor: "#d1fae5",
                        border: "1px solid #6ee7b7"
                      }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      已驗證
                    </span>
                  )}
                </div>
                
                <div className="space-y-8">
                  {profile.education.map((edu, idx) => (
                    <div key={idx} className="flex gap-6">
                      {/* University Logo */}
                      {edu.website && (
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex items-center justify-center p-2">
                            <UniversityLogoImage
                              website={edu.website}
                              universityName={edu.university}
                              size={48}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Education Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1" style={{ color: "#2c2c2c" }}>
                          {edu.degree}
                        </h3>
                        <div className="text-sm mb-2" style={{ color: "#6b6b6b" }}>
                          {edu.startYear} - {edu.endYear ? edu.endYear : '至今'}
                        </div>
                        <div className="space-y-1">
                          <p className="text-base" style={{ color: "#4a4a4a" }}>
                            {edu.university}
                            {edu.country && (
                              <span className="ml-2 text-sm" style={{ color: "#6b6b6b" }}>
                                · {edu.country}
                              </span>
                            )}
                          </p>
                          {edu.major && (
                            <p className="text-sm" style={{ color: "#6b6b6b" }}>
                              主修：{edu.major}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* High School Background */}
            {(profile.high_school || profile.high_school_system) && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6" style={{ color: "#2c2c2c" }}>
                  高中背景
                </h2>
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center text-2xl">
                      🎓
                    </div>
                  </div>
                  <div className="flex-1">
                    {profile.high_school && (
                      <h3 className="text-lg font-bold mb-2" style={{ color: "#2c2c2c" }}>
                        {profile.high_school}
                      </h3>
                    )}
                    {profile.high_school_system && (
                      <p className="text-base" style={{ color: "#4a4a4a" }}>
                        學習體制：
                        {profile.high_school_system === '其他' && profile.high_school_system_other
                          ? profile.high_school_system_other
                          : profile.high_school_system}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
