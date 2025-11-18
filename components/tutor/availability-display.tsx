import type { AvailabilitySlot } from "@/lib/types/database";
import { cn } from "@/lib/utils";

interface AvailabilityDisplayProps {
  availability: AvailabilitySlot[];
  parentAvailability?: AvailabilitySlot[];
}

const DAYS = [
  { id: 0, name: "Sun", shortName: "S" },
  { id: 1, name: "Mon", shortName: "M" },
  { id: 2, name: "Tue", shortName: "T" },
  { id: 3, name: "Wed", shortName: "W" },
  { id: 4, name: "Thu", shortName: "T" },
  { id: 5, name: "Fri", shortName: "F" },
  { id: 6, name: "Sat", shortName: "S" },
];

export function AvailabilityDisplay({ availability, parentAvailability }: AvailabilityDisplayProps) {
  const getDaySlots = (dayId: number, slots: AvailabilitySlot[]) => {
    return slots
      .filter((slot) => slot.day_of_week === dayId && slot.is_available)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  const isOverlapping = (tutorSlot: AvailabilitySlot, parentSlots: AvailabilitySlot[]) => {
    return parentSlots.some(pSlot => 
      // Simple overlap check: if times match exactly or overlap
      // For simplicity in this UI, we check if hours align roughly or if precise match
      // A robust implementation would check time ranges intersection
      (tutorSlot.start_time >= pSlot.start_time && tutorSlot.start_time < pSlot.end_time) ||
      (pSlot.start_time >= tutorSlot.start_time && pSlot.start_time < tutorSlot.end_time)
    );
  };

  if (availability.length === 0) {
    return (
      <div className="text-center py-8 text-ink-lighter text-sm">
        No availability set
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day) => {
          const daySlots = getDaySlots(day.id, availability);
          const parentDaySlots = parentAvailability ? getDaySlots(day.id, parentAvailability) : [];
          const hasSlots = daySlots.length > 0;
          
          return (
            <div key={day.id} className="flex flex-col items-center">
              <div className="text-[10px] font-bold uppercase text-ink-lighter mb-2 tracking-wider">
                {day.shortName}
              </div>
              <div className="w-full space-y-1">
                {hasSlots ? (
                  daySlots.map((slot) => {
                    const isMatch = parentAvailability && isOverlapping(slot, parentDaySlots);
                    return (
                      <div
                        key={slot.id}
                        className={cn(
                          "w-full py-1 rounded text-[10px] text-center font-medium transition-colors cursor-default",
                          isMatch 
                            ? "bg-green-100 text-green-800 ring-1 ring-green-200" 
                            : "bg-ink/5 text-ink hover:bg-ink/10"
                        )}
                        title={isMatch ? "時間匹配!" : `${slot.start_time.slice(0,5)} - ${slot.end_time.slice(0,5)}`}
                      >
                        {parseInt(slot.start_time)}
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full py-1 text-center text-[10px] text-border select-none">
                    -
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {parentAvailability && parentAvailability.length > 0 && (
        <div className="flex items-center justify-center gap-4 text-[10px] text-ink-lighter pt-2 border-t border-stone-100">
           <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-ink/10"></div>
              <span>教師時間</span>
           </div>
           <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-200"></div>
              <span>共同時間</span>
           </div>
        </div>
      )}
      
      {/* Prompt for parents if they haven't set availability yet but are viewing */}
      {parentAvailability !== undefined && parentAvailability.length === 0 && (
         <div className="mt-4 p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-center">
            <p className="text-xs text-blue-800 mb-2 font-medium">設定您的時間以查看共同空檔</p>
            <a href="/parent/dashboard" className="inline-block text-[10px] font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
              前往設定
            </a>
         </div>
      )}
    </div>
  );
}
