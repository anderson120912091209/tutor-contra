"use client";

import Image from "next/image";
import { useState } from "react";
import type { University } from "@/lib/data/universities";

interface UniversityLogoProps {
  university: University;
  size?: number;
  className?: string;
}

export function UniversityLogo({ 
  university, 
  size = 64,
  className = "" 
}: UniversityLogoProps) {
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Extract domain from website URL
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  };

  const domain = getDomain(university.website);

  // Method 1: Clearbit Logo API (free, high quality)
  const clearbitUrl = `https://logo.clearbit.com/${domain}`;

  // Method 2: Google Favicon (fallback)
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  // Method 3: DuckDuckGo Icon (another fallback)
  const duckduckgoUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`;

  if (imgError) {
    // Fallback to emoji if all fails
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <span style={{ fontSize: size * 0.6 }}>{university.logo}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg animate-pulse">
          <span className="text-2xl">{university.logo}</span>
        </div>
      )}
      <Image
        src={clearbitUrl}
        alt={`${university.name} logo`}
        width={size}
        height={size}
        className={`rounded-lg object-contain bg-white shadow-sm ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onLoad={() => setLoading(false)}
        onError={() => {
          // Try favicon as fallback
          const img = new window.Image();
          img.src = faviconUrl;
          img.onload = () => {
            setImgError(false);
            setLoading(false);
          };
          img.onerror = () => {
            setImgError(true);
            setLoading(false);
          };
        }}
      />
    </div>
  );
}

