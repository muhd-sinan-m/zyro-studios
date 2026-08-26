"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowUpRight,
  Home,
  Package,
  Briefcase,
  Info,
  Settings,
  Send,
  ChevronRight,
} from "lucide-react";
import { navLinks } from "@/data/navigation";

const LINK_ICONS: Record<string, any> = {
  "/": Home,
  "/services": Package,
  "/work": Briefcase,
  "/about": Info,
  "/process": Settings,
  "/contact": Send,
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        {/* Floating Nav Container (Guaranteed 18px top margin, 64px tall pill) */}
        <div
          className="w-[92%] md:w-full md:max-w-[920px] mx-auto rounded-full bg-[#060c1a]/95 backdrop-blur-xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex items-center justify-between pointer-events-auto"
          style={{
            marginTop: "18px",
            minHeight: "64px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0" aria-label="Zyro Studios — Home">
            <div className="relative w-8.5 h-8.5 rounded-full overflow-hidden border border-white/20 bg-white/5 flex-shrink-0">
              <Image
                src="/logo/zyro-logo.jpg"
                alt="Zyro Studios"
                fill
                className="object-cover"
                sizes="34px"
              />
            </div>
            <span className="font-display font-extrabold text-sm md:text-base tracking-tight text-gradient whitespace-nowrap">
              ZYRO STUDIOS
            </span>
          </Link>

          {/* Desktop Navigation Links (UNTOUCHED FOR DESKTOP) */}
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

          {/* Right Action Button (UNTOUCHED FOR DESKTOP) */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <Link href="/contact" className="btn-primary text-xs py-2 px-4.5 rounded-full">
              <span>Start a Project</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Mobile Menu Trigger (Glass Circular Button) */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-slate-200 hover:text-white active:scale-95 transition-all shadow-sm flex-shrink-0"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Premium Mobile Navigation Dropdown (Compact Height with Crisp Icons & Typography) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 z-40 md:hidden pointer-events-auto flex justify-center"
            style={{ top: "94px" }}
          >
            <div
              className="w-[92%] mx-auto bg-[#050b1a]/98 border border-[#1e3a8a]/40 backdrop-blur-2xl rounded-[24px] shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(0,132,255,0.2)] flex flex-col justify-between"
              style={{
                padding: "24px 20px",
                gap: "10px",
              }}
            >
              {/* Menu Link Cards with Icon, Title, and Chevron Arrow */}
              <nav
                className="w-full flex flex-col"
                style={{ gap: "9px" }}
              >
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = LINK_ICONS[link.href] || Home;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`w-full flex items-center justify-between transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-[#0055ff]/40 via-[#0070ff]/30 to-[#0084ff]/20 border border-[#0084ff] shadow-[0_0_20px_rgba(0,132,255,0.35)]"
                          : "bg-[#09132a]/95 border border-white/10 hover:border-white/25 hover:bg-[#0d1a38]"
                      }`}
                      style={{
                        padding: "12px 18px",
                        borderRadius: "14px",
                        minHeight: "44px",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={17} className="text-[#38bdf8] flex-shrink-0" />
                        <span
                          className={`font-display text-xs sm:text-sm tracking-wide ${
                            isActive ? "text-white font-bold" : "text-white font-semibold"
                          }`}
                        >
                          {link.label}
                        </span>
                      </div>
                      <ChevronRight
                        size={15}
                        className={isActive ? "text-[#38bdf8]" : "text-slate-400"}
                      />
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom CTA Button ("Start a Project") */}
              <div className="w-full" style={{ marginTop: "4px" }}>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#0066ff] via-[#0084ff] to-[#0099ff] hover:brightness-110 shadow-[0_0_28px_rgba(0,132,255,0.5)] flex items-center justify-center gap-2 transition-all active:scale-95 border border-[#38bdf8]/40"
                  style={{
                    padding: "12px 20px",
                    borderRadius: "14px",
                    minHeight: "44px",
                  }}
                >
                  <span>Start a Project</span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
