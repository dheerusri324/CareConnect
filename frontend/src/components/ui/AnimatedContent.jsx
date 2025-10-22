// frontend/src/components/ui/AnimatedContent.jsx

import React, { useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useInView, useAnimation } from 'framer-motion';

const AnimatedContent = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={{
        hidden: { opacity: 0, y: 75 }, // Start invisible and lower
        visible: { opacity: 1, y: 0 },   // Fade in and slide up
      }}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.5, delay: delay }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContent;