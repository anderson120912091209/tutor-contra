import { cn } from "@/lib/utils";
import { ProfileBlock } from "@/lib/types/database";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface BlockProps {
  block: ProfileBlock;
  className?: string;
  isEditing?: boolean;
  onUpdate?: (content: string, metadata?: any) => void;
  onDelete?: () => void;
}

export function TextBlock({ block, className, isEditing, onUpdate, onDelete }: BlockProps) {
  if (isEditing) {
      return (
          <div className="relative group">
              <Textarea
                  value={block.content}
                  onChange={(e) => onUpdate?.(e.target.value)}
                  className={cn("min-h-[100px] text-lg leading-relaxed font-serif", className)}
              />
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
    <p className={cn("text-lg leading-relaxed text-ink mb-4 whitespace-pre-wrap", className)}>
      {block.content}
    </p>
  );
}
