"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide the loading screen after a short delay to ensure hydration is complete
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0A192F] flex flex-col justify-center items-center transition-opacity duration-500">
      <div className="animate-pulse flex justify-center items-center">
        <Image 
          src="/korfu_logo_transparent.svg" 
          alt="KorfuFinance Yükleniyor" 
          width={120} 
          height={120}
          priority
        />
      </div>
    </div>
  );
}
