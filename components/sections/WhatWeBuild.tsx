"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight, Code2, ShoppingBag, GraduationCap, Building, Zap,
  Webhook, LayoutDashboard, CreditCard, Database, Cloud, Gauge
} from "lucide-react";

const SPECIALIZED_MODULES = [
  {
    icon: Webhook,
    title: "API Integrations",
    desc: "REST, GraphQL & third-party webhook sync",
  },
  {
    icon: LayoutDashboard,
    title: "Admin Dashboards",
    desc: "Real-time metrics, analytics & role-based RBAC",
  },
  {
    icon: CreditCard,
    title: "Payment Systems",
    desc: "Stripe, subscriptions & automated invoices",
  },
  {
    icon: Database,
    title: "CMS Architecture",
    desc: "Headless content & dynamic schema workflows",
  },
  {
    icon: Cloud,
    title: "Cloud Deployment",
    desc: "Edge networks, zero-downtime & global CDN",
  },
  {
    icon: Gauge,
    title: "Performance Tuning",
    desc: "Sub-second load times & 100/100 Core Web Vitals",
  },
];

export function WhatWeBuild() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-60px" });

  return (
    <section
      className="relative overflow-hidden bg-[#030712]"
      id="services"
      style={{ paddingTop: "140px", paddingBottom: "100px" }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none opacity-15"
        style={{ background: "radial-gradient(circle, #0084ff 0%, transparent 70%)" }}
      />

      <div className="section-container relative z-10">
        {/* Centered Section Header */}
        <div ref={headRef} className="section-header-block" data-section-header="true">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            className="flex justify-center mb-4"
          >
            <span className="section-label">02 / CORE CAPABILITIES</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-4 tracking-tight text-center"
          >
            What we engineer for{" "}
            <span className="text-gradient-blue">modern brands.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base leading-relaxed text-center max-w-[620px] mx-auto"
          >
            From bespoke web applications to high-converting e-commerce and educational platforms — we develop tailored digital infrastructure built to grow.
          </motion.p>
        </div>

        {/* ─── Luxury Asymmetrical Bento Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
          
          {/* Card 1 (Large 8 Cols): Custom Web Applications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="md:col-span-12 lg:col-span-8 bento-card relative overflow-hidden group border border-white/10 hover:border-blue-500/40 p-8 sm:p-10"
          >
            <div className="mb-8">
              <div className="max-w-2xl">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#38bdf8] group-hover:bg-[#0084ff]/20 transition-colors mb-6">
                  <Code2 size={22} />
                </div>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-3 group-hover:text-[#38bdf8] transition-colors">
                  Custom Web Applications
                </h3>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  Full-stack digital products, internal workflow tools, customer dashboards, and database-driven web platforms tailored to your exact business logic.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {["Next.js 15", "TypeScript", "Tailored DB", "Secure Auth", "Real-Time Sync"].map((tag) => (
                  <span key={tag} className="text-xs font-mono text-slate-300 bg-white/5 px-3.5 py-1.5 rounded-full border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
              <Link href="/contact" className="inline-flex items-center gap-2 text-xs font-semibold text-[#38bdf8] group-hover:text-white transition-colors">
                <span>Start build</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </motion.div>

          {/* Card 2 (4 Cols): E-Commerce Stores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.18 }}
            className="md:col-span-6 lg:col-span-4 bento-card relative overflow-hidden group border border-white/10 hover:border-blue-500/40 p-8 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#38bdf8] mb-6 group-hover:bg-[#0084ff]/20 transition-colors">
                <ShoppingBag size={22} />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-3 group-hover:text-[#38bdf8] transition-colors">
                E-Commerce Stores
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Fast shopping experiences with streamlined checkout, inventory management, and zero-friction payment gateways.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {["Stripe", "Cart Engine", "Mobile-First"].map((t) => (
                  <span key={t} className="text-[11px] font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-md border border-white/5">
                    {t}
                  </span>
                ))}
              </div>
              <Link href="/contact" className="text-slate-400 hover:text-[#38bdf8] transition-colors p-1">
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </motion.div>

          {/* Card 3 (4 Cols): Educational Platforms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.24 }}
            className="md:col-span-6 lg:col-span-4 bento-card group border border-white/10 hover:border-blue-500/40 p-8 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#38bdf8] mb-6 group-hover:bg-[#0084ff]/20 transition-colors">
                <GraduationCap size={22} />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-3 group-hover:text-[#38bdf8] transition-colors">
                Educational Portals
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Resource hubs, question repositories, and student portals built for frictionless academic discovery.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {["Resource DB", "Search Index", "Fast PDF"].map((t) => (
                  <span key={t} className="text-[11px] font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-md border border-white/5">
                    {t}
                  </span>
                ))}
              </div>
              <Link href="/contact" className="text-slate-400 hover:text-[#38bdf8] transition-colors p-1">
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </motion.div>

          {/* Card 4 (4 Cols): Business Websites */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="md:col-span-6 lg:col-span-4 bento-card group border border-white/10 hover:border-blue-500/40 p-8 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#38bdf8] mb-6 group-hover:bg-[#0084ff]/20 transition-colors">
                <Building size={22} />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-3 group-hover:text-[#38bdf8] transition-colors">
                Business Websites
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                High-credibility digital headquarters for companies and service providers that position you as an industry leader.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {["SEO Built-in", "Inquiry Forms", "Sub-Second"].map((t) => (
                  <span key={t} className="text-[11px] font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-md border border-white/5">
                    {t}
                  </span>
                ))}
              </div>
              <Link href="/contact" className="text-slate-400 hover:text-[#38bdf8] transition-colors p-1">
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </motion.div>

          {/* Card 5 (4 Cols): Landing Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.36 }}
            className="md:col-span-6 lg:col-span-4 bento-card group border border-white/10 hover:border-blue-500/40 p-8 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#38bdf8] mb-6 group-hover:bg-[#0084ff]/20 transition-colors">
                <Zap size={22} />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-3 group-hover:text-[#38bdf8] transition-colors">
                Landing Pages
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Laser-focused campaign pages built to maximize conversion rates for product launches and marketing campaigns.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {["Conversion UI", "Analytics Ready", "A/B Ready"].map((t) => (
                  <span key={t} className="text-[11px] font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-md border border-white/5">
                    {t}
                  </span>
                ))}
              </div>
              <Link href="/contact" className="text-slate-400 hover:text-[#38bdf8] transition-colors p-1">
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </motion.div>

        </div>

        {/* ─── Specialized Modules Matrix (6 Cards) ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          {/* Main Heading: Specialized Infrastructure Modules */}
          <div
            className="flex items-center gap-3.5"
            style={{ marginTop: "56px", marginBottom: "28px" }}
          >
            <h4 className="text-xs sm:text-sm font-mono font-bold tracking-widest text-white uppercase">
              Specialized Infrastructure Modules
            </h4>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {SPECIALIZED_MODULES.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group rounded-[14px] bg-gradient-to-b from-[#091126]/80 to-[#040816]/90 border border-white/15 hover:border-[#38bdf8]/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 p-3.5 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-4">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-[9px] sm:rounded-[10px] bg-[#0084ff]/10 border border-[#0084ff]/25 flex items-center justify-center text-[#38bdf8] flex-shrink-0 group-hover:bg-[#0084ff]/20 group-hover:border-[#0084ff]/40 transition-all p-1.5 sm:p-2.5 mt-0.5">
                      <Icon size={17} className="sm:hidden" />
                      <Icon size={20} className="hidden sm:block" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-base font-display font-bold text-white mb-1 sm:mb-2 group-hover:text-[#38bdf8] transition-colors leading-snug">
                        {item.title}
                      </p>
                      <p className="text-[11px] sm:text-sm text-slate-300 leading-normal sm:leading-[1.6]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
