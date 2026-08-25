"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { navLinks } from "@/data/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 sm:pt-7 px-4 pointer-events-none">
        <div className="nav-pill-container pointer-events-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0" aria-label="Zyro Studios — Home">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-white/5 flex-shrink-0">
              <Image
                src="/logo/zyro-logo.jpg"
                alt="Zyro Studios"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-gradient whitespace-nowrap">
              ZYRO STUDIOS
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center" role="navigation" aria-label="Main navigation">
            <ul className="nav-links-list">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`nav-link-item ${isActive ? "active" : ""}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <Link href="/contact" className="btn-primary text-xs py-2 px-4.5 rounded-full">
              <span>Start a Project</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            className="md:hidden p-2 rounded-full text-slate-300 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown (Full Width, Center Aligned, Fits Content) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[76px] left-0 right-0 w-full z-40 md:hidden px-4 pointer-events-auto"
          >
            <div className="w-full bg-[#071022]/95 border border-white/15 backdrop-blur-2xl rounded-2xl py-6 px-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center text-center gap-4">
              <nav className="w-full max-w-sm flex flex-col items-center justify-center gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`w-full py-2.5 px-4 rounded-xl text-sm font-display font-bold text-center transition-all ${
                        isActive
                          ? "text-[#38bdf8] bg-[#0084ff]/15 border border-[#0084ff]/30 shadow-[0_0_15px_rgba(0,132,255,0.2)]"
                          : "text-slate-200 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="w-full max-w-sm pt-3 border-t border-white/10 flex flex-col items-center justify-center gap-2.5">
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full py-3 text-center justify-center text-xs font-bold rounded-xl shadow-[0_0_20px_rgba(0,132,255,0.4)]"
                >
                  <span>Start a Project</span>
                  <ArrowUpRight size={15} />
                </Link>
                <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest text-center mt-1">
                  WE BUILD. YOU GROW.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
