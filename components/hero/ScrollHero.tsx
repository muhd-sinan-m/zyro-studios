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

  // Scroll tracking across 380vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const rafIdRef = useRef<number | null>(null);

  // Draw frame to canvas with full viewport cover scaling
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

    // Cover fill for both desktop & mobile viewport
    if (canvasAspect > imgAspect) {
      drawW = w;
      drawH = w / imgAspect;
      offsetY = (h - drawH) / 2;
    } else {
      drawH = h;
      drawW = h * imgAspect;
      offsetX = (w - drawW) / 2;
      offsetY = (h - drawH) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    lastDrawnFrameRef.current = frameIndex;
  }, []);

  // Resize handler with mobile address-bar collapse protection
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const newW = Math.round(rect.width * dpr);
    const newH = Math.round(rect.height * dpr);

    // Don't re-allocate canvas size if height change is just mobile browser address bar collapse
    if (canvas.width !== newW || Math.abs(canvas.height - newH) > 80) {
      canvas.width = newW;
      canvas.height = newH;
    }

    lastDrawnFrameRef.current = -1;
    const currentFrame = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.floor(currentProgressRef.current * (TOTAL_FRAMES - 1)))
    );
    drawFrame(currentFrame);
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

  // Direct passive window scroll tracking (guarantees continuous mobile scroll updates)
  useEffect(() => {
    const handleNativeScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable > 0) {
        const currentScroll = -rect.top;
        const progress = Math.min(1, Math.max(0, currentScroll / totalScrollable));
        targetProgressRef.current = progress;
      }
    };

    window.addEventListener("scroll", handleNativeScroll, { passive: true });
    handleNativeScroll();
    return () => window.removeEventListener("scroll", handleNativeScroll);
  }, []);

  // Smooth LERP animation loop
  useEffect(() => {
    const updateTarget = (progress: number) => {
      targetProgressRef.current = progress;
    };

    const unsubscribe = scrollYProgress.on("change", updateTarget);

    const lerpLoop = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.15;
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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const leftStage = LEFT_STAGES[activeStage];
  const rightStandard = RIGHT_STANDARDS[activeStage];

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#030712]"
      style={{ height: isMobile ? "auto" : "380vh" }}
      aria-label="Interactive scroll animation experience"
    >
      {/* ─── MOBILE-ONLY HERO LAYOUT (Full-Screen Background Image, Stage 01 Flanking Alignment) ─── */}
      <div className="md:hidden relative h-screen w-full flex flex-col justify-between items-center bg-[#030712] overflow-hidden">
        {/* Full-Screen Background Image for Mobile Viewport */}
        <img
          src="/img/mobile-hero.webp"
          alt="Zyro Studios Background"
          className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-95"
        />

        {/* Subtle Vignette Overlay for Image Clarity */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(3,7,18,0.15) 0%, rgba(3,7,18,0.45) 60%, rgba(3,7,18,0.8) 100%)",
          }}
        />

        {/* Ambient Glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] pointer-events-none opacity-30 rounded-full z-0"
          style={{ background: "radial-gradient(circle, #0084ff 0%, transparent 70%)" }}
        />

        {/* ─── LEFT FLANK: Stage 01 Message (Aligned with 28px+ Screen Border Clearance) ─── */}
        <div className="absolute left-7 sm:left-12 top-[16%] sm:top-[18%] z-10 max-w-[280px] text-left pointer-events-none">
          <div className="flex flex-col items-start gap-1.5 sm:gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-[#38bdf8] uppercase">
              01 // CUSTOM WEB APPS
            </span>
            <h1 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-snug">
              Full-Stack Web Applications.
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xs">
              Custom SaaS platforms, client portals, and internal business workflow systems built to scale.
            </p>
          </div>
        </div>

        {/* ─── RIGHT FLANK: Stage 01 Message (Shifted 8px up) ─── */}
        <div className="absolute right-7 sm:right-12 bottom-[13%] sm:bottom-[14%] -translate-y-[3px] z-10 max-w-[280px] text-right pointer-events-none">
          <div className="flex flex-col items-end gap-1 sm:gap-1.5">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-gradient-blue tracking-tight">
              Turnkey
            </span>
            <h3 className="font-display font-bold text-base sm:text-lg text-white">
              End-to-End Delivery
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xs">
              System architecture, UI design, deployment, and maintenance — fully owned, start to finish.
            </p>
          </div>
        </div>

        {/* ─── BOTTOM ACTION BUTTONS: Generous 24px Bottom Clearance ─── */}
        <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="btn-primary text-xs py-2.5 px-6 rounded-full font-semibold shadow-[0_0_24px_rgba(0,132,255,0.4)]"
            >
              <span>Start a Project</span>
              <ArrowRight size={13} />
            </Link>
            <Link
              href="/work"
              className="btn-secondary text-xs py-2.5 px-6 rounded-full font-medium"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>

      {/* ─── DESKTOP VIEWPORT WITH SCROLL CANVAS ANIMATION (Unchanged for Desktop) ─── */}
      <div className="hidden md:flex sticky top-0 h-screen h-[100dvh] w-full overflow-hidden items-center justify-center">
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
              "radial-gradient(ellipse at center, transparent 35%, rgba(3,7,18,0.65) 75%, #030712 100%)",
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
        <div className="absolute left-4 sm:left-12 lg:left-16 top-[12%] sm:top-1/2 sm:-translate-y-1/2 z-20 w-full max-w-[280px] sm:max-w-sm pointer-events-none">
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
                <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-[#38bdf8] uppercase">
                  {leftStage.num} // {leftStage.tag}
                </span>
              </div>

              <h2 className="font-display font-extrabold text-xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                {leftStage.title}
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xs">
                {leftStage.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── RIGHT FLANK: Pure Floating Typography ─────────────── */}
        <div className="absolute right-4 sm:right-12 lg:right-16 bottom-[16%] top-auto sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 z-20 w-full max-w-[280px] sm:max-w-sm text-right pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-end gap-1 sm:gap-2"
            >
              <span className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gradient-blue tracking-tight">
                {rightStandard.metric}
              </span>

              <h3 className="font-display font-bold text-base sm:text-xl text-white">
                {rightStandard.title}
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xs">
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
          className="absolute bottom-2 sm:bottom-3 inset-x-0 z-20 flex justify-center px-4"
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
