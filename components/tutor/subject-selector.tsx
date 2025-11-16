"use client";

import { useState } from "react";
import { SUBJECT_CATEGORIES } from "@/lib/data/subjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SubjectSelectorProps {
  selected: string[];
  onChange: (subjects: string[]) => void;
}

export function SubjectSelector({ selected, onChange }: SubjectSelectorProps) {
  const [customSubject, setCustomSubject] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const toggleSubject = (subject: string) => {
    if (selected.includes(subject)) {
      onChange(selected.filter((s) => s !== subject));
    } else {
      onChange([...selected, subject]);
    }
  };

  const addCustomSubject = () => {
    const trimmed = customSubject.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
      setCustomSubject("");
      setShowCustomInput(false);
    }
  };

  const removeSubject = (subject: string) => {
    onChange(selected.filter((s) => s !== subject));
  };

  return (
    <div className="space-y-6">
      {/* Selected Subjects Display */}
      {selected.length > 0 && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="text-sm font-medium mb-2">已選擇 {selected.length} 個科目</div>
          <div className="flex flex-wrap gap-2">
            {selected.map((subject) => (
              <div
                key={subject}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium group hover:bg-primary/90 transition-colors"
              >
                <span>{subject}</span>
                <button
                  onClick={() => removeSubject(subject)}
                  className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  type="button"
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
        </div>
      )}

      {/* Subject Categories */}
      <div className="space-y-6">
        {SUBJECT_CATEGORIES.map((category) => (
          <div key={category.name}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{category.icon}</span>
              <h3 className="font-medium text-sm text-muted-foreground">
                {category.name}
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {category.subjects.map((subject) => {
                const isSelected = selected.includes(subject);
                return (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm scale-105"
                          : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                      }
                    `}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Custom Subject Input */}
      <div className="pt-4 border-t">
        {showCustomInput ? (
          <div className="flex gap-2">
            <Input
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="輸入自訂科目..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomSubject();
                }
              }}
              autoFocus
            />
            <Button
              type="button"
              onClick={addCustomSubject}
              disabled={!customSubject.trim()}
            >
              新增
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowCustomInput(false);
                setCustomSubject("");
              }}
            >
              取消
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowCustomInput(true)}
            className="w-full"
          >
            + 新增自訂科目
          </Button>
        )}
      </div>

      {selected.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          請選擇您能教授的科目
        </div>
      )}
    </div>
  );
}

