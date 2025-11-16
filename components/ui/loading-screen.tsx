"use client";

import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Morphing Animation - Local WebM */}
      <div className="w-48 h-48 mb-6">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain"
        >
          <source src="/morphing-animation.webm" type="video/webm" />
        </video>
      </div>

      {/* Loading Text */}
      <div className="flex items-center gap-2">
        <span className="text-gray-600 text-lg font-medium">載入中{dots}</span>
      </div>
    </div>
  );
}

