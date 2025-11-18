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

export function CalloutBlock({ block, className, isEditing, onUpdate, onDelete }: BlockProps) {
  if (isEditing) {
      return (
        <div className="relative group">
            <div className={cn("my-6 flex gap-4 rounded-lg border border-l-4 border-l-primary bg-paper-secondary p-4", className)}>
                <div className="text-2xl">💡</div>
                <Textarea
                    value={block.content}
                    onChange={(e) => onUpdate?.(e.target.value)}
                    className="flex-1 bg-transparent border-none shadow-none resize-none focus-visible:ring-0 p-0 text-lg text-ink"
                    placeholder="Callout text..."
                />
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
    <div className={cn("my-6 flex gap-4 rounded-lg border border-l-4 border-l-primary bg-paper-secondary p-4", className)}>
      <div className="text-2xl">💡</div>
      <div className="text-lg text-ink">{block.content}</div>
    </div>
  );
}
