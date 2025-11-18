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

export function CodeBlock({ block, className, isEditing, onUpdate, onDelete }: BlockProps) {
  if (isEditing) {
      return (
        <div className="relative group">
             <Textarea
                value={block.content}
                onChange={(e) => onUpdate?.(e.target.value)}
                className={cn("min-h-[100px] font-mono text-sm bg-zinc-50", className)}
                placeholder="Paste code here..."
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
    <div className={cn("my-6 rounded-lg border border-border bg-zinc-50 p-4 font-mono text-sm overflow-x-auto", className)}>
      <pre>
        <code>{block.content}</code>
      </pre>
    </div>
  );
}
