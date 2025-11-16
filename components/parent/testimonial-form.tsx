"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface TestimonialFormProps {
  tutorId: string;
  tutorName: string;
  onSuccess?: () => void;
}

export function TestimonialForm({ tutorId, tutorName, onSuccess }: TestimonialFormProps) {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorId,
          text,
          rating,
          isPublic,
        }),
      });

      if (response.ok) {
        setText("");
        setRating(5);
        setIsPublic(false);
        if (onSuccess) onSuccess();
        alert("評價已送出！");
      } else {
        setError("送出評價失敗，請稍後再試");
      }
    } catch (error) {
      setError("送出評價失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>撰寫評價</CardTitle>
        <CardDescription>為 {tutorName} 撰寫評價</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label>評分</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-colors ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="text">評價內容</Label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="分享您的上課體驗..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded border-input"
            />
            <Label htmlFor="isPublic" className="font-normal cursor-pointer">
              公開此評價（顯示在家教的公開檔案頁面）
            </Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "送出中..." : "送出評價"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


