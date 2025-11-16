"use client";

import { useState } from "react";
import type { Education } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { UniversityAutocompleteGlobal } from "./university-autocomplete-global";

interface EducationEditorProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export function EducationEditor({ education, onChange }: EducationEditorProps) {
  const [isAdding, setIsAdding] = useState(false);

  const addEducation = (newEdu: Education) => {
    onChange([...education, newEdu]);
    setIsAdding(false);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, updated: Education) => {
    const newEducation = [...education];
    newEducation[index] = updated;
    onChange(newEducation);
  };

  return (
    <div className="space-y-4">
      {education.map((edu, index) => (
        <EducationItem
          key={index}
          education={edu}
          onUpdate={(updated) => updateEducation(index, updated)}
          onRemove={() => removeEducation(index)}
        />
      ))}

      {isAdding ? (
        <EducationForm
          onSave={addEducation}
          onCancel={() => setIsAdding(false)}
        />
      ) : (
        <Button
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="w-full"
        >
          + 新增學歷
        </Button>
      )}
    </div>
  );
}

function EducationItem({
  education,
  onUpdate,
  onRemove,
}: {
  education: Education;
  onUpdate: (edu: Education) => void;
  onRemove: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <EducationForm
        initialData={education}
        onSave={(updated) => {
          onUpdate(updated);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="p-4 border rounded-lg hover:bg-accent transition-colors group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-semibold">{education.university}</div>
          <div className="text-sm text-muted-foreground">
            {education.degree} • {education.major}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {education.startYear} - {education.endYear || "現在"}
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-primary hover:underline"
          >
            編輯
          </button>
          <button
            onClick={onRemove}
            className="text-sm text-destructive hover:underline"
          >
            刪除
          </button>
        </div>
      </div>
    </div>
  );
}

function EducationForm({
  initialData,
  onSave,
  onCancel,
}: {
  initialData?: Education;
  onSave: (edu: Education) => void;
  onCancel: () => void;
}) {
  const [university, setUniversity] = useState(initialData?.university || "");
  const [universityId, setUniversityId] = useState(initialData?.universityId || "");
  const [website, setWebsite] = useState(initialData?.website || "");
  const [country, setCountry] = useState(initialData?.country || "");
  const [degree, setDegree] = useState(initialData?.degree || "");
  const [major, setMajor] = useState(initialData?.major || "");
  const [startYear, setStartYear] = useState(initialData?.startYear?.toString() || "");
  const [endYear, setEndYear] = useState(initialData?.endYear?.toString() || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!university || !degree || !major || !startYear) {
      alert("請填寫所有必填欄位");
      return;
    }

    onSave({
      university,
      universityId,
      degree,
      major,
      startYear: parseInt(startYear),
      endYear: endYear ? parseInt(endYear) : undefined,
      website: website || undefined,
      country: country || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-accent/50 space-y-3">
      <UniversityAutocompleteGlobal
        value={university}
        onSelect={(uni) => {
          setUniversity(uni.name);
          setUniversityId(uni.universityId);
          setWebsite(uni.website);
          setCountry(uni.country || "");
        }}
      />

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">學位 *</label>
          <select
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="w-full p-2 border rounded-md mt-1"
            required
          >
            <option value="">選擇學位</option>
            <option value="學士">學士</option>
            <option value="碩士">碩士</option>
            <option value="博士">博士</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">主修科系 *</label>
          <input
            type="text"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="w-full p-2 border rounded-md mt-1"
            placeholder="例：資訊工程學系"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">開始年份 *</label>
          <input
            type="number"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            className="w-full p-2 border rounded-md mt-1"
            placeholder="2015"
            min="1950"
            max={new Date().getFullYear()}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">結束年份（可留空表示在學）</label>
          <input
            type="number"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
            className="w-full p-2 border rounded-md mt-1"
            placeholder="2019"
            min="1950"
            max={new Date().getFullYear() + 10}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" size="sm">
          {initialData ? "更新" : "新增"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          取消
        </Button>
      </div>
    </form>
  );
}

