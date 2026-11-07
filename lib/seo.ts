import type { Metadata } from "next";

export const SITE_CONFIG = {
  name: "Zyro Studios",
  legalName: "Zyro Studios Freelance Web Engineering",
  brandTitle: "Zyro Studios | Affordable Freelance Web Developer & Custom Web Apps",
  shortTitle: "Zyro Studios — Freelance Web Developer",
  url: "https://zyrostudios.vercel.app",
  domain: "zyrostudios.vercel.app",
  ogImage: "https://zyrostudios.vercel.app/logo/zyro-logo.jpg",
  logo: "https://zyrostudios.vercel.app/logo/zyro-logo.jpg",
  founderName: "Sinan",
  founderRole: "Senior Freelance Full-Stack Developer & Systems Architect",
  tagline: "We Build. You Grow. High-performance custom web development at affordable freelance rates.",
  description:
    "Hire an affordable freelance web developer. Zyro Studios designs, builds, and deploys high-performance Next.js websites, custom web apps, e-commerce stores, and academic portals at cheap, budget-friendly prices. Fast delivery, 100% custom code.",
  priceRange: "$", // Google Rich Snippet budget indicator
  currenciesAccepted: "USD, INR, EUR, GBP, AED, CAD, AUD",
  paymentAccepted: "Credit Card, Debit Card, Stripe, Bank Transfer, PayPal, UPI, Wire",
  areaServed: [
    "Worldwide",
    "India",
    "United States",
    "United Kingdom",
    "United Arab Emirates",
    "Canada",
    "Australia",
    "Germany",
    "Singapore",
  ],
  googleVerification: "6TkbjzfigeR4hnswayZI8sx7ThG2Qy2wLu-Vkl4OrmU",
  googleAnalyticsId: "G-BVLJCMCSCX",
};

/**
 * Exhaustive targeted SEO keyword cluster
 * Structured for high commercial intent, low-cost searchers, and technical buyers.
 */
export const SEO_KEYWORDS = [
  // Commercial & Transactional High-Intent (Cheap/Affordable Freelance)
  "cheap freelance web developer",
  "affordable freelance web developer",
  "hire cheap freelance developer",
  "budget friendly web developer",
  "cheap website development services",
  "low cost web developer for hire",
  "affordable custom web application development",
  "cheap freelance programmer",
  "hire freelance web developer affordable",
  "best budget web development studio",
  "cheap React developer for hire",
  "affordable Next.js developer",
  "cheap full stack developer freelance",
  "low cost ecommerce website development",
  "cheap portfolio website developer",
  "student project web developer cheap",
  "affordable startup web development",
  "fast low cost website developer",
  "affordable landing page design and development",
  "hire affordable frontend developer",
  "hire affordable backend developer",

  // Core Brand & Agency Services
  "Zyro Studios",
  "Zyro Studios freelance web developer",
  "custom web applications",
  "systems engineering",
  "Next.js web development",
  "React web development",
  "TypeScript developer freelance",
  "Tailwind CSS web development",
  "Supabase PostgreSQL development",
  "digital agency budget",
  "educational platform development",
  "pyq portal development",
  "student academic portal developer",
  "e-commerce store development",
  "custom dashboard development",
  "responsive mobile first web design",
  "high performance web engineering",
  "Core Web Vitals 100 score",
  "SEO optimized web development",
  "modern web development studio",
];

