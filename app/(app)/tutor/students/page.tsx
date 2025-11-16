"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ManageStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    // This is a simplified version - in production, you'd fetch via API
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // TODO: Implement student creation via API
    // For now, just show success message
    alert("學生新增功能開發中...");
    setSubmitting(false);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/tutor/dashboard" className="text-sm text-muted-foreground hover:text-foreground mb-2 block">
                ← 回儀表板
              </Link>
              <h1 className="text-2xl font-bold">管理學生</h1>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "取消" : "+ 新增學生"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>新增學生</CardTitle>
              <CardDescription>
                填寫學生資料。家長需先在平台註冊才能建立連結。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">學生姓名 *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="王小明"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">科目</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="數學"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">年級</Label>
                    <Input
                      id="level"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      placeholder="國二"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentEmail">家長電子郵件 *</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    required
                    placeholder="parent@example.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    需與家長在平台註冊的電子郵件相符
                  </p>
                </div>
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? "新增中..." : "新增學生"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>功能開發中</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              學生管理功能正在開發中。目前您可以在儀表板看到已建立的學生列表。
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


