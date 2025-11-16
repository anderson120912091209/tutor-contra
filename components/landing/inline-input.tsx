"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ChatTag } from "./chat-tag";
import { TagSelector } from "./tag-selector";

interface Tag {
  id: string;
  type: "subject" | "grade" | "curriculum" | "location" | "schedule";
  value: string;
}

interface ContentBlock {
  id: string;
  type: "text" | "tag";
  content: string;
  tag?: Tag;
}

interface InlineInputProps {
  onSubmit: (blocks: ContentBlock[]) => void;
  disabled?: boolean;
}

export function InlineInput({ onSubmit, disabled }: InlineInputProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    { id: "initial", type: "text", content: "" },
  ]);
  const [activeBlockId, setActiveBlockId] = useState("initial");
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({});

  const focusBlock = (blockId: string) => {
    const input = inputRefs.current[blockId];
    if (input) {
      input.focus();
      // Move cursor to end
      const range = document.createRange();
      const sel = window.getSelection();
      if (input.childNodes.length > 0) {
        range.setStart(input.childNodes[0], input.textContent?.length || 0);
      } else {
        range.setStart(input, 0);
      }
      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const updateBlockContent = (blockId: string, content: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, content } : block
      )
    );
  };

  const handleInput = (blockId: string, e: React.FormEvent<HTMLSpanElement>) => {
    const content = e.currentTarget.textContent || "";
    updateBlockContent(blockId, content);

    // Check for @ trigger
    if (content.endsWith("@")) {
      const rect = e.currentTarget.getBoundingClientRect();
      setSelectorPosition({
        x: rect.left,
        y: rect.bottom,
      });
      setShowTagSelector(true);
      setActiveBlockId(blockId);
    }
  };

  const addTag = (type: string, value: string) => {
    const newTag: Tag = {
      id: Date.now().toString(),
      type: type as Tag["type"],
      value,
    };

    const currentBlockIndex = blocks.findIndex((b) => b.id === activeBlockId);
    const currentBlock = blocks[currentBlockIndex];

    // Remove @ from current block
    const updatedContent = currentBlock.content.slice(0, -1);

    // Create new blocks: [text before @] [tag] [empty text after]
    const newBlocks = [...blocks];
    newBlocks[currentBlockIndex] = {
      ...currentBlock,
      content: updatedContent,
    };

    const tagBlock: ContentBlock = {
      id: `tag-${Date.now()}`,
      type: "tag",
      content: value,
      tag: newTag,
    };

    const nextTextBlock: ContentBlock = {
      id: `text-${Date.now()}`,
      type: "text",
      content: "",
    };

    newBlocks.splice(currentBlockIndex + 1, 0, tagBlock, nextTextBlock);
    setBlocks(newBlocks);

    // Focus the new text block after tag
    setTimeout(() => focusBlock(nextTextBlock.id), 0);
    setShowTagSelector(false);
  };

  const removeTag = (blockId: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  };

  const handleKeyDown = (blockId: string, e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Backspace") {
      const currentBlock = blocks.find((b) => b.id === blockId);
      if (currentBlock?.content === "") {
        e.preventDefault();
        const currentIndex = blocks.findIndex((b) => b.id === blockId);
        if (currentIndex > 0) {
          const prevBlock = blocks[currentIndex - 1];
          if (prevBlock.type === "tag") {
            // Remove the tag
            removeTag(prevBlock.id);
            // Focus previous text block
            const prevTextBlock = blocks[currentIndex - 2];
            if (prevTextBlock) {
              setTimeout(() => focusBlock(prevTextBlock.id), 0);
            }
          }
        }
      }
    }
  };

  const handleSubmit = () => {
    if (disabled) return;
    const hasContent = blocks.some((b) => b.content.trim() !== "");
    if (hasContent) {
      onSubmit(blocks);
      // Reset
      setBlocks([{ id: "initial-" + Date.now(), type: "text", content: "" }]);
    }
  };

  const useDefaultPrompt = () => {
    setBlocks([
      { id: "text-1", type: "text", content: "我的孩子目前是 " },
      {
        id: "tag-1",
        type: "tag",
        content: "高中",
        tag: { id: "1", type: "grade", value: "高中" },
      },
      { id: "text-2", type: "text", content: " 學生，需要 " },
      {
        id: "tag-2",
        type: "tag",
        content: "數學",
        tag: { id: "2", type: "subject", value: "數學" },
      },
      { id: "text-3", type: "text", content: " 家教" },
    ]);
  };

  return (
    <div className="w-full">
      <div className="relative bg-white rounded-xl border-2 border-gray-200 focus-within:border-gray-900 transition-all duration-200 shadow-sm hover:shadow-md min-h-[60px]">
        {/* Inline Content Editor */}
        <div
          ref={containerRef}
          className="px-6 py-4 text-base min-h-[60px] flex flex-wrap items-center gap-1.5 cursor-text"
          onClick={(e) => {
            if (e.target === containerRef.current) {
              const lastBlock = blocks[blocks.length - 1];
              if (lastBlock) focusBlock(lastBlock.id);
            }
          }}
        >
          {blocks.map((block) => {
            if (block.type === "tag" && block.tag) {
              return (
                <div key={block.id} className="inline-flex">
                  <ChatTag
                    type={block.tag.type}
                    value={block.tag.value}
                    onRemove={() => removeTag(block.id)}
                    onClick={() => {
                      // TODO: Edit tag
                    }}
                  />
                </div>
              );
            }

            return (
              <span
                key={block.id}
                ref={(el) => (inputRefs.current[block.id] = el)}
                contentEditable={!disabled}
                suppressContentEditableWarning
                onInput={(e) => handleInput(block.id, e)}
                onKeyDown={(e) => handleKeyDown(block.id, e)}
                onFocus={() => setActiveBlockId(block.id)}
                className="outline-none inline-block min-w-[2px]"
                data-placeholder={
                  blocks.length === 1 && !block.content
                    ? "描述您的需求... (輸入 @ 來添加標籤)"
                    : ""
                }
                style={{
                  minWidth: block.content ? "auto" : "2px",
                }}
              >
                {block.content}
              </span>
            );
          })}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={disabled || !blocks.some((b) => b.content.trim())}
            className="ml-auto px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {disabled ? "處理中..." : "搜尋"}
          </button>
        </div>

        {/* Helper Text */}
        {blocks.length === 1 && !blocks[0].content && (
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

