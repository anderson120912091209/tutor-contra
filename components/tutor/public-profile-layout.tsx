import { TeachingHeatmap } from "@/components/tutor/teaching-heatmap";
import { SocialLinksDisplay } from "@/components/tutor/social-links-display";
import { AvailabilityDisplay } from "@/components/tutor/availability-display";
import { ProfileEditorWrapper } from "@/components/tutor/blocks/editor-wrapper";
import Image from "next/image";
import { ProfileBlock, TutorProfile, TutorStats, AvailabilitySlot } from "@/lib/types/database";
import { Button } from "@/components/ui/button";

interface PublicProfileLayoutProps {
  tutorProfile: TutorProfile;
  stats: TutorStats;
  heatmapData: Record<string, number>;
  testimonials: any[];
  availability: AvailabilitySlot[];
  parentAvailability?: AvailabilitySlot[];
  isOwner: boolean;
}

export function PublicProfileLayout({
  tutorProfile,
  stats,
  heatmapData,
  testimonials,
  availability,
  parentAvailability,
  isOwner,
}: PublicProfileLayoutProps) {
  
  // Determine content to render
  let contentBlocks: ProfileBlock[] = tutorProfile.profile_blocks || [];
  if (contentBlocks.length === 0 && tutorProfile.bio) {
    contentBlocks = [
      {
        id: 'bio-fallback',
        type: 'text',
        content: tutorProfile.bio
      }
    ];
  }

  return (
    <main className="max-w-5xl mx-auto px-4 pt-24 pb-24">
      {/* Card Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
          
          {/* Top Banner / Brand Line */}
          <div className="h-3 w-full bg-gradient-to-r from-slate-100 via-stone-200 to-slate-100" />

          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">
              
              {/* Left Sidebar (Sticky in Desktop) */}
              <div className="bg-stone-50/50 border-b lg:border-b-0 lg:border-r border-stone-100 p-8 lg:p-10 flex flex-col gap-8">
                  
                  {/* Avatar */}
                  <div className="relative w-32 h-32 lg:w-48 lg:h-48 mx-auto lg:mx-0">
                      <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md">
                           {tutorProfile.avatar_photo_url ? (
                              <Image
                                  src={tutorProfile.avatar_photo_url}
                                  alt={tutorProfile.display_name}
                                  fill
                                  className="object-cover"
                                  quality={100}
                                  unoptimized
                              />
                          ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">
                                  👨‍🏫
                              </div>
                          )}
                      </div>
                      {tutorProfile.university_verified && (
                           <div className="absolute bottom-2 right-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-stone-50" title="已驗證">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                           </div>
                      )}
                  </div>

                  {/* Basic Info */}
                  <div className="text-center lg:text-left space-y-4">
                      <div>
                          <h1 className="text-3xl lg:text-4xl font-bold font-serif mb-2 tracking-tight">
                              {tutorProfile.display_name}
                          </h1>
                          {tutorProfile.education && tutorProfile.education.length > 0 && (
                              <div className="text-stone-600 font-medium leading-snug">
                                  {tutorProfile.education[0].university}
                                  <div className="text-sm text-stone-500 font-normal mt-0.5">
                                      {tutorProfile.education[0].degree} • {tutorProfile.education[0].major}
                                  </div>
                              </div>
                          )}
                      </div>
                      
                      {/* Stats Pills */}
                      <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                           <div className="bg-white px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-600 shadow-sm">
                               {stats.total_students || 0} 位學生
                           </div>
                           <div className="bg-white px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-600 shadow-sm">
                               {stats.total_verified_hours || 0} 小時教學
                           </div>
                           <div className="bg-white px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-600 shadow-sm">
                               ★ {stats.average_rating ? stats.average_rating.toFixed(1) : "-"}
                           </div>
                      </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                      <Button className="w-full bg-stone-900 hover:bg-black text-white rounded-xl h-12 text-base shadow-lg shadow-stone-900/10">
                          預約課程
                      </Button>
                      {tutorProfile.social_links && (
                          <div className="flex justify-center gap-3 py-2">
                              <SocialLinksDisplay socialLinks={tutorProfile.social_links} />
                          </div>
                      )}
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-stone-200" />

                  {/* Widgets */}
                  <div className="space-y-8">
                      {/* Availability */}
                      <div>
                          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">可預約時段</h3>
                          <AvailabilityDisplay availability={availability} parentAvailability={parentAvailability} />
                      </div>

                      {/* Heatmap */}
                      <div>
                          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">教學活躍度</h3>
                          <TeachingHeatmap data={heatmapData} year={new Date().getFullYear()} />
                      </div>
                  </div>
              </div>

              {/* Right Content Area */}
              <div className="p-8 lg:p-12 space-y-16 min-h-[80vh]">
                  
                  {/* About Section */}
                  <section>
                      <h2 className="text-lg font-bold font-serif text-stone-900 mb-6 flex items-center gap-2 pb-4 border-b border-stone-100">
                          <span className="text-stone-300">01.</span> 關於我
                      </h2>
                      <div className="prose prose-stone max-w-none prose-p:leading-loose prose-li:marker:text-stone-400">
                           <ProfileEditorWrapper 
                              initialBlocks={contentBlocks}
                              tutorId={tutorProfile.id}
                              isOwner={isOwner}
                          />
                      </div>
                  </section>

                  {/* Timeline Section */}
                  {tutorProfile.education && tutorProfile.education.length > 0 && (
                      <section>
                          <h2 className="text-lg font-bold font-serif text-stone-900 mb-8 flex items-center gap-2 pb-4 border-b border-stone-100">
                              <span className="text-stone-300">02.</span> 學經歷
                          </h2>
                          <div className="space-y-8 pl-4 border-l-2 border-stone-100 ml-2">
                              {tutorProfile.education.map((edu, idx) => (
                                  <div key={idx} className="relative pl-8 group">
                                      <div className="absolute -left-[25px] top-1.5 w-3 h-3 bg-white border-2 border-stone-300 rounded-full group-hover:border-stone-900 transition-colors" />
                                      <div className="text-xs font-mono text-stone-400 mb-1">
                                          {edu.startYear} — {edu.endYear || '至今'}
                                      </div>
                                      <h3 className="text-lg font-bold text-stone-800">{edu.university}</h3>
                                      <p className="text-stone-600">{edu.degree} • {edu.major}</p>
                                  </div>
                              ))}
                               
                              {(tutorProfile.high_school || tutorProfile.high_school_system) && (
                                   <div className="relative pl-8 group">
                                      <div className="absolute -left-[25px] top-1.5 w-3 h-3 bg-white border-2 border-stone-300 rounded-full group-hover:border-stone-900 transition-colors" />
                                      <div className="text-xs font-mono text-stone-400 mb-1">高中階段</div>
                                      <h3 className="text-lg font-bold text-stone-800">{tutorProfile.high_school || "高中"}</h3>
                                      {tutorProfile.high_school_system && (
                                          <p className="text-stone-600">
                                              {tutorProfile.high_school_system === '其他' && tutorProfile.high_school_system_other
                                                  ? tutorProfile.high_school_system_other
                                                  : tutorProfile.high_school_system} 學制
                                          </p>
                                      )}
                                   </div>
                              )}
                          </div>
                      </section>
                  )}

                  {/* Expertise Section */}
                  {tutorProfile.subjects.length > 0 && (
                      <section>
                          <h2 className="text-lg font-bold font-serif text-stone-900 mb-6 flex items-center gap-2 pb-4 border-b border-stone-100">
                              <span className="text-stone-300">03.</span> 專業科目
                          </h2>
                          <div className="flex flex-wrap gap-2">
                              {tutorProfile.subjects.map((subject) => (
                                  <span 
                                      key={subject} 
                                      className="px-4 py-2 bg-stone-50 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-100 transition-colors cursor-default"
                                  >
                                      {subject}
                                  </span>
                              ))}
                          </div>
                      </section>
                  )}

                  {/* Reviews Section */}
                  {testimonials.length > 0 && (
                      <section>
                          <h2 className="text-lg font-bold font-serif text-stone-900 mb-6 flex items-center gap-2 pb-4 border-b border-stone-100">
                              <span className="text-stone-300">04.</span> 學生評價
                          </h2>
                          <div className="grid gap-6">
                              {testimonials.slice(0, 4).map((t: any) => (
                                  <div key={t.id} className="bg-stone-50/50 p-6 rounded-2xl">
                                      <div className="flex text-yellow-500 text-xs mb-3">
                                          {Array.from({ length: 5 }).map((_, i) => (
                                              <span key={i}>{i < t.rating ? "★" : "☆"}</span>
                                          ))}
                                      </div>
                                      <p className="text-stone-700 leading-relaxed">"{t.content}"</p>
                                  </div>
                              ))}
                          </div>
                      </section>
                  )}
              </div>
          </div>
      </div>
      
      {/* Footer */}
      <div className="text-center mt-12 text-stone-400 text-xs">
          <p>© PinPin 家教平台</p>
      </div>
    </main>
  );
}

