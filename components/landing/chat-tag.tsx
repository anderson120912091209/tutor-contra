"use client";

interface ChatTagProps {
  type: "subject" | "grade" | "curriculum" | "location" | "schedule";
  value: string;
  onRemove?: () => void;
  onClick?: () => void;
}

const tagStyles = {
  subject: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20",
  grade: "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20",
  curriculum: "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20",
  location: "bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20",
  schedule: "bg-pink-500/10 text-pink-600 border-pink-500/20 hover:bg-pink-500/20",
};

const tagLabels = {
  subject: "科目",
  grade: "年級",
  curriculum: "課程",
  location: "地點",
  schedule: "時間",
};

export function ChatTag({ type, value, onRemove, onClick }: ChatTagProps) {
  const Element = onClick ? "button" : "div";
  
  return (
    <Element
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-sm font-medium transition-all ${tagStyles[type]} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <span className="text-xs opacity-70">{tagLabels[type]}</span>
      <span>{value}</span>
      {onRemove && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:opacity-70 transition-opacity cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }
          }}
        >
          <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </span>
      )}
    </Element>
  );
}

