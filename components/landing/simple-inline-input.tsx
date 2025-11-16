"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { ChatTag } from "./chat-tag";
import { TagSelector } from "./tag-selector";

interface Tag {
  id: string;
  type: "subject" | "grade" | "curriculum" | "location" | "schedule";
  value: string;
  position: number; // Position in text where tag should be inserted
}

interface SimpleInlineInputProps {
  onSubmit: (text: string, tags: Tag[]) => void;
  disabled?: boolean;
}

export function SimpleInlineInput({ onSubmit, disabled }: SimpleInlineInputProps) {
  const [text, setText] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });
  const [atPosition, setAtPosition] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (value: string) => {
    setText(value);

    // Check for @ trigger
    if (value.endsWith("@")) {
      const rect = textareaRef.current?.getBoundingClientRect();
      if (rect) {
        setSelectorPosition({
          x: rect.left,
          y: rect.bottom,
        });
        setAtPosition(value.length - 1);
        setShowTagSelector(true);
      }
    }
  };

  const addTag = (type: string, value: string) => {
    if (atPosition === null) return;

    const newTag: Tag = {
      id: Date.now().toString(),
      type: type as Tag["type"],
      value,
      position: atPosition,
    };

    // Remove @ from text
    setText(text.slice(0, -1));
    setTags([...tags, newTag]);
    setShowTagSelector(false);
    setAtPosition(null);

    // Focus back to textarea
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const removeTag = (id: string) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (disabled || (!text.trim() && tags.length === 0)) return;
    onSubmit(text, tags);
    setText("");
    setTags([]);
  };

  const useDefaultPrompt = () => {
    setText("我的孩子目前是  學生，需要  家教");
    setTags([
      { id: "1", type: "grade", value: "高中", position: 7 },
      { id: "2", type: "subject", value: "數學", position: 13 },
    ]);
  };

  return (
    <div className="w-full">
      <div className="relative bg-white rounded-xl border-2 border-gray-200 focus-within:border-gray-900 transition-all duration-200 shadow-sm hover:shadow-md">
        {/* Tags Display */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 px-6 pt-4">
            {tags.map((tag) => (
              <ChatTag
                key={tag.id}
                type={tag.type}
                value={tag.value}
                onRemove={() => removeTag(tag.id)}
              />
            ))}
          </div>
        )}

        {/* Text Input */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              tags.length === 0
                ? "描述您的需求... (輸入 @ 來添加標籤)"
                : "繼續描述需求..."
            }
            className="w-full px-6 py-4 text-base rounded-xl resize-none focus:outline-none"
            rows={Math.max(1, text.split("\n").length)}
            style={{ minHeight: "60px", maxHeight: "200px" }}
            disabled={disabled}
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={disabled || (!text.trim() && tags.length === 0)}
            className="absolute right-3 bottom-3 px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {disabled ? "處理中..." : "搜尋"}
          </button>
        </div>

        {/* Helper Text */}
        {tags.length === 0 && !text && (
          <div className="px-6 pb-4 text-sm text-gray-500">
            <button
              onClick={useDefaultPrompt}
              className="text-gray-900 hover:underline font-medium"
            >
              使用範例提示
            </button>
            {" "}或輸入{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
              @
            </kbd>{" "}
            來添加搜尋標籤
          </div>
        )}
      </div>

      {/* Tag Selector */}
      {showTagSelector && (
        <TagSelector
          onSelect={addTag}
          onClose={() => setShowTagSelector(false)}
          position={selectorPosition}
        />
      )}
    </div>
  );
}

