"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { theme } = useAdminTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Invalid administrator credentials.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] mx-auto py-8 sm:py-12 px-4">
      {/* ── Outer Login Card with 48px top/bottom and 36px left/right padding ── */}
      <div
        className="rounded-3xl border shadow-2xl backdrop-blur-xl transition-colors"
        style={{
          backgroundColor: "var(--admin-card-bg)",
          borderColor: "var(--admin-border)",
          padding: "48px 36px",
        }}
      >
        {/* ── Centered Header ── */}
        <div className="flex flex-col items-center text-center mb-8">
          {/* Shield icon with prominent glow and centered margin */}
          <div className="w-16 h-16 rounded-2xl bg-[#0084ff] border border-blue-400/40 flex items-center justify-center text-white mb-6 shadow-[0_0_35px_rgba(0,132,255,0.5)]">
            <ShieldCheck size={32} />
          </div>

          <h1
            className="font-display font-black text-2xl sm:text-3xl tracking-tight mb-2.5 leading-tight"
            style={{ color: "var(--admin-text-main)" }}
          >
            Studio Command Center
          </h1>
          <p
            className="text-xs sm:text-sm max-w-xs leading-relaxed"
            style={{ color: "var(--admin-text-muted)" }}
          >
            Executive access for project deployments &amp; client leads.
          </p>
        </div>

        {/* ── Error Banner (if any) ── */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs mb-6 font-mono text-center">
            {error}
          </div>
        )}

        {/* ── Form Body ── */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              className="block text-xs font-mono font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--admin-text-muted)" }}
            >
              Admin Email
            </label>
            <div className="relative">
              <Mail
                size={17}
                className="absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                style={{ left: "16px" }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="w-full h-12 rounded-xl border text-xs sm:text-sm font-mono focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/30 transition-all"
                style={{
                  paddingLeft: "48px",
                  paddingRight: "16px",
                  backgroundColor: "var(--admin-input-bg)",
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text-main)",
                }}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              className="block text-xs font-mono font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--admin-text-muted)" }}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={17}
                className="absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                style={{ left: "16px" }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="new-password"
                className="w-full h-12 rounded-xl border text-xs sm:text-sm font-mono focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/30 transition-all"
                style={{
                  paddingLeft: "48px",
                  paddingRight: "16px",
                  backgroundColor: "var(--admin-input-bg)",
                  borderColor: "var(--admin-border)",
                  color: "var(--admin-text-main)",
                }}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#0084ff] text-white text-xs sm:text-sm font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#0074e0] shadow-[0_0_24px_rgba(0,132,255,0.4)] hover:shadow-[0_0_32px_rgba(0,132,255,0.65)] transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
