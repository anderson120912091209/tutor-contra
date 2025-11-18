"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface HeatmapData {
  [date: string]: number;
}

interface TeachingHeatmapProps {
  data: HeatmapData;
  year?: number;
}

export function TeachingHeatmap({ data, year = new Date().getFullYear() }: TeachingHeatmapProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Generate all dates for the year
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  // Get the first Monday before or on start date
  const firstDay = new Date(startDate);
  while (firstDay.getDay() !== 1) {
    firstDay.setDate(firstDay.getDate() - 1);
  }

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  const currentDate = new Date(firstDay);

  // Generate grid of dates
  while (currentDate <= endDate || currentWeek.length > 0) {
    if (currentDate.getDay() === 1 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);

    if (currentDate > endDate && currentWeek.length > 0) {
      // Pad last week
      while (currentWeek.length < 7) {
        currentWeek.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(currentWeek);
      break;
    }
  }

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-stone-100";
    if (count === 1) return "bg-stone-300";
    if (count === 2) return "bg-stone-400";
    if (count >= 3) return "bg-stone-600";
    return "bg-stone-100";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto scrollbar-none">
        <div className="inline-block min-w-full">
          <div className="flex gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((date, dayIndex) => {
                  const dateStr = date.toISOString().split("T")[0];
                  const count = data[dateStr] || 0;
                  const isCurrentYear = date.getFullYear() === year;

                  return (
                    <div
                      key={dayIndex}
                      className={cn(
                        "w-2.5 h-2.5 rounded-[1px] transition-colors",
                        isCurrentYear ? getIntensity(count) : "bg-transparent"
                      )}
                      onMouseEnter={() => setHoveredDate(dateStr)}
                      onMouseLeave={() => setHoveredDate(null)}
                      title={`${formatDate(date)}: ${count} lessons`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
