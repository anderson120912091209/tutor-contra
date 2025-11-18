"use client";

import { useState } from "react";
import { TutorCard } from "./tutor-card";
import { TutorModal } from "./tutor-modal";
import { AiChatAdvanced } from "./ai-chat-advanced";
import { SidebarProfile } from "./sidebar-profile";
import { LandingIntro } from "./landing-intro";
import Link from "next/link";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";

interface LandingContentProps {
  initialTutors: any[];
  user?: User | null;
  userRole?: "tutor" | "parent" | null;
  profileData?: any;
}

export function LandingContent({ initialTutors, user, userRole, profileData }: LandingContentProps) {
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [showContent, setShowContent] = useState(false);

  return (
    <>
      {/* Intro Animation */}
      <LandingIntro onComplete={() => setShowContent(true)} />
      
      {/* Main Content */}
      <div 
        className="min-h-screen bg-gray-50 flex"
        style={{
          opacity: showContent ? 1 : 0,
          transition: "opacity 0.6s ease-out"
        }}
      >
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r fixed left-0 top-0 h-full overflow-y-auto">
        <div className="p-6">
          {/* Logo */}
          <Link href="/" className="block mb-8">
            <Image
              src="/pinpinlogo-text-grey-ultralight.png"
              alt="PinPin 家教平台"
              width={120}
              height={40}
              priority
              className="w-auto h-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.07926 0.222253C7.31275 -0.007434 7.6873 -0.007434 7.92079 0.222253L14.6708 6.86227C14.907 7.09465 14.9101 7.47453 14.6778 7.71076C14.4454 7.947 14.0655 7.95012 13.8293 7.71773L13 6.90201V12.5C13 12.7761 12.7762 13 12.5 13H2.50002C2.22388 13 2.00002 12.7761 2.00002 12.5V6.90201L1.17079 7.71773C0.934558 7.95012 0.554672 7.947 0.32229 7.71076C0.0899079 7.47453 0.0930283 7.09465 0.32926 6.86227L7.07926 0.222253ZM7.50002 1.49163L12 5.91831V12H10V8.49999C10 8.22385 9.77617 7.99999 9.50002 7.99999H6.50002C6.22388 7.99999 6.00002 8.22385 6.00002 8.49999V12H3.00002V5.91831L7.50002 1.49163ZM7.00002 12H9.00002V8.99999H7.00002V12Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
              <span>首頁</span>
            </Link>
            
            <Link
              href="/search"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
              <span>搜尋教師</span>
            </Link>

            <Link
              href="/subjects"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 2C2.22386 2 2 2.22386 2 2.5V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V2.5C13 2.22386 12.7761 2 12.5 2H2.5ZM1 2.5C1 1.67157 1.67157 1 2.5 1H12.5C13.3284 1 14 1.67157 14 2.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V2.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H10.5C10.7761 5 11 4.77614 11 4.5C11 4.22386 10.7761 4 10.5 4H4.5ZM4 7.5C4 7.22386 4.22386 7 4.5 7H10.5C10.7761 7 11 7.22386 11 7.5C11 7.77614 10.7761 8 10.5 8H4.5C4.22386 8 4 7.77614 4 7.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H7.5C7.77614 11 8 10.7761 8 10.5C8 10.2239 7.77614 10 7.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
              <span>科目分類</span>
            </Link>

            <Link
              href="/about"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
              <span>關於我們</span>
            </Link>
          </nav>

          <div className="mt-8 pt-8 border-t">
            {user ? (
              <SidebarProfile 
                user={user} 
                userRole={userRole}
                profileData={profileData}
              />
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  prefetch={false}
                  className="block w-full text-center px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium mb-2 transition-colors"
                >
                  登入
                </Link>
                <Link
                  href="/auth/signup"
                  prefetch={false}
                  className="block w-full text-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors"
                >
                  註冊
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-xs text-muted-foreground border-t mt-auto">
          <p>&copy; 2024 PinPin 家教平台</p>
          <p className="mt-1">台灣最專業的家教媒合平台</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 tracking-tight">
              尋找最適合的家教
            </h1>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              告訴我們您的需求，AI 助理會幫您推薦最適合的教師
            </p>

            {/* AI Chat Box */}
            <div className="max-w-3xl mx-auto">
              <AiChatAdvanced />
            </div>
          </div>

          {/* Results Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 tracking-tight">
              推薦教師
            </h2>
            <p className="text-gray-600">
              瀏覽我們平台上的優秀教師
            </p>
          </div>

          {/* Tutor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {initialTutors.map((tutor) => (
              <TutorCard
                key={tutor.profile.id}
                tutor={{
                  ...tutor.profile,
                  stats: tutor.stats,
                }}
                onClick={() => setSelectedTutor(tutor)}
              />
            ))}
          </div>

          {initialTutors.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">目前還沒有教師</h3>
              <p className="text-gray-600 mb-6">
                請稍後再回來查看
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Tutor Modal */}
      <TutorModal
        tutor={selectedTutor}
        open={!!selectedTutor}
        onClose={() => setSelectedTutor(null)}
      />
      </div>
    </>
  );
}

