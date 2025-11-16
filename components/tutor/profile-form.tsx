"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TutorProfile } from "@/lib/types/database";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { generateSlug } from "@/lib/utils";

interface ProfileFormProps {
  profile: TutorProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [subjects, setSubjects] = useState(profile.subjects.join(", "));
  const [location, setLocation] = useState(profile.location ?? "");
  const [teachesOnline, setTeachesOnline] = useState(profile.teaches_online);
  const [yearsExperience, setYearsExperience] = useState(
    profile.years_experience?.toString() ?? ""
  );
  const [publicSlug, setPublicSlug] = useState(profile.public_slug);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const subjectsArray = subjects
      .split(",")
      .map((subject) => subject.trim())
      .filter(Boolean);

    try {
      const response = await fetch("/api/tutor/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          display_name: displayName,
          bio: bio || null,
          subjects: subjectsArray,
          location: location || null,
          teaches_online: teachesOnline,
          years_experience: yearsExperience
            ? Number(yearsExperience)
            : null,
          public_slug: publicSlug || generateSlug(displayName),
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(
          typeof error === "string" ? error : "更新失敗，請稍後再試"
        );
      }

      setSuccess("已更新您的檔案！");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "更新失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSlug = () => {
    setPublicSlug(generateSlug(displayName));
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 text-sm text-green-600 bg-green-100 rounded-md">
          {success}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="displayName">顯示名稱 *</Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">個人簡介</Label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="描述您的教學風格、經驗與亮點"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subjects">教學科目（用逗號分隔）</Label>
        <Input
          id="subjects"
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
          placeholder="數學, 物理, 國文"
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
            max="80"
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
        <Label htmlFor="publicSlug">公開網址</Label>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">/t/</span>
          <Input
            id="publicSlug"
            value={publicSlug}
            onChange={(e) => setPublicSlug(e.target.value)}
            placeholder={generateSlug(displayName)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateSlug}
            className="whitespace-nowrap"
          >
            重新產生
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          此網址會顯示在公開檔案頁面，請保持簡短易記
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading} className="px-8">
          {loading ? "儲存中..." : "儲存變更"}
        </Button>
      </div>
    </form>
  );
}

