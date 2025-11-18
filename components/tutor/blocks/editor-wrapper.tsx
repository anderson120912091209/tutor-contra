"use client";

import { useState, useCallback, useEffect } from "react";
import { ProfileBlock, ProfileBlockType } from "@/lib/types/database";
import { BlockRenderer } from "./block-renderer";
import { updateProfileBlocks } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfileEditorWrapperProps {
  initialBlocks: ProfileBlock[];
  tutorId: string;
  isOwner: boolean;
}

export function ProfileEditorWrapper({ initialBlocks, tutorId, isOwner }: ProfileEditorWrapperProps) {
  const [blocks, setBlocks] = useState<ProfileBlock[]>(initialBlocks);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  // Update blocks when initialBlocks change
  useEffect(() => {
    setBlocks(initialBlocks);
  }, [initialBlocks]);

  const handleUpdateBlock = useCallback((id: string, content: string, metadata?: any) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, content, metadata: { ...b.metadata, ...metadata } } : b))
    );
  }, []);

  const handleDeleteBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const handleAddBlock = (type: ProfileBlockType) => {
    const newBlock: ProfileBlock = {
      id: crypto.randomUUID(),
      type,
      content: type === 'text' ? '' : '', // Empty content for new text blocks to prompt placeholder
      metadata: {},
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfileBlocks(tutorId, blocks);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save blocks", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOwner) {
    return <BlockRenderer blocks={blocks} />;
  }

  return (
    <div className="relative group/editor min-h-[200px]">
      
      {/* Subtle Edit Toggle (Visible on hover of container) */}
      <div className={cn(
          "absolute -top-12 right-0 transition-opacity duration-300 z-50 flex gap-2",
          isEditing || "opacity-0 group-hover/editor:opacity-100"
      )}>
        {isEditing ? (
            <>
                <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    size="sm"
                    className="bg-black text-white hover:bg-gray-800 rounded-full px-4 h-8 text-xs font-medium shadow-sm"
                >
                    {isSaving ? "Saving..." : "Done"}
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={() => {
                        setBlocks(initialBlocks);
                        setIsEditing(false);
                    }}
                    size="sm"
                    className="text-gray-500 hover:text-black rounded-full px-4 h-8 text-xs"
                >
                    Cancel
                </Button>
            </>
        ) : (
            <Button 
                onClick={() => setIsEditing(true)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-black hover:bg-gray-100 rounded-full px-3 h-8 text-xs gap-1"
            >
                <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1464 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89211L2.50251 11.2421C2.4596 11.343 2.45783 11.4558 2.49771 11.5581C2.53759 11.6605 2.61476 11.7411 2.71171 11.7803C2.80865 11.8195 2.91514 11.8134 3.01105 11.7635L5.36105 10.5385C5.46606 10.4837 5.56101 10.4036 5.64002 10.3246L13.0719 2.89273C13.2672 2.69747 13.2672 2.38088 13.0719 2.18562L11.8536 1.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                Edit
            </Button>
        )}
      </div>

      {/* Editor Content */}
      <div className={cn("transition-all duration-300", isEditing && "pl-4 border-l-2 border-gray-100")}>
        <BlockRenderer 
            blocks={blocks} 
            isEditing={isEditing}
            onUpdateBlock={handleUpdateBlock}
            onDeleteBlock={handleDeleteBlock}
        />
        
        {/* Add Block Controls */}
        {isEditing && (
            <div className="mt-8 pt-4 border-t border-dashed border-gray-200 flex justify-center">
                 <div className="flex gap-1 bg-white shadow-sm border border-gray-100 rounded-full p-1">
                     {[
                         { type: 'text', icon: '¶' },
                         { type: 'image', icon: '🖼️' },
                         { type: 'video', icon: '🎥' },
                         { type: 'code', icon: '{ }' },
                         { type: 'callout', icon: '💡' }
                     ].map((item) => (
                        <button
                            key={item.type}
                            onClick={() => handleAddBlock(item.type as ProfileBlockType)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-500 hover:text-black transition-colors text-sm"
                            title={`Add ${item.type}`}
                        >
                            {item.icon}
                        </button>
                     ))}
                 </div>
            </div>
        )}
      </div>
    </div>
  );
}
