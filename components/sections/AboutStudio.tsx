"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function AboutStudio() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="relative overflow-hidden bg-[#030712]"
      id="about"
      style={{ paddingTop: "140px", paddingBottom: "100px" }}
    >
      <div className="section-container relative z-10">
        
        {/* ─── Centered Section Header ──────────────────────────────────────── */}
        <div ref={ref} className="section-header-block" data-section-header="true">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="flex justify-center mb-4"
          >
            <span className="section-label">08 / STUDIO MANIFESTO</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-4 tracking-tight text-center"
          >
            Built by developers.{" "}
            <span className="text-gradient-blue">Designed for growth.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed text-center max-w-[600px] mx-auto"
          >
            We replace bloated agency processes with direct senior engineer collaboration, clear milestones, and meticulous execution.
          </motion.p>
        </div>

        {/* ─── Centered Studio Philosophy Card (Compact & Efficient Spacing) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="w-full rounded-[16px] bg-gradient-to-b from-[#091126]/90 to-[#040816]/95 border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex flex-col items-center text-center"
          style={{ maxWidth: "860px", marginLeft: "auto", marginRight: "auto", padding: "48px 36px" }}
        >
          {/* Eyebrow label */}
          <div className="flex justify-center" style={{ marginBottom: "12px" }}>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#38bdf8]">
              OUR CORE PHILOSOPHY
            </span>
          </div>

          {/* Heading */}
          <h3
            className="font-display font-bold text-2xl sm:text-3xl text-white leading-tight text-center"
            style={{ maxWidth: "680px", marginLeft: "auto", marginRight: "auto", marginBottom: "16px" }}
          >
            High-Agency Engineering For Ambitious Brands
          </h3>

          {/* Paragraphs with clean 24px margin-bottom */}
          <div
            className="space-y-3 text-slate-300 text-sm sm:text-base leading-[1.65] text-center"
            style={{ maxWidth: "680px", marginLeft: "auto", marginRight: "auto", marginBottom: "24px" }}
          >
            <p>
              Zyro Studios is a development-focused digital studio engineered to ship bespoke web platforms, custom applications, and e-commerce infrastructure.
            </p>
            <p>
              Every project is built from clean source code with direct developer access, transparent communication, and 100% intellectual property ownership. We don&apos;t use bloated templates or outsource work — everything is engineered in-house with modern frameworks.
            </p>
          </div>

          {/* Divider Line 1 (24px top/bottom) */}
          <div
            style={{
              width: "100%",
              maxWidth: "680px",
              height: "1px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              margin: "0 auto 24px auto",
            }}
          />

          {/* 3 Pillars Checkmark Row (Centered as a Unit) */}
          <div
            className="flex flex-wrap items-center justify-center text-center"
            style={{ gap: "28px", width: "100%", maxWidth: "680px", margin: "0 auto 24px auto" }}
          >
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <CheckCircle2 size={15} className="text-[#38bdf8] flex-shrink-0" />
              <span>Direct Developer Access</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <CheckCircle2 size={15} className="text-[#38bdf8] flex-shrink-0" />
              <span>100% Code Ownership</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <CheckCircle2 size={15} className="text-[#38bdf8] flex-shrink-0" />
              <span>Production-Grade Quality</span>
            </div>
          </div>

          {/* Divider Line 2 (24px top/bottom) */}
          <div
            style={{
              width: "100%",
              maxWidth: "680px",
              height: "1px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              margin: "0 auto 24px auto",
            }}
          />

          {/* Bottom Action Row (Centered as a Unit) */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center text-center"
            style={{ gap: "24px", width: "100%", maxWidth: "680px", margin: "0 auto" }}
          >
            <Link
              href="/contact"
              className="btn-primary text-xs sm:text-sm px-8 py-3.5 rounded-[10px] font-bold shadow-[0_0_24px_rgba(0,132,255,0.4)] hover:shadow-[0_0_35px_rgba(0,132,255,0.65)] transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Start a Conversation</span>
              <ArrowRight size={15} />
            </Link>
            <a
              href="mailto:build.zyrostudios@gmail.com"
              className="text-xs font-mono text-slate-300 hover:text-[#38bdf8] transition-colors"
            >
              build.zyrostudios@gmail.com
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
