"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Layout, Server, Database, Cloud } from "lucide-react";

const TECH_PILLARS = [
  {
    icon: Layout,
    title: "Frontend Architecture",
    tagline: "Sub-second SSR & 60fps motion",
    stack: [
      { name: "Next.js 15", role: "SSR & Edge Routing" },
      { name: "React 19", role: "Component Tree" },
      { name: "TypeScript", role: "Type Safety" },
      { name: "Tailwind CSS", role: "Design Tokens" },
      { name: "Framer Motion", role: "Kinetic Engine" },
    ],
  },
  {
    icon: Server,
    title: "Backend & Services",
    tagline: "High-concurrency event architecture",
    stack: [
      { name: "Node.js", role: "Event Runtime" },
      { name: "Python", role: "Backend Logic" },
      { name: "FastAPI", role: "High-Speed REST" },
      { name: "Django", role: "Enterprise Framework" },
      { name: "REST / GraphQL", role: "API Protocol" },
    ],
  },
  {
    icon: Database,
    title: "Data & Storage",
    tagline: "ACID storage & real-time sync",
    stack: [
      { name: "PostgreSQL", role: "Relational Engine" },
      { name: "Supabase", role: "Realtime & Auth" },
      { name: "Redis", role: "In-Memory Cache" },
      { name: "MySQL", role: "Structured DB" },
      { name: "Prisma ORM", role: "Schema Validation" },
    ],
  },
  {
    icon: Cloud,
    title: "Cloud & Security",
    tagline: "Global edge & zero-downtime CI/CD",
    stack: [
      { name: "Vercel", role: "Global Edge Platform" },
      { name: "AWS", role: "Cloud Compute & S3" },
      { name: "Cloudflare", role: "DNS & DDoS Shield" },
      { name: "Docker", role: "Container Builds" },
      { name: "GitHub Actions", role: "Automated CI/CD" },
    ],
  },
];

export function TechStack() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="section-padding relative overflow-hidden bg-[#030712]" id="tech">
      <div className="section-container relative z-10">
        
        {/* ─── Centered Section Header ──────────────────────────────────────── */}
        <div ref={ref} className="section-header-block" data-section-header="true">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="flex justify-center mb-4"
          >
            <span className="section-label">07 / TECHNOLOGY FOUNDATION</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-4 tracking-tight text-center"
          >
            Modern, maintainable{" "}
            <span className="text-gradient-blue">infrastructure.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed text-center max-w-[600px] mx-auto"
          >
            We curate technologies specifically for high uptime, rapid performance, and long-term scalability.
          </motion.p>
        </div>

        {/* ─── 4-Pillar Standardized Matrix (align-items: stretch) ─────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch w-full">
          {TECH_PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="flex flex-col h-full w-full"
              >
                {/* Standardized Card Container with 24px uniform padding */}
                <div
                  className="w-full h-full flex flex-col justify-between rounded-[14px] bg-gradient-to-b from-[#091126]/90 to-[#040816]/95 border border-white/15 hover:border-[#38bdf8]/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300"
                  style={{ padding: "24px" }}
                >
                  <div className="flex flex-col flex-1">
                    {/* Header Block with top-aligned icon and fixed 80px min-height */}
                    <div
                      className="flex items-start gap-3.5 mb-5 pb-5 border-b border-white/10"
                      style={{ minHeight: "80px" }}
                    >
                      <div className="w-10 h-10 rounded-[10px] bg-[#0084ff]/10 border border-[#0084ff]/25 flex items-center justify-center text-[#38bdf8] flex-shrink-0 mt-0.5">
                        <Icon size={19} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display font-bold text-base text-white leading-tight">
                          {pillar.title}
                        </h3>
                        <p className="text-[11px] font-mono text-slate-400 mt-1 leading-snug">
                          {pillar.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Standardized 5-Row Technology List with 10px spacing */}
                    <div className="space-y-2.5">
                      {pillar.stack.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between p-3 rounded-[10px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-[#38bdf8]/35 transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_6px_#38bdf8] flex-shrink-0" />
                            <span className="font-mono text-xs font-semibold text-white truncate">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400 text-right flex-shrink-0 ml-2">
                            {item.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
