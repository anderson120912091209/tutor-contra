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
        <Button
          type="button"
          variant="outline"
          onClick={quickSetWeekdays}
          className="flex-1"
        >
          📅 快速設定（週一到週五 9-12, 14-18）
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={clearAll}
          className="text-red-600 hover:text-red-700"
        >
          🗑️ 清除全部
        </Button>
      </div>

      {/* Add Time Slot Form */}
      <div className="border rounded-lg p-4 bg-accent/5">
        <Label className="text-sm font-semibold mb-3 block">新增可用時間</Label>
        
        <div className="grid grid-cols-4 gap-3 mb-3">
          {DAYS.map((day) => (
            <button
              key={day.id}
              type="button"
              onClick={() => setSelectedDay(day.id)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                selectedDay === day.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {day.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <Label className="text-xs">開始時間</Label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {TIME_SLOTS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-xs">結束時間</Label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {TIME_SLOTS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          type="button"
          onClick={addTimeSlot}
          className="w-full"
        >
          + 新增時段
        </Button>
      </div>

      {/* Weekly Schedule View */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">每週時間表</Label>
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day) => {
            const daySlots = getDaySlots(day.id);
            return (
              <div key={day.id} className="border rounded-lg p-2">
                <div className="text-center font-semibold text-sm mb-2 pb-2 border-b">
                  {day.shortName}
                </div>
                <div className="space-y-1">
                  {daySlots.length === 0 ? (
                    <div className="text-xs text-center text-muted-foreground py-4">
                      無
                    </div>
                  ) : (
                    daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="bg-primary/10 rounded p-1.5 text-xs relative group"
                      >
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(slot.id)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          ×
                        </button>
                        <div className="font-medium">{slot.start_time}</div>
                        <div className="text-muted-foreground">-</div>
                        <div className="font-medium">{slot.end_time}</div>
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

