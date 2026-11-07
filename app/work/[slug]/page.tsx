import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Check } from "lucide-react";
import { getProjectBySlug as getStaticProjectBySlug, projects } from "@/data/projects";
import { query } from "@/lib/db";
import { Project } from "@/types";
import { constructMetadata, getBreadcrumbSchema, getProjectCaseStudySchema } from "@/lib/seo";

const GithubIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);

interface Props {
  params: Promise<{ slug: string }>;
}

async function fetchProjectBySlug(slug: string): Promise<Project | undefined> {
  try {
    const rows = await query(
      `SELECT * FROM public.projects WHERE slug = $1 AND is_hidden = false AND status != 'archived'`,
      [slug]
    );
    if (rows && rows.length > 0) {
      const p = rows[0];
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        shortDescription: p.short_description,
        fullDescription: p.full_description || p.short_description,
        technologies: Array.isArray(p.technologies) ? p.technologies : [],
        features: Array.isArray(p.features) ? p.features : [],
        thumbnail: p.thumbnail_url || (Array.isArray(p.screenshots) && p.screenshots[0]) || "",
        modalImage: p.modal_image_url || p.thumbnail_url || (Array.isArray(p.screenshots) && p.screenshots[1]) || "",
        screenshots: Array.isArray(p.screenshots) ? p.screenshots : [],
        liveUrl: p.live_url || "",
        githubUrl: p.github_url || "",
        year: p.year || 2026,
        featured: Boolean(p.featured),
        isHidden: Boolean(p.is_hidden),
        status: p.status || "live",
        problemStatement: p.problem_statement || "",
        solution: p.solution || "",
        results: p.results || "",
        client: p.client || "",
      };
    }
  } catch {
    // fallback to static
  }
  return getStaticProjectBySlug(slug);
}

export async function generateStaticParams() {
  return projects.filter((p) => !p.isHidden).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);
  if (!project || project.isHidden) {
    return constructMetadata({
      title: "Project Not Found",
      noIndex: true,
    });
  }

  const techs = Array.isArray(project.technologies) ? project.technologies : [];
  const techSummary = techs.length > 0 ? ` Engineered with ${techs.slice(0, 4).join(", ")}.` : "";

  return constructMetadata({
    title: `${project.title} — Case Study & Engineering Details`,
    description: `${project.shortDescription}${techSummary} Custom web development by Zyro Studios.`,
    path: `/work/${project.slug}`,
    image: project.thumbnail.startsWith("http") ? project.thumbnail : project.thumbnail,
    type: "article",
    keywords: [
      project.title,
      `${project.title} case study`,
      ...techs,
      "freelance project showcase",
      "affordable web development case study",
    ],
  });
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);
  if (!project || project.isHidden) notFound();

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
    { name: project.title, path: `/work/${project.slug}` },
  ]);

  const caseStudySchema = getProjectCaseStudySchema(project);

  return (
    <div className="pt-32 sm:pt-40 bg-[#030712] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
      />

      {/* Back navigation */}
      <div className="section-container mb-10">
        <Link href="/work" className="inline-flex items-center gap-2 text-silver-dim hover:text-white transition-colors text-sm">
          <ArrowLeft size={15} />
          Back to Work
        </Link>
      </div>

      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{ minHeight: "55vh", background: "radial-gradient(ellipse at 50% 100%, rgba(30,144,255,0.12) 0%, rgba(5,8,15,0.95) 70%)" }}
      >
        <div className="absolute inset-0 grid-texture opacity-30" />
        <div className="section-container relative z-10 py-20 text-center">
          <div className="mb-6">
            <span className="section-label">{project.category}</span>
          </div>
          <h1
            className="font-display font-black mb-4"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            <span className="text-gradient">{project.title}</span>
          </h1>
          <p className="text-silver-dim text-lg max-w-2xl mx-auto mb-8">
            {project.shortDescription}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <span>Visit Live Platform</span>
                <ExternalLink size={15} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <GithubIcon size={16} />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left/Main Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <div>
              <h2 className="font-display font-bold text-2xl mb-4 text-white">Project Overview</h2>
              <p className="text-silver leading-relaxed whitespace-pre-line text-base">
                {project.fullDescription}
              </p>
            </div>

            {/* Problem & Solution */}
            {(project.problemStatement || project.solution) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.problemStatement && (
                  <div className="p-6 rounded-xl border border-white/5 bg-[#0a1020]/40">
                    <h3 className="font-display font-semibold text-lg text-red-400 mb-3">The Challenge</h3>
                    <p className="text-silver-dim text-sm leading-relaxed">{project.problemStatement}</p>
                  </div>
                )}
                {project.solution && (
                  <div className="p-6 rounded-xl border border-white/5 bg-[#0a1020]/40">
                    <h3 className="font-display font-semibold text-lg text-[#38bdf8] mb-3">The Architecture</h3>
                    <p className="text-silver-dim text-sm leading-relaxed">{project.solution}</p>
                  </div>
                )}
              </div>
            )}

            {/* Results */}
            {project.results && (
              <div className="p-6 rounded-xl border border-blue-500/10 bg-blue-500/5">
                <h3 className="font-display font-semibold text-lg text-white mb-2">Outcome & Impact</h3>
                <p className="text-silver text-sm leading-relaxed">{project.results}</p>
              </div>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-2xl mb-6 text-white">Core Capabilities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-surface border border-white/5">
                      <div className="mt-1 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-[#38bdf8]">
                        <Check size={12} />
                      </div>
                      <span className="text-silver text-sm leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <div className="p-6 rounded-xl border border-white/5 bg-[#0a1020]/60 backdrop-blur-sm space-y-6">
              <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4">
                Specifications
              </h3>

              {project.client && (
                <div>
                  <div className="text-xs font-mono text-silver-dim uppercase tracking-wider mb-1">Client</div>
                  <div className="text-silver font-medium text-sm">{project.client}</div>
                </div>
              )}

              <div>
                <div className="text-xs font-mono text-silver-dim uppercase tracking-wider mb-1">Timeline</div>
                <div className="text-silver font-medium text-sm">{project.year}</div>
              </div>

              <div>
                <div className="text-xs font-mono text-silver-dim uppercase tracking-wider mb-1">Status</div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {project.status.toUpperCase()}
                </div>
              </div>

              {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                <div>
                  <div className="text-xs font-mono text-silver-dim uppercase tracking-wider mb-3">Tech Stack</div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 text-silver-dim border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Box */}
            <div className="p-6 rounded-xl border border-blue-500/20 bg-gradient-to-b from-blue-500/10 to-transparent text-center">
              <h4 className="font-display font-bold text-white mb-2">Need a similar product?</h4>
              <p className="text-silver-dim text-xs mb-4">
                We engineer scalable, high-speed applications tailored to your specific requirements at affordable freelance rates.
              </p>
              <Link href="/contact" className="btn-primary w-full justify-center text-sm py-2.5">
                Start Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
