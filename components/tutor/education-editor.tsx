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
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="w-full px-4 py-3 text-sm font-medium rounded-xl transition-all hover:opacity-70"
          style={{ 
            color: "#373737",
            backgroundColor: "#f3f4f6"
          }}
        >
          + 新增學歷
        </button>
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
    <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100/50 transition-colors group border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-medium text-sm mb-1" style={{ color: "#373737" }}>
            {education.university}
          </div>
          <div className="text-xs mb-1" style={{ color: "#737373" }}>
            {education.degree} • {education.major}
          </div>
          <div className="text-xs" style={{ color: "#737373" }}>
            {education.startYear} - {education.endYear || "現在"}
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs px-2 py-1 rounded-lg transition-all hover:opacity-70"
            style={{ 
              color: "#737373",
              backgroundColor: "#f3f4f6"
            }}
          >
            編輯
          </button>
          <button
            onClick={onRemove}
            className="text-xs px-2 py-1 rounded-lg transition-all hover:opacity-70"
            style={{ 
              color: "#737373",
              backgroundColor: "#f3f4f6"
            }}
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
    <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-gray-50 border border-gray-100 space-y-6">
      <div className="bg-white rounded-xl p-4">
        <UniversityAutocompleteGlobal
          value={university}
          onSelect={(uni) => {
            setUniversity(uni.name);
            setUniversityId(uni.universityId);
            setWebsite(uni.website);
            setCountry(uni.country || "");
          }}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium block" style={{ color: "#373737" }}>
            學位 *
          </label>
          <select
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="w-full text-base py-4 px-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#373737]/20 transition-all"
            style={{ color: "#373737" }}
            required
          >
            <option value="">選擇學位</option>
            <option value="學士">學士</option>
            <option value="碩士">碩士</option>
            <option value="博士">博士</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium block" style={{ color: "#373737" }}>
            主修科系 *
          </label>
          <input
            type="text"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="w-full text-base py-4 px-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#373737]/20 transition-all placeholder:text-gray-400"
            style={{ color: "#373737" }}
            placeholder="例：資訊工程學系"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium block" style={{ color: "#373737" }}>
            開始年份 *
          </label>
          <input
            type="number"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            className="w-full text-base py-4 px-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#373737]/20 transition-all placeholder:text-gray-400"
            style={{ color: "#373737" }}
            placeholder="2015"
            min="1950"
            max={new Date().getFullYear()}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium block" style={{ color: "#373737" }}>
            結束年份（可留空表示在學）
          </label>
          <input
            type="number"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
            className="w-full text-base py-4 px-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#373737]/20 transition-all placeholder:text-gray-400"
            style={{ color: "#373737" }}
            placeholder="2019"
            min="1950"
            max={new Date().getFullYear() + 10}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow-md"
          style={{ 
            color: "white",
            backgroundColor: "#373737"
          }}
        >
          {initialData ? "更新" : "新增"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all hover:opacity-70"
          style={{ 
            color: "#737373",
            backgroundColor: "#f3f4f6"
          }}
        >
          取消
        </button>
      </div>
    </form>
  );
}

