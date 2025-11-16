import { formatDateTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LessonHistoryProps {
  lessons: any[];
}

export function LessonHistory({ lessons }: LessonHistoryProps) {
  if (lessons.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>歷史記錄</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            尚無已驗證的課程記錄
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>歷史記錄</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lessons.map((lesson: any) => (
            <div
              key={lesson.id}
              className="p-3 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">
                    {lesson.student.name} • {lesson.tutor.display_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDateTime(lesson.scheduled_start_at)}
                  </div>
                  {lesson.student.subject && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {lesson.student.subject}
                    </div>
                  )}
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  ✓ 已驗證
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


