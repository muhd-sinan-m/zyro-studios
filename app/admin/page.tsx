"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  FolderGit2,
  Database,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  RefreshCw,
  Mail,
  Trash2,
  Phone,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>({
    totalInquiries: 0,
    unreadInquiries: 0,
    totalProjects: 0,
    activeProjects: 0,
    isDbConnected: true,
  });

  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [resStats, resInq] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/inquiries"),
      ]);

      if (resStats.ok) {
        const statsData = await resStats.json();
        setStats(statsData.stats || statsData);
      }

      if (resInq.ok) {
        const inqData = await resInq.json();
        setRecentInquiries(inqData.inquiries || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh new inquiries & stats live every 5 seconds without UI flickering
    const interval = setInterval(() => {
      fetchData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteInquiry = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the inquiry from "${name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/inquiries?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setRecentInquiries((prev) => prev.filter((item) => item.id !== id));
        fetchData();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to delete inquiry.");
      }
    } catch {
      alert("Failed to connect to server.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ padding: "32px", maxWidth: "1280px", margin: "0 auto" }}>
      {/* ─── Header Section (Clean Typography with 24px bottom margin) ───────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ marginBottom: "24px" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              style={{
                fontSize: "10px",
                fontFamily: "monospace",
                fontWeight: 700,
                color: "#2563eb",
                backgroundColor: "#eff6ff",
                border: "1px solid #dbeafe",
                padding: "2px 8px",
                borderRadius: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              System Command Center
            </span>
            <span style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>
              • Node.js Engine
            </span>
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#111827",
              margin: "0 0 4px 0",
              letterSpacing: "-0.02em",
            }}
          >
            Studio Telemetry &amp; Overview
          </h1>
          <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>
            Real-time telemetry, client pipeline, and live project deployments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sync Button */}
          <button
            onClick={() => fetchData()}
            className="flex items-center gap-2 transition-all cursor-pointer"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px 16px",
              color: "#374151",
              fontSize: "12px",
              fontWeight: 600,
            }}
            title="Refresh Metrics"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#6b7280]" : "text-[#6b7280]"} />
            <span>Sync</span>
          </button>

          {/* Deploy Project Button */}
          <Link
            href="/admin/projects"
            className="flex items-center gap-2 transition-all cursor-pointer"
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "12px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <Plus size={16} />
            <span>Deploy Project</span>
          </Link>
        </div>
      </div>

      {/* ─── Metric Cards Grid (20px gap, 160px height, 24px bottom margin) ───── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        style={{ gap: "20px", marginBottom: "24px" }}
      >
        {/* Total Inquiries */}
        <div
          className="flex flex-col justify-between"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "24px",
            height: "160px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              style={{
                color: "#2563eb",
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: "monospace",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              TOTAL INQUIRIES
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#eff6ff] text-[#2563eb] flex items-center justify-center">
              <Inbox size={17} />
            </div>
          </div>
          <p
            className="font-display"
            style={{
              color: "#111827",
              fontSize: "36px",
              fontWeight: 900,
              margin: "4px 0",
              lineHeight: 1,
            }}
          >
            {loading ? "—" : stats.totalInquiries}
          </p>
          <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: 500, margin: 0 }}>
            Direct website leads
          </p>
        </div>

        {/* Unread Leads */}
        <div
          className="flex flex-col justify-between"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "24px",
            height: "160px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              style={{
                color: "#d97706",
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: "monospace",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              UNREAD LEADS
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#fef3c7] text-[#d97706] flex items-center justify-center">
              <Clock size={17} />
            </div>
          </div>
          <p
            className="font-display"
            style={{
              color: "#111827",
              fontSize: "36px",
              fontWeight: 900,
              margin: "4px 0",
              lineHeight: 1,
            }}
          >
            {loading ? "—" : stats.unreadInquiries}
          </p>
          <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: 500, margin: 0 }}>
            Awaiting review
          </p>
        </div>

        {/* Live Projects */}
        <div
          className="flex flex-col justify-between"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "24px",
            height: "160px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              style={{
                color: "#9333ea",
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: "monospace",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              LIVE PROJECTS
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#f3e8ff] text-[#9333ea] flex items-center justify-center">
              <FolderGit2 size={17} />
            </div>
          </div>
          <p
            className="font-display"
            style={{
              color: "#111827",
              fontSize: "36px",
              fontWeight: 900,
              margin: "4px 0",
              lineHeight: 1,
            }}
          >
            {loading ? "—" : stats.totalProjects}
          </p>
          <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: 500, margin: 0 }}>
            PyQ Portal + Custom
          </p>
        </div>

        {/* DB Engine */}
        <div
          className="flex flex-col justify-between"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "24px",
            height: "160px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              style={{
                color: "#059669",
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: "monospace",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              DB ENGINE
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#d1fae5] text-[#059669] flex items-center justify-center">
              <Database size={17} />
            </div>
          </div>
          <p
            className="font-display flex items-center gap-2"
            style={{
              color: "#111827",
              fontSize: "28px",
              fontWeight: 900,
              margin: "4px 0",
              lineHeight: 1,
            }}
          >
            <CheckCircle2 size={24} className="text-[#059669] flex-shrink-0" />
            <span>Online</span>
          </p>
          <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: 500, margin: 0 }}>
            PostgreSQL &amp; Storage active
          </p>
        </div>
      </div>

      {/* ─── Recent Client Inquiries Feed (Card container with 24px padding) ─── */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header Block with H2 Heading */}
        <div
          className="flex items-center justify-between"
          style={{
            paddingBottom: "16px",
            marginBottom: "12px",
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <div>
            <h2
              className="font-display"
              style={{
                color: "#111827",
                fontSize: "22px",
                fontWeight: 700,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Recent Client Inquiries
            </h2>
            <p style={{ color: "#6b7280", fontSize: "12px", marginTop: "2px", margin: 0 }}>
              Incoming project scopes directly from the website contact form.
            </p>
          </div>
          <Link
            href="/admin/inquiries"
            className="flex items-center gap-1 hover:underline"
            style={{
              color: "#111827",
              fontSize: "12px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ fontSize: "12px" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  color: "#6b7280",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <th style={{ padding: "12px 8px" }}>CLIENT</th>
                <th style={{ padding: "12px 8px" }}>PROJECT SCOPE</th>
                <th style={{ padding: "12px 8px" }}>TIMELINE</th>
                <th style={{ padding: "12px 8px" }}>STATUS</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {recentInquiries.map((inq, idx) => (
                <tr
                  key={inq.id}
                  style={{
                    borderBottom: idx !== recentInquiries.length - 1 ? "1px solid #f3f4f6" : "none",
                  }}
                >
                  <td style={{ padding: "16px 8px" }}>
                    <p style={{ color: "#111827", fontWeight: 700, fontSize: "13px", margin: 0 }}>
                      {inq.name}
                    </p>
                    <p style={{ color: "#2563eb", fontSize: "11px", margin: "2px 0 0 0", fontWeight: 500 }}>
                      {inq.email}
                    </p>
                    {inq.phone && (
                      <p style={{ color: "#059669", fontSize: "11px", margin: "2px 0 0 0", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                        <Phone size={11} />
                        <span>{inq.phone}</span>
                      </p>
                    )}
                  </td>
                  <td style={{ padding: "16px 8px" }}>
                    <span
                      style={{
                        backgroundColor: "#eff6ff",
                        color: "#2563eb",
                        border: "1px solid #dbeafe",
                        borderRadius: "6px",
                        padding: "4px 10px",
                        fontSize: "11px",
                        fontWeight: 600,
                        display: "inline-block",
                      }}
                    >
                      {inq.project_type}
                    </span>
                  </td>
                  <td style={{ padding: "16px 8px", color: "#374151", fontWeight: 600 }}>
                    {inq.timeline || "2-4 Weeks"}
                  </td>
                  <td style={{ padding: "16px 8px" }}>
                    <span
                      style={{
                        backgroundColor: "#fef3c7",
                        color: "#d97706",
                        border: "1px solid #fde68a",
                        borderRadius: "9999px",
                        padding: "3px 10px",
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        display: "inline-block",
                      }}
                    >
                      {inq.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 8px", textAlign: "right" }}>
                    <div className="flex items-center justify-end" style={{ gap: "8px" }}>
                      <a
                        href={`mailto:${inq.email}?subject=Regarding Your Project Inquiry with Zyro Studios`}
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          padding: "6px 14px",
                          color: "#2563eb",
                          fontWeight: 700,
                          fontSize: "12px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          textDecoration: "none",
                          cursor: "pointer",
                        }}
                      >
                        <Mail size={13} style={{ color: "#2563eb" }} />
                        <span style={{ color: "#2563eb", fontWeight: 700 }}>Reply</span>
                      </a>

                      <button
                        onClick={() => handleDeleteInquiry(inq.id, inq.name)}
                        disabled={deletingId === inq.id}
                        title="Delete Inquiry Permanently"
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #fecaca",
                          borderRadius: "8px",
                          padding: "6px 10px",
                          color: "#dc2626",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={13} style={{ color: "#dc2626" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
