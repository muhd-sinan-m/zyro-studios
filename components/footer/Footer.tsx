import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

// Brand icons as SVGs
const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

const WhatsappIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.71 1.455h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.177-1.238-6.164-3.487-8.413Z"/>
  </svg>
);

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-[#02050c] overflow-hidden" role="contentinfo">
      {/* Radial Top Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse at top, #0084ff 0%, transparent 70%)" }}
      />

      {/* ─── CTA Banner (Mathematically Centered) ──────────────────────────── */}
      <div
        className="section-container relative z-10 border-b border-white/[0.08]"
        style={{ paddingTop: "100px", paddingBottom: "100px" }}
      >
        <div
          className="section-header-block"
          data-section-header="true"
          style={{ maxWidth: "720px", marginLeft: "auto", marginRight: "auto", textAlign: "center", marginBottom: "0" }}
        >
          <div className="flex justify-center mb-5" style={{ marginLeft: "auto", marginRight: "auto" }}>
            <span className="section-label">READY TO COLLABORATE</span>
          </div>

          <h2
            className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] mb-5 text-center w-full"
            style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto" }}
          >
            Let&apos;s build something{" "}
            <span className="text-gradient-blue">extraordinary.</span>
          </h2>

          <p
            className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-[560px] mx-auto text-center"
            style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto", marginBottom: "36px" }}
          >
            Partner with a founder-led studio that ships high-performance digital products — on time and built to last.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "8px",
              gap: "16px",
            }}
          >
            <Link
              href="/contact"
              className="btn-primary text-sm py-4 px-9 rounded-full font-bold shadow-[0_0_30px_rgba(0,132,255,0.45)] hover:shadow-[0_0_40px_rgba(0,132,255,0.7)] transition-all whitespace-nowrap"
            >
              <span>Start a Project</span>
              <ArrowUpRight size={16} />
            </Link>
            <a
              href="mailto:build.zyrostudios@gmail.com"
              className="btn-secondary text-sm py-4 px-9 rounded-full font-semibold whitespace-nowrap"
            >
              build.zyrostudios@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* ─── 3-Zone Horizontal Flanking Layout ────────────────────────────── */}
      <div className="section-container relative z-10 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center pb-12 border-b border-white/[0.05]">

          {/* Left Zone: Brand Info (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center text-center sm:items-start sm:text-left justify-center">
            <Link href="/" className="flex items-center gap-3 mb-4 group w-fit">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/15 bg-white/5">
                <Image
                  src="/logo/zyro-logo.jpg"
                  alt="Zyro Studios"
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight text-white group-hover:text-[#38bdf8] transition-colors">
                ZYRO STUDIOS
              </span>
            </Link>

            <p className="font-display font-extrabold text-[11px] text-[#38bdf8] uppercase tracking-widest mb-2">
              WE BUILD. YOU GROW.
            </p>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-5 max-w-xs">
              Development-focused digital studio engineering bespoke web platforms, applications, and digital experiences.
            </p>

            <div className="flex items-center gap-2.5">
              <a
                href="https://www.linkedin.com/in/muhammed-sinan-m/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#0077b5] hover:border-[#0077b5]/60 hover:bg-[#0077b5]/15 hover:shadow-[0_0_16px_rgba(0,119,181,0.35)] transition-all"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={15} />
              </a>
              <a
                href="https://www.instagram.com/zyro_studios_/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#e4405f] hover:border-[#e4405f]/60 hover:bg-[#e4405f]/15 hover:shadow-[0_0_16px_rgba(228,64,95,0.35)] transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon size={15} />
              </a>
              <a
                href="https://wa.me/917994312026"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#25D366] hover:border-[#25D366]/60 hover:bg-[#25D366]/15 hover:shadow-[0_0_16px_rgba(37,211,102,0.35)] transition-all"
                aria-label="WhatsApp"
              >
                <WhatsappIcon size={15} />
              </a>
            </div>
          </div>

          {/* Center Zone: Giant ZYRO STUDIOS Wordmark (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center select-none py-4 lg:py-0 pointer-events-none">
            <p className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tighter text-white/[0.08] leading-none uppercase">
              ZYRO
            </p>
            <p className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tighter text-white/[0.08] leading-none uppercase mt-1">
              STUDIOS
            </p>
          </div>

          {/* Right Zone: Direct Communication (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center text-center sm:items-start sm:text-left lg:items-end lg:text-right justify-center">
            <h4 className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-4 font-semibold">
              Direct Communication
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <p>
                Email:{" "}
                <a href="mailto:build.zyrostudios@gmail.com" className="text-[#38bdf8] hover:underline font-mono">
                  build.zyrostudios@gmail.com
                </a>
              </p>
              <p>
                WhatsApp:{" "}
                <a href="https://wa.me/917994312026" target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline font-mono">
                  +91 7994312026
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* ─── Bottom Legal Bar ─────────────────────────────────────────────── */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>© {year} Zyro Studios. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
