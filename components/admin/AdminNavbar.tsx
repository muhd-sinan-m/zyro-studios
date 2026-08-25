"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";

interface AdminNavbarProps {
  userName?: string;
  userRole?: string;
  liveSiteUrl?: string;
  onLogout?: () => void;
}

export default function AdminNavbar({
  userName = "Zyro Admin",
  liveSiteUrl = "/",
  onLogout,
}: AdminNavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
      return;
    }
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <header
      className="flex items-center justify-between w-full shrink-0 z-30"
      style={{
        height: "72px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        padding: "16px 32px",
      }}
    >
      {/* Left: Brand Logo only */}
      <div className="flex items-center" style={{ gap: "12px" }}>
        <Link href="/admin" className="flex items-center gap-3 text-decoration-none">
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            Z
          </div>
          <span style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "#111827" }}>
            ZYRO // COMMAND
          </span>
        </Link>
      </div>

      {/* Right: actions + single "Zyro Admin" label */}
      <div className="flex items-center" style={{ gap: "16px" }}>
        <Link
          href={liveSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            padding: "8px 14px",
            fontSize: "14px",
            fontWeight: 500,
            color: "#374151",
            textDecoration: "none",
          }}
        >
          <span>Live Site</span>
          <ExternalLink size={14} style={{ color: "#6b7280" }} />
        </Link>

        {/* User Badge: Avatar + "Zyro Admin" only */}
        <div className="flex items-center" style={{ gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            Z
          </div>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>
            Zyro Admin
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            borderRadius: "8px",
            border: "1px solid #fecaca",
            backgroundColor: "#ffffff",
            padding: "8px 14px",
            fontSize: "14px",
            fontWeight: 500,
            color: "#dc2626",
            cursor: "pointer",
          }}
        >
          <LogOut size={14} style={{ color: "#dc2626" }} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export { AdminNavbar };
