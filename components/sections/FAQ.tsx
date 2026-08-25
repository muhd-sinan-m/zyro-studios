"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What types of digital platforms and websites do you build?",
    answer:
      "We engineer custom business websites, high-converting e-commerce stores, comprehensive educational platforms, portfolio sites, landing pages, and bespoke web applications with tailored internal workflows and admin dashboards.",
  },
  {
    question: "Can you build directly from existing Figma / UI designs?",
    answer:
      "Yes. We translate Figma, Adobe XD, or Sketch designs into pixel-perfect, production-grade code with responsive fluid layouts and high-performance animations.",
  },
  {
    question: "Do you provide infrastructure, hosting, and deployment?",
    answer:
      "Yes. We handle end-to-end setup across modern cloud platforms like Vercel, AWS, Supabase, and Cloudflare — including DNS configuration, edge CDN caching, and SSL certificates.",
  },
  {
    question: "Do you offer post-launch maintenance and continuous support?",
    answer:
      "Yes. We provide ongoing support packages that cover performance monitoring, feature development, framework updates, and proactive optimizations as your user base expands.",
  },
  {
    question: "How long does a typical project take from start to finish?",
    answer:
      "Timelines depend on scope and feature complexity: landing pages typically take 1–2 weeks, full business websites take 3–5 weeks, and comprehensive web platforms take 6–10 weeks with weekly milestone demos.",
  },
];

function FAQItem({ item }: { item: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full rounded-[12px] bg-gradient-to-b from-[#091126]/90 to-[#040816]/95 border border-white/15 overflow-hidden transition-all duration-200 hover:border-[#38bdf8]/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      {/* Question Row with explicit 24px vertical / 28px horizontal padding */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
        style={{ padding: "22px 28px", gap: "20px" }}
        aria-expanded={open}
        suppressHydrationWarning
      >
        <span className="font-display font-bold text-white text-base sm:text-lg leading-snug">
          {item.question}
        </span>
        <div
          className={cn(
            "w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0 transition-all duration-200",
            open
              ? "bg-[#0084ff] text-white shadow-[0_0_15px_rgba(0,132,255,0.5)]"
              : "bg-[#070e20] text-[#38bdf8] border border-white/15 hover:border-white/30"
          )}
        >
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {/* Expanded answer content container with 24px bottom breathing room */}
            <div style={{ padding: "0 28px 24px 28px" }}>
              <div
                className="rounded-[10px] bg-[#070e20]/95 border border-white/10 border-l-2 border-l-[#38bdf8] text-slate-300 text-sm sm:text-base leading-[1.65]"
                style={{ padding: "20px 24px" }}
              >
                {item.answer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-60px" });

  return (
    <section className="section-padding relative overflow-hidden bg-[#030712]" id="faq">
      <div className="section-container relative z-10">
        
        {/* ─── Centered Section Header (Matching 860px max-width) ───────────── */}
        <div
          ref={headRef}
          className="section-header-block"
          data-section-header="true"
          style={{ maxWidth: "860px", marginLeft: "auto", marginRight: "auto" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            className="flex justify-center mb-4"
          >
            <span className="section-label">09 / FREQUENTLY ASKED QUESTIONS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-4 tracking-tight text-center"
          >
            Clear answers to <span className="text-gradient-blue">common questions.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base leading-relaxed text-center max-w-[580px] mx-auto"
          >
            Everything you need to know about our engineering process, pricing models, and ongoing studio support.
          </motion.p>
        </div>

        {/* ─── Centered FAQ List Container (Matching 860px max-width) ────────── */}
        <div
          className="w-full flex flex-col"
          style={{ maxWidth: "860px", marginLeft: "auto", marginRight: "auto", gap: "16px" }}
        >
          {faqs.map((faq, i) => (
            <FAQItem key={i} item={faq} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
