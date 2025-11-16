"use client";

import { useState } from "react";
import type { LessonWithDetails } from "@/lib/types/database";
import { formatDateTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PendingConfirmationsProps {
  lessons: any[];
}

export function PendingConfirmations({ lessons }: PendingConfirmationsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleConfirm = async (lessonId: string, confirmed: boolean) => {
    setLoading(lessonId);
    
    try {
      const response = await fetch("/api/lessons/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, confirmed }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("確認失敗，請稍後再試");
      }
    } catch (error) {
      alert("確認失敗，請稍後再試");
    } finally {
      setLoading(null);
    }
  };

  if (lessons.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>待確認課程</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            目前沒有待確認的課程
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>待確認課程</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lessons.map((lesson: any) => (
            <div
              key={lesson.id}
              className="p-4 border rounded-lg space-y-3"
            >
              <div>
                <div className="font-medium">
                  {lesson.student.name} • {lesson.tutor.display_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDateTime(lesson.scheduled_start_at)} -{" "}
                  {formatDateTime(lesson.scheduled_end_at).split(" ")[1]}
                </div>
                {lesson.student.subject && (
                  <div className="text-sm text-muted-foreground">
                    科目：{lesson.student.subject}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleConfirm(lesson.id, true)}
                  disabled={loading === lesson.id}
                  className="flex-1"
                >
                  ✓ 確認課程
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleConfirm(lesson.id, false)}
                  disabled={loading === lesson.id}
                  className="flex-1"
                >
                  ⚠️ 回報問題
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


