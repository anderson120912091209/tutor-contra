"use client";

import { useState } from "react";
import type { TutorProfile, Education } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EducationEditor } from "./education-editor";
import Link from "next/link";

interface InlineProfileEditorProps {
  profile: TutorProfile;
}

export function InlineProfileEditor({ profile: initialProfile }: InlineProfileEditorProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Editable field states
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio || "");
  const [subjects, setSubjects] = useState(profile.subjects.join(", "));
  const [location, setLocation] = useState(profile.location || "");
  const [yearsExperience, setYearsExperience] = useState(profile.years_experience?.toString() || "");
  const [teachesOnline, setTeachesOnline] = useState(profile.teaches_online);
  const [education, setEducation] = useState<Education[]>(profile.education || []);

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
          subjects: subjects.split(",").map((s) => s.trim()).filter(Boolean),
          location: location || null,
          years_experience: yearsExperience ? parseInt(yearsExperience) : null,
          teaches_online: teachesOnline,
          education,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setEditingField(null);
        setMessage({ type: "success", text: "已儲存！預覽下方查看效果" });
      } else {
        const error = await response.json();
        setMessage({ type: "error", text: error.error || "儲存失敗" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "網路錯誤，請稍後再試" });
    } finally {
      setSaving(false);
    }
  };

  const EditableField = ({
    fieldName,
    label,
    value,
    onChange,
    multiline = false,
  }: {
    fieldName: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    multiline?: boolean;
  }) => {
    const isEditing = editingField === fieldName;

    return (
      <div className="group relative">
        <div className="text-sm font-medium text-muted-foreground mb-1">{label}</div>
        {isEditing ? (
          multiline ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full min-h-[80px] p-3 border rounded-md focus:ring-2 focus:ring-primary"
              placeholder={`輸入${label}...`}
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary"
              placeholder={`輸入${label}...`}
              autoFocus
            />
          )
        ) : (
          <div
            onClick={() => setEditingField(fieldName)}
            className="p-3 rounded-md border border-transparent hover:border-primary hover:bg-accent cursor-pointer transition-all"
          >
            {value || <span className="text-muted-foreground">點擊編輯{label}</span>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">編輯個人檔案</h1>
          <p className="text-sm text-muted-foreground">點擊任何區塊即可編輯</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tutor/dashboard">
            <Button variant="ghost">← 回儀表板</Button>
          </Link>
          <Link href={`/t/${profile.public_slug}`} target="_blank">
            <Button variant="outline">預覽公開檔案</Button>
          </Link>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Editor Area */}
      <Card className="p-6 space-y-6">
        <EditableField
          fieldName="displayName"
          label="顯示名稱"
          value={displayName}
          onChange={setDisplayName}
        />

        <EditableField
          fieldName="bio"
          label="個人簡介"
          value={bio}
          onChange={setBio}
          multiline
        />

        <EditableField
          fieldName="subjects"
          label="教學科目（逗號分隔）"
          value={subjects}
          onChange={setSubjects}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <EditableField
            fieldName="location"
            label="地區"
            value={location}
            onChange={setLocation}
          />
          <EditableField
            fieldName="yearsExperience"
            label="教學年資"
            value={yearsExperience}
            onChange={setYearsExperience}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="teachesOnline"
            checked={teachesOnline}
            onChange={(e) => setTeachesOnline(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="teachesOnline" className="text-sm cursor-pointer">
            提供線上教學
          </label>
        </div>

        {/* Education Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">學歷</h3>
          <EducationEditor education={education} onChange={setEducation} />
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              // Reset to original values
              setDisplayName(profile.display_name);
              setBio(profile.bio || "");
              setSubjects(profile.subjects.join(", "));
              setLocation(profile.location || "");
              setYearsExperience(profile.years_experience?.toString() || "");
              setTeachesOnline(profile.teaches_online);
              setEducation(profile.education || []);
              setEditingField(null);
              setMessage(null);
            }}
          >
            取消變更
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "儲存中..." : "💾 儲存檔案"}
          </Button>
        </div>
      </Card>

      {/* Preview Section */}
      <div className="text-sm text-muted-foreground text-center">
        💡 提示：儲存後請點擊「預覽公開檔案」查看效果
      </div>
    </div>
  );
}

