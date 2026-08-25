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

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

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

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-40 md:hidden bg-[#030712]/98 backdrop-blur-3xl flex flex-col justify-between p-6 pt-24 pb-8 h-[100dvh] overflow-y-auto"
          >
            <nav className="flex flex-col gap-2.5">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block py-3.5 px-4 rounded-xl text-base font-display font-bold transition-all ${
                        isActive
                          ? "text-[#38bdf8] bg-[#0084ff]/10 border border-[#0084ff]/25"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-white/10 flex flex-col gap-3.5">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full py-3.5 text-center justify-center text-sm font-bold rounded-xl shadow-[0_0_25px_rgba(0,132,255,0.4)]"
              >
                <span>Start a Project</span>
                <ArrowUpRight size={16} />
              </Link>
              <p className="text-center font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                WE BUILD. YOU GROW.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
