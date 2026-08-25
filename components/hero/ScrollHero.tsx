"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Activity, ShieldCheck } from "lucide-react";

const TOTAL_FRAMES = 240;

const LEFT_STAGES = [
  {
    num: "01",
    tag: "CUSTOM WEB APPS",
    title: "Full-Stack Web Applications.",
    desc: "Custom SaaS platforms, client portals, and internal business workflow systems built to scale.",
    icon: Sparkles,
  },
  {
    num: "02",
    tag: "COMMERCE & PORTALS",
    title: "E-Commerce & Educational Portals.",
    desc: "High-converting online stores, automated checkouts, and academic resource platforms like PyQ Portal.",
    icon: Activity,
  },
  {
    num: "03",
    tag: "DIGITAL PLATFORMS",
    title: "Tailored Digital Infrastructure.",
    desc: "High-impact digital headquarters and custom web platforms engineered to grow your business.",
    icon: ShieldCheck,
  },
];

const RIGHT_STANDARDS = [
  {
    metric: "Turnkey",
    title: "End-to-End Delivery",
    desc: "System architecture, UI design, deployment, and maintenance — fully owned, start to finish.",
  },
  {
    metric: "Revenue",
    title: "Conversion-Driven UI",
    desc: "Every interface decision is measured against one goal: turning visitors into customers.",
  },
  {
    metric: "Direct",
    title: "Founder-Led Builds",
    desc: "You work directly with the engineers building your product — not a rotating team.",
  },
];

