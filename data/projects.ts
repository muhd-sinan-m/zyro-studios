import { Project } from "@/types";

export const projects: Project[] = [
  {
    title: "PyQ Portal",
    slug: "pyq-portal",
    category: "Educational / Academic Platform",
    shortDescription:
      "A modern academic portal built for students to access previous year questions, subject-wise resources, and study materials — all in one place.",
    fullDescription:
      "PyQ Portal is a comprehensive educational platform designed to help students prepare effectively for their examinations. The platform provides organized access to previous year question papers, subject-wise categorization, and a clean study experience. Built with performance and accessibility in mind, the portal handles large volumes of academic content efficiently.",
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "PostgreSQL",
      "Supabase",
    ],
    features: [
      "Previous Year Question (PYQ) repository with subject-wise filtering",
      "Searchable question bank with tag-based navigation",
      "Clean, distraction-free reading interface",
      "Mobile-responsive design for study on any device",
      "Fast page loads with optimized content delivery",
      "Organized subject and topic categorization",
      "Download functionality for offline study",
    ],
    thumbnail: "/img/pyqportal.webp",
    modalImage: "/img/pyqportal.webp",
    screenshots: [
      "/img/pyqportal.webp",
    ],
    liveUrl: "https://pyq.marian.cloud",
    year: 2026,
    featured: true,
    isHidden: false,
    status: "live",
    problemStatement:
      "Students struggle to find organized, accessible previous year question papers. Resources are scattered across different platforms, often poorly formatted and hard to navigate on mobile devices.",
    solution:
      "A centralized, well-organized portal that presents academic resources in a clean, searchable interface — optimized for the way students actually study.",
    results:
      "A fully functional academic resource platform with a seamless user experience, organized content architecture, and fast performance across all devices.",
    client: "Educational Institution",
  },
];

export const getFeaturedProjects = (): Project[] =>
  projects.filter((p) => p.featured && !p.isHidden);

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug && !p.isHidden);
