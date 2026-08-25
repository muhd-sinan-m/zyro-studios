"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for outer precision ring
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on devices with a mouse/fine pointer
    if (window.matchMedia("(pointer: fine)").matches) {
      setIsTouch(false);
    } else {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = Boolean(
        target.closest("a, button, input, textarea, select, [role='button'], .btn-primary, .btn-secondary, [data-interactive='true']")
      );
      setIsHovered(isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", handleElementHover);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleElementHover);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouch) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
      aria-hidden="true"
    >
      {/* ─── Outer Smooth Precision Crosshair Ring ───────────────────────────── */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{
          scale: 1,
          borderColor: "rgba(56, 189, 248, 0.35)",
          backgroundColor: "rgba(0, 132, 255, 0)",
        }}
        animate={{
          scale: isClicked ? 0.8 : isHovered ? 1.4 : 1,
          borderColor: isHovered ? "rgba(56, 189, 248, 0.85)" : "rgba(56, 189, 248, 0.35)",
          backgroundColor: isHovered ? "rgba(0, 132, 255, 0.08)" : "rgba(0, 132, 255, 0)",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#38bdf8]/40 shadow-[0_0_12px_rgba(56,189,248,0.25)] flex items-center justify-center pointer-events-none"
      >
        {/* Subtle 4-point crosshair ticks */}
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-[#38bdf8]/60" />
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-[#38bdf8]/60" />
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-1 bg-[#38bdf8]/60" />
        <span className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-1 bg-[#38bdf8]/60" />
      </motion.div>

      {/* ─── Crisp Center Precision Dot ──────────────────────────────────────── */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicked ? 0.6 : isHovered ? 1.25 : 1,
        }}
        transition={{ duration: 0.1 }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8] pointer-events-none"
      />
    </div>
  );
}
