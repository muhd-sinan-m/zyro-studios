"use client";

import { motion } from "framer-motion";
import { Layers, Cpu, Smartphone, Zap, Shield, HeartHandshake } from "lucide-react";

const pillars = [
  {
    icon: Layers,
    title: "100% Bespoke Engineering",
    description:
      "Every product is conceived and built from the ground up to match your exact goals, brand identity, and operational workflows — zero cookie-cutter templates.",
  },
  {
    icon: Cpu,
    title: "Modern Tech Foundation",
    description:
      "Engineered with cutting-edge, battle-tested frameworks like Next.js, React, TypeScript, and modern headless backends built for maintainability.",
  },
  {
    icon: Smartphone,
    title: "Fluid Across All Screens",
    description:
      "Pixel-perfect responsive execution across mobile, tablet, desktop, and ultra-wide displays with touch-optimized micro-interactions.",
  },
  {
    icon: Zap,
    title: "Performance & SEO First",
    description:
      "Sub-second load times, stellar Core Web Vitals, and semantic SEO structure built directly into the codebase to maximize conversion.",
  },
  {
    icon: Shield,
    title: "Production-Grade Security",
    description:
      "Strict input validation, CSRF/XSS protection, secure environment management, and zero-trust cloud deployment practices.",
  },
  {
    icon: HeartHandshake,
    title: "Dedicated Studio Partnership",
    description:
      "We act as your technical partner before, during, and long after deployment — offering proactive enhancements, monitoring, and scaling support.",
  },
];

export function WhyZyro() {
  return (
    <section className="section-padding relative overflow-hidden bg-[#030712]" id="why-zyro">
      <div className="section-container relative z-10">
        {/* Centered Section Header */}
        <div className="section-header-block" data-section-header="true">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mb-4"
          >
            <span className="section-label">03 / STUDIO STANDARDS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-4 tracking-tight text-center"
          >
            Built for those who value{" "}
            <span className="text-gradient-blue">quality.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed text-center max-w-[600px] mx-auto"
          >
            We combine high-agency developer craft with direct communication to deliver digital assets that perform.
          </motion.p>
        </div>

        {/* 6-Card Bento Grid (2 per row on mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {pillars.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="premium-card p-4 sm:p-8 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#38bdf8] mb-3 sm:mb-5 group-hover:bg-[#0084ff]/20 group-hover:border-[#0084ff]/40 transition-all">
                    <Icon size={17} className="sm:hidden" />
                    <Icon size={20} className="hidden sm:block" />
                  </div>
                  <h3 className="font-display font-bold text-xs sm:text-lg text-white mb-1.5 sm:mb-2.5 group-hover:text-[#38bdf8] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-[11px] sm:text-sm leading-normal sm:leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
