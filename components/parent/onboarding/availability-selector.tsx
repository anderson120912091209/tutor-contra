"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import { cn } from "@/lib/utils";

interface AvailabilitySelectorProps {
  value: { day: number; startTime: string; endTime: string }[];
  onChange: (value: { day: number; startTime: string; endTime: string }[]) => void;
}

const DAYS = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 8:00 to 22:00

export function AvailabilitySelector({ value, onChange }: AvailabilitySelectorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ day: number; hour: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ day: number; hour: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse events for drag selection
  const handleMouseDown = (day: number, hour: number) => {
    setIsDragging(true);
    setDragStart({ day, hour });
    // Toggle initial cell
    toggleSlot(day, hour);
  };

  const handleMouseEnter = (day: number, hour: number) => {
    setHoveredCell({ day, hour });
    if (isDragging && dragStart) {
      // Calculate range and toggle
      // For simplicity in this drag, we just select the current hovered cell if not selected
      // A more complex implementation would calculate the rectangle
      toggleSlot(day, hour, true); 
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging]);

  const toggleSlot = (day: number, hour: number, forceSelect = false) => {
    const startTime = `${hour.toString().padStart(2, "0")}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;
    
    const existingIndex = value.findIndex(
      (s) => s.day === day && s.startTime === startTime
    );

    if (existingIndex >= 0) {
      if (!forceSelect) {
        const newValue = [...value];
        newValue.splice(existingIndex, 1);
        onChange(newValue);
      }
    } else {
      onChange([...value, { day, startTime, endTime }]);
    }
  };

  const isSelected = (day: number, hour: number) => {
    const startTime = `${hour.toString().padStart(2, "0")}:00`;
    return value.some((s) => s.day === day && s.startTime === startTime);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white select-none shadow-sm">
      {/* Header */}
      <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
        <div className="p-3 text-xs font-medium text-gray-400 border-r border-gray-200 bg-gray-50/50">
          時間
        </div>
        {DAYS.map((day, i) => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-8 bg-white" ref={containerRef}>
        {HOURS.map((hour) => (
          <Fragment key={hour}>
            {/* Time Label */}
            <div className="border-b border-r border-gray-100 p-2 text-xs text-gray-400 text-center h-10 flex items-center justify-center bg-gray-50/30">
              {hour}:00
            </div>
            {/* Day Cells */}
            {DAYS.map((_, dayIndex) => (
              <div
                key={`${dayIndex}-${hour}`}
                className={cn(
                  "border-b border-r border-gray-100 h-10 cursor-pointer transition-colors",
                  isSelected(dayIndex, hour) ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-gray-50",
                  dayIndex === 6 && "border-r-0"
                )}
                onMouseDown={() => handleMouseDown(dayIndex, hour)}
                onMouseEnter={() => handleMouseEnter(dayIndex, hour)}
              />
            ))}
          </Fragment>
        ))}
      </div>
      
      <div className="p-4 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
        <div>
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-sm mr-2 align-middle"></span>
            已選時段
        </div>
        <div>
            拖曳以選取連續時段
        </div>
      </div>
    </div>
  );
}

