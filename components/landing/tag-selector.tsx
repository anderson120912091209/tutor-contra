"use client";

import { useState } from "react";

interface TagSelectorProps {
  onSelect: (type: string, value: string) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

const tagOptions = {
  subject: {
    label: "科目",
    options: ["數學", "英文", "物理", "化學", "生物", "歷史", "地理", "公民", "國文", "程式設計"],
  },
  grade: {
    label: "年級",
    options: ["國小", "國中", "高中", "大學", "成人"],
  },
  curriculum: {
    label: "課程體系",
    options: ["IB 課程", "AP 課程", "A-Level", "108 課綱", "美國高中課程"],
  },
  location: {
    label: "上課地點",
    options: ["台北市", "新北市", "桃園市", "台中市", "台南市", "高雄市", "線上教學"],
  },
  schedule: {
    label: "上課時間",
    options: ["平日白天", "平日晚上", "週末白天", "週末晚上", "彈性安排"],
  },
};

export function TagSelector({ onSelect, onClose, position }: TagSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Selector */}
      <div
        className="fixed z-50 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translateY(-100%)",
          marginTop: "-8px",
        }}
      >
        {!selectedCategory ? (
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              選擇類別
            </div>
            {Object.entries(tagOptions).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-between group"
              >
                <span className="font-medium">{label}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <path
                    d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-2">
            <div className="flex items-center gap-2 px-3 py-2 border-b">
              <button
                onClick={() => setSelectedCategory(null)}
                className="hover:opacity-70 transition-opacity"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <span className="text-sm font-semibold">
                {tagOptions[selectedCategory as keyof typeof tagOptions].label}
              </span>
            </div>
            <div className="max-h-64 overflow-y-auto py-2">
              {tagOptions[selectedCategory as keyof typeof tagOptions].options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onSelect(selectedCategory, option);
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

