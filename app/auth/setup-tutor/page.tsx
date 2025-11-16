"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateSlug } from "@/lib/utils";

export default function SetupTutorPage() {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [subjects, setSubjects] = useState("");
  const [location, setLocation] = useState("");
  const [teachesOnline, setTeachesOnline] = useState(false);
  const [yearsExperience, setYearsExperience] = useState("");
  const [publicSlug, setPublicSlug] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Load OAuth profile data on mount
  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Set display name from OAuth if available
        if (user.user_metadata?.full_name) {
          setDisplayName(user.user_metadata.full_name);
        }
        
        // Set avatar URL from OAuth provider if available
        if (user.user_metadata?.avatar_url) {
          setAvatarUrl(user.user_metadata.avatar_url);
        }
      }
    };

    loadUserData();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/signin");
      return;
    }

    const slug = publicSlug || generateSlug(displayName);
    const subjectsArray = subjects.split(",").map((s) => s.trim()).filter(Boolean);

    const { error: insertError } = await supabase.from("tutor_profiles").insert({
      user_id: user.id,
      display_name: displayName,
      bio: bio || null,
      subjects: subjectsArray,
      location: location || null,
      teaches_online: teachesOnline,
      years_experience: yearsExperience ? parseInt(yearsExperience) : null,
      public_slug: slug,
      avatar_photo_url: avatarUrl, // Set OAuth avatar if available
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/tutor/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>建立家教檔案</CardTitle>
          <CardDescription>填寫基本資料以建立您的教學檔案</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
            
            {avatarUrl && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">已從您的帳號載入個人照片</p>
                  <p className="text-blue-700">這張照片將作為您的公開檔案照片</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="displayName">顯示名稱 *</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="王老師"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">個人簡介</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="簡單介紹您的教學經驗與專長"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjects">教學科目（用逗號分隔）</Label>
              <Input
                id="subjects"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                placeholder="數學, 物理, 英文"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">地區</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="台北市"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearsExperience">教學年資</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  min="0"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  placeholder="5"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="teachesOnline"
                checked={teachesOnline}
                onChange={(e) => setTeachesOnline(e.target.checked)}
                className="rounded border-input"
              />
              <Label htmlFor="teachesOnline" className="font-normal cursor-pointer">
                提供線上教學
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="publicSlug">公開網址（選填）</Label>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-2">
                  /t/
                </span>
                <Input
                  id="publicSlug"
                  value={publicSlug}
                  onChange={(e) => setPublicSlug(e.target.value)}
                  placeholder={generateSlug(displayName) || "your-name"}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                若留空，將自動根據您的名稱產生
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "建立中..." : "建立檔案"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


