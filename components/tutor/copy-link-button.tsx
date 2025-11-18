"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Button 
      onClick={handleCopy}
      variant="ghost" 
      size="sm"
      className="h-8 px-3 rounded-md bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 text-xs font-medium gap-2 transition-all"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          <span className="text-green-700">已複製</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          <span>分享</span>
        </>
      )}
    </Button>
  );
}
