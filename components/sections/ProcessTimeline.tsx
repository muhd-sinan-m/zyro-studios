"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { processSteps } from "@/data/navigation";
import ArrowRevealButton from "@/components/ui/ArrowRevealButton";

export function ProcessTimeline() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-60px" });

  return (
    <section
      className="relative overflow-hidden bg-[#030712]"
      id="process"
      style={{ paddingTop: "140px", paddingBottom: "100px" }}
    >
      <div className="section-container relative z-10">
        
        {/* ─── Centered Section Header ──────────────────────────────────────── */}
        <div ref={headRef} className="section-header-block" data-section-header="true">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            className="flex justify-center mb-4"
          >
            <span className="section-label">06 / ENGINEERING LIFECYCLE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-4 tracking-tight text-center"
          >
            From concept to <span className="text-gradient-blue">launch &amp; scale.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed text-center max-w-[600px] mx-auto"
          >
            A clear, predictable roadmap where precision engineering meets continuous feedback.
          </motion.p>
        </div>

        {/* ─── Balanced 8-Card Grid (2 per row on mobile, 4 per row on desktop) ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {/* Steps 01 through 07 */}
          {processSteps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 25 }}
              animate={headInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="premium-card p-4 sm:p-7 group relative overflow-hidden flex flex-col justify-between"
            >
              {/* Subtle Step Number Watermark */}
              <div className="absolute top-2 sm:top-4 right-3 sm:right-5 font-mono font-bold text-2xl sm:text-4xl text-white/[0.03] select-none group-hover:text-[#38bdf8]/10 transition-colors">
                {step.number}
              </div>

              <div>
                <span className="text-[10px] sm:text-xs font-mono font-bold text-[#38bdf8] mb-2 sm:mb-3 block">
                  {step.number} // STEP
                </span>

                <h3 className="font-display font-bold text-xs sm:text-xl text-white mb-2 sm:mb-3 group-hover:text-[#38bdf8] transition-colors leading-snug">
                  {step.title}
                </h3>

                <p className="text-slate-400 text-[11px] sm:text-sm leading-normal sm:leading-[1.6]">
                  {step.description}
                </p>
              </div>

              <div className="mt-3 sm:mt-6 flex items-center justify-between">
                <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold">
                  Phase {step.number}
                </span>
              </div>
            </motion.div>
          ))}

          {/* ─── 8th Card: Closing CTA Beside "Grow" ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 7 * 0.07 }}
            className="premium-card p-4 sm:p-7 group relative overflow-hidden flex flex-col justify-between border-[#0084ff]/30 bg-gradient-to-b from-[#0084ff]/10 via-[#07112b] to-[#040816]/95 hover:border-[#38bdf8]/60 shadow-[0_0_30px_rgba(0,132,255,0.15)]"
          >
            {/* Subtle Watermark */}
            <div className="absolute top-2 sm:top-4 right-3 sm:right-5 font-mono font-bold text-2xl sm:text-4xl text-[#38bdf8]/10 select-none group-hover:text-[#38bdf8]/20 transition-colors">
              08
            </div>

            <div>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-[#38bdf8] mb-2 sm:mb-3 block">
                08 // START BUILD
              </span>

              <h3 className="font-display font-bold text-xs sm:text-xl text-white mb-2 sm:mb-3 group-hover:text-[#38bdf8] transition-colors leading-snug">
                Ready to launch?
              </h3>

              <p className="text-slate-400 text-[11px] sm:text-sm leading-normal sm:leading-[1.6]">
                Turn your roadmap into production code with dedicated senior execution.
              </p>
            </div>

            <div className="mt-3 sm:mt-6 flex items-center justify-center w-full">
              <ArrowRevealButton
                label="Start Project"
                link="/contact"
                colors={{ fill: "#0084ff", textColor: "#FFFFFF" }}
                icon={{
                  side: "right",
                  type: "icon",
                  icon: "arrow",
                  background: "rgba(255, 255, 255, 0.18)",
                  color: "#FFFFFF",
                  padding: 6,
                  size: 12,
                }}
                padding="8px 12px"
                rounded={100}
                font={{ fontSize: "11px", fontWeight: 700 }}
                style={{ width: "100%" }}
              />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
