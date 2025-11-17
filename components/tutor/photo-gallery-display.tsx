"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { GalleryPhoto, GalleryDisplayStyle } from "@/lib/types/database";

interface PhotoGalleryDisplayProps {
  photos: GalleryPhoto[];
  displayStyle: GalleryDisplayStyle;
}

export function PhotoGalleryDisplay({
  photos,
  displayStyle,
}: PhotoGalleryDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play carousel
  useEffect(() => {
    if (displayStyle !== "carousel" || photos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [displayStyle, photos.length]);

  if (displayStyle === "hidden" || photos.length === 0) {
    return null;
  }

  if (displayStyle === "carousel") {
    return (
      <div className="relative">
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={photo.url}
                alt={photo.caption || `Photo ${index + 1}`}
                fill
                className="object-cover"
              />
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white text-sm">{photo.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        {photos.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-[#373737]"
                    : "w-1.5 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to photo ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? photos.length - 1 : prev - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-110"
              style={{ color: "#373737" }}
              aria-label="Previous photo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % photos.length)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-110"
              style={{ color: "#373737" }}
              aria-label="Next photo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    );
  }

  // Grid display
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group shadow-md hover:shadow-xl transition-all duration-300"
        >
          <Image
            src={photo.url}
            alt={photo.caption || "Gallery photo"}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {photo.caption && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white text-sm font-medium">
                {photo.caption}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

