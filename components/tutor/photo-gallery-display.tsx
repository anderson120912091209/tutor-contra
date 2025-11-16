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
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
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
          <div className="flex justify-center gap-2 mt-4">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-gray-300 hover:bg-gray-400"
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
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Previous photo"
            >
              ←
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % photos.length)
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Next photo"
            >
              →
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
          className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
        >
          <Image
            src={photo.url}
            alt={photo.caption || "Gallery photo"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {photo.caption && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-end p-3">
              <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {photo.caption}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

