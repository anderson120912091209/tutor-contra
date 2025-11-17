import type { AvailabilitySlot } from "@/lib/types/database";

interface AvailabilityDisplayProps {
  availability: AvailabilitySlot[];
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

export function AvailabilityDisplay({ availability }: AvailabilityDisplayProps) {
  const getDaySlots = (dayId: number) => {
    return availability
      .filter((slot) => slot.day_of_week === dayId && slot.is_available)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  if (availability.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        教師尚未設定可用時間
      </div>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-3">
      {DAYS.map((day) => {
        const daySlots = getDaySlots(day.id);
        return (
          <div key={day.id} className="rounded-xl p-4 bg-gray-50 border border-gray-100">
            <div className="text-center font-medium text-sm mb-3 pb-2 border-b border-gray-200" style={{ color: "#373737" }}>
              {day.name}
            </div>
            <div className="space-y-2">
              {daySlots.length === 0 ? (
                <div className="text-xs text-center py-4" style={{ color: "#d1d5db" }}>
                  休息
                </div>
              ) : (
                daySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="rounded-lg p-2.5 text-xs text-center shadow-sm"
                    style={{
                      backgroundColor: "rgba(147, 197, 253, 0.12)",
                      border: "1px solid rgba(147, 197, 253, 0.2)"
                    }}
                  >
                    <div className="font-medium" style={{ color: "#373737" }}>
                      {slot.start_time.slice(0, 5)}
                    </div>
                    <div className="text-xs" style={{ color: "#737373" }}>-</div>
                    <div className="font-medium" style={{ color: "#373737" }}>
                      {slot.end_time.slice(0, 5)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

