"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SelectRolePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRoleSelection = async (role: "tutor" | "parent") => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/signin");
      return;
    }

    if (role === "tutor") {
      router.push("/auth/setup-tutor");
    } else {
      router.push("/auth/setup-parent");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle>選擇您的身份</CardTitle>
          <CardDescription>請選擇您是家教還是家長</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => handleRoleSelection("tutor")}
              disabled={loading}
              className="p-8 border-2 rounded-lg hover:border-primary hover:bg-accent transition-colors text-left space-y-2"
            >
              <div className="text-2xl font-bold">🎓 家教</div>
              <p className="text-sm text-muted-foreground">
                建立您的教學檔案，追蹤課程紀錄，展示您的教學能力
              </p>
            </button>
            <button
              onClick={() => handleRoleSelection("parent")}
              disabled={loading}
              className="p-8 border-2 rounded-lg hover:border-primary hover:bg-accent transition-colors text-left space-y-2"
            >
              <div className="text-2xl font-bold">👪 家長</div>
              <p className="text-sm text-muted-foreground">
                確認課程紀錄，查看歷史記錄，為家教撰寫評價
              </p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


