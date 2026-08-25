import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "This page doesn't exist.",
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#05080f" }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-texture opacity-30" aria-hidden="true" />

      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(30,144,255,0.06) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center px-6">
        {/* 404 */}
        <div
          className="font-display font-black mb-4 leading-none"
          style={{
            fontSize: "clamp(6rem, 20vw, 14rem)",
            background: "linear-gradient(135deg, rgba(30,144,255,0.2) 0%, rgba(192,200,216,0.1) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          aria-hidden="true"
        >
          404
        </div>

        {/* Decorative line */}
        <div className="line-gradient max-w-xs mx-auto mb-8" />

        {/* Message */}
        <h1 className="font-display font-bold text-2xl text-white mb-3">
          Looks like this page went off the grid.
        </h1>
        <p className="text-silver-dim mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-primary px-7 py-3.5">
            Back to Home
          </Link>
          <Link href="/contact" className="btn-secondary px-7 py-3.5">
            Contact Us
          </Link>
        </div>

        {/* Tagline */}
        <p
          className="mt-12 font-display font-black tracking-widest text-xs uppercase"
          style={{ color: "rgba(30,144,255,0.3)" }}
        >
          ZYRO STUDIOS — WE BUILD. YOU GROW.
        </p>
      </div>
    </div>
  );
}
