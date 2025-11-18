"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LandingIntroProps {
  onComplete: () => void;
}

export function LandingIntro({ onComplete }: LandingIntroProps) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Check if user has seen the intro before (in this session)
    const hasSeenIntro = sessionStorage.getItem("hasSeenLandingIntro");
    
    if (hasSeenIntro) {
      // Skip animation if already seen
      setShowIntro(false);
      onComplete();
      return;
    }

    // Show animation for 2.5 seconds
    const timer = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("hasSeenLandingIntro", "true");
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!showIntro) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{
          background: 'radial-gradient(ellipse at center bottom, rgba(147, 197, 253, 0.12) 0%, rgba(191, 219, 254, 0.06) 25%, rgba(219, 234, 254, 0.02) 50%, transparent 70%, white 100%)'
        }}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center gap-8">
          {/* Logo Animation */}
          

          {/* Text Animation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.3,
              ease: "easeOut" 
            }}
          >
            <Image
              src="/pinpinlogo-text-grey-ultralight.png"
              alt="PinPin 家教平台"
              width={200}
              height={60}
              priority
              className="w-auto h-auto"
            />
          </motion.div>

          {/* Optional: Loading indicator */}
          <motion.div
            className="flex gap-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#93c5fd" }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

