"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FolderKanban,
  Users,
  Zap,
  ExternalLink,
  KeyRound,
  X,
  Lock,
  CheckCircle2,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard Overview", href: "/admin", icon: LayoutGrid },
  { label: "Projects Manager", href: "/admin/projects", icon: FolderKanban },
  { label: "Client Inquiries", href: "/admin/inquiries", icon: Users },
];

interface AdminSidebarProps {
  dbConnected?: boolean;
  storageBucket?: string;
  liveSiteUrl?: string;
}

export default function AdminSidebar({
  dbConnected = true,
  storageBucket = "project-assets",
  liveSiteUrl = "/",
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setSuccess("");
        }, 1800);
      } else {
        setError(data.error || "Failed to update password.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <aside
        className="flex flex-col justify-between shrink-0 overflow-y-auto"
        style={{
          width: "280px",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          padding: "24px 20px",
          height: "100%",
        }}
      >
        {/* Top Nav Section */}
        <div className="shrink-0">
          <p
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#9ca3af",
              marginBottom: "12px",
              paddingLeft: "12px",
            }}
          >
            MANAGEMENT
          </p>

          <nav className="flex flex-col" style={{ gap: "4px" }}>
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const isActive =
                href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontSize: "15px",
                    fontWeight: isActive ? 600 : 500,
                    backgroundColor: isActive ? "#eff6ff" : "transparent",
                    color: isActive ? "#2563eb" : "#4b5563",
                    textDecoration: "none",
                    transition: "background-color 0.15s ease, color 0.15s ease",
                  }}
                >
                  <Icon size={20} style={{ color: isActive ? "#2563eb" : "#9ca3af" }} />
                  <span>{label}</span>
                </Link>
              );
            })}

            {/* Change Password Sidebar Nav Item */}
            <button
              onClick={() => {
                setError("");
                setSuccess("");
                setIsPasswordModalOpen(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "15px",
                fontWeight: 500,
                backgroundColor: "transparent",
                color: "#4b5563",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "background-color 0.15s ease, color 0.15s ease",
              }}
              className="hover:bg-slate-50 hover:text-slate-900"
            >
              <KeyRound size={20} style={{ color: "#9ca3af" }} />
              <span>Change Password</span>
            </button>
          </nav>
        </div>

        {/* Bottom Section: Supabase widget + Visit Live Site */}
        <div className="shrink-0" style={{ marginTop: "32px" }}>
          {/* Supabase Sync Card */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center" style={{ gap: "8px" }}>
                <Zap size={16} style={{ color: "#059669" }} />
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#059669" }}>
                  Supabase Sync
                </span>
              </div>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: dbConnected ? "#059669" : "#d1d5db",
                }}
              />
            </div>

            <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px", margin: "4px 0 0 0" }}>
              PostgreSQL DB &amp; Storage active
            </p>

            <div className="flex items-center justify-between" style={{ marginTop: "12px" }}>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>Connected</span>
              <span
                style={{
                  backgroundColor: "#d1fae5",
                  color: "#059669",
                  borderRadius: "6px",
                  padding: "2px 8px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {storageBucket}
              </span>
            </div>
          </div>

          {/* Visit Live Site Link */}
          <Link
            href={liveSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
              padding: "10px 12px",
              fontSize: "13px",
              fontWeight: 500,
              color: "#374151",
              textDecoration: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <span>Visit Live Site</span>
            <ExternalLink size={14} style={{ color: "#9ca3af" }} />
          </Link>
        </div>
      </aside>

      {/* ── Change Password Modal (Clean 32px Padding Light Mode Card) ── */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "20px",
              padding: "32px",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              color: "#111827",
            }}
            className="animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div
              className="flex items-start justify-between"
              style={{
                paddingBottom: "20px",
                marginBottom: "20px",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div className="flex items-center" style={{ gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "#eff6ff",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Lock size={20} />
                </div>
                <div>
                  <h3
                    className="font-display"
                    style={{ fontSize: "20px", fontWeight: 800, color: "#111827", margin: 0 }}
                  >
                    Change Admin Password
                  </h3>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0 0" }}>
                    Update credentials for Zyro Command admin session.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPasswordModalOpen(false)}
                style={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "6px",
                  color: "#6b7280",
                  cursor: "pointer",
                }}
                className="hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  border: "1px solid #fecaca",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "20px",
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  backgroundColor: "#ecfdf5",
                  color: "#059669",
                  border: "1px solid #a7f3d0",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#f8fafc",
                    fontSize: "13px",
                    color: "#111827",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#f8fafc",
                    fontSize: "13px",
                    color: "#111827",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#f8fafc",
                    fontSize: "13px",
                    color: "#111827",
                    outline: "none",
                  }}
                  required
                />
              </div>

              {/* Actions Footer */}
              <div
                className="flex items-center justify-end"
                style={{
                  gap: "12px",
                  paddingTop: "20px",
                  marginTop: "8px",
                  borderTop: "1px solid #f3f4f6",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    color: "#4b5563",
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  className="hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                  className="hover:bg-[#1d4ed8]"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export { AdminSidebar };
