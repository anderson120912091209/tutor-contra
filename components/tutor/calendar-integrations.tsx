"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CalendarIntegrationsProps {
  googleCalendarEnabled: boolean;
  notionCalendarEnabled: boolean;
  onGoogleConnect: () => void;
  onGoogleDisconnect: () => void;
  onNotionConnect: () => void;
  onNotionDisconnect: () => void;
}

export function CalendarIntegrations({
  googleCalendarEnabled,
  notionCalendarEnabled,
  onGoogleConnect,
  onGoogleDisconnect,
  onNotionConnect,
  onNotionDisconnect,
}: CalendarIntegrationsProps) {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleGoogleConnect = async () => {
    setConnecting("google");
    try {
      await onGoogleConnect();
    } finally {
      setConnecting(null);
    }
  };

  const handleNotionConnect = async () => {
    setConnecting("notion");
    try {
      await onNotionConnect();
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm mb-6" style={{ color: "#737373" }}>
        連結您的日曆，當學生預約課程時，自動同步到您的日曆
      </div>

      {/* Google Calendar */}
      <div className="rounded-xl p-5 bg-white border border-gray-100 flex items-center justify-between transition-all hover:shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>
          <div>
            <div className="font-medium text-sm mb-0.5" style={{ color: "#373737" }}>
              Google Calendar
            </div>
            <div className="text-xs" style={{ color: "#737373" }}>
              {googleCalendarEnabled ? (
                <span style={{ color: "#10b981" }}>✓ 已連結</span>
              ) : (
                "未連結"
              )}
            </div>
          </div>
        </div>

        {googleCalendarEnabled ? (
          <button
            type="button"
            onClick={onGoogleDisconnect}
            className="px-4 py-2 text-xs font-medium rounded-lg transition-all hover:opacity-70"
            style={{ 
              color: "#dc2626",
              backgroundColor: "#fee2e2"
            }}
          >
            中斷連結
          </button>
        ) : (
          <button
            type="button"
            onClick={handleGoogleConnect}
            disabled={connecting === "google"}
            className="px-4 py-2 text-xs font-medium rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              color: connecting === "google" ? "#d1d5db" : "white",
              backgroundColor: connecting === "google" ? "#f3f4f6" : "#373737"
            }}
          >
            {connecting === "google" ? "連結中..." : "連結"}
          </button>
        )}
      </div>

      {/* Notion Calendar */}
      <div className="rounded-xl p-5 bg-white border border-gray-100 flex items-center justify-between transition-all hover:shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 4h16v16H4V4z"
                fill="white"
                stroke="#000"
                strokeWidth="1.5"
              />
              <path
                d="M8 7h8M8 11h8M8 15h5"
                stroke="#000"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <div className="font-medium text-sm mb-0.5" style={{ color: "#373737" }}>
              Notion Calendar
            </div>
            <div className="text-xs" style={{ color: "#737373" }}>
              {notionCalendarEnabled ? (
                <span style={{ color: "#10b981" }}>✓ 已連結</span>
              ) : (
                "未連結"
              )}
            </div>
          </div>
        </div>

        {notionCalendarEnabled ? (
          <button
            type="button"
            onClick={onNotionDisconnect}
            className="px-4 py-2 text-xs font-medium rounded-lg transition-all hover:opacity-70"
            style={{ 
              color: "#dc2626",
              backgroundColor: "#fee2e2"
            }}
          >
            中斷連結
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNotionConnect}
            disabled={connecting === "notion"}
            className="px-4 py-2 text-xs font-medium rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              color: connecting === "notion" ? "#d1d5db" : "white",
              backgroundColor: connecting === "notion" ? "#f3f4f6" : "#373737"
            }}
          >
            {connecting === "notion" ? "連結中..." : "連結"}
          </button>
        )}
      </div>

      {/* Benefits Info */}
      <div className="rounded-xl p-5 bg-gray-50 border border-gray-100">
        <div className="flex items-start gap-3">
          <span className="text-lg">💡</span>
          <div className="flex-1">
            <div className="font-medium text-sm mb-2" style={{ color: "#373737" }}>
              自動同步好處
            </div>
            <ul className="text-xs space-y-1.5" style={{ color: "#737373" }}>
              <li>• 學生預約時自動在日曆建立事件</li>
              <li>• 避免時間衝突和重複預約</li>
              <li>• 提前收到提醒通知</li>
              <li>• 統一管理所有行程</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

