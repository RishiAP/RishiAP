"use client";

import React, { useState, useEffect } from 'react';

export function Typewriter({ text, delay = 50, startDelay = 0, onComplete }: { text: string, delay?: number, startDelay?: number, onComplete?: () => void }) {
  const [currentText, setCurrentText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (!started) {
      timeout = setTimeout(() => setStarted(true), startDelay);
      return () => clearTimeout(timeout);
    }

    if (currentText.length < text.length) {
      timeout = setTimeout(() => {
        setCurrentText(text.slice(0, currentText.length + 1));
      }, delay);
    } else if (onComplete) {
      onComplete();
    }

    return () => clearTimeout(timeout);
  }, [currentText, text, delay, started, startDelay, onComplete]);

  return (
    <span>{currentText}</span>
  );
}
