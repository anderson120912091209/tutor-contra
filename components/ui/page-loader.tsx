"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoadingScreen } from "./loading-screen";

export function PageLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  // Show loading when navigation starts
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // Listen to Next.js router events if available
    // For now, we'll rely on the loading.tsx files
    
    return () => {
      handleComplete();
    };
  }, []);

  if (!loading) return null;

  return <LoadingScreen />;
}

