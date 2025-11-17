"use client";

import Image from "next/image";
import { useState } from "react";

interface UniversityLogoImageProps {
  website: string;
  universityName: string;
  size?: number;
}

export function UniversityLogoImage({ website, universityName, size = 48 }: UniversityLogoImageProps) {
  const [imgSrc, setImgSrc] = useState(
    `https://logo.clearbit.com/${new URL(website).hostname}`
  );

  const handleError = () => {
    setImgSrc(`https://www.google.com/s2/favicons?domain=${new URL(website).hostname}&sz=128`);
  };

  return (
    <Image
      src={imgSrc}
      alt={universityName}
      width={size}
      height={size}
      className="object-contain"
      onError={handleError}
    />
  );
}