export function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const [isFirstFrameReady, setIsFirstFrameReady] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [isSettled, setIsSettled] = useState(false);
  const [heroHeight, setHeroHeight] = useState("380vh");

  // Dynamically set container height for mobile (250vh) vs desktop (380vh)
  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 768) {
        setHeroHeight("250vh");
      } else {
        setHeroHeight("380vh");
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Scroll tracking across container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const rafIdRef = useRef<number | null>(null);

  // Draw frame to canvas with adaptive mobile contain & desktop cover scaling
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let i = frameIndex - 1; i >= 0; i--) {
        if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth !== 0) {
          img = imagesRef.current[i];
          break;
        }
      }
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let i = frameIndex + 1; i < TOTAL_FRAMES; i++) {
          if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth !== 0) {
            img = imagesRef.current[i];
            break;
          }
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const canvasAspect = w / h;
    const imgAspect = imgW / imgH;

    let drawW = w;
    let drawH = h;
    let offsetX = 0;
    let offsetY = 0;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Mobile adaptive scaling: fit 3D logo proportionally so it is NOT cut off or huge
      const scale = Math.min(w / imgW, h / imgH) * 0.72;
      drawW = imgW * scale;
      drawH = imgH * scale;
      offsetX = (w - drawW) / 2;
      offsetY = (h - drawH) / 2;
    } else {
      // Desktop cover scaling with slight upward shift for text clearance
      const verticalShift = h * 0.04;
      if (canvasAspect > imgAspect) {
        drawW = w;
        drawH = w / imgAspect;
        offsetY = (h - drawH) / 2 - verticalShift;
      } else {
        drawH = h;
        drawW = h * imgAspect;
        offsetX = (w - drawW) / 2;
        offsetY = -verticalShift;
      }
    }

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    lastDrawnFrameRef.current = frameIndex;
  }, []);

  // Resize handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    if (lastDrawnFrameRef.current >= 0) {
      drawFrame(lastDrawnFrameRef.current);
    }
  }, [drawFrame]);

  // Preload and GPU-decode all 240 frames
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES).fill(null);
    let isCancelled = false;

    // Load first frame immediately
    const firstImg = new Image();
    firstImg.src = `/hero/frames/frame_001.webp`;
    firstImg.onload = async () => {
      if (isCancelled) return;
      try {
        await firstImg.decode();
      } catch {
        // Fallback
      }
      imagesRef.current[0] = firstImg;
      setIsFirstFrameReady(true);
      handleResize();
      drawFrame(0);
    };

    // Preload remaining frames
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i + 1).padStart(3, "0");
      img.src = `/hero/frames/frame_${frameNum}.webp`;
      img.onload = async () => {
        if (isCancelled) return;
        try {
          await img.decode();
        } catch {
          // ignore
        }
        imagesRef.current[i] = img;
      };
    }

    window.addEventListener("resize", handleResize);
    return () => {
      isCancelled = true;
      window.removeEventListener("resize", handleResize);
    };
  }, [drawFrame, handleResize]);

  // LERP Smoothing Animation Loop
  useEffect(() => {
    const updateTarget = (progress: number) => {
      targetProgressRef.current = progress;
    };

    const unsubscribe = scrollYProgress.on("change", updateTarget);

    const lerpLoop = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      // Faster response rate on mobile touch scroll (0.28 vs 0.09)
      const isMobile = window.innerWidth < 768;
      const lerpRate = isMobile ? 0.28 : 0.09;

      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * lerpRate;
      } else {
        currentProgressRef.current = target;
      }

      const smoothed = currentProgressRef.current;

      // Update active discrete stage
      if (smoothed < 0.35) {
        setActiveStage(0);
        setIsSettled(false);
      } else if (smoothed < 0.70) {
        setActiveStage(1);
        setIsSettled(false);
      } else {
        setActiveStage(2);
        setIsSettled(smoothed >= 0.78);
      }

      // Clean forward-only animation: scroll 0→1 plays frames 0→239
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(smoothed * (TOTAL_FRAMES - 1)))
      );

      if (frameIndex !== lastDrawnFrameRef.current) {
        drawFrame(frameIndex);
      }

      rafIdRef.current = requestAnimationFrame(lerpLoop);
    };

    rafIdRef.current = requestAnimationFrame(lerpLoop);

    return () => {
      unsubscribe();
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [scrollYProgress, drawFrame]);

  const leftStage = LEFT_STAGES[activeStage];
  const rightStandard = RIGHT_STANDARDS[activeStage];

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#030712]"
      style={{ height: heroHeight }}
      aria-label="Interactive scroll animation experience"
    >
      {/* Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Fullscreen Canvas with 3D logo */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block absolute inset-0"
          style={{ filter: "brightness(1.03) contrast(1.06)" }}
          aria-hidden="true"
        />

        {/* Ambient Dark Gradient & Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(3,7,18,0.65) 75%, #030712 100%)",
          }}
        />

        {/* Top/Bottom smooth blending transitions */}
        <div
          className="absolute inset-x-0 top-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, #030712 0%, transparent 100%)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
          style={{ background: "linear-gradient(to top, #030712 0%, transparent 100%)" }}
        />

        {/* ─── LEFT FLANK: Pure Floating Typography ──────────────── */}
        <div className="absolute left-4 sm:left-12 lg:left-16 top-[13%] sm:top-1/2 sm:-translate-y-1/2 z-20 w-full max-w-[260px] sm:max-w-sm pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col gap-1.5 sm:gap-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#38bdf8] uppercase">
                  {leftStage.num} // {leftStage.tag}
                </span>
              </div>

              <h2 className="font-display font-extrabold text-lg sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                {leftStage.title}
              </h2>

              <p className="text-slate-400 text-[11px] sm:text-sm leading-relaxed max-w-xs">
                {leftStage.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── RIGHT FLANK: Pure Floating Typography ─────────────── */}
        <div className="absolute right-4 sm:right-12 lg:right-16 bottom-[16%] top-auto sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 z-20 w-full max-w-[260px] sm:max-w-sm text-right pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-end gap-1 sm:gap-2"
            >
              <span className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-gradient-blue tracking-tight">
                {rightStandard.metric}
              </span>

              <h3 className="font-display font-bold text-sm sm:text-xl text-white">
                {rightStandard.title}
              </h3>

              <p className="text-slate-400 text-[11px] sm:text-sm leading-relaxed max-w-xs">
                {rightStandard.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── BOTTOM CLEAN ACTION BUTTONS ────────────────────────────────────── */}
        <motion.div
          animate={{
            opacity: isSettled ? 1 : 0,
            y: isSettled ? 0 : 20,
            pointerEvents: isSettled ? "auto" : "none",
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute bottom-4 sm:bottom-6 inset-x-0 z-20 flex justify-center px-4"
        >
          <div className="flex items-center gap-3">
            <Link href="/contact" className="btn-primary text-xs py-2.5 px-6 rounded-full font-semibold shadow-[0_0_24px_rgba(0,132,255,0.4)]">
              <span>Start a Project</span>
              <ArrowRight size={13} />
            </Link>
            <Link href="/work" className="btn-secondary text-xs py-2.5 px-6 rounded-full font-medium">
              View Our Work
            </Link>
          </div>
        </motion.div>

        {/* Initial Minimal Loader */}
        {!isFirstFrameReady && (
          <div className="absolute inset-0 z-30 bg-[#030712] flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-[#0084ff] border-t-transparent animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
