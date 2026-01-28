"use client";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [hasMouse, setHasMouse] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device has a mouse (fine pointer)
    const hasFineMouse = window.matchMedia("(pointer: fine)").matches;
    setHasMouse(hasFineMouse);

    if (!hasFineMouse) return; // Don't set up listeners on touch devices

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName === "A" ||
        target.tagName === "BUTTON"
      );
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updatePosition);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Don't render cursor on touch devices
  if (!hasMouse) return null;

  return (
    <>
      {/* Main cursor ball */}
      <div
        className={`fixed pointer-events-none z-[9999] mix-blend-screen will-change-transform transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Inner neon ball */}
        <div
          className={`transition-transform duration-200 ${
            isPointer ? "scale-150" : "scale-100"
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 shadow-[0_0_10px_#10b981,0_0_20px_#10b981,0_0_30px_#10b981]" />
        </div>
      </div>

      {/* Outer glow/aura */}
      <div
        className={`fixed pointer-events-none z-[9998] mix-blend-screen will-change-transform transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className={`transition-transform duration-300 ${
            isPointer ? "scale-125" : "scale-100"
          }`}
        >
          {/* Large outer aura */}
          <div className="w-24 h-24 rounded-full bg-green-400/10 blur-xl shadow-[0_0_40px_rgba(16,185,129,0.3),0_0_60px_rgba(16,185,129,0.2)]" />
        </div>
      </div>

      {/* Middle ring */}
      <div
        className={`fixed pointer-events-none z-[9998] mix-blend-screen will-change-transform transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className={`transition-transform duration-200 ${
            isPointer ? "scale-110" : "scale-100"
          }`}
        >
          {/* Middle glow ring */}
          <div className="w-12 h-12 rounded-full bg-cyan-400/20 blur-md shadow-[0_0_20px_rgba(6,182,212,0.4)]" />
        </div>
      </div>
    </>
  );
}
