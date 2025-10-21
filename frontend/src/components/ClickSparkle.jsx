// frontend/src/components/ClickSparkle.jsx

import React, { useState, useEffect } from 'react';
// This component is created when you run the `npx shadcn@latest add...` command
import { ClickSpark } from '@/components/ui/ClickSpark';

// This wrapper component will listen for clicks and render the sparks
function ClickSparkle() {
  const [sparks, setSparks] = useState([]);

  useEffect(() => {
    // This function will be called on every click
    const handleSpark = (e) => {
      console.log("Sparkle click detected!");
      const { clientX, clientY } = e;
      const newSpark = {
        id: Date.now(), // A unique key for each spark
        x: clientX,
        y: clientY,
      };
      // Add the new spark to our list of sparks
      setSparks(prevSparks => [...prevSparks, newSpark]);
    };

    // Add the click listener to the whole window
    window.addEventListener('mousedown', handleSpark);

    // Clean up the listener when the component is removed
    return () => {
      window.removeEventListener('mousedown', handleSpark);
    };
  }, []);

  return (
    // This wrapper ensures the sparks render on top of all other content
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]">
      {sparks.map(spark => (
        <ClickSpark key={spark.id} x={spark.x} y={spark.y} />
      ))}
    </div>
  );
}

export default ClickSparkle;
