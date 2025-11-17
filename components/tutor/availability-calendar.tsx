"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { AvailabilitySlot } from "@/lib/types/database";

interface AvailabilityCalendarProps {
  tutorId: string;
  availability: AvailabilitySlot[];
  onChange: (slots: AvailabilitySlot[]) => void;
}

const DAYS = [
  { id: 0, name: "週日", shortName: "日" },
  { id: 1, name: "週一", shortName: "一" },
  { id: 2, name: "週二", shortName: "二" },
  { id: 3, name: "週三", shortName: "三" },
  { id: 4, name: "週四", shortName: "四" },
  { id: 5, name: "週五", shortName: "五" },
  { id: 6, name: "週六", shortName: "六" },
];

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

export function AvailabilityCalendar({
  tutorId,
  availability,
  onChange,
}: AvailabilityCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const addTimeSlot = () => {
    if (selectedDay === null) {
      alert("請選擇星期幾");
      return;
    }

    if (startTime >= endTime) {
      alert("結束時間必須晚於開始時間");
      return;
    }

    const newSlot: AvailabilitySlot = {
      id: `temp-${Date.now()}`,
      tutor_id: tutorId,
      day_of_week: selectedDay,
      start_time: startTime,
      end_time: endTime,
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onChange([...availability, newSlot]);
    
    // Reset form
    setStartTime("09:00");
    setEndTime("17:00");
  };

  const removeTimeSlot = (id: string) => {
    onChange(availability.filter((slot) => slot.id !== id));
  };

  const getDaySlots = (dayId: number) => {
    return availability
      .filter((slot) => slot.day_of_week === dayId)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  const quickSetWeekdays = () => {
    const weekdaySlots: AvailabilitySlot[] = [];
    for (let day = 1; day <= 5; day++) {
      weekdaySlots.push({
        id: `temp-weekday-${day}-${Date.now()}`,
        tutor_id: tutorId,
        day_of_week: day,
        start_time: "09:00",
        end_time: "12:00",
        is_available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      weekdaySlots.push({
        id: `temp-weekday-${day}-afternoon-${Date.now()}`,
        tutor_id: tutorId,
        day_of_week: day,
        start_time: "14:00",
        end_time: "18:00",
        is_available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    onChange([...availability, ...weekdaySlots]);
  };

  const clearAll = () => {
    if (confirm("確定要清除所有時間設定嗎？")) {
      onChange([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={quickSetWeekdays}
          className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all hover:opacity-70"
          style={{ 
            color: "#373737",
            backgroundColor: "#f3f4f6"
          }}
        >
          📅 快速設定（週一到週五 9-12, 14-18）
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="px-4 py-3 text-sm font-medium rounded-xl transition-all hover:opacity-70"
          style={{ 
            color: "#dc2626",
            backgroundColor: "#fee2e2"
          }}
        >
          🗑️ 清除全部
        </button>
      </div>

      {/* Add Time Slot Form */}
      <div className="rounded-xl p-6 bg-white border border-gray-100">
        <Label className="text-sm font-medium mb-4 block" style={{ color: "#373737" }}>
          新增可用時間
        </Label>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          {DAYS.map((day) => (
            <button
              key={day.id}
              type="button"
              onClick={() => setSelectedDay(day.id)}
              className="p-3 rounded-xl text-sm font-medium transition-all"
              style={{
                color: selectedDay === day.id ? "white" : "#373737",
                backgroundColor: selectedDay === day.id ? "#373737" : "#f3f4f6"
              }}
            >
              {day.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium" style={{ color: "#737373" }}>
              開始時間
            </Label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full text-base py-4 px-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#373737]/20 transition-all"
              style={{ color: "#373737" }}
            >
              {TIME_SLOTS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium" style={{ color: "#737373" }}>
              結束時間
            </Label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full text-base py-4 px-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#373737]/20 transition-all"
              style={{ color: "#373737" }}
            >
              {TIME_SLOTS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={addTimeSlot}
          className="w-full px-4 py-3 text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow-md"
          style={{ 
            color: "white",
            backgroundColor: "#373737"
          }}
        >
          + 新增時段
        </button>
      </div>

      {/* Weekly Schedule View */}
      <div>
        <Label className="text-sm font-medium mb-4 block" style={{ color: "#373737" }}>
          每週時間表
        </Label>
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day) => {
            const daySlots = getDaySlots(day.id);
            return (
              <div key={day.id} className="rounded-xl p-3 bg-white border border-gray-100">
                <div className="text-center font-medium text-xs mb-3 pb-2 border-b border-gray-100" style={{ color: "#373737" }}>
                  {day.shortName}
                </div>
                <div className="space-y-1.5">
                  {daySlots.length === 0 ? (
                    <div className="text-xs text-center py-4" style={{ color: "#d1d5db" }}>
                      無
                    </div>
                  ) : (
                    daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="rounded-lg p-2 text-xs relative group"
                        style={{ backgroundColor: "#f3f4f6" }}
                      >
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(slot.id)}
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          style={{ backgroundColor: "#dc2626", color: "white" }}
                        >
                          ×
                        </button>
                        <div className="font-medium" style={{ color: "#373737" }}>
                          {slot.start_time}
                        </div>
                        <div className="text-xs" style={{ color: "#737373" }}>-</div>
                        <div className="font-medium" style={{ color: "#373737" }}>
                          {slot.end_time}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      {availability.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          總共設定了 {availability.length} 個時段
        </div>
      )}
    </div>
  );
}

