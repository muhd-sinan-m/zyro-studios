"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Calendar, User, Layers, Flag, Check, FileText, Maximize2 } from "lucide-react";
import Image from "next/image";
import { Project } from "@/types";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeImagePreview, setActiveImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeImagePreview) {
          setActiveImagePreview(null);
        } else {
          onClose();
        }
      }
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose, activeImagePreview]);

  if (!project) return null;

  const cardImg = project.thumbnail || (project.screenshots && project.screenshots[0]) || "";
  const modalImg = project.modalImage || (project.screenshots && project.screenshots[1]) || cardImg;

  return (
    <>
      <AnimatePresence>
        {project && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#030712]/92 backdrop-blur-md overflow-y-auto">
            {/* Backdrop click listener */}
            <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-5xl max-h-[88vh] overflow-y-auto rounded-[28px] bg-[#070e1c] border border-white/20 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.95)] text-slate-200 [::-webkit-scrollbar]:hidden"
              style={{
                padding: "32px 36px 28px 36px",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* Top Header: Metadata Text & Close Button */}
              <div className="flex items-center justify-between gap-4" style={{ marginBottom: "16px" }}>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-slate-400">
                  <span className="font-bold uppercase tracking-wider text-[#38bdf8]">
                    {project.category}
                  </span>

                  <span className="text-slate-600">•</span>

                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Calendar size={13} className="text-[#38bdf8]" />
                    <span>{project.year || 2026}</span>
                  </span>

                  {project.client && (
                    <>
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <User size={13} className="text-[#38bdf8]" />
                        <span>{project.client}</span>
                      </span>
                    </>
                  )}
                </div>

                {/* Top Right Close Icon */}
                <button
                  onClick={onClose}
                  className="p-2 sm:p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex-shrink-0"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Title & Tagline */}
              <div style={{ marginBottom: "24px" }}>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-tight">
                  {project.title}
                </h2>
                {project.shortDescription && (
                  <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
                    {project.shortDescription}
                  </p>
                )}
              </div>

              {/* Main 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
                
                {/* LEFT COLUMN (6 Cols) */}
                <div className="lg:col-span-6 flex flex-col justify-between gap-5">
                  
                  {/* 2 Side-by-Side Clean Images (Click to preview popup) */}
                  <div className="grid grid-cols-2 gap-3.5">
                    {/* Image 1 */}
                    <div
                      onClick={() => cardImg && setActiveImagePreview(cardImg)}
                      className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#030712] aspect-[16/11] group shadow-lg cursor-pointer transition-all duration-300 hover:border-[#0084ff]/50"
                    >
                      {cardImg ? (
                        <Image
                          src={cardImg}
                          alt={`${project.title} Image 1`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono text-xs">
                          {project.title}
                        </div>
                      )}
                      {cardImg && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 duration-200">
                            <Maximize2 size={14} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Image 2 */}
                    <div
                      onClick={() => modalImg && setActiveImagePreview(modalImg)}
                      className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#030712] aspect-[16/11] group shadow-lg cursor-pointer transition-all duration-300 hover:border-[#0084ff]/50"
                    >
                      {modalImg ? (
                        <Image
                          src={modalImg}
                          alt={`${project.title} Image 2`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono text-xs">
                          {project.title}
                        </div>
                      )}
                      {modalImg && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 duration-200">
                            <Maximize2 size={14} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PROJECT OVERVIEW Card */}
                  <div
                    className="rounded-2xl bg-white/[0.03] border border-white/10 flex-1 flex flex-col justify-center"
                    style={{ padding: "24px" }}
                  >
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#a855f7]/15 border border-[#a855f7]/30 flex items-center justify-center text-[#c084fc]">
                        <FileText size={15} />
                      </div>
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#c084fc]">
                        Project Overview
                      </h3>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {project.fullDescription || project.shortDescription}
                    </p>
                  </div>
                </div>

                {/* RIGHT COLUMN (6 Cols) */}
                <div className="lg:col-span-6 flex flex-col justify-between gap-5">
                  
                  {/* Dual Challenge & Solution Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* CHALLENGE Card */}
                    <div
                      className="rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col"
                      style={{ padding: "20px" }}
                    >
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b] flex-shrink-0">
                          <Flag size={14} />
                        </div>
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#f59e0b]">
                          CHALLENGE
                        </h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {project.problemStatement || "Engineered to overcome domain complexity and user navigation bottlenecks."}
                      </p>
                    </div>

                    {/* SOLUTION Card */}
                    <div
                      className="rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col"
                      style={{ padding: "20px" }}
                    >
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#10b981] flex-shrink-0">
                          <Check size={15} />
                        </div>
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#10b981]">
                          SOLUTION
                        </h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {project.solution || "Tailored digital system delivering continuous performance and clear conversion paths."}
                      </p>
                    </div>
                  </div>

                  {/* KEY CAPABILITIES & SYSTEM HIGHLIGHTS Card */}
                  <div
                    className="rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden flex-1 flex flex-col justify-center"
                    style={{ padding: "24px" }}
                  >
                    {/* Watermark SVG Layers Pattern Background */}
                    <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none text-[#0084ff]">
                      <Layers size={130} />
                    </div>

                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#38bdf8] mb-3.5 flex items-center gap-2 relative z-10">
                      KEY CAPABILITIES &amp; SYSTEM HIGHLIGHTS
                    </h3>

                    <div className="space-y-2.5 relative z-10">
                      {project.features && project.features.length > 0 ? (
                        project.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                            <CheckCircle2 size={16} className="text-[#0084ff] flex-shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <CheckCircle2 size={16} className="text-[#0084ff] flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{project.shortDescription}</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Image Popup Lightbox Modal when tapped ────────────────────────────── */}
      <AnimatePresence>
        {activeImagePreview && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-xl">
            <div
              className="fixed inset-0"
              onClick={() => setActiveImagePreview(null)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            >
              <button
                onClick={() => setActiveImagePreview(null)}
                className="absolute -top-12 right-0 sm:-top-14 p-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer z-20"
                aria-label="Close image preview"
              >
                <X size={20} />
              </button>

              <div className="relative w-full aspect-[16/10] max-h-[82vh] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#030712]">
                <Image
                  src={activeImagePreview}
                  alt="Full resolution preview"
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
