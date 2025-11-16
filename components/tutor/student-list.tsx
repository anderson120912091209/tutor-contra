import type { StudentWithStats } from "@/lib/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentListProps {
  students: StudentWithStats[];
}

export function StudentList({ students }: StudentListProps) {
  if (students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>學生列表</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            尚未新增學生
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>學生列表</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{student.name}</span>
                  {!student.active && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                      不活躍
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {student.subject && `${student.subject}`}
                  {student.level && ` • ${student.level}`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">
                  {student.total_verified_hours} 小時
                </div>
                <div className="text-xs text-muted-foreground">
                  {student.total_lessons} 堂課
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


