"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  FolderGit2,
  ExternalLink,
  Trash2,
  Edit,
  UploadCloud,
  Check,
  X,
  Sparkles,
  Search,
  Globe,
  Star,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  MoreHorizontal,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { Project } from "@/types";

const CATEGORY_OPTIONS = [
  "Educational / Academic Platform",
  "Custom Web Application",
  "E-Commerce & Digital Commerce",
  "SaaS & Cloud Platform",
  "Business Digital Headquarters",
  "Digital Infrastructure & Portal",
  "Workflow & Internal System",
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingModalImage, setUploadingModalImage] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedDetailsProject, setSelectedDetailsProject] = useState<any | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: CATEGORY_OPTIONS[0],
    client: "",
    year: 2026,
    shortDescription: "",
    fullDescription: "",
    problemStatement: "",
    solution: "",
    features: [] as string[],
    liveUrl: "",
    screenshot: "",
    modalImage: "",
    featured: true,
    isHidden: false,
    status: "live",
  });

  const [pointInput, setPointInput] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects?all=true");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleToggleVisibility = async (project: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const id = project.id || project.slug;
    setTogglingId(id);
    const newHiddenState = !project.isHidden;

    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) =>
        (p.id === id || p.slug === id) ? { ...p, isHidden: newHiddenState } : p
      )
    );

    if (selectedDetailsProject && (selectedDetailsProject.id === id || selectedDetailsProject.slug === id)) {
      setSelectedDetailsProject((prev: any) => ({ ...prev, isHidden: newHiddenState }));
    }

    try {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isHidden: newHiddenState }),
      });

      if (!res.ok) {
        // Revert on error
        setProjects((prev) =>
          prev.map((p) =>
            (p.id === id || p.slug === id) ? { ...p, isHidden: !newHiddenState } : p
          )
        );
        if (selectedDetailsProject && (selectedDetailsProject.id === id || selectedDetailsProject.slug === id)) {
          setSelectedDetailsProject((prev: any) => ({ ...prev, isHidden: !newHiddenState }));
        }
        alert("Failed to update project visibility. Please try again.");
      }
    } catch (err) {
      console.error(err);
      // Revert on network error
      setProjects((prev) =>
        prev.map((p) =>
          (p.id === id || p.slug === id) ? { ...p, isHidden: !newHiddenState } : p
        )
      );
      if (selectedDetailsProject && (selectedDetailsProject.id === id || selectedDetailsProject.slug === id)) {
        setSelectedDetailsProject((prev: any) => ({ ...prev, isHidden: !newHiddenState }));
      }
      alert("Network error updating visibility.");
    } finally {
      setTogglingId(null);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      category: CATEGORY_OPTIONS[0],
      client: "",
      year: 2026,
      shortDescription: "",
      fullDescription: "",
      problemStatement: "",
      solution: "",
      features: [],
      liveUrl: "",
      screenshot: "",
      modalImage: "",
      featured: true,
      isHidden: false,
      status: "live",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: any) => {
    setEditingId(project.id || project.slug);
    const hasImg = project.thumbnail || (project.screenshots && project.screenshots.length > 0 ? project.screenshots[0] : "");
    const hasModalImg = project.modalImage || project.thumbnail || (project.screenshots && project.screenshots.length > 1 ? project.screenshots[1] : hasImg);
    setFormData({
      title: project.title || "",
      slug: project.slug || "",
      category: project.category || CATEGORY_OPTIONS[0],
      client: project.client || "",
      year: project.year || 2026,
      shortDescription: project.shortDescription || "",
      fullDescription: project.fullDescription || project.shortDescription || "",
      problemStatement: project.problemStatement || "",
      solution: project.solution || "",
      features: project.features && project.features.length > 0 ? project.features : [
        "High-performance architecture with sub-second page loads",
        "Tailored database design with real-time sync",
        "Mobile-first responsive interface optimized for conversion",
      ],
      liveUrl: project.liveUrl || "",
      screenshot: hasImg,
      modalImage: hasModalImg,
      featured: project.featured !== undefined ? project.featured : true,
      isHidden: Boolean(project.isHidden),
      status: project.status || "live",
    });
    setIsModalOpen(true);
  };

  const handleAddPoint = () => {
    if (!pointInput.trim()) return;
    setFormData({
      ...formData,
      features: [...formData.features, pointInput.trim()],
    });
    setPointInput("");
  };

  const handleRemovePoint = (idx: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== idx),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "thumbnails");
      if (formData.screenshot) {
        data.append("oldUrl", formData.screenshot);
      }

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          setFormData((prev) => ({ ...prev, screenshot: json.url }));
        }
      } else {
        alert("Unable to upload image. Please try again.");
      }
    } catch {
      alert("Unable to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleModalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingModalImage(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "modals");
      if (formData.modalImage) {
        data.append("oldUrl", formData.modalImage);
      }

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          setFormData((prev) => ({ ...prev, modalImage: json.url }));
        }
      } else {
        alert("Unable to upload image. Please try again.");
      }
    } catch {
      alert("Unable to upload image. Please try again.");
    } finally {
      setUploadingModalImage(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) {
      alert("Please provide a Title and Category.");
      return;
    }

    setSaving(true);
    try {
      const autoSlug = formData.slug
        ? formData.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-")
        : formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const payload = {
        id: editingId || undefined,
        title: formData.title,
        slug: autoSlug,
        category: formData.category,
        client: formData.client,
        year: Number(formData.year) || 2026,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription || formData.shortDescription,
        problemStatement: formData.problemStatement,
        solution: formData.solution,
        features: formData.features,
        liveUrl: formData.liveUrl,
        thumbnailUrl: formData.screenshot || "/logo/zyro-logo.jpg",
        modalImageUrl: formData.modalImage || formData.screenshot || "/logo/zyro-logo.jpg",
        screenshots: [
          formData.screenshot || "/logo/zyro-logo.jpg",
          formData.modalImage || formData.screenshot || "/logo/zyro-logo.jpg",
        ],
        featured: formData.featured,
        isHidden: formData.isHidden,
        status: formData.status,
      };

      const res = await fetch("/api/projects", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsModalOpen(false);
        fetchProjects();
      } else {
        alert(data.error || "Unable to save project. Please try again.");
      }
    } catch {
      alert("Unable to save project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: string, slug: string) => {
    if (slug === "pyq-portal") {
      alert("PyQ Portal is the baseline flagship project and cannot be deleted. You can Hide it instead.");
      return;
    }

    if (!confirm("Are you sure you want to permanently delete this project?")) return;

    try {
      const res = await fetch(`/api/projects?id=${id || slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch {
      alert("Failed to delete project.");
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(search.toLowerCase()));

    let matchesStatus = true;
    if (statusFilter === "visible") {
      matchesStatus = !p.isHidden;
    } else if (statusFilter === "hidden") {
      matchesStatus = Boolean(p.isHidden);
    } else if (statusFilter === "live") {
      matchesStatus = p.status === "live";
    } else if (statusFilter === "development") {
      matchesStatus = p.status === "development" || p.status === "in-development";
    }

    const matchesType = typeFilter === "all" || p.category === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const hiddenCount = projects.filter((p) => p.isHidden).length;
  const visibleCount = projects.filter((p) => !p.isHidden).length;

  return (
    <div className="pb-12" style={{ color: "#0f172a" }}>
      {/* ─── Page Header with Heading & Sync/Deploy Buttons ─────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ marginBottom: "32px" }}
      >
        <div>
          <div className="flex items-center gap-3">
            <h1
              className="font-display"
              style={{
                color: "#111827",
                fontSize: "36px",
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Projects Manager
            </h1>
            <span
              style={{
                backgroundColor: "#f1f5f9",
                border: "1px solid #e2e8f0",
                color: "#475569",
                fontSize: "12px",
                fontWeight: 700,
                padding: "2px 10px",
                borderRadius: "9999px",
              }}
            >
              {projects.length} Total ({visibleCount} Live, {hiddenCount} Hidden)
            </span>
          </div>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px", marginBottom: 0 }}>
            Manage client showcases, customize features, and toggle public website visibility at any time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh/Sync Button */}
          <button
            onClick={fetchProjects}
            className="flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:bg-slate-50"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "9px 12px",
              color: "#374151",
            }}
            title="Refresh Projects"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-[#6b7280]" : "text-[#6b7280]"} />
          </button>

          {/* Deploy New Project Button */}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 transition-all cursor-pointer shadow-xs hover:bg-[#1d4ed8]"
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            <Plus size={16} />
            <span>Deploy New Project</span>
          </button>
        </div>
      </div>

      {/* ─── Filter & Control Toolbar ────────────────────────────────────────── */}
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ marginBottom: "28px" }}
      >
        {/* Left: Search Bar */}
        <div className="relative w-full md:w-[380px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title or category..."
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

        {/* Right: Dropdown Filters & Grid/List View Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Status & Visibility Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "9px 14px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="all">All Projects ({projects.length})</option>
            <option value="visible">Visible on Site ({visibleCount})</option>
            <option value="hidden">Hidden from Site ({hiddenCount})</option>
            <option value="live">Live Status</option>
            <option value="development">In Development</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "9px 14px",
              fontSize: "12px",
              fontWeight: 500,
              color: "#374151",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="all">All Categories</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* View Toggle Buttons */}
          <div className="flex items-center gap-1 bg-[#f8fafc] p-1 rounded-lg border border-[#e5e7eb]">
            <button
              onClick={() => setViewMode("grid")}
              style={{
                backgroundColor: viewMode === "grid" ? "#eff6ff" : "transparent",
                color: viewMode === "grid" ? "#2563eb" : "#9ca3af",
                border: viewMode === "grid" ? "1px solid #bfdbfe" : "1px solid transparent",
                borderRadius: "6px",
                padding: "6px 8px",
                cursor: "pointer",
              }}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                backgroundColor: viewMode === "list" ? "#eff6ff" : "transparent",
                color: viewMode === "list" ? "#2563eb" : "#9ca3af",
                border: viewMode === "list" ? "1px solid #bfdbfe" : "1px solid transparent",
                borderRadius: "6px",
                padding: "6px 8px",
                cursor: "pointer",
              }}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Projects Display: Empty State ───────────────────────────────────── */}
      {filteredProjects.length === 0 ? (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "64px 24px",
            textAlign: "center",
          }}
        >
          <FolderGit2 size={40} style={{ color: "#9ca3af", margin: "0 auto 12px auto", opacity: 0.6 }} />
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 }}>
            No projects match your filter
          </h3>
          <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
            Try adjusting your search query or status filter to see other projects.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* ─── GRID VIEW ───────────────────────────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "24px" }}>
          {filteredProjects.map((p) => {
            const isPyq = p.slug === "pyq-portal";
            const isHidden = Boolean(p.isHidden);
            const isToggling = togglingId === (p.id || p.slug);
            const hasImg = p.screenshots && p.screenshots.length > 0 && p.screenshots[0];
            const imgUrl = hasImg ? p.screenshots[0] : p.thumbnail;
            const featuresList = p.features && p.features.length > 0 ? p.features : [
              "Previous Year Question (PYQ) repository",
              "Subject-wise filtering & search",
              "Searchable question bank with tag-based navigation",
            ];

            return (
              <div
                key={p.slug || p.id}
                className={`flex flex-col justify-between transition-all hover:shadow-md ${
                  isHidden ? "border-amber-200 bg-amber-50/20" : "bg-white"
                }`}
                style={{
                  border: isHidden ? "1px solid #fcd34d" : "1px solid #e5e7eb",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  position: "relative",
                }}
              >
                <div>
                  {/* Top Screenshot / Banner Section */}
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      backgroundColor: "#0f172a",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={p.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "top",
                          opacity: isHidden ? 0.75 : 1,
                          filter: isHidden ? "grayscale(30%)" : "none",
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-900 text-white">
                        <span className="font-display font-extrabold text-2xl text-blue-400">
                          {p.title}
                        </span>
                        <span className="text-xs text-slate-400 mt-1 font-mono">{p.category}</span>
                      </div>
                    )}

                    {/* Top Left Hidden/Status Pill */}
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        zIndex: 10,
                      }}
                    >
                      {isHidden ? (
                        <div
                          style={{
                            backgroundColor: "rgba(254, 243, 199, 0.96)",
                            backdropFilter: "blur(4px)",
                            border: "1px solid #f59e0b",
                            borderRadius: "9999px",
                            padding: "3px 10px",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#92400e",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                          }}
                        >
                          <EyeOff size={13} className="text-amber-600" />
                          <span>Hidden from Site</span>
                        </div>
                      ) : (
                        <div
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(4px)",
                            border: "1px solid #d1fae5",
                            borderRadius: "9999px",
                            padding: "3px 10px",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#059669",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: "#059669",
                            }}
                          />
                          <span>Visible Live</span>
                        </div>
                      )}
                    </div>

                    {/* Top Right Quick Hide/Unhide Toggle Button */}
                    <button
                      onClick={(e) => handleToggleVisibility(p, e)}
                      disabled={isToggling}
                      title={isHidden ? "Click to unhide project on live website" : "Click to hide project from live website"}
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        backgroundColor: isHidden ? "#ffffff" : "rgba(15, 23, 42, 0.85)",
                        backdropFilter: "blur(4px)",
                        border: isHidden ? "1px solid #f59e0b" : "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "9999px",
                        padding: "4px 12px",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: isHidden ? "#b45309" : "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        zIndex: 10,
                        transition: "all 0.15s ease",
                      }}
                      className="hover:scale-105 active:scale-95"
                    >
                      {isToggling ? (
                        <Loader2 size={13} className="animate-spin text-slate-400" />
                      ) : isHidden ? (
                        <>
                          <Eye size={13} className="text-emerald-600" />
                          <span>Unhide</span>
                        </>
                      ) : (
                        <>
                          <EyeOff size={13} className="text-amber-400" />
                          <span>Hide</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Card Content Body */}
                  <div style={{ padding: "20px 24px" }}>
                    {/* Category Label */}
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        fontFamily: "monospace",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        color: isHidden ? "#64748b" : "#2563eb",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {p.category}
                    </p>

                    {/* Title */}
                    <h3
                      className="font-display"
                      style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: isHidden ? "#334155" : "#111827",
                        margin: "0 0 8px 0",
                        lineHeight: 1.25,
                      }}
                    >
                      {p.title}
                    </h3>

                    {/* Short Description */}
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        lineHeight: 1.5,
                        margin: "0 0 16px 0",
                      }}
                    >
                      {p.shortDescription || "A modern application showcase built for custom client solutions."}
                    </p>

                    {/* Feature Points List with Checkmarks */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {featuresList.slice(0, 3).map((feat: string, idx: number) => (
                        <div key={idx} className="flex items-start" style={{ gap: "8px" }}>
                          <CheckCircle2
                            size={15}
                            style={{
                              color: isHidden ? "#94a3b8" : "#2563eb",
                              flexShrink: 0,
                              marginTop: "2px",
                            }}
                          />
                          <span style={{ fontSize: "12px", color: "#374151", lineHeight: 1.4 }}>
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div
                  className="flex items-center justify-between"
                  style={{
                    padding: "16px 24px",
                    borderTop: "1px solid #f3f4f6",
                    backgroundColor: isHidden ? "#fffbeb" : "#ffffff",
                  }}
                >
                  {/* Live Site Link */}
                  {p.liveUrl ? (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#2563eb",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        textDecoration: "none",
                      }}
                    >
                      <span>Live Site</span>
                      <ExternalLink size={13} style={{ color: "#2563eb" }} />
                    </a>
                  ) : (
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>No link</span>
                  )}

                  {/* Right Action Buttons: View Details & Options Menu */}
                  <div className="flex items-center" style={{ gap: "8px" }}>
                    <button
                      onClick={() => setSelectedDetailsProject(p)}
                      style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "6px 14px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#374151",
                        cursor: "pointer",
                      }}
                      className="hover:bg-slate-50"
                    >
                      View Details
                    </button>

                    {/* Dropdown Options Button */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === (p.slug || p.id) ? null : (p.slug || p.id));
                        }}
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          padding: "6px 8px",
                          color: "#6b7280",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        className="hover:bg-slate-50"
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {/* Dropdown Menu Popup */}
                      {activeMenuId === (p.slug || p.id) && (
                        <div
                          style={{
                            position: "absolute",
                            right: 0,
                            bottom: "100%",
                            marginBottom: "6px",
                            width: "180px",
                            backgroundColor: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                            zIndex: 40,
                            padding: "4px",
                          }}
                        >
                          {/* Hide / Unhide option */}
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              handleToggleVisibility(p);
                            }}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-slate-50 rounded-md cursor-pointer"
                          >
                            {isHidden ? (
                              <>
                                <Eye size={14} className="text-emerald-600" />
                                <span className="text-emerald-700">Unhide (Show on site)</span>
                              </>
                            ) : (
                              <>
                                <EyeOff size={14} className="text-amber-600" />
                                <span className="text-amber-700">Hide from website</span>
                              </>
                            )}
                          </button>

                          {/* Edit option */}
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              openEditModal(p);
                            }}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
                          >
                            <Edit size={13} className="text-blue-600" />
                            <span>Edit Card</span>
                          </button>

                          {!isPyq && (
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                handleDeleteProject(p.id, p.slug);
                              }}
                              className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                            >
                              <Trash2 size={13} className="text-red-600" />
                              <span>Delete Project</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ─── LIST VIEW ───────────────────────────────────────────────────────── */
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" style={{ fontSize: "13px" }}>
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-mono text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-6 font-semibold">Project</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Client / Year</th>
                  <th className="py-3.5 px-4 font-semibold">Site Visibility</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((p) => {
                  const isPyq = p.slug === "pyq-portal";
                  const isHidden = Boolean(p.isHidden);
                  const isToggling = togglingId === (p.id || p.slug);
                  const imgUrl = (p.screenshots && p.screenshots[0]) || p.thumbnail;

                  return (
                    <tr
                      key={p.slug || p.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isHidden ? "bg-amber-50/30" : ""
                      }`}
                    >
                      {/* Project Title + Thumbnail */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 rounded-lg bg-slate-900 overflow-hidden flex-shrink-0 border border-slate-200">
                            {imgUrl ? (
                              <img src={imgUrl} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold font-mono">
                                ZY
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 font-display m-0 leading-tight">
                              {p.title}
                            </p>
                            <p className="text-xs text-slate-500 font-mono m-0 mt-0.5">/{p.slug}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 text-xs font-medium text-slate-600">
                        {p.category}
                      </td>

                      {/* Client / Year */}
                      <td className="py-4 px-4 text-xs text-slate-600">
                        <span>{p.client || "Zyro Studios"}</span>
                        <span className="text-slate-400 ml-1.5 font-mono">({p.year || 2026})</span>
                      </td>

                      {/* Visibility Status & 1-Click Toggle */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleVisibility(p)}
                          disabled={isToggling}
                          style={{
                            backgroundColor: isHidden ? "#fef3c7" : "#ecfdf5",
                            border: isHidden ? "1px solid #fde68a" : "1px solid #a7f3d0",
                            color: isHidden ? "#92400e" : "#065f46",
                            padding: "4px 10px",
                            borderRadius: "9999px",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.15s ease",
                          }}
                          className="hover:scale-105 active:scale-95"
                          title={isHidden ? "Click to make visible on website" : "Click to hide from website"}
                        >
                          {isToggling ? (
                            <Loader2 size={12} className="animate-spin text-slate-400" />
                          ) : isHidden ? (
                            <>
                              <EyeOff size={12} className="text-amber-600" />
                              <span>Hidden (Click to Unhide)</span>
                            </>
                          ) : (
                            <>
                              <Eye size={12} className="text-emerald-600" />
                              <span>Visible (Click to Hide)</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedDetailsProject(p)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit size={14} />
                          </button>
                          {!isPyq && (
                            <button
                              onClick={() => handleDeleteProject(p.id, p.slug)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Bottom Pagination & Info ───────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ marginTop: "36px" }}
      >
        <div className="text-xs text-slate-500">
          Showing {filteredProjects.length} of {projects.length} total projects
        </div>

        {/* Center: Pagination */}
        <div className="flex items-center" style={{ gap: "6px" }}>
          <button
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "6px 10px",
              color: "#9ca3af",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            1
          </button>
          <button
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "6px 10px",
              color: "#9ca3af",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="hidden sm:block w-36" />
      </div>

      {/* ─── View Details Modal Inspector ───────────────────────────────────── */}
      {selectedDetailsProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "20px",
              padding: "32px",
              width: "100%",
              maxWidth: "560px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              color: "#111827",
            }}
            className="animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div
              className="flex items-start justify-between"
              style={{
                paddingBottom: "20px",
                marginBottom: "20px",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
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
                    {selectedDetailsProject.category}
                  </span>

                  {/* Hidden / Visible Badge */}
                  {selectedDetailsProject.isHidden ? (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                      <EyeOff size={10} />
                      Hidden
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                      <Eye size={10} />
                      Visible
                    </span>
                  )}
                </div>

                <h3
                  className="font-display"
                  style={{
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "#111827",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {selectedDetailsProject.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedDetailsProject(null)}
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

            {/* Description */}
            <p
              style={{
                fontSize: "13px",
                color: "#4b5563",
                lineHeight: 1.6,
                marginBottom: "20px",
                margin: "0 0 20px 0",
              }}
            >
              {selectedDetailsProject.shortDescription}
            </p>

            {/* Feature Highlights Box */}
            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "24px",
              }}
            >
              <h4
                style={{
                  fontSize: "11px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                  margin: "0 0 12px 0",
                }}
              >
                Key Showcase Features:
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {(selectedDetailsProject.features || []).map((f: string, i: number) => (
                  <div key={i} className="flex items-start" style={{ gap: "10px" }}>
                    <CheckCircle2 size={16} style={{ color: "#2563eb", flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "13px", color: "#374151" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="flex items-center justify-between gap-3"
              style={{
                paddingTop: "20px",
                borderTop: "1px solid #f3f4f6",
              }}
            >
              <div className="flex items-center gap-2">
                {selectedDetailsProject.liveUrl && (
                  <a
                    href={selectedDetailsProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: "#2563eb",
                      color: "#ffffff",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "12px",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      textDecoration: "none",
                    }}
                    className="hover:bg-[#1d4ed8]"
                  >
                    <span>Live Showcase</span>
                    <ExternalLink size={13} />
                  </a>
                )}

                {/* Quick Toggle Inside Details Modal */}
                <button
                  onClick={() => handleToggleVisibility(selectedDetailsProject)}
                  style={{
                    backgroundColor: selectedDetailsProject.isHidden ? "#fef3c7" : "#f1f5f9",
                    border: selectedDetailsProject.isHidden ? "1px solid #fde68a" : "1px solid #e2e8f0",
                    color: selectedDetailsProject.isHidden ? "#92400e" : "#475569",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                  className="hover:opacity-90"
                >
                  {selectedDetailsProject.isHidden ? (
                    <>
                      <Eye size={13} className="text-amber-700" />
                      <span>Unhide Project</span>
                    </>
                  ) : (
                    <>
                      <EyeOff size={13} className="text-slate-600" />
                      <span>Hide Project</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => {
                  const p = selectedDetailsProject;
                  setSelectedDetailsProject(null);
                  openEditModal(p);
                }}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  color: "#374151",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                className="hover:bg-slate-50"
              >
                Edit Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Deploy / Edit Project Modal ─────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "20px",
              padding: "28px 32px",
              width: "100%",
              maxWidth: "960px",
              maxHeight: "90vh",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)",
              color: "#111827",
            }}
            className="animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between flex-shrink-0"
              style={{
                paddingBottom: "16px",
                marginBottom: "20px",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "20px",
                    fontWeight: 800,
                    color: "#111827",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {editingId ? "Edit Project Showcase" : "Deploy New Project Showcase"}
                </h2>
                <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>
                  Manage showcase card content, public visibility, custom images, and technical specifications.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
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

            {/* Modal Form Container with Scrollable Body */}
            <form onSubmit={handleSaveProject} className="flex-1 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
              
              {/* ─── PUBLIC VISIBILITY SELECTOR ─── */}
              <div
                style={{
                  backgroundColor: formData.isHidden ? "#fffbeb" : "#f0fdf4",
                  border: formData.isHidden ? "1px solid #fde68a" : "1px solid #bbf7d0",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  marginBottom: "20px",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span style={{ display: "block", fontSize: "13px", fontWeight: 700, color: formData.isHidden ? "#92400e" : "#166534" }}>
                      Public Website Visibility
                    </span>
                    <p style={{ fontSize: "11px", color: formData.isHidden ? "#b45309" : "#15803d", margin: "2px 0 0 0" }}>
                      {formData.isHidden
                        ? "⚠️ Project is currently HIDDEN. It will NOT appear anywhere on the live website (Home, Work, Sitemap)."
                        : "✓ Project is VISIBLE to all website visitors on public portfolio showcases."}
                    </p>
                  </div>

                  {/* Toggle Pills */}
                  <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isHidden: false })}
                      style={{
                        backgroundColor: !formData.isHidden ? "#22c55e" : "transparent",
                        color: !formData.isHidden ? "#ffffff" : "#64748b",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        fontSize: "11px",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <Eye size={13} />
                      <span>Visible</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isHidden: true })}
                      style={{
                        backgroundColor: formData.isHidden ? "#f59e0b" : "transparent",
                        color: formData.isHidden ? "#ffffff" : "#64748b",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        fontSize: "11px",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <EyeOff size={13} />
                      <span>Hidden</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* ─── LEFT COLUMN: Project Meta & Descriptions ─── */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Title */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                        Project Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. PyQ Portal"
                        style={{
                          width: "100%",
                          height: "38px",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          backgroundColor: "#f8fafc",
                          fontSize: "13px",
                          color: "#111827",
                          outline: "none",
                        }}
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={{
                          width: "100%",
                          height: "38px",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          backgroundColor: "#f8fafc",
                          fontSize: "12px",
                          color: "#111827",
                          outline: "none",
                          cursor: "pointer",
                        }}
                      >
                        {CATEGORY_OPTIONS.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                      Short Description (Card View)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="Brief summary displayed on the card..."
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#f8fafc",
                        fontSize: "12px",
                        color: "#111827",
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* Full Detailed Description */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                      Full Detailed Description (Modal View)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.fullDescription}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      placeholder="Comprehensive overview inside details modal..."
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#f8fafc",
                        fontSize: "12px",
                        color: "#111827",
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* Client & Release Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                        Client / Organization
                      </label>
                      <input
                        type="text"
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        placeholder="e.g. Educational Institution"
                        style={{
                          width: "100%",
                          height: "38px",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          backgroundColor: "#f8fafc",
                          fontSize: "12px",
                          color: "#111827",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                        Release Year
                      </label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) || 2026 })}
                        placeholder="2026"
                        style={{
                          width: "100%",
                          height: "38px",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          backgroundColor: "#f8fafc",
                          fontSize: "12px",
                          color: "#111827",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  {/* Live Application URL */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                      Live Application URL
                    </label>
                    <input
                      type="text"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      placeholder="https://pyqportal.com"
                      style={{
                        width: "100%",
                        height: "38px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#f8fafc",
                        fontSize: "12px",
                        color: "#111827",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                {/* ─── RIGHT COLUMN: Media Uploads & Highlight Points ─── */}
                <div className="space-y-4">
                  {/* Card Thumbnail Image */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                      1. Card Thumbnail Image (Website View) *
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.screenshot}
                        onChange={(e) => setFormData({ ...formData, screenshot: e.target.value })}
                        placeholder="/img/pyqportal.webp"
                        style={{
                          flex: 1,
                          height: "38px",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          backgroundColor: "#f8fafc",
                          fontSize: "12px",
                          color: "#111827",
                          outline: "none",
                        }}
                      />
                      <label
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e7eb",
                          color: "#374151",
                          borderRadius: "8px",
                          padding: "8px 14px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                        className="hover:bg-slate-50"
                      >
                        {uploadingImage ? "..." : "Upload"}
                        <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>

                  {/* Modal Showcase Image */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                      2. Modal Showcase Image (Inside Popup View)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.modalImage}
                        onChange={(e) => setFormData({ ...formData, modalImage: e.target.value })}
                        placeholder="/img/pyqportal.webp"
                        style={{
                          flex: 1,
                          height: "38px",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          backgroundColor: "#f8fafc",
                          fontSize: "12px",
                          color: "#111827",
                          outline: "none",
                        }}
                      />
                      <label
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e7eb",
                          color: "#374151",
                          borderRadius: "8px",
                          padding: "8px 14px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                        className="hover:bg-slate-50"
                      >
                        {uploadingModalImage ? "..." : "Upload"}
                        <input type="file" onChange={handleModalImageUpload} className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>

                  {/* Problem & Solution (Row) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                        Problem / Challenge
                      </label>
                      <textarea
                        rows={2}
                        value={formData.problemStatement}
                        onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                        placeholder="Challenge statement..."
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          backgroundColor: "#f8fafc",
                          fontSize: "12px",
                          color: "#111827",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                        Architectural Solution
                      </label>
                      <textarea
                        rows={2}
                        value={formData.solution}
                        onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                        placeholder="Solution details..."
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          backgroundColor: "#f8fafc",
                          fontSize: "12px",
                          color: "#111827",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  {/* Feature Points */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
                      Key Capabilities &amp; System Highlights
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={pointInput}
                        onChange={(e) => setPointInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddPoint();
                          }
                        }}
                        placeholder="Add feature highlight..."
                        style={{
                          flex: 1,
                          height: "36px",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          backgroundColor: "#f8fafc",
                          fontSize: "12px",
                          color: "#111827",
                          outline: "none",
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddPoint}
                        style={{
                          backgroundColor: "#2563eb",
                          color: "#ffffff",
                          borderRadius: "8px",
                          padding: "7px 14px",
                          fontSize: "12px",
                          fontWeight: 700,
                          border: "none",
                          cursor: "pointer",
                        }}
                        className="hover:bg-[#1d4ed8]"
                      >
                        Add
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                      {formData.features.map((feat, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e5e7eb",
                            fontSize: "11px",
                            color: "#374151",
                          }}
                        >
                          <span className="truncate">{feat}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePoint(idx)}
                            style={{ color: "#dc2626", border: "none", background: "none", cursor: "pointer", marginLeft: "6px" }}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Action Buttons Footer */}
              <div
                className="flex items-center justify-end gap-3 pt-4 mt-6 border-t border-slate-100 flex-shrink-0"
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    color: "#4b5563",
                    borderRadius: "8px",
                    padding: "9px 18px",
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
                  disabled={saving}
                  style={{
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    borderRadius: "8px",
                    padding: "9px 22px",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                  className="hover:bg-[#1d4ed8]"
                >
                  {saving ? "Saving..." : editingId ? "Update Showcase" : "Deploy Showcase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
