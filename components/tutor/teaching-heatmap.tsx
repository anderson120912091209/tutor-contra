"use client";

import { useState } from "react";

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
    if (count === 0) return "bg-muted";
    if (count === 1) return "bg-green-200";
    if (count === 2) return "bg-green-400";
    if (count >= 3) return "bg-green-600";
    return "bg-muted";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("zh-TW", {
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{year} 年教學記錄</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>少</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-muted rounded-sm" />
            <div className="w-3 h-3 bg-green-200 rounded-sm" />
            <div className="w-3 h-3 bg-green-400 rounded-sm" />
            <div className="w-3 h-3 bg-green-600 rounded-sm" />
          </div>
          <span>多</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((date, dayIndex) => {
                  const dateStr = date.toISOString().split("T")[0];
                  const count = data[dateStr] || 0;
                  const isCurrentYear = date.getFullYear() === year;

                  return (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
                        isCurrentYear ? getIntensity(count) : "bg-background"
                      }`}
                      onMouseEnter={() => setHoveredDate(dateStr)}
                      onMouseLeave={() => setHoveredDate(null)}
                      title={`${formatDate(date)}: ${count} 堂課`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {hoveredDate && data[hoveredDate] > 0 && (
        <div className="text-sm text-muted-foreground">
          {formatDate(new Date(hoveredDate))}: {data[hoveredDate]} 堂已驗證課程
        </div>
      )}
    </div>
  );
}


