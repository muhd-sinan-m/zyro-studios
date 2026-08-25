import { NavLink, ProcessStep, TechItem } from "@/types";

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Process", href: "/process" },
  { label: "Contact", href: "/contact" },
];

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description:
      "We begin by deeply understanding your idea, requirements, target audience, and business goals. No assumptions — just clear, direct conversations.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "We define the full scope: features, structure, technology stack, timeline, and project milestones. Everything is documented before a single line of code is written.",
  },
  {
    number: "03",
    title: "Design",
    description:
      "We craft the visual direction, user experience, and interaction design. Your brand identity becomes the foundation of every design decision.",
  },
  {
    number: "04",
    title: "Build",
    description:
      "Development begins using modern, maintainable technologies. Clean code, proper architecture, and regular progress updates throughout the build.",
  },
  {
    number: "05",
    title: "Test",
    description:
      "Every feature is tested for responsiveness, functionality, performance, and security across devices and browsers — before it reaches you.",
  },
  {
    number: "06",
    title: "Launch",
    description:
      "We handle deployment, domain configuration, and go-live. Your digital product is published and ready for the world.",
  },
  {
    number: "07",
    title: "Grow",
    description:
      "The relationship continues after launch. We provide maintenance, improvements, new features, and strategic support as your business grows.",
  },
];

export const techStack: TechItem[] = [
  // Frontend
  { name: "Next.js", category: "frontend" },
  { name: "React", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "Framer Motion", category: "frontend" },
  // Backend
  { name: "Node.js", category: "backend" },
  { name: "Python", category: "backend" },
  { name: "FastAPI", category: "backend" },
  { name: "Django", category: "backend" },
  // Database
  { name: "PostgreSQL", category: "database" },
  { name: "Supabase", category: "database" },
  { name: "MySQL", category: "database" },
  // Infrastructure
  { name: "Vercel", category: "infrastructure" },
  { name: "AWS", category: "infrastructure" },
  { name: "Cloudflare", category: "infrastructure" },
  { name: "Docker", category: "infrastructure" },
];

export const projectTypes = [
  "Business Website",
  "E-Commerce",
  "Educational Website",
  "Portfolio",
  "Landing Page",
  "Web Application",
  "Redesign",
  "Other",
];

export const budgetRanges = [
  "Under ₹10,000",
  "₹10,000 – ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000+",
  "Not sure yet",
];

export const timelineOptions = [
  "As soon as possible",
  "1–2 weeks",
  "1 month",
  "2–3 months",
  "No rush — quality over speed",
];