interface ConstructMetadataParams {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

/**
 * Centralized, production-grade Next.js Metadata factory
 */
export function constructMetadata({
  title,
  description = SITE_CONFIG.description,
  path = "",
  keywords = [],
  image = SITE_CONFIG.ogImage,
  type = "website",
  noIndex = false,
}: ConstructMetadataParams = {}): Metadata {
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const canonicalUrl = `${SITE_CONFIG.url}${cleanPath}`;
  const resolvedTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.brandTitle;

  const combinedKeywords = Array.from(
    new Set([...keywords, ...SEO_KEYWORDS])
  );

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: title
      ? {
          default: resolvedTitle,
          template: `%s | ${SITE_CONFIG.name}`,
        }
      : {
          default: SITE_CONFIG.brandTitle,
          template: `%s | ${SITE_CONFIG.name}`,
        },
    description,
    keywords: combinedKeywords,
    authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
    creator: `${SITE_CONFIG.founderName} (${SITE_CONFIG.name})`,
    publisher: SITE_CONFIG.name,
    formatDetection: {
      email: true,
      address: false,
      telephone: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      locale: "en_US",
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      title: resolvedTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.name} — Affordable Freelance Web Development`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [image],
      creator: "@zyrostudios",
      site: "@zyrostudios",
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    icons: {
      icon: [
        { url: "/favicon/favicon.ico" },
        { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: "/favicon/favicon.ico",
      apple: [
        { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      other: [
        { rel: "android-chrome-192x192", url: "/favicon/android-chrome-192x192.png" },
        { rel: "android-chrome-512x512", url: "/favicon/android-chrome-512x512.png" },
      ],
    },
    manifest: "/favicon/site.webmanifest",
    verification: {
      google: SITE_CONFIG.googleVerification,
    },
    category: "technology",
    classification: "Freelance Web Development & Software Engineering Services",
  };
}

/**
 * FAQ Data used for both UI and FAQPage Schema markup
 */
export const FAQ_ITEMS = [
  {
    question: "Why hire an affordable freelance web developer over an expensive agency?",
    answer:
      "Agencies charge heavy overhead fees for account managers, sales teams, and corporate margins. When working with Zyro Studios, you work directly with a senior freelance full-stack engineer who builds custom, pixel-perfect Next.js web applications at a fraction of agency pricing with significantly faster delivery.",
  },
  {
    question: "What types of websites and web apps do you develop at cheap freelance rates?",
    answer:
      "We engineer custom business websites, high-converting e-commerce stores with Stripe checkout, academic and educational portals (such as question paper repositories like PyQ Portal), personal portfolios, landing pages, and bespoke web apps with custom dashboards and database architecture.",
  },
  {
    question: "How cheap or affordable are your freelance web development packages?",
    answer:
      "We provide highly competitive and transparent budget-friendly pricing tailored to students, startups, and small businesses. Projects start from budget starter landing pages to full-stack custom web applications, delivering enterprise-grade quality at accessible rates.",
  },
  {
    question: "Can you build directly from Figma, Adobe XD, or custom UI designs?",
    answer:
      "Yes. We convert Figma, Sketch, or Adobe XD designs into clean, responsive, production-ready React and Next.js code with fluid animations, sub-second load times, and perfect Core Web Vitals.",
  },
  {
    question: "Do you handle hosting, cloud deployment, and domain setup?",
    answer:
      "Yes. We take care of end-to-end deployment on Vercel, Supabase, Cloudflare, or AWS — configuring custom domains, SSL certificates, edge CDN caching, and database migrations with zero downtime.",
  },
  {
    question: "How long does a typical project take to build and deploy?",
    answer:
      "Turnaround is exceptionally fast: budget landing pages take 3–7 days, complete business websites take 1–3 weeks, and advanced full-stack web platforms take 3–6 weeks with continuous milestone previews.",
  },
  {
    question: "Do you offer post-launch maintenance, revisions, and support?",
    answer:
      "Yes. All projects include post-launch support, performance tuning, bug fixing, and optional affordable maintenance retainers to keep your platform updated and secure.",
  },
];

/**
 * Generates Root JSON-LD Schema Graph:
 * - ProfessionalService / LocalBusiness (with priceRange "$" for cheap/affordable queries)
 * - Person (Senior Freelancer)
 * - WebSite
 * - OfferCatalog (Affordable tiers)
 * - FAQPage (Rich snippets in SERPs)
 */
export function getRootSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["ProfessionalService", "LocalBusiness"],
        "@id": `${SITE_CONFIG.url}/#organization`,
        name: SITE_CONFIG.name,
        alternateName: [
          "Zyro Studios",
          "Zyro Studios Freelance Web Developer",
          "Affordable Freelance Web Development Studio",
        ],
        url: SITE_CONFIG.url,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_CONFIG.url}/#logo`,
          url: SITE_CONFIG.logo,
          contentUrl: SITE_CONFIG.logo,
          caption: "Zyro Studios Logo",
        },
        image: SITE_CONFIG.ogImage,
        description: SITE_CONFIG.description,
        slogan: SITE_CONFIG.tagline,
        priceRange: SITE_CONFIG.priceRange,
        currenciesAccepted: SITE_CONFIG.currenciesAccepted,
        paymentAccepted: SITE_CONFIG.paymentAccepted,
        areaServed: SITE_CONFIG.areaServed.map((area) => ({
          "@type": "Place",
          name: area,
        })),
        foundingDate: "2025",
        founder: {
          "@type": "Person",
          "@id": `${SITE_CONFIG.url}/#founder`,
          name: SITE_CONFIG.founderName,
          jobTitle: SITE_CONFIG.founderRole,
          url: SITE_CONFIG.url,
          knowsAbout: [
            "Freelance Web Development",
            "Next.js App Router",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "PostgreSQL & Supabase",
            "Full Stack Software Engineering",
            "Affordable Website Development",
            "Cheap Web Design for Small Business",
            "SEO Architecture & Performance Optimization",
          ],
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Affordable Freelance Web Development Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Budget Starter Website & Portfolio",
                description:
                  "Affordable, high-speed landing page or personal portfolio built with Next.js, responsive design, and SEO tags for individuals, freelancers, and students.",
              },
              priceSpecification: {
                "@type": "PriceSpecification",
                priceCurrency: "USD",
                price: "99",
                minPrice: "99",
                description: "Starting rate for starter websites and landing pages",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Custom Full-Stack Web Application",
                description:
                  "Bespoke database-driven web applications, user authentication, interactive dashboards, and cloud backend integration at budget-friendly freelance rates.",
              },
              priceSpecification: {
                "@type": "PriceSpecification",
                priceCurrency: "USD",
                price: "299",
                minPrice: "299",
                description: "Starting rate for custom full-stack web applications",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Affordable E-Commerce Store",
                description:
                  "High-converting online store with Stripe checkout, cart engine, inventory management, and mobile-first responsive layout.",
              },
              priceSpecification: {
                "@type": "PriceSpecification",
                priceCurrency: "USD",
                price: "349",
                minPrice: "349",
                description: "Starting rate for e-commerce website development",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Educational & Student Academic Portals",
                description:
                  "Comprehensive resource hubs, question paper repositories (PYQ portals), and academic platforms built for high volume and fast search discovery.",
              },
              priceSpecification: {
                "@type": "PriceSpecification",
                priceCurrency: "USD",
                price: "199",
                minPrice: "199",
                description: "Starting rate for academic and educational platforms",
              },
            },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_CONFIG.url}/#website`,
        url: SITE_CONFIG.url,
        name: SITE_CONFIG.name,
        alternateName: "Zyro Studios - Affordable Freelance Web Developer",
        description: SITE_CONFIG.description,
        publisher: { "@id": `${SITE_CONFIG.url}/#organization` },
        inLanguage: "en-US",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_CONFIG.url}/#faq`,
        mainEntity: FAQ_ITEMS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
}

/**
 * BreadcrumbList Schema Generator for Google Search SERP trails
 */
export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

/**
 * CreativeWork / SoftwareApplication Schema for Project Case Studies
 */
export function getProjectCaseStudySchema(project: {
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  thumbnail?: string;
  liveUrl?: string;
  technologies?: string[];
  year?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    applicationCategory: project.category || "WebApplication",
    operatingSystem: "Web Browser",
    url: `${SITE_CONFIG.url}/work/${project.slug}`,
    description: project.shortDescription,
    image: project.thumbnail
      ? project.thumbnail.startsWith("http")
        ? project.thumbnail
        : `${SITE_CONFIG.url}${project.thumbnail}`
      : SITE_CONFIG.ogImage,
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
}

