"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  ShieldCheck,
  Users2,
  Mail,
  User,
  Phone,
  Building2,
  FileText,
  Monitor,
  ShoppingCart,
  GraduationCap,
  Globe,
  ChevronDown,
} from "lucide-react";
import type { ContactFormData, ContactFormState } from "@/types";
import { cn } from "@/lib/utils";

const PROJECT_TYPE_CARDS = [
  { id: "Custom Web App", title: "Custom Web App", icon: Monitor },
  { id: "E-Commerce Store", title: "E-Commerce Store", icon: ShoppingCart },
  { id: "Educational Portal", title: "Educational Portal", icon: GraduationCap },
  { id: "Business Website", title: "Business Website", icon: Globe },
];

const COUNTRY_CODES = [
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+971", label: "🇦🇪 +971" },
  { code: "+966", label: "🇸🇦 +966" },
  { code: "+61", label: "🇦🇺 +61" },
  { code: "+65", label: "🇸🇬 +65" },
  { code: "+49", label: "🇩🇪 +49" },
  { code: "+33", label: "🇫🇷 +33" },
  { code: "+974", label: "🇶🇦 +974" },
  { code: "+968", label: "🇴🇲 +968" },
  { code: "+965", label: "🇰🇼 +965" },
  { code: "+973", label: "🇧🇭 +973" },
];

const COMMITMENTS = [
  {
    icon: Clock,
    title: "24h Response Guarantee",
    desc: "Rapid technical review & architecture roadmap delivered within 24 hours.",
  },
  {
    icon: ShieldCheck,
    title: "100% IP Ownership",
    desc: "You retain full ownership of all custom source code, assets & databases.",
  },
  {
    icon: Users2,
    title: "Founder-Led Collaboration",
    desc: "Direct access to senior developers from initial call to production launch.",
  },
];

const WhatsAppIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.181 8.181 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.09-.39-.13-.56.12-.17.25-.64.81-.79.97-.14.17-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.37 1 2.53c.12.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
  </svg>
);

const EmailIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="16" x="2" y="4" rx="3" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const inputClass =
  "w-full h-13 rounded-[11px] bg-[#070e20] border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]/40 transition-all";

const labelClass =
  "block text-xs font-mono font-semibold tracking-wider uppercase text-slate-200 mb-2.5 leading-normal";

