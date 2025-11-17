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
        setAvatarPhotoUrl(user.user_metadata.avatar_url);
      }
    };

    checkOAuthAvatar();
  }, [profile.avatar_photo_url]);

  // Refresh profile after verification callback
  useEffect(() => {
    const checkVerificationCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const verification = urlParams.get("university_verification");
      
      if (verification === "success") {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          try {
            const response = await fetch("/api/tutor/profile");
            if (response.ok) {
              const updatedProfile = await response.json();
              setProfile(updatedProfile);
            }
          } catch (error) {
            console.error("Error refreshing profile:", error);
          }
        }
        window.history.replaceState({}, "", window.location.pathname);
      }
    };

    checkVerificationCallback();
  }, []);

  // Handle welcome completion
  const handleWelcomeComplete = async (data: {
    fullName: string;
    highSchool?: string;
    highSchoolSystem?: "IB" | "AP" | "學測" | "高職" | "A-Levels" | "其他";
    highSchoolSystemOther?: string;
    university: string;
    universityWebsite?: string;
    universityCountry?: string;
  }) => {
    setDisplayName(data.fullName);

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

    setShowWelcome(false);

    try {
      await fetch("/api/tutor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: data.fullName,
          high_school: data.highSchool || null,
          high_school_system: data.highSchoolSystem || null,
          high_school_system_other: data.highSchoolSystem === "其他" ? data.highSchoolSystemOther : null,
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
        setMessage({ type: "success", text: "已儲存" });
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

  if (showWelcome) {
    return <WelcomeOnboarding onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Top Bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/tutor/dashboard" 
              className="text-sm flex items-center gap-1.5 transition-colors hover:opacity-70"
              style={{ color: "#737373" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              回儀表板
            </Link>
            
            <div className="flex items-center gap-3">
              {message && (
                <div
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}
              
              <Link href={`/t/${profile.public_slug}`} target="_blank">
                <button
                  className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-70"
                  style={{ 
                    color: "#737373",
                    backgroundColor: "#f3f4f6"
                  }}
                >
                  查看公開頁
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Form */}
        <div className="w-1/2 border-r border-gray-100 bg-white flex flex-col relative overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-xl mx-auto px-8 py-10 pb-32">
              {/* Progress Section - Subtle */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: "#373737" }}>
                      步驟 {currentStep} / {STEPS.length}
                    </span>
                    <span className="text-xs" style={{ color: "#737373" }}>
                      {completionPercentage()}% 完整
                    </span>
                  </div>
                  {completionPercentage() < 100 && (
                    <span className="text-xs" style={{ color: "#737373" }}>
                      {getNextStepSuggestion()}
                    </span>
                  )}
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${completionPercentage()}%`,
                      backgroundColor: "#373737"
                    }}
                  />
                </div>
              </div>

              {/* Step Title */}
              <div className="mb-10">
                <h1 className="text-2xl font-semibold mb-2" style={{ color: "#373737" }}>
                  {STEPS[currentStep - 1].name}
                </h1>
                <p className="text-sm" style={{ color: "#737373" }}>
                  {STEPS[currentStep - 1].description}
                </p>
              </div>

              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <section className="space-y-8">
                  <div className="space-y-3">
                    <Label htmlFor="displayName" className="text-sm font-medium block" style={{ color: "#373737" }}>
                      顯示名稱
                    </Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="例如：陳老師"
                      className="w-full text-base py-4 px-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#373737]/20 transition-all placeholder:text-gray-400"
                      style={{ color: "#373737" }}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="bio" className="text-sm font-medium block" style={{ color: "#373737" }}>
                      自我介紹
                    </Label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={10}
                      className="w-full text-base py-4 px-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#373737]/20 transition-all placeholder:text-gray-400 resize-none"
                      style={{ color: "#373737" }}
                      placeholder="簡單介紹您的教學理念、風格或特色...

例如：
• 您的教學經驗
• 您的教學方法
• 您的教學特色
• 您擅長幫助什麼樣的學生"
                    />
                    <p className="text-xs" style={{ color: "#737373" }}>
                      建議至少 200 字，讓家長更了解您的教學風格
                    </p>
                  </div>
                </section>
              )}

              {/* Step 2: Teaching Information */}
              {currentStep === 2 && (
                <section className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium block" style={{ color: "#373737" }}>
                      教學科目
                    </Label>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <SubjectSelectorCompact
                        selected={subjects}
                        onChange={setSubjects}
                      />
                    </div>
                    <p className="text-xs" style={{ color: "#737373" }}>
                      請至少選擇一個教學科目
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-sm font-medium block" style={{ color: "#373737" }}>
                      教學地點
                    </Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="例如：台北市大安區"
                      className="w-full text-base py-4 px-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#373737]/20 transition-all placeholder:text-gray-400"
                      style={{ color: "#373737" }}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="yearsExperience" className="text-sm font-medium block" style={{ color: "#373737" }}>
                      教學年資
                    </Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      min="0"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      placeholder="例如：5"
                      className="w-full text-base py-4 px-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#373737]/20 transition-all placeholder:text-gray-400"
                      style={{ color: "#373737" }}
                    />
                    <p className="text-xs" style={{ color: "#737373" }}>
                      您有多少年的教學經驗
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 transition-all hover:bg-gray-100/50 cursor-pointer group">
                    <input
                      type="checkbox"
                      id="teachesOnline"
                      checked={teachesOnline}
                      onChange={(e) => setTeachesOnline(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#373737] focus:ring-2 focus:ring-[#373737]/20 cursor-pointer"
                    />
                    <label htmlFor="teachesOnline" className="flex-1 cursor-pointer">
                      <div className="text-sm font-medium mb-0.5" style={{ color: "#373737" }}>
                        提供線上教學
                      </div>
                      <div className="text-xs" style={{ color: "#737373" }}>
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
                    <h3 className="text-lg font-semibold mb-6" style={{ color: "#373737" }}>
                      可用時間設定
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <AvailabilityCalendar
                        tutorId={profile.id}
                        availability={availability}
                        onChange={setAvailability}
                      />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-semibold mb-6" style={{ color: "#373737" }}>
                      日曆整合
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <CalendarIntegrations
                        googleCalendarEnabled={profile.google_calendar_enabled}
                        notionCalendarEnabled={profile.notion_calendar_enabled}
                        onGoogleConnect={() => {
                          window.location.href = "/api/calendar/google/connect";
                        }}
                        onGoogleDisconnect={async () => {
                          alert("中斷連結功能即將推出");
                        }}
                        onNotionConnect={() => {
                          window.location.href = "/api/calendar/notion/connect";
                        }}
                        onNotionDisconnect={async () => {
                          alert("中斷連結功能即將推出");
                        }}
                      />
                    </div>
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
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 z-20">
            <div className="max-w-xl mx-auto px-8 py-5">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="px-6 py-2.5 text-sm rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ 
                    color: currentStep === 1 ? "#d1d5db" : "#373737",
                    backgroundColor: currentStep === 1 ? "transparent" : "#f3f4f6"
                  }}
                >
                  上一步
                </button>

                {/* Page Indicators */}
                <div className="flex items-center gap-1.5">
                  {STEPS.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`h-1.5 rounded-full transition-all ${
                        currentStep === step.id
                          ? "w-8 bg-[#373737]"
                          : currentStep > step.id
                          ? "w-1.5 bg-[#373737]/40"
                          : "w-1.5 bg-gray-200"
                      }`}
                      aria-label={`跳到${step.name}`}
                    />
                  ))}
                </div>

                {currentStep < STEPS.length ? (
                  <button
                    onClick={handleNext}
                    disabled={!canGoNext()}
                    className="px-6 py-2.5 text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    style={{ 
                      color: canGoNext() ? "white" : "#d1d5db",
                      backgroundColor: canGoNext() ? "#373737" : "#f3f4f6"
                    }}
                  >
                    下一步
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    style={{ 
                      color: saving ? "#d1d5db" : "white",
                      backgroundColor: saving ? "#f3f4f6" : "#373737"
                    }}
                  >
                    {saving ? "儲存中..." : "完成"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 overflow-y-auto bg-gray-50/50">
          <div className="sticky top-0 p-8">
            <div className="mb-6">
              <div className="text-xs font-medium mb-1" style={{ color: "#737373" }}>
                即時預覽
              </div>
              <div className="h-px bg-gray-100" />
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200/50 shadow-sm">
              <ProfilePreview profile={previewProfile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
