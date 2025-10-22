/* eslint-disable no-unused-vars */
// frontend/src/components/ui/EvervaultCard.jsx

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

// We embed the image data directly to avoid broken links
const noiseDataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAABnSURBVHja7M5RDYAwDEXRDgmvEocnlrB2bBgZ2MLADgFiIPoB3T3i2wElb4lXy90L/A1vjBnhzRhv/W4s23YS/v7d2Lb9hL//t2Lb9hP+/t2Lb9tP+Pt3Y9v2E/7+3di2/YR/9t/APwGfKjlT/wAAAABJRU5ErkJggg==";
const gridDataUri = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='black'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e";

export const EvervaultCard = ({ children, className }) => {
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    controls.start({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      transition: { duration: 10, repeat: Infinity, repeatType: "reverse" },
    });
  }, [controls]);

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-4",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url(${noiseDataUri})`,
          opacity: isHovered ? 0.15 : 0,
        }}
      />
      <motion.div
        className="absolute inset-0 h-full w-full [background-position:0_0] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"
        style={{
          backgroundImage: `url(${gridDataUri})`,
        }}
        animate={controls}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};