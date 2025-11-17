"use client";

import { useState } from "react";
import { SUBJECT_CATEGORIES, ALL_SUBJECTS } from "@/lib/data/subjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SubjectSelectorCompactProps {
  selected: string[];
  onChange: (subjects: string[]) => void;
}

export function SubjectSelectorCompact({ selected, onChange }: SubjectSelectorCompactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSubject = (subject: string) => {
    if (selected.includes(subject)) {
      onChange(selected.filter((s) => s !== subject));
    } else {
      onChange([...selected, subject]);
    }
  };

  const removeSubject = (subject: string) => {
    onChange(selected.filter((s) => s !== subject));
  };

  // Filter subjects based on search
  const filteredSubjects = searchQuery
    ? ALL_SUBJECTS.filter((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-3">
      {/* Selected Subjects Display */}
      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selected.map((subject) => (
            <div
              key={subject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{ 
                color: "#373737",
                backgroundColor: "#f3f4f6"
              }}
            >
              <span>{subject}</span>
              <button
                onClick={() => removeSubject(subject)}
                className="ml-0.5 hover:opacity-70 rounded-full p-0.5 transition-all"
                type="button"
                style={{ color: "#737373" }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground py-2">
          尚未選擇科目
        </div>
      )}

      {/* Add Subject Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-sm font-medium rounded-xl transition-all hover:opacity-70"
        style={{ 
          color: "#373737",
          backgroundColor: "#f3f4f6"
        }}
      >
        {isOpen ? "收起" : `+ 選擇教學科目 ${selected.length > 0 ? `(${selected.length})` : ""}`}
      </button>

      {/* Collapsible Subject Picker */}
      {isOpen && (
        <div className="rounded-xl p-6 space-y-4 bg-gray-50 border border-gray-100">
          {/* Search Box */}
          <div>
            <Input
              type="text"
              placeholder="搜尋科目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-base py-4 px-4 bg-white border-0 rounded-xl focus:ring-2 focus:ring-[#373737]/20 transition-all placeholder:text-gray-400"
              style={{ color: "#373737" }}
            />
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">
                搜尋結果
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => toggleSubject(subject)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        color: selected.includes(subject) ? "white" : "#373737",
                        backgroundColor: selected.includes(subject) ? "#373737" : "#f3f4f6"
                      }}
                    >
                      {subject}
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    找不到相關科目
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Categories (only show when not searching) */}
          {!searchQuery && (
            <div className="space-y-3">
              <div className="text-xs font-medium text-muted-foreground">
                依類別選擇
              </div>
              
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                {SUBJECT_CATEGORIES.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() =>
                      setActiveCategory(
                        activeCategory === category.name ? null : category.name
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      color: activeCategory === category.name ? "white" : "#373737",
                      backgroundColor: activeCategory === category.name ? "#373737" : "#f3f4f6"
                    }}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>

              {/* Subjects in Active Category */}
              {activeCategory && (
                <div className="pt-2 space-y-2">
                  {SUBJECT_CATEGORIES.find((c) => c.name === activeCategory)?.subjects.map(
                    (subject) => (
                      <label
                        key={subject}
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-gray-100/50"
                        style={{ backgroundColor: selected.includes(subject) ? "#f3f4f6" : "transparent" }}
                      >
                        <input
                          type="checkbox"
                          checked={selected.includes(subject)}
                          onChange={() => toggleSubject(subject)}
                          className="w-4 h-4 rounded border-gray-300 text-[#373737] focus:ring-2 focus:ring-[#373737]/20 cursor-pointer"
                        />
                        <span className="text-sm" style={{ color: "#373737" }}>
                          {subject}
                        </span>
                      </label>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

