// ─── Project Types ───────────────────────────────────────────────────────────

export interface Project {
  id?: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  technologies?: string[];
  features: string[];
  thumbnail: string;
  modalImage?: string;
  screenshots: string[];
  liveUrl?: string;
  githubUrl?: string;
  year: number;
  featured: boolean;
  status: "live" | "development" | "completed";
  problemStatement?: string;
  solution?: string;
  results?: string;
  client?: string;
}

// ─── Service Types ────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  highlighted?: boolean;
}

// ─── Navigation Types ─────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

// ─── Contact Form Types ───────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  description: string;
  budget?: string;
  timeline?: string;
}

export interface ContactFormState {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
}

// ─── Process Step Types ───────────────────────────────────────────────────────

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

// ─── Tech Stack Types ─────────────────────────────────────────────────────────

export interface TechItem {
  name: string;
  category: "frontend" | "backend" | "database" | "infrastructure";
}

// ─── Founder Types ────────────────────────────────────────────────────────────

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}
