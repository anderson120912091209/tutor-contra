import type { LessonWithDetails } from "@/lib/types/database";
import { formatTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LessonListProps {
  lessons: LessonWithDetails[];
  title: string;
}

export function LessonList({ lessons, title }: LessonListProps) {
  const getStatusBadge = (lesson: LessonWithDetails) => {
    if (lesson.status === "cancelled") {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-destructive/10 text-destructive">
          已取消
        </span>
      );
    }

    if (!lesson.confirmation) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
          已排程
        </span>
      );
    }

    if (lesson.confirmation.final_status === "verified") {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
          ✓ 已驗證
        </span>
      );
    }

    if (lesson.confirmation.parent_confirmed === false) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
          等待家長確認
        </span>
      );
    }

    return (
      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
        進行中
      </span>
    );
  };

  if (lessons.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            目前沒有課程
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex-1">
                <div className="font-medium">{lesson.student.name}</div>
                <div className="text-sm text-muted-foreground">
                  {formatTime(lesson.scheduled_start_at)} -{" "}
                  {formatTime(lesson.scheduled_end_at)}
                  {lesson.student.subject && ` • ${lesson.student.subject}`}
                </div>
              </div>
              <div>{getStatusBadge(lesson)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


