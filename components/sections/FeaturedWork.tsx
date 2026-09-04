"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { getFeaturedProjects } from "@/data/projects";
import { Project } from "@/types";

import { ProjectModal } from "@/components/projects/ProjectModal";

export function FeaturedWork() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [projectList, setProjectList] = useState<Project[]>(getFeaturedProjects());
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
          const visible = data.projects.filter((p: Project) => !p.isHidden);
          const featuredOnly = visible.filter((p: Project) => p.featured);
          setProjectList(featuredOnly.length > 0 ? featuredOnly : visible);
        }
      })
      .catch((err) => {
        console.error("Failed to load projects from DB:", err);
      });
  }, []);

  // Sync modal state with URL hash (#project-slug) for browser back button support
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace("#", "");
      if (!rawHash) {
        setSelectedProject(null);
      } else if (projectList.length > 0) {
        const found = projectList.find((p) => p.slug === rawHash);
        if (found) {
          setSelectedProject(found);
        }
      }
    };

    handleHashChange();

    window.addEventListener("popstate", handleHashChange);
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("popstate", handleHashChange);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [projectList]);

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    if (window.location.hash !== `#${project.slug}`) {
      window.history.pushState({ modal: true }, "", `#${project.slug}`);
    }
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    if (window.location.hash) {
      window.history.replaceState({}, "", window.location.pathname + window.location.search);
    }
  };

  return (
    <section className="section-padding relative overflow-hidden bg-[#030712]" id="work">
      <div className="section-container relative z-10">
        
        {/* ─── Centered Section Header ──────────────────────────────────────── */}
        <div ref={ref} className="section-header-block" data-section-header="true">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="flex justify-center mb-4"
          >
            <span className="section-label">04 / SELECTED WORK</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-4 tracking-tight text-center"
          >
            Proven work, <span className="text-gradient-blue">real impact.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base leading-relaxed text-center max-w-[600px] mx-auto"
          >
            Explore our featured builds engineered for reliability, conversion, and long-term business scalability.
          </motion.p>
        </div>

        {/* ─── Featured Project Showcase Card with 32px Inset Padding ───────── */}
        <div className="flex flex-col gap-8">
          {projectList.map((project, i) => {
            const hasScreenshot = project.screenshots && project.screenshots.length > 0 && Boolean(project.screenshots[0]);
            const screenshotUrl = hasScreenshot ? project.screenshots[0] : project.thumbnail;
            const isLocalOrData = screenshotUrl?.startsWith("data:") || screenshotUrl?.startsWith("/") || screenshotUrl?.startsWith("http");

            return (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="w-full rounded-[16px] bg-gradient-to-b from-[#091126]/90 to-[#040816]/95 border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all hover:border-[#38bdf8]/35"
                style={{ padding: "32px" }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                  
                  {/* Visual Showcase / Live Site Frame (7 cols) */}
                  <div className="lg:col-span-7 relative rounded-[12px] bg-[#060b18] border border-white/10 flex flex-col justify-between shadow-2xl overflow-hidden min-h-0 sm:min-h-[360px] p-3.5 sm:p-6">
                    {/* Browser top-bar mockup */}
                    <div className="flex items-center justify-between border-b border-white/10 relative z-10 pt-1 pb-3 mb-3 px-3 sm:px-4">
                      <div className="flex items-center gap-2 pl-4 sm:pl-6">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 truncate max-w-[140px] sm:max-w-none">
                        {project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, "") : `${project.slug}.zyrostudios.com`}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#38bdf8] uppercase tracking-wider pr-4 sm:pr-6">
                        {project.status === "live" ? "LIVE" : "DEV"}
                      </span>
                    </div>

                    {/* Visual Centerpiece or Image Screenshot */}
                    {hasScreenshot && isLocalOrData ? (
                      <div className="relative my-2 w-full rounded-lg overflow-hidden border border-white/10 aspect-[16/9] shadow-lg bg-[#02050e]">
                        <img
                          src={screenshotUrl}
                          alt={project.title}
                          className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
                        />
                      </div>
                    ) : (
                      <div className="my-auto text-center py-6">
                        <span className="text-3xl sm:text-5xl font-display font-extrabold text-gradient tracking-tight block mb-2">
                          {project.title}
                        </span>
                        <p className="text-xs sm:text-sm font-mono text-slate-300">
                          {project.category}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Information / Description Box (5 cols) */}
                  <div
                    className="lg:col-span-5 flex flex-col justify-between h-full"
                    style={{ padding: "8px 4px" }}
                  >
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#38bdf8] mb-2 block">
                        {project.category}
                      </span>

                      <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-3 leading-tight">
                        {project.title}
                      </h3>

                      <p className="text-slate-300 text-sm sm:text-base leading-[1.65] mb-6">
                        {project.shortDescription}
                      </p>

                      <div className="space-y-3 mb-8">
                        {project.features.map((f) => (
                          <div key={f} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                            <Sparkles size={15} className="text-[#38bdf8] mt-0.5 flex-shrink-0" />
                            <span className="leading-snug">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons: View Details (Modal) & Live Site — Side by Side Center Aligned on Mobile */}
                    <div
                      className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center pt-5 w-full text-center items-center justify-center"
                      style={{ marginTop: "24px" }}
                    >
                      <button
                        onClick={() => openProjectModal(project)}
                        className="btn-secondary text-xs py-3 px-2 sm:px-5 rounded-[10px] font-semibold flex items-center justify-center gap-1.5 w-full text-center cursor-pointer"
                      >
                        <Sparkles size={14} className="text-[#38bdf8]" />
                        <span>View Details</span>
                      </button>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary text-xs py-3 px-2 sm:px-6 rounded-[10px] font-bold flex items-center justify-center gap-1.5 w-full text-center cursor-pointer shadow-[0_0_20px_rgba(0,132,255,0.4)]"
                        >
                          <span>Visit Live Site</span>
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Bottom CTA Link to All Projects (Unified Design System) ────── */}
        <div className="mt-16 pt-8 text-center flex flex-col items-center">
          <p className="text-slate-400 text-xs sm:text-sm font-mono mb-4">
            Explore our complete portfolio, custom platform builds, and technical case studies.
          </p>
          <Link
            href="/work"
            className="btn-primary text-xs sm:text-sm px-8 py-3.5 rounded-[10px] font-bold shadow-[0_0_24px_rgba(0,132,255,0.4)] hover:shadow-[0_0_35px_rgba(0,132,255,0.65)] transition-all cursor-pointer inline-flex items-center gap-2 mt-4 sm:mt-6"
            style={{ marginTop: "24px" }}
          >
            <span>Explore All Projects &amp; Archives</span>
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>

      {/* Project Details Modal Popup */}
      <ProjectModal
        project={selectedProject}
        onClose={closeProjectModal}
      />
    </section>
  );
}
