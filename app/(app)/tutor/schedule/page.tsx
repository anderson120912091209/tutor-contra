"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ScheduleLessonPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // TODO: Implement lesson scheduling via API
    alert("課程排程功能開發中...");
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div>
            <Link href="/tutor/dashboard" className="text-sm text-muted-foreground hover:text-foreground mb-2 block">
              ← 回儀表板
            </Link>
            <h1 className="text-2xl font-bold">排程課程</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>新增課程</CardTitle>
              <CardDescription>
                排定新的教學課程。課程結束後，請記得標記為完成以請家長確認。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student">選擇學生 *</Label>
                  <select
                    id="student"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">請選擇學生</option>
                    {/* TODO: Load students from API */}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">日期 *</Label>
                    <Input
                      id="date"
                      type="date"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">開始時間 *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">課程時長（分鐘）*</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="30"
                    step="30"
                    defaultValue="60"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">備註</Label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="課程內容或特別注意事項"
                  />
                </div>

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? "排程中..." : "建立課程"}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-muted rounded-md text-sm">
                <p className="font-medium mb-2">💡 提示</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 課程排定後會顯示在您的儀表板</li>
                  <li>• 課程完成後，請標記為「已完成」</li>
                  <li>• 家長確認後，課程會計入您的驗證時數</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>功能開發中</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                完整的課程排程功能（包括學生選擇、重複課程設定等）正在開發中。
                目前您可以透過儀表板查看已排定的課程。
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}


