"use client";

import { useState, useEffect } from "react";
import type { TutorProfile, Education } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EducationEditor } from "./education-editor";
import { SubjectSelectorCompact } from "./subject-selector-compact";
import { ProfilePreview } from "./profile-preview";
import { SocialLinksEditor } from "./social-links-editor";
import { PhotoManager } from "./photo-manager";
import { AvailabilityCalendar } from "./availability-calendar";
import { CalendarIntegrations } from "./calendar-integrations";
import { WelcomeOnboarding } from "./welcome-onboarding";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import type { SocialLinks, GalleryPhoto, GalleryDisplayStyle, AvailabilitySlot } from "@/lib/types/database";

interface ProfileEditorSplitProps {
  profile: TutorProfile;
}

const STEPS = [
  { id: 1, name: "基本資訊", description: "姓名與自我介紹" },
  { id: 2, name: "教學資訊", description: "科目與經驗" },
  { id: 3, name: "學歷背景", description: "教育經歷" },
  { id: 4, name: "照片管理", description: "個人照片與相片集" },
  { id: 5, name: "可用時間", description: "設定時間表與日曆" },
  { id: 6, name: "社交連結", description: "社交媒體帳號" },
];

export function ProfileEditorSplit({ profile: initialProfile }: ProfileEditorSplitProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [oauthAvatarAvailable, setOauthAvatarAvailable] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Form states
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio || "");
  const [subjects, setSubjects] = useState<string[]>(profile.subjects || []);
  const [location, setLocation] = useState(profile.location || "");
  const [yearsExperience, setYearsExperience] = useState(profile.years_experience?.toString() || "");
  const [teachesOnline, setTeachesOnline] = useState(profile.teaches_online);
  const [education, setEducation] = useState<Education[]>(profile.education || []);
  const [avatarPhotoUrl, setAvatarPhotoUrl] = useState(profile.avatar_photo_url || "");
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(profile.gallery_photos || []);
  const [galleryDisplayStyle, setGalleryDisplayStyle] = useState<GalleryDisplayStyle>(
    profile.gallery_display_style || "carousel"
  );
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(profile.social_links || {});
  
  // Load availability
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Check if this is first time editing (empty bio and minimal info)
  useEffect(() => {
    const isFirstTime = !profile.bio && profile.subjects.length === 0;
    setShowWelcome(isFirstTime);
  }, [profile.bio, profile.subjects.length]);

  // Check if user has OAuth avatar available
  useEffect(() => {
    const checkOAuthAvatar = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.user_metadata?.avatar_url && !profile.avatar_photo_url) {
        setOauthAvatarAvailable(true);
        // Auto-set OAuth avatar if no avatar is currently set
        setAvatarPhotoUrl(user.user_metadata.avatar_url);
      }
    };

    checkOAuthAvatar();
  }, [profile.avatar_photo_url]);

  // Handle welcome completion
  const handleWelcomeComplete = async (data: {
    fullName: string;
    university: string;
    universityWebsite?: string;
    universityCountry?: string;
  }) => {
    // Update display name
    setDisplayName(data.fullName);

    // Add university to education
    const currentYear = new Date().getFullYear();
    const newEducation: Education = {
      university: data.university,
      universityId: data.university.toLowerCase().replace(/\s+/g, "-"),
      degree: "",
      major: "",
      startYear: currentYear - 4,
      endYear: currentYear,
      website: data.universityWebsite,
      country: data.universityCountry,
    };
    setEducation([newEducation]);

    // Close welcome and save initial data
    setShowWelcome(false);

    // Auto-save the initial data
    try {
      await fetch("/api/tutor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: data.fullName,
          education: [newEducation],
        }),
      });
    } catch (error) {
      console.error("Failed to save initial data:", error);
    }
  };

  // Create preview profile from current form state
  const previewProfile: TutorProfile = {
    ...profile,
    display_name: displayName,
    bio: bio || null,
    subjects: subjects,
    location: location || null,
    years_experience: yearsExperience ? parseInt(yearsExperience) : null,
    teaches_online: teachesOnline,
    education: education,
    avatar_photo_url: avatarPhotoUrl || null,
    gallery_photos: galleryPhotos,
    gallery_display_style: galleryDisplayStyle,
    social_links: socialLinks,
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Save profile
      const response = await fetch("/api/tutor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName,
          bio: bio || null,
          subjects: subjects,
          location: location || null,
          years_experience: yearsExperience ? parseInt(yearsExperience) : null,
          teaches_online: teachesOnline,
          education,
          avatar_photo_url: avatarPhotoUrl || null,
          gallery_photos: galleryPhotos,
          gallery_display_style: galleryDisplayStyle,
          social_links: socialLinks,
        }),
      });

      if (!response.ok) throw new Error("Failed to save profile");

      // Save availability
      const availResponse = await fetch("/api/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slots: availability.map(slot => ({
            day_of_week: slot.day_of_week,
            start_time: slot.start_time,
            end_time: slot.end_time,
            is_available: slot.is_available,
          })),
        }),
      });

      if (response.ok && availResponse.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setMessage({ type: "success", text: "✓ 已儲存" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: "儲存失敗" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "網路錯誤，請稍後再試" });
    } finally {
      setSaving(false);
    }
  };

  const completionPercentage = () => {
    let completed = 0;
    let total = 9;

    if (displayName) completed++;
    if (bio) completed++;
    if (subjects.length > 0) completed++;
    if (location) completed++;
    if (yearsExperience) completed++;
    if (education.length > 0) completed += 2;
    if (avatarPhotoUrl || galleryPhotos.length > 0) completed++;
    if (Object.keys(socialLinks).some(key => socialLinks[key as keyof SocialLinks])) completed++;

    return Math.round((completed / total) * 100);
  };

  const canGoNext = () => {
    if (currentStep === 1) {
      return displayName.trim() !== "" && bio.trim() !== "";
    }
    if (currentStep === 2) {
      return subjects.length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (canGoNext() && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getNextStepSuggestion = () => {
    if (!displayName) return "新增顯示名稱";
    if (!bio) return "新增自我介紹";
    if (subjects.length === 0) return "新增教學科目";
    if (!location) return "新增教學地點";
    if (!yearsExperience) return "新增教學年資";
    if (education.length === 0) return "新增學歷背景";
    if (!Object.keys(socialLinks).some(key => socialLinks[key as keyof SocialLinks])) return "新增社交連結";
    return "完善您的檔案";
  };

  // Show welcome onboarding if first time
  if (showWelcome) {
    return <WelcomeOnboarding onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar - Simple */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/tutor/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                ← 回儀表板
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              {message && (
                <div
                  className={`text-sm px-3 py-1.5 rounded-md ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}
              
              <Link href={`/t/${profile.public_slug}`} target="_blank">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  查看公開頁
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="flex h-[calc(100vh-65px)]">
        {/* Left Panel - Form */}
        <div className="w-1/2 border-r bg-white flex flex-col relative">
          <div className="flex-1 overflow-y-auto">
            <div className="p-8 max-w-2xl mx-auto pb-40">
            {/* Progress Section - Inside Left Panel */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="inline-flex items-center justify-center px-3 py-1 bg-red-100 text-red-600 rounded text-sm font-bold">
                    {completionPercentage()}%
                  </span>
                  <span className="ml-3 text-gray-600">完整度</span>
                </div>
                {completionPercentage() < 100 && (
                  <span className="text-sm text-green-600 font-medium">
                    +{100 - completionPercentage()}% {getNextStepSuggestion()}
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage()}%` }}
                />
              </div>
            </div>

            {/* Step Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">{STEPS[currentStep - 1].name}</h1>
              <p className="text-gray-500 text-sm">
                {STEPS[currentStep - 1].description}
              </p>
            </div>

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <section className="space-y-6">
                <div>
                  <Label htmlFor="displayName" className="text-gray-700">
                    顯示名稱
                  </Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="例如：陳老師"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="bio" className="text-gray-700">
                    自我介紹
                  </Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={12}
                    className="mt-2 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="簡單介紹您的教學理念、風格或特色...

例如：
• 您的教學經驗
• 您的教學方法
• 您的教學特色
• 您擅長幫助什麼樣的學生"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    建議至少 200 字，讓家長更了解您的教學風格
                  </p>
                </div>
              </section>
            )}

            {/* Step 2: Teaching Information */}
            {currentStep === 2 && (
              <section className="space-y-6">
                <div>
                  <Label className="text-gray-700">教學科目</Label>
                  <div className="mt-2">
                    <SubjectSelectorCompact
                      selected={subjects}
                      onChange={setSubjects}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    請至少選擇一個教學科目
                  </p>
                </div>

                <div>
                  <Label htmlFor="location" className="text-gray-700">
                    教學地點
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="例如：台北市大安區"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="yearsExperience" className="text-gray-700">
                    教學年資
                  </Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    min="0"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    placeholder="例如：5"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    您有多少年的教學經驗
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                  <input
                    type="checkbox"
                    id="teachesOnline"
                    checked={teachesOnline}
                    onChange={(e) => setTeachesOnline(e.target.checked)}
                    className="rounded w-4 h-4"
                  />
                  <label htmlFor="teachesOnline" className="text-sm cursor-pointer flex-1">
                    <div className="font-medium">提供線上教學</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      透過視訊進行遠距教學
                    </div>
                  </label>
                </div>
              </section>
            )}

            {/* Step 3: Education */}
            {currentStep === 3 && (
              <section>
                <EducationEditor education={education} onChange={setEducation} />
              </section>
            )}

            {/* Step 4: Photos */}
            {currentStep === 4 && (
              <section>
                <PhotoManager
                  userId={profile.user_id}
                  avatarUrl={avatarPhotoUrl}
                  galleryPhotos={galleryPhotos}
                  displayStyle={galleryDisplayStyle}
                  onAvatarChange={setAvatarPhotoUrl}
                  onGalleryChange={setGalleryPhotos}
                  onDisplayStyleChange={setGalleryDisplayStyle}
                />
              </section>
            )}

            {/* Step 5: Availability & Calendar */}
            {currentStep === 5 && (
              <section className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">可用時間設定</h3>
                  <AvailabilityCalendar
                    tutorId={profile.id}
                    availability={availability}
                    onChange={setAvailability}
                  />
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">日曆整合</h3>
                  <CalendarIntegrations
                    googleCalendarEnabled={profile.google_calendar_enabled}
                    notionCalendarEnabled={profile.notion_calendar_enabled}
                    onGoogleConnect={() => {
                      window.location.href = "/api/calendar/google/connect";
                    }}
                    onGoogleDisconnect={async () => {
                      // TODO: Implement disconnect
                      alert("中斷連結功能即將推出");
                    }}
                    onNotionConnect={() => {
                      window.location.href = "/api/calendar/notion/connect";
                    }}
                    onNotionDisconnect={async () => {
                      // TODO: Implement disconnect
                      alert("中斷連結功能即將推出");
                    }}
                  />
                </div>
              </section>
            )}

            {/* Step 6: Social Links */}
            {currentStep === 6 && (
              <section>
                <SocialLinksEditor socialLinks={socialLinks} onChange={setSocialLinks} />
              </section>
            )}
            </div>
          </div>

          {/* Bottom Navigation - Fixed Footer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
            <div className="max-w-2xl mx-auto px-8 py-5">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="px-8"
                >
                  上一步
                </Button>

                {/* Page Indicators */}
                <div className="flex items-center gap-2">
                  {STEPS.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentStep === step.id
                          ? "bg-primary w-8"
                          : currentStep > step.id
                          ? "bg-primary/60"
                          : "bg-gray-300"
                      }`}
                      aria-label={`跳到${step.name}`}
                    />
                  ))}
                </div>

                {currentStep < STEPS.length ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canGoNext()}
                    className="px-8 bg-blue-600 hover:bg-blue-700"
                  >
                    下一步
                  </Button>
                ) : (
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 bg-blue-600 hover:bg-blue-700"
                  >
                    {saving ? "儲存中..." : "完成"}
                  </Button>
                )}
              </div>

              {/* Current Step Indicator */}
              <div className="text-center text-xs text-muted-foreground">
                {currentStep} / {STEPS.length}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 overflow-y-auto bg-gray-50">
          <div className="p-8">
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-500">即時預覽</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border">
              <ProfilePreview profile={previewProfile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
