import { ProfileBlock } from "@/lib/types/database";
import { TextBlock } from "./text-block";
import { ImageBlock } from "./image-block";
import { VideoBlock } from "./video-block";
import { CodeBlock } from "./code-block";
import { CalloutBlock } from "./callout-block";

interface BlockRendererProps {
  blocks: ProfileBlock[];
  isEditing?: boolean;
  onUpdateBlock?: (id: string, content: string, metadata?: any) => void;
  onDeleteBlock?: (id: string) => void;
}

export function BlockRenderer({ blocks, isEditing, onUpdateBlock, onDeleteBlock }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-4">
      {blocks.map((block) => {
        const commonProps = {
            block,
            isEditing,
            onUpdate: (content: string, metadata?: any) => onUpdateBlock?.(block.id, content, metadata),
            onDelete: () => onDeleteBlock?.(block.id)
        };

        switch (block.type) {
          case "text":
            return <TextBlock key={block.id} {...commonProps} />;
          case "image":
            return <ImageBlock key={block.id} {...commonProps} />;
          case "video":
            return <VideoBlock key={block.id} {...commonProps} />;
          case "code":
            return <CodeBlock key={block.id} {...commonProps} />;
          case "callout":
            return <CalloutBlock key={block.id} {...commonProps} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