export function ContactForm() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [countryCode, setCountryCode] = useState("+91");
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "Custom Web App",
    description: "",
    timeline: "2-4 Weeks",
  });

  const [state, setState] = useState<ContactFormState>({ status: "idle" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = "Please enter your name.";
    if (!form.email.trim()) newErrors.email = "Please enter a valid work email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email format.";
    if (!(form.phone || "").trim()) newErrors.phone = "Please enter your phone / WhatsApp number.";
    if (!form.description.trim()) newErrors.description = "Please describe your project scope.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setState({ status: "loading" });

    const fullPhone = `${countryCode} ${(form.phone || "").trim()}`;

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectType: form.projectType || "Custom Web App",
          timeline: form.timeline || "2-4 Weeks",
          name: form.name,
          email: form.email,
          phone: fullPhone,
          company: form.company,
          details: form.description,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setState({
          status: "success",
          message: data.message || "Inquiry received! We will review your project and get back to you within 24 hours.",
        });
        setForm({
          name: "",
          email: "",
          phone: "",
          company: "",
          projectType: "Custom Web App",
          description: "",
          timeline: "2-4 Weeks",
        });
      } else {
        setState({
          status: "error",
          message: data.error || "Failed to submit. Please email us directly at build.zyrostudios@gmail.com",
        });
      }
    } catch {
      setState({
        status: "error",
        message: "Network error. Please try again or email build.zyrostudios@gmail.com directly.",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section
      className="relative bg-[#030712]"
      id="contact"
      style={{ paddingTop: "140px", paddingBottom: "140px" }}
    >
      {/* Ambient background lighting */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[450px] pointer-events-none opacity-15"
        style={{ background: "radial-gradient(ellipse at center, #0084ff 0%, transparent 65%)" }}
      />

      <div ref={ref} className="section-container relative z-10">
        
        {/* ─── Mathematically Centered Section Header ──────────────────────── */}
        <div className="section-header-block" data-section-header="true">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="flex justify-center mb-4"
          >
            <span className="section-label">05 / START A PROJECT</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 tracking-tight text-center leading-[1.15]"
          >
            Have a project in mind?{" "}
            <span className="text-gradient-blue">Let&apos;s build together.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base md:text-lg leading-[1.65] text-center max-w-[600px] mx-auto"
          >
            We partner with founders, businesses, and creators to build high-performance web applications, online stores, and digital infrastructure.
          </motion.p>
        </div>

        {/* ─── Centered 12-Column Grid ────────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full"
          style={{ maxWidth: "1140px", marginLeft: "auto", marginRight: "auto" }}
        >
          
          {/* ─── Left Box: Direct Studio Access (5 Cols) ───────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full w-full lg:col-span-5"
          >
            <div
              className="w-full h-full flex flex-col justify-between rounded-[16px] bg-gradient-to-b from-[#091126]/90 to-[#040816]/95 border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.5)] contact-box-left"
            >
              <div>
                <h3 className="font-display font-bold text-xl text-white mb-4 leading-tight">
                  Direct Studio Access
                </h3>

                <p className="text-slate-400 text-sm leading-[1.65]" style={{ marginBottom: "24px" }}>
                  Have questions before filling the form? Connect directly with our engineering leads for an immediate consultation.
                </p>

                {/* Direct Channel Buttons */}
                <div className="flex flex-col" style={{ gap: "14px", marginTop: "24px", marginBottom: "28px" }}>
                  <a
                    href="mailto:build.zyrostudios@gmail.com"
                    className="flex items-center gap-3.5 p-3.5 rounded-[10px] bg-[#070e20] border border-white/15 hover:border-[#38bdf8]/50 hover:bg-[#0c1630] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-[8px] bg-[#0084ff]/10 border border-[#0084ff]/25 flex items-center justify-center text-[#38bdf8] flex-shrink-0 group-hover:bg-[#0084ff]/20 group-hover:border-[#0084ff]/40 group-hover:shadow-[0_0_12px_rgba(0,132,255,0.3)] transition-all">
                      <EmailIcon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold mb-0.5">
                        Email Us Directly
                      </p>
                      <p className="text-xs font-medium text-white group-hover:text-[#38bdf8] transition-colors font-mono truncate">
                        build.zyrostudios@gmail.com
                      </p>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/917994312026"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-3.5 rounded-[10px] bg-[#070e20] border border-white/15 hover:border-[#25d366]/50 hover:bg-[#0c1630] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-[8px] bg-[#25d366]/10 border border-[#25d366]/25 flex items-center justify-center text-[#25d366] flex-shrink-0 group-hover:bg-[#25d366]/20 group-hover:border-[#25d366]/40 group-hover:shadow-[0_0_14px_rgba(37,211,102,0.3)] transition-all">
                      <WhatsAppIcon size={19} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold mb-0.5">
                        WhatsApp Direct
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-white group-hover:text-[#25d366] transition-colors font-mono">
                        +91 7994312026
                      </p>
                    </div>
                  </a>
                </div>

                {/* Studio Standards */}
                <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <h4
                    className="text-xs font-mono font-bold uppercase tracking-wider text-[#38bdf8]"
                    style={{ marginBottom: "16px" }}
                  >
                    Studio Standards
                  </h4>

                  <div className="flex flex-col" style={{ gap: "24px" }}>
                    {COMMITMENTS.map((c) => {
                      const Icon = c.icon;
                      return (
                        <div key={c.title} className="flex items-start gap-3.5">
                          <div className="w-8 h-8 rounded-[8px] bg-white/5 border border-white/10 flex items-center justify-center text-[#38bdf8] flex-shrink-0 mt-0.5">
                            <Icon size={15} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white leading-snug" style={{ marginBottom: "4px" }}>{c.title}</p>
                            <p className="text-[11px] text-slate-400 leading-[1.55]">{c.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── Right Box: Project Inquiry Form ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col h-full w-full lg:col-span-7"
          >
            <div
              className="w-full h-full flex flex-col justify-between rounded-[16px] bg-[#070e1c] border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.5)] contact-box-right"
            >
              {state.status === "success" ? (
                <div className="w-full h-full flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-300 min-h-[440px]">
                  {/* Glowing Success Badge */}
                  <div className="w-20 h-20 rounded-3xl bg-[#059669]/15 border border-[#10b981]/40 flex items-center justify-center text-[#10b981] mb-6 shadow-[0_0_45px_rgba(16,185,129,0.4)]">
                    <CheckCircle2 size={40} strokeWidth={2.2} />
                  </div>

                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#10b981] mb-2 block">
                    04 // INQUIRY CONFIRMED
                  </span>

                  <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-4 tracking-tight leading-snug">
                    Inquiry Submitted!
                  </h3>

                  <p className="text-slate-300 text-base sm:text-lg w-full max-w-xl mx-auto mb-8 leading-[1.7]">
                    {state.message}
                  </p>

                  {/* 24h Guarantee Pill */}
                  <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs sm:text-sm font-mono mb-10">
                    <Clock size={16} className="text-[#38bdf8]" />
                    <span>24-Hour Rapid Engineering Review</span>
                  </div>

                  {/* Reset Button */}
                  <div className="w-full max-w-md mt-6 sm:mt-8">
                    <button
                      onClick={() => setState({ status: "idle" })}
                      className="w-full h-13 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm sm:text-base transition-all cursor-pointer shadow-lg inline-flex items-center justify-center gap-2"
                    >
                      <span>Submit Another Inquiry</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col justify-between h-full"
                  suppressHydrationWarning
                >
                  <div className="space-y-6">
                    {state.status === "error" && (
                      <div className="p-3.5 rounded-[10px] bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-center gap-2.5 leading-relaxed">
                        <AlertCircle size={16} className="flex-shrink-0 text-red-400" />
                        <span>{state.message}</span>
                      </div>
                    )}

                    {/* ─── Field 1: PROJECT TYPE (Row of 4 Cards) ─────────────── */}
                    <div style={{ marginBottom: "28px" }}>
                      <label className={cn(labelClass, "mb-3")}>
                        1. PROJECT TYPE
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {PROJECT_TYPE_CARDS.map((item) => {
                          const isSelected = form.projectType === item.id;
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setForm((prev) => ({ ...prev, projectType: item.id }))}
                              className={cn(
                                "relative flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all duration-200 cursor-pointer min-h-[108px]",
                                isSelected
                                  ? "bg-[#0b1836] border-[#0084ff] shadow-[0_0_20px_rgba(0,132,255,0.35)]"
                                  : "bg-[#070e20]/80 border-white/10 hover:border-white/25 hover:bg-[#0c1630]"
                              )}
                            >
                              {/* Icon directly rendered with no background circle */}
                              <Icon
                                size={22}
                                className={cn(
                                  "mb-2.5 transition-colors",
                                  isSelected ? "text-[#0084ff]" : "text-slate-400"
                                )}
                              />

                              {/* Title Label */}
                              <span
                                className={cn(
                                  "text-[11px] font-medium text-center leading-tight",
                                  isSelected ? "text-white font-semibold" : "text-slate-300"
                                )}
                              >
                                {item.title}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ─── Field 2: YOUR NAME & WORK EMAIL ───────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ marginBottom: "24px" }}>
                      <div>
                        <label htmlFor="name" className={labelClass}>
                          YOUR NAME <span className="text-red-400">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <User
                            size={17}
                            style={{
                              position: "absolute",
                              left: "16px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#9ca3af",
                              pointerEvents: "none",
                              zIndex: 10,
                            }}
                          />
                          <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className={cn(inputClass, errors.name && "border-red-500/60")}
                            style={{ paddingLeft: "48px", paddingRight: "16px" }}
                            suppressHydrationWarning
                          />
                        </div>
                        {errors.name && <p className="mt-1.5 text-[11px] text-red-400 font-mono leading-tight">{errors.name}</p>}
                      </div>

                      <div>
                        <label htmlFor="email" className={labelClass}>
                          WORK EMAIL <span className="text-red-400">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <Mail
                            size={17}
                            style={{
                              position: "absolute",
                              left: "16px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#9ca3af",
                              pointerEvents: "none",
                              zIndex: 10,
                            }}
                          />
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter work email"
                            className={cn(inputClass, errors.email && "border-red-500/60")}
                            style={{ paddingLeft: "48px", paddingRight: "16px" }}
                            suppressHydrationWarning
                          />
                        </div>
                        {errors.email && <p className="mt-1.5 text-[11px] text-red-400 font-mono leading-tight">{errors.email}</p>}
                      </div>
                    </div>

                    {/* ─── Field 3: PHONE / WHATSAPP & COMPANY / ORGANIZATION ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ marginBottom: "24px" }}>
                      <div>
                        <label htmlFor="phone" className={labelClass}>
                          PHONE / WHATSAPP <span className="text-red-400">*</span>
                        </label>
                        <div className="flex gap-2.5">
                          {/* Multi-Region Dropdown */}
                          <div className="relative shrink-0 flex items-center" style={{ width: "82px" }}>
                            <select
                              value={countryCode}
                              onChange={(e) => setCountryCode(e.target.value)}
                              className="w-full h-13 rounded-[11px] bg-[#070e20] border border-white/15 text-white text-xs font-mono appearance-none focus:outline-none focus:border-[#0084ff] cursor-pointer"
                              style={{ paddingLeft: "8px", paddingRight: "18px" }}
                            >
                              {COUNTRY_CODES.map((c) => (
                                <option key={c.code} value={c.code} className="bg-[#070e20] text-white text-left">
                                  {c.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown size={13} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>

                          {/* Phone Input with Left Icon */}
                          <div className="relative flex-1 flex items-center">
                            <Phone
                              size={17}
                              style={{
                                position: "absolute",
                                left: "16px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#9ca3af",
                                pointerEvents: "none",
                                zIndex: 10,
                              }}
                            />
                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={form.phone}
                              onChange={handleChange}
                              placeholder="Phone number"
                              className={cn(inputClass, errors.phone && "border-red-500/60")}
                              style={{ paddingLeft: "48px", paddingRight: "16px" }}
                              suppressHydrationWarning
                            />
                          </div>
                        </div>
                        {errors.phone && <p className="mt-1.5 text-[11px] text-red-400 font-mono leading-tight">{errors.phone}</p>}
                      </div>

                      <div>
                        <label htmlFor="company" className={labelClass}>
                          COMPANY / ORGANIZATION <span className="text-slate-500 font-normal normal-case">(optional)</span>
                        </label>
                        <div className="relative flex items-center">
                          <Building2
                            size={17}
                            style={{
                              position: "absolute",
                              left: "16px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#9ca3af",
                              pointerEvents: "none",
                              zIndex: 10,
                            }}
                          />
                          <input
                            id="company"
                            name="company"
                            type="text"
                            value={form.company}
                            onChange={handleChange}
                            placeholder="Enter company name"
                            className={inputClass}
                            style={{ paddingLeft: "48px", paddingRight: "16px" }}
                            suppressHydrationWarning
                          />
                        </div>
                      </div>
                    </div>

                    {/* ─── Field 4: PROJECT SCOPE & GOALS ───────────────────── */}
                    <div style={{ marginBottom: "28px" }}>
                      <label htmlFor="description" className={labelClass}>
                        PROJECT SCOPE &amp; GOALS <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <FileText
                          size={17}
                          style={{
                            position: "absolute",
                            left: "16px",
                            top: "16px",
                            color: "#9ca3af",
                            pointerEvents: "none",
                            zIndex: 10,
                          }}
                        />
                        <textarea
                          id="description"
                          name="description"
                          rows={4}
                          value={form.description}
                          onChange={handleChange}
                          placeholder="Describe your project scope, requirements, and timeline expectations..."
                          className={cn(
                            "w-full min-h-[120px] rounded-[11px] bg-[#070e20] border border-white/15 text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]/40 transition-all resize-none leading-[1.6]",
                            errors.description && "border-red-500/60"
                          )}
                          style={{ paddingLeft: "48px", paddingRight: "16px", paddingTop: "14px", paddingBottom: "14px" }}
                          suppressHydrationWarning
                        />
                      </div>
                      {errors.description && (
                        <p className="mt-1.5 text-[11px] text-red-400 font-mono leading-tight">{errors.description}</p>
                      )}
                    </div>
                  </div>

                  {/* ─── Vibrant Full-Width Submit Action Button ───────────── */}
                  <div style={{ marginTop: "12px" }}>
                    <button
                      type="submit"
                      disabled={state.status === "loading"}
                      className="w-full h-13 rounded-[12px] bg-[#0084ff] hover:bg-[#0070f3] text-white text-sm font-bold shadow-[0_0_25px_rgba(0,132,255,0.45)] hover:shadow-[0_0_35px_rgba(0,132,255,0.7)] transition-all cursor-pointer flex items-center justify-center gap-2"
                      suppressHydrationWarning
                    >
                      {state.status === "loading" ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Submitting Inquiry...
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Submit Project Inquiry
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
