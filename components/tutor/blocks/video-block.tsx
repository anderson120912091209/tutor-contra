import { cn } from "@/lib/utils";
import { ProfileBlock } from "@/lib/types/database";
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

export function VideoBlock({ block, className, isEditing, onUpdate, onDelete }: BlockProps) {
  // Simple embed logic for YouTube/Vimeo
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    try {
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url;
    } catch (e) {
        return url;
    }
  };

  if (isEditing) {
      return (
        <div className="relative group border border-dashed border-border p-4 rounded-lg bg-paper-secondary/50">
            <div className="space-y-3">
                <div>
                    <Label>Video URL (YouTube)</Label>
                    <Input 
                        value={block.content} 
                        onChange={(e) => onUpdate?.(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
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
    <div className={cn("my-8 aspect-video w-full overflow-hidden rounded-lg border border-border/50 bg-paper-secondary", className)}>
      {block.content ? (
          <iframe
            src={getEmbedUrl(block.content)}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
      ) : (
        <div className="flex items-center justify-center h-full text-ink-lighter">No Video Set</div>
      )}
    </div>
  );
}
