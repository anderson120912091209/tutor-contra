import { cn } from "@/lib/utils";
import { ProfileBlock } from "@/lib/types/database";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface BlockProps {
  block: ProfileBlock;
  className?: string;
  isEditing?: boolean;
  onUpdate?: (content: string, metadata?: any) => void;
  onDelete?: () => void;
}

export function ImageBlock({ block, className, isEditing, onUpdate, onDelete }: BlockProps) {
  if (isEditing) {
    return (
        <div className="relative group border border-dashed border-border p-4 rounded-lg bg-paper-secondary/50">
             <div className="space-y-3">
                <div>
                    <Label>Image URL</Label>
                    <Input 
                        value={block.content} 
                        onChange={(e) => onUpdate?.(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
                <div>
                    <Label>Caption</Label>
                    <Input 
                        value={block.metadata?.caption || ''} 
                        onChange={(e) => onUpdate?.(block.content, { caption: e.target.value })}
                        placeholder="Image caption..."
                    />
                </div>
             </div>
             <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-6 w-6 rounded-full"
                    onClick={onDelete}
                  >
                      ×
                  </Button>
              </div>
        </div>
    );
  }

  return (
    <figure className={cn("my-8", className)}>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/50 bg-paper-secondary">
        {block.content ? (
             <Image
             src={block.content}
             alt={block.metadata?.caption || "Profile image"}
             fill
             className="object-cover"
           />
        ) : (
            <div className="flex items-center justify-center h-full text-ink-lighter">No Image Set</div>
        )}
      </div>
      {block.metadata?.caption && (
        <figcaption className="mt-2 text-center text-sm text-ink-lighter font-serif italic">
          {block.metadata.caption}
        </figcaption>
      )}
    </figure>
  );
}
