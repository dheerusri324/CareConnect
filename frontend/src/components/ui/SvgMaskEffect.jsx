/* eslint-disable no-unused-vars */
// frontend/src/components/ui/SvgMaskEffect.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const SvgMaskEffect = ({
  children,
  revealText,
  size = 40,
  revealSize = 300,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const updateMousePosition = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      className={cn("relative h-full w-full", className)}
      onMouseMove={updateMousePosition}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 h-full w-full">{children}</div>
      <motion.div
        className="absolute inset-0 h-full w-full bg-grid-slate-900/[0.1] [mask-image:url(/mask.svg)] [mask-size:40px] [mask-repeat:no-repeat]"
        animate={{
          WebkitMaskPosition: `${mousePosition.x - (isHovered ? revealSize / 2 : size / 2)}px ${mousePosition.y - (isHovered ? revealSize / 2 : size / 2)}px`,
          WebkitMaskSize: `${isHovered ? revealSize : size}px`,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
      >
        <div className="absolute inset-0 h-full w-full bg-white opacity-100 backdrop-blur-md"></div>
        <div className="absolute inset-0 h-full w-full">{revealText}</div>
      </motion.div>
    </motion.div>
  );
};