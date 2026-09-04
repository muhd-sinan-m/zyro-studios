import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Check } from "lucide-react";

const GithubIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);
import { getProjectBySlug as getStaticProjectBySlug, projects } from "@/data/projects";
import { query } from "@/lib/db";
import { Project } from "@/types";

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
  } catch (err) {
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
  if (!project || project.isHidden) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: project.shortDescription,
  };
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);
  if (!project || project.isHidden) notFound();

  return (
    <div className="pt-32 sm:pt-40 bg-[#030712] min-h-screen">
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
          <p className="text-silver-dim text-lg max-w-2xl mx-auto mb-8">{project.shortDescription}</p>
          <div className="flex items-center justify-center gap-4">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                View Live <ExternalLink size={15} />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                GitHub <GithubIcon size={15} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Case study content */}
      <div className="section-container py-16">
        <div className="max-w-3xl mx-auto">
          {/* Overview grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
            {[
              { label: "Year", value: project.year.toString() },
              { label: "Category", value: project.category.split("/")[0].trim() },
              { label: "Status", value: project.status === "live" ? "Live" : "In Development" },
              { label: "Client", value: project.client ?? "Zyro Studios" },
            ].map(({ label, value }) => (
              <div key={label} className="glass-card rounded-xl p-4 text-center">
                <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1">{label}</p>
                <p className="font-display font-semibold text-white text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* Problem */}
          {project.problemStatement && (
            <Section title="The Problem" number="01">
              <p className="text-silver-dim leading-relaxed">{project.problemStatement}</p>
            </Section>
          )}

          {/* Solution */}
          {project.solution && (
            <Section title="The Solution" number="02">
              <p className="text-silver-dim leading-relaxed">{project.solution}</p>
            </Section>
          )}

          {/* Features */}
          <Section title="Key Features" number="03">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-silver-dim text-sm">
                  <Check size={15} className="text-blue mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </Section>

          {/* Tech Stack */}
          <Section title="Technology Stack" number="04">
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech) => (
                <span key={tech} className="badge badge-blue text-xs px-3 py-1.5">{tech}</span>
              ))}
            </div>
          </Section>

          {/* Full description */}
          <Section title="About the Project" number="05">
            <p className="text-silver-dim leading-relaxed">{project.fullDescription}</p>
          </Section>

          {/* Results */}
          {project.results && (
            <Section title="Results" number="06">
              <p className="text-silver-dim leading-relaxed">{project.results}</p>
            </Section>
          )}

          {/* CTA */}
          <div className="mt-16 glass-card rounded-2xl p-8 text-center">
            <p className="text-xs font-mono text-muted uppercase tracking-wider mb-3">Next Step</p>
            <h2 className="font-display font-bold text-2xl text-white mb-3">Ready to build something like this?</h2>
            <p className="text-silver-dim mb-6">Let&apos;s talk about your project and what we can build together.</p>
            <Link href="/contact" className="btn-primary inline-flex">
              Start a Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, number, children }: { title: string; number: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xs font-mono text-blue opacity-60">{number}</span>
        <h2 className="font-display font-bold text-xl text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}
