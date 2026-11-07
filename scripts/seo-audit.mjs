#!/usr/bin/env node

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Zyro Studios — Automated Production SEO Audit & Analysis Tool
 * ─────────────────────────────────────────────────────────────────────────────
 * Analyzes and validates:
 * 1. Metadata completeness & length (Title, Description, Canonical, Keywords)
 * 2. OpenGraph & Twitter Card specifications
 * 3. Search engine crawler directives & Robots.txt rules
 * 4. Sitemap.xml dynamic & static routes
 * 5. Structured Data (Schema.org JSON-LD graphs, ProfessionalService, Person, FAQPage, BreadcrumbList)
 * 6. High-intent keyword targeting ("cheap freelance web developer", "affordable Next.js")
 * 7. PWA / Web Manifest compliance
 * ─────────────────────────────────────────────────────────────────────────────
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
};

let passedChecks = 0;
let totalChecks = 0;
const issues = [];

function check(title, condition, detail = "") {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ${COLORS.green}✓${COLORS.reset} ${title}`);
  } else {
    issues.push({ title, detail });
    console.log(`  ${COLORS.red}✗${COLORS.reset} ${title} ${detail ? COLORS.dim + "(" + detail + ")" + COLORS.reset : ""}`);
  }
}

function heading(text) {
  console.log(`\n${COLORS.bold}${COLORS.cyan}▶ ${text}${COLORS.reset}`);
}

console.log(`\n${COLORS.bold}================================================================${COLORS.reset}`);
console.log(`${COLORS.bold}   ZYRO STUDIOS — FREELANCE SEO AUDIT & RANKING OPTIMIZER       ${COLORS.reset}`);
console.log(`${COLORS.bold}================================================================${COLORS.reset}`);

// 1. Check SEO Core Config
heading("1. Centralized SEO Package (lib/seo.ts)");
const seoLibPath = path.join(rootDir, "lib", "seo.ts");
const seoLibExists = fs.existsSync(seoLibPath);
check("lib/seo.ts exists", seoLibExists);

if (seoLibExists) {
  const seoContent = fs.readFileSync(seoLibPath, "utf-8");
  check("SITE_CONFIG defined", seoContent.includes("export const SITE_CONFIG"));
  check("Canonical base URL is HTTPS", seoContent.includes('"https://zyrostudios.vercel.app"'));
  check("Price range configured for budget ranking ('$')", seoContent.includes('priceRange: "$"'));
  check("OpenGraph image specified", seoContent.includes("ogImage:"));
  check("Google Search Console verification token configured", seoContent.includes("googleVerification:"));
  check("SEO Keywords array contains 'cheap freelance web developer'", seoContent.includes("cheap freelance web developer"));
  check("SEO Keywords array contains 'affordable freelance web developer'", seoContent.includes("affordable freelance web developer"));
  check("SEO Keywords array contains 'Next.js'", seoContent.includes("Next.js"));
  check("constructMetadata factory exported", seoContent.includes("export function constructMetadata"));
  check("getRootSchemaGraph JSON-LD generator exported", seoContent.includes("export function getRootSchemaGraph"));
  check("FAQPage Schema.org generator included", seoContent.includes('"@type": "FAQPage"'));
  check("ProfessionalService / LocalBusiness Schema.org included", seoContent.includes('"ProfessionalService"') && seoContent.includes('"LocalBusiness"'));
  check("Person Schema.org (Freelancer) included", seoContent.includes('"@type": "Person"'));
  check("BreadcrumbList Schema.org generator exported", seoContent.includes("getBreadcrumbSchema"));
  check("Project / SoftwareApplication Schema.org generator exported", seoContent.includes("getProjectCaseStudySchema"));
  check("Social profiles (sameAs) configured in Schema", seoContent.includes("sameAs:"));
}

// 2. Robots & Sitemap
heading("2. Technical SEO Crawlability (Robots & Sitemap)");
const robotsPath = path.join(rootDir, "app", "robots.ts");
const sitemapPath = path.join(rootDir, "app", "sitemap.ts");

check("app/robots.ts exists", fs.existsSync(robotsPath));
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, "utf-8");
  check("Robots.txt points to sitemap.xml", robotsContent.includes("sitemap.xml"));
  check("Robots.txt disallows admin paths (/admin, /api/admin)", robotsContent.includes("/admin") && robotsContent.includes("/api/admin"));
  check("Robots.txt allows public routes", robotsContent.includes("/services") && robotsContent.includes("/work"));
}

check("app/sitemap.ts exists", fs.existsSync(sitemapPath));
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
  check("Sitemap includes home page with priority 1.0", sitemapContent.includes("priority: 1") || sitemapContent.includes("priority: 1.0"));
  check("Sitemap includes core pages (services, work, contact, about, process)", 
    sitemapContent.includes("/services") && 
    sitemapContent.includes("/work") && 
    sitemapContent.includes("/contact") && 
    sitemapContent.includes("/about") && 
    sitemapContent.includes("/process")
  );
  check("Sitemap dynamically indexes project case studies", sitemapContent.includes("/work/${slug}") || sitemapContent.includes("/work/"));
}

// 3. Web App Manifest & AI Engine Discovery
heading("3. Web App Manifest & AI Engine Discovery");
const manifestPathFavicon = path.join(rootDir, "public", "favicon", "site.webmanifest");
const manifestPathRoot = path.join(rootDir, "public", "site.webmanifest");
const llmsPath = path.join(rootDir, "public", "llms.txt");

check("public/favicon/site.webmanifest exists", fs.existsSync(manifestPathFavicon));
check("public/site.webmanifest exists", fs.existsSync(manifestPathRoot));
check("public/llms.txt exists (Perplexity / ChatGPT Search discovery)", fs.existsSync(llmsPath));

if (fs.existsSync(manifestPathFavicon)) {
  try {
    const manifestJson = JSON.parse(fs.readFileSync(manifestPathFavicon, "utf-8"));
    check("Manifest has valid name", Boolean(manifestJson.name));
    check("Manifest has valid icons array", Array.isArray(manifestJson.icons) && manifestJson.icons.length > 0);
    check("Manifest has theme_color", Boolean(manifestJson.theme_color));
  } catch (err) {
    check("Manifest is valid JSON", false, err.message);
  }
}

// 4. Page Meta Tags & Semantic Structure
heading("4. Page Metadata & On-Page SEO");
const pagesToCheck = [
  { name: "Root Layout", path: path.join(rootDir, "app", "layout.tsx"), checkLd: true },
  { name: "Home Page", path: path.join(rootDir, "app", "page.tsx") },
  { name: "Services Page", path: path.join(rootDir, "app", "services", "page.tsx"), checkBreadcrumbs: true },
  { name: "Work Layout", path: path.join(rootDir, "app", "work", "layout.tsx"), checkBreadcrumbs: true },
  { name: "Work Dynamic Slug", path: path.join(rootDir, "app", "work", "[slug]", "page.tsx"), checkBreadcrumbs: true, checkLd: true },
  { name: "About Page", path: path.join(rootDir, "app", "about", "page.tsx"), checkBreadcrumbs: true },
  { name: "Process Page", path: path.join(rootDir, "app", "process", "page.tsx"), checkBreadcrumbs: true },
  { name: "Contact Page", path: path.join(rootDir, "app", "contact", "page.tsx"), checkBreadcrumbs: true },
];

for (const p of pagesToCheck) {
  const exists = fs.existsSync(p.path);
  check(`${p.name} file exists`, exists);
  if (exists) {
    const content = fs.readFileSync(p.path, "utf-8");
    check(`${p.name} uses constructMetadata or metadata`, content.includes("constructMetadata") || content.includes("Metadata"));
    if (p.checkBreadcrumbs) {
      check(`${p.name} injects BreadcrumbList JSON-LD`, content.includes("getBreadcrumbSchema") || content.includes("application/ld+json"));
    }
    if (p.checkLd) {
      check(`${p.name} injects Structured Data JSON-LD`, content.includes("application/ld+json"));
    }
  }
}

// 5. On-page Heading & Keyword Density Check
heading("5. Semantic HTML & Keyword Targeting");
const heroComponentPath = path.join(rootDir, "components", "hero", "ScrollHero.tsx");
if (fs.existsSync(heroComponentPath)) {
  const heroContent = fs.readFileSync(heroComponentPath, "utf-8");
  check("Hero has semantic <h1> tag for desktop search indexing", heroContent.includes("<h1") && heroContent.includes("Affordable Freelance Web Developer"));
  check("Hero has semantic <h1> tag for mobile search indexing", heroContent.includes("<h1") && heroContent.includes("Full-Stack Web Applications"));
  check("Hero background images have descriptive alt text", heroContent.includes('alt="Zyro Studios — Affordable Freelance Web Development'));
}

const faqComponentPath = path.join(rootDir, "components", "sections", "FAQ.tsx");
if (fs.existsSync(faqComponentPath)) {
  const faqContent = fs.readFileSync(faqComponentPath, "utf-8");
  check("FAQ component synchronizes directly with FAQ_ITEMS from SEO package", faqContent.includes("FAQ_ITEMS"));
}

const footerComponentPath = path.join(rootDir, "components", "footer", "Footer.tsx");
if (fs.existsSync(footerComponentPath)) {
  const footerContent = fs.readFileSync(footerComponentPath, "utf-8");
  check("Footer contains sitewide internal links for crawler PageRank flow", 
    footerContent.includes("/services") && 
    footerContent.includes("/work") && 
    footerContent.includes("/contact")
  );
}

// Summary Score
const score = Math.round((passedChecks / totalChecks) * 100);
console.log(`\n${COLORS.bold}================================================================${COLORS.reset}`);
console.log(`${COLORS.bold}   SEO AUDIT SCORE: ${score === 100 ? COLORS.green : COLORS.yellow}${score}%${COLORS.reset} (${passedChecks}/${totalChecks} checks passed)`);
console.log(`${COLORS.bold}================================================================${COLORS.reset}`);

if (issues.length > 0) {
  console.log(`\n${COLORS.yellow}Items to review:${COLORS.reset}`);
  issues.forEach((iss) => console.log(` - ${iss.title} ${iss.detail ? `(${iss.detail})` : ""}`));
  process.exit(1);
} else {
  console.log(`\n${COLORS.green}✨ Outstanding! All SEO packages, meta tags, and structured schemas are production-ready.${COLORS.reset}\n`);
  process.exit(0);
}

