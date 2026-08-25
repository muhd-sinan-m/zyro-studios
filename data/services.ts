import { Service } from "@/types";

export const services: Service[] = [
  {
    id: "ecommerce",
    title: "E-Commerce Websites",
    description:
      "Online stores designed for products, payments, orders, and exceptional customer experience. Built to convert visitors into buyers.",
    icon: "ShoppingCart",
    features: [
      "Product catalogue & inventory management",
      "Secure payment integration",
      "Order tracking & management",
      "Mobile-first shopping experience",
    ],
    highlighted: false,
  },
  {
    id: "educational",
    title: "Educational Websites",
    description:
      "Platforms for schools, colleges, coaching centres, courses, and learning management. Built to deliver knowledge at scale.",
    icon: "GraduationCap",
    features: [
      "Course & content management",
      "Student portals",
      "Resource libraries",
      "Assessment systems",
    ],
    highlighted: true,
  },
  {
    id: "business",
    title: "Business Websites",
    description:
      "Professional websites for companies, local businesses, services, resorts, restaurants, and organizations that want to grow online.",
    icon: "Building2",
    features: [
      "Professional brand identity",
      "Service showcases",
      "Contact & enquiry systems",
      "Google-ready SEO setup",
    ],
    highlighted: false,
  },
  {
    id: "portfolio",
    title: "Portfolio Websites",
    description:
      "Modern personal, creator, freelancer, and professional portfolio websites that make the right first impression.",
    icon: "Layers",
    features: [
      "Custom visual identity",
      "Project showcases",
      "Skills & experience sections",
      "Contact forms",
    ],
    highlighted: false,
  },
  {
    id: "landing",
    title: "Landing Pages",
    description:
      "High-converting landing pages for products, campaigns, businesses, and marketing. Designed to capture leads and drive action.",
    icon: "Target",
    features: [
      "Conversion-focused design",
      "A/B testing ready",
      "Analytics integration",
      "Lead capture forms",
    ],
    highlighted: false,
  },
  {
    id: "webapp",
    title: "Custom Web Applications",
    description:
      "Purpose-built web applications designed around your specific business requirements, workflows, and user needs.",
    icon: "Code2",
    features: [
      "Custom business logic",
      "User authentication",
      "Dashboard & data management",
      "API integrations",
    ],
    highlighted: true,
  },
];
