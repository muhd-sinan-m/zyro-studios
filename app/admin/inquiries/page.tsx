"use client";

import React, { useEffect, useState } from "react";
import {
  Inbox,
  Search,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  DollarSign,
  Calendar,
  X,
  ExternalLink,
  RefreshCw,
  MessageSquare,
  FileText,
  Trash2,
  Eye,
  Phone,
} from "lucide-react";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchInquiries = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    // Auto-fetch new incoming inquiries live every 5 seconds
    const interval = setInterval(() => {
      fetchInquiries(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
      }
    } catch {
      alert("Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteInquiry = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to permanently delete the inquiry from "${name}"? This action cannot be undone.`
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
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(null);
        }
      } else {
        const errData = await res.json();
        alert(errData.error || "Unable to delete inquiry. Please try again.");
      }
    } catch (err) {
      alert("Unable to process request. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      (inq.phone && inq.phone.toLowerCase().includes(search.toLowerCase())) ||
      (inq.company && inq.company.toLowerCase().includes(search.toLowerCase())) ||
      inq.project_type.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || inq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="pb-12" style={{ color: "#0f172a" }}>
      {/* ─── Header & Refresh Pipeline Button ─────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ marginBottom: "32px" }}
      >
        <div>
          <h1
            className="font-display"
            style={{
              color: "#111827",
              fontSize: "36px",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: "4px",
            }}
          >
            Client Inquiries
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
            Review and manage incoming project scopes directly from the website contact form.
          </p>
        </div>

        <button
          onClick={() => fetchInquiries()}
          className="flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "9px 16px",
            color: "#374151",
            fontSize: "12px",
            fontWeight: 600,
          }}
          title="Sync Pipeline"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-[#6b7280]" : "text-[#6b7280]"} />
          <span>Sync Pipeline</span>
        </button>
      </div>

      {/* ─── Search & Status Filters Toolbar ───────────────────────────────── */}
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ marginBottom: "28px" }}
      >
        {/* Left: Search Input */}
        <div className="relative w-full md:w-[380px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email, phone, company..."
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "10px 14px 10px 40px",
              fontSize: "12px",
              color: "#111827",
              width: "100%",
              outline: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
          />
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Right: Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {["all", "unread", "in_review", "contacted", "archived"].map((st) => {
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  backgroundColor: isActive ? "#2563eb" : "#ffffff",
                  color: isActive ? "#ffffff" : "#4b5563",
                  border: isActive ? "1px solid #2563eb" : "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  fontSize: "12px",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  textTransform: "capitalize",
                  boxShadow: isActive ? "0 1px 2px rgba(37,99,235,0.2)" : "none",
                }}
              >
                {st.replace("_", " ")}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Inquiries Table Card Container ─────────────────────────────────── */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        {filteredInquiries.length === 0 ? (
          <div style={{ padding: "64px 24px", textAlign: "center" }}>
            <Inbox size={40} style={{ color: "#9ca3af", margin: "0 auto 12px auto", opacity: 0.6 }} />
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 }}>
              No inquiries found
            </h3>
            <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
              {search || statusFilter !== "all"
                ? "Try adjusting your search criteria or status filter."
                : "Client submissions through the website contact form will appear here automatically."}
            </p>
          </div>
        ) : (
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
                  <th style={{ padding: "12px 12px" }}>CLIENT &amp; CONTACT</th>
                  <th style={{ padding: "12px 12px" }}>PROJECT SCOPE</th>
                  <th style={{ padding: "12px 12px" }}>TIMELINE</th>
                  <th style={{ padding: "12px 12px" }}>STATUS</th>
                  <th style={{ padding: "12px 12px", textAlign: "right" }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inq, idx) => (
                  <tr
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    style={{
                      borderBottom: idx !== filteredInquiries.length - 1 ? "1px solid #f3f4f6" : "none",
                      cursor: "pointer",
                    }}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Client Name, Email & Required Phone Number */}
                    <td style={{ padding: "16px 12px" }}>
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
                      {inq.company && (
                        <p style={{ color: "#9ca3af", fontSize: "11px", margin: "2px 0 0 0", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Building size={11} />
                          <span>{inq.company}</span>
                        </p>
                      )}
                    </td>

                    {/* Project Scope Badge & Details */}
                    <td style={{ padding: "16px 12px" }}>
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
                      <p
                        className="line-clamp-1 max-w-xs"
                        style={{ color: "#6b7280", fontSize: "12px", marginTop: "6px", margin: "6px 0 0 0" }}
                      >
                        {inq.details}
                      </p>
                    </td>

                    {/* Timeline */}
                    <td style={{ padding: "16px 12px", color: "#374151", fontWeight: 600 }}>
                      {inq.timeline || "2-4 Weeks"}
                    </td>

                    {/* Status Pill Badge */}
                    <td style={{ padding: "16px 12px" }}>
                      <span
                        style={{
                          backgroundColor:
                            inq.status === "unread"
                              ? "#fef3c7"
                              : inq.status === "contacted"
                              ? "#d1fae5"
                              : inq.status === "in_review"
                              ? "#eff6ff"
                              : "#f1f5f9",
                          color:
                            inq.status === "unread"
                              ? "#d97706"
                              : inq.status === "contacted"
                              ? "#059669"
                              : inq.status === "in_review"
                              ? "#2563eb"
                              : "#64748b",
                          border:
                            inq.status === "unread"
                              ? "1px solid #fde68a"
                              : inq.status === "contacted"
                              ? "1px solid #a7f3d0"
                              : inq.status === "in_review"
                              ? "1px solid #bfdbfe"
                              : "1px solid #e2e8f0",
                          borderRadius: "9999px",
                          padding: "3px 10px",
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          display: "inline-block",
                        }}
                      >
                        {inq.status.replace("_", " ")}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td style={{ padding: "16px 12px", textAlign: "right" }}>
                      <div
                        className="flex items-center justify-end"
                        style={{ gap: "8px" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Reply Button */}
                        <a
                          href={`mailto:${inq.email}?subject=Regarding Your ${inq.project_type} Inquiry with Zyro Studios`}
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
                          <span>Reply</span>
                        </a>

                        {/* Inspect Details Button */}
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          style={{
                            backgroundColor: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            padding: "6px 14px",
                            color: "#374151",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                          className="hover:bg-slate-100"
                        >
                          Inspect
                        </button>

                        {/* Delete Button */}
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
        )}
      </div>

      {/* ─── Detailed Lead Inspector Modal (Clean 32px Padding Light Mode Card) ── */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "20px",
              padding: "32px",
              width: "100%",
              maxWidth: "720px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              color: "#111827",
            }}
            className="animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header Block */}
            <div
              className="flex items-start justify-between"
              style={{
                paddingBottom: "20px",
                marginBottom: "20px",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div>
                <span
                  style={{
                    color: "#2563eb",
                    fontSize: "11px",
                    fontWeight: 700,
                    fontFamily: "monospace",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  CLIENT INQUIRY // {selectedInquiry.id.slice(0, 8)}
                </span>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "#111827",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {selectedInquiry.name}
                </h2>
                <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px", margin: "4px 0 0 0" }}>
                  {selectedInquiry.email} {selectedInquiry.company ? `• ${selectedInquiry.company}` : ""}
                </p>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
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

            {/* Dedicated Client Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: "20px" }}>
              {/* Field 1: Phone / WhatsApp */}
              <div>
                <label
                  style={{
                    fontSize: "11px",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Phone / WhatsApp Number
                </label>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f8fafc] border border-slate-200">
                  <Phone size={16} className="text-[#059669] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900 font-mono select-all">
                    {selectedInquiry.phone || "Not provided"}
                  </span>
                </div>
              </div>

              {/* Field 2: Work Email */}
              <div>
                <label
                  style={{
                    fontSize: "11px",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Work Email Address
                </label>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f8fafc] border border-slate-200">
                  <Mail size={16} className="text-blue-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 font-mono select-all break-all">
                    {selectedInquiry.email}
                  </span>
                </div>
              </div>

              {/* Field 3: Project Type */}
              <div>
                <label
                  style={{
                    fontSize: "11px",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Project Type
                </label>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f8fafc] border border-slate-200">
                  <FileText size={16} className="text-blue-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-blue-700">
                    {selectedInquiry.project_type}
                  </span>
                </div>
              </div>

              {/* Field 4: Timeline */}
              <div>
                <label
                  style={{
                    fontSize: "11px",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Target Timeline
                </label>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f8fafc] border border-slate-200">
                  <Clock size={16} className="text-slate-500 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {selectedInquiry.timeline || "Flexible"}
                  </span>
                </div>
              </div>
            </div>

            {/* Scope Details / Message Box */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontSize: "11px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "8px",
                  letterSpacing: "0.05em",
                }}
              >
                Project Scope &amp; Details
              </label>
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "20px",
                  fontSize: "13px",
                  color: "#374151",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {selectedInquiry.details}
              </div>
            </div>

            {/* Update Status Selector Row */}
            <div
              className="flex items-center justify-between"
              style={{
                paddingTop: "16px",
                paddingBottom: "16px",
                borderTop: "1px solid #f3f4f6",
                borderBottom: "1px solid #f3f4f6",
                marginBottom: "20px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  color: "#6b7280",
                  textTransform: "uppercase",
                }}
              >
                Update Status:
              </span>
              <div className="flex gap-2">
                {["unread", "in_review", "contacted", "archived"].map((st) => {
                  const isActive = selectedInquiry.status === st;
                  return (
                    <button
                      key={st}
                      disabled={updatingStatus}
                      onClick={() => handleUpdateStatus(selectedInquiry.id, st)}
                      style={{
                        backgroundColor: isActive ? "#2563eb" : "#f1f5f9",
                        color: isActive ? "#ffffff" : "#475569",
                        border: isActive ? "1px solid #2563eb" : "1px solid #e2e8f0",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        fontSize: "11px",
                        fontFamily: "monospace",
                        fontWeight: isActive ? 700 : 600,
                        cursor: "pointer",
                        textTransform: "uppercase",
                      }}
                    >
                      {st.replace("_", " ")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Modal Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Regarding Your ${selectedInquiry.project_type} Project with Zyro Studios`}
                  style={{
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    borderRadius: "8px",
                    padding: "10px 16px",
                    fontSize: "12px",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    textDecoration: "none",
                  }}
                  className="hover:bg-[#1d4ed8]"
                >
                  <Mail size={14} />
                  <span>Email Client</span>
                </a>

                {selectedInquiry.phone && (
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: "#059669",
                      color: "#ffffff",
                      borderRadius: "8px",
                      padding: "10px 16px",
                      fontSize: "12px",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      textDecoration: "none",
                    }}
                    className="hover:bg-[#047857]"
                  >
                    <MessageSquare size={14} />
                    <span>WhatsApp</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteInquiry(selectedInquiry.id, selectedInquiry.name)}
                  disabled={deletingId === selectedInquiry.id}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #fecaca",
                    color: "#dc2626",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    fontSize: "12px",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                  }}
                  className="hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
