// frontend/src/components/ui/BackgroundBeams.jsx

import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }) => {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full h-full z-0 overflow-hidden",
        className
      )}
    >
      <div className="relative w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50 to-white"></div>
        <div
          style={{
            animation: "beam-pulse 5s linear infinite",
            transformOrigin: "center center",
            background: "linear-gradient(180deg, rgba(37, 99, 235, 0) 0%, #2563eb 100%)",
          }}
          className="absolute top-1/2 left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2"
        ></div>
      </div>
    </div>
  );
};