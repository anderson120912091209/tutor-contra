"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      setError("請輸入 DELETE 以確認");
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/signin");
        return;
      }

      // Delete account via API
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("刪除帳號失敗");
      }

      // Sign out
      await supabase.auth.signOut();

      // Redirect to home
      router.push("/");
    } catch (err: any) {
      setError(err.message || "發生錯誤，請稍後再試");
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">設定</h1>
          <p className="text-gray-600">管理您的帳號設定</p>
        </div>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="text-red-600">危險區域</CardTitle>
            <CardDescription>
              這些操作無法撤銷，請謹慎操作
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
              <div>
                <h3 className="font-semibold text-gray-900">刪除帳號</h3>
                <p className="text-sm text-gray-600 mt-1">
                  永久刪除您的帳號及所有相關資料
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="ml-4"
              >
                刪除帳號
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認刪除帳號</DialogTitle>
            <DialogDescription className="space-y-2">
              <p>
                此操作將永久刪除您的帳號及所有相關資料，包括：
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>個人檔案</li>
                <li>課程記錄</li>
                <li>評價與回饋</li>
                <li>上傳的照片</li>
                <li>所有設定</li>
              </ul>
              <p className="font-semibold text-red-600 mt-4">
                此操作無法撤銷！
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="confirm" className="text-sm font-medium">
              請輸入 <span className="font-bold text-red-600">DELETE</span> 以確認：
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setError("");
              }}
              placeholder="DELETE"
              className="mt-2"
              disabled={deleting}
            />
            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setConfirmText("");
                setError("");
              }}
              disabled={deleting}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleting || confirmText !== "DELETE"}
            >
              {deleting ? "刪除中..." : "確認刪除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

