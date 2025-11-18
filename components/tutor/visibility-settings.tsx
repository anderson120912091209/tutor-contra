"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProfileVisibility } from "@/lib/types/database";
import { updateProfileVisibility } from "@/app/actions/profile";
import { cn } from "@/lib/utils";

interface VisibilitySettingsProps {
  tutorId: string;
  initialVisibility: ProfileVisibility;
}

const VISIBILITY_OPTIONS = [
  {
    value: "public",
    label: "公開模式",
    description: "可以被任何人在公開的拼拼家教網上找到",
    icon: (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
    ),
  },
  {
    value: "restricted",
    label: "限制瀏覽",
    description: "只有被配對到的家長可以看到",
    icon: (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    ),
  },
  {
    value: "private",
    label: "私人模式",
    description: "不讓任何人看到，目前不接家教",
    icon: (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" x2="22" y1="8" y2="13"/><line x1="22" x2="17" y1="8" y2="13"/></svg>
    ),
  },
] as const;

export function VisibilitySettings({ tutorId, initialVisibility }: VisibilitySettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentVisibility, setCurrentVisibility] = useState<ProfileVisibility>(initialVisibility);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (visibility: ProfileVisibility) => {
    setIsUpdating(true);
    try {
      await updateProfileVisibility(tutorId, visibility);
      setCurrentVisibility(visibility);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update visibility", error);
      alert("更新失敗，請稍後再試");
    } finally {
      setIsUpdating(false);
    }
  };

  const currentOption = VISIBILITY_OPTIONS.find(opt => opt.value === currentVisibility) || VISIBILITY_OPTIONS[0];
  const Icon = currentOption.icon;

  return (
    <div className="relative z-50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 px-3 rounded-md bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 text-xs font-medium gap-2 transition-all"
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{currentOption.label}</span>
        <svg className="w-3 h-3 opacity-50" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-stone-100 p-1.5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="space-y-0.5">
              {VISIBILITY_OPTIONS.map((option) => {
                const OptionIcon = option.icon;
                const isSelected = currentVisibility === option.value;
                return (
                  <button
                    key={option.value}
                    disabled={isUpdating}
                    onClick={() => handleUpdate(option.value as ProfileVisibility)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md transition-all flex gap-3 items-start group",
                      isSelected ? "bg-stone-100" : "hover:bg-stone-50"
                    )}
                  >
                    <OptionIcon className={cn("w-4 h-4 mt-0.5", isSelected ? "text-stone-900" : "text-stone-400 group-hover:text-stone-600")} />
                    <div className="flex-1">
                      <div className={cn(
                        "text-xs font-medium",
                        isSelected ? "text-stone-900" : "text-stone-600 group-hover:text-stone-900"
                      )}>
                        {option.label}
                      </div>
                      <div className="text-[10px] mt-0.5 text-stone-400 leading-tight">
                        {option.description}
                      </div>
                    </div>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-stone-900 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
