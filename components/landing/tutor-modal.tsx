"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TeachingHeatmap } from "@/components/tutor/teaching-heatmap";
import { EducationDisplay } from "@/components/tutor/education-display";
import { SocialLinksDisplay } from "@/components/tutor/social-links-display";
import { PhotoGalleryDisplay } from "@/components/tutor/photo-gallery-display";
import { AvailabilityDisplay } from "@/components/tutor/availability-display";
import Image from "next/image";
import Link from "next/link";

interface TutorModalProps {
  tutor: any;
  open: boolean;
  onClose: () => void;
}

export function TutorModal({ tutor, open, onClose }: TutorModalProps) {
  if (!tutor) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{tutor.profile.display_name} 的檔案</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-6">
            {tutor.profile.avatar_photo_url && (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/10 flex-shrink-0">
                <Image
                  src={tutor.profile.avatar_photo_url}
                  alt={tutor.profile.display_name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-3xl font-bold">{tutor.profile.display_name}</h2>
                {tutor.profile.social_links && (
                  <SocialLinksDisplay socialLinks={tutor.profile.social_links} />
                )}
              </div>

              {tutor.profile.subjects && tutor.profile.subjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tutor.profile.subjects.map((subject: string) => (
                    <span
                      key={subject}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                {tutor.profile.location && (
                  <div className="flex items-center gap-1.5">
                    <span>📍</span>
                    <span>{tutor.profile.location}</span>
                  </div>
                )}
                {tutor.profile.years_experience && (
                  <div className="flex items-center gap-1.5">
                    <span>👨‍🏫</span>
                    <span>{tutor.profile.years_experience} 年經驗</span>
                  </div>
                )}
                {tutor.profile.teaches_online && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                    <span>💻</span>
                    <span>線上教學</span>
                  </div>
                )}
              </div>

              {tutor.profile.bio && (
                <p className="text-muted-foreground leading-relaxed">{tutor.profile.bio}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          {tutor.stats && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {tutor.stats.total_verified_hours || 0}
                </div>
                <div className="text-sm text-muted-foreground">驗證時數</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {tutor.stats.total_students || 0}
                </div>
                <div className="text-sm text-muted-foreground">學生數</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {tutor.stats.average_rating ? tutor.stats.average_rating.toFixed(1) : "-"}
                </div>
                <div className="text-sm text-muted-foreground">平均評分</div>
              </div>
            </div>
          )}

          {/* Photo Gallery */}
          {tutor.profile.gallery_photos &&
            tutor.profile.gallery_photos.length > 0 &&
            tutor.profile.gallery_display_style !== "hidden" && (
              <div>
                <h3 className="text-lg font-semibold mb-3">相片集</h3>
                <PhotoGalleryDisplay
                  photos={tutor.profile.gallery_photos}
                  displayStyle={tutor.profile.gallery_display_style}
                />
              </div>
            )}

          {/* Availability */}
          {tutor.availability && tutor.availability.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">可預約時間</h3>
              <AvailabilityDisplay availability={tutor.availability} />
            </div>
          )}

          {/* Teaching Heatmap */}
          {tutor.heatmapData && (
            <div>
              <h3 className="text-lg font-semibold mb-3">教學記錄</h3>
              <TeachingHeatmap data={tutor.heatmapData} year={new Date().getFullYear()} />
            </div>
          )}

          {/* Education */}
          {tutor.profile.education && tutor.profile.education.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">學歷背景</h3>
              <EducationDisplay education={tutor.profile.education} />
            </div>
          )}

          {/* Testimonials */}
          {tutor.testimonials && tutor.testimonials.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">學生評價</h3>
              <div className="space-y-3">
                {tutor.testimonials.map((testimonial: any) => (
                  <div key={testimonial.id} className="border-l-4 border-primary pl-4 py-2">
                    <p className="text-muted-foreground mb-2">{testimonial.content}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-yellow-500">
                        {"★".repeat(testimonial.rating)}
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(testimonial.created_at).toLocaleDateString("zh-TW")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
            <Link href={`/t/${tutor.profile.public_slug}`} className="flex-1">
              <Button className="w-full" size="lg">
                查看完整檔案
              </Button>
            </Link>
            <Button variant="outline" size="lg" onClick={onClose}>
              關閉
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

