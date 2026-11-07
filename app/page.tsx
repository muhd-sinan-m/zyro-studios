import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";
import { WhyZyro } from "@/components/sections/WhyZyro";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { TechStack } from "@/components/sections/TechStack";
import { AboutStudio } from "@/components/sections/AboutStudio";
import { FAQ } from "@/components/sections/FAQ";
import { ContactForm } from "@/components/sections/ContactForm";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Affordable Freelance Web Developer & Custom Web Apps",
  description:
    "Hire an affordable freelance web developer. Zyro Studios designs, builds, and deploys high-performance Next.js websites, custom web apps, e-commerce stores, and academic portals at cheap, budget-friendly prices. Fast delivery, 100% custom code.",
  path: "/",
  keywords: [
    "cheap freelance web developer",
    "affordable freelance web developer",
    "hire cheap web developer",
    "cheap custom website developer",
    "budget friendly web development",
    "freelance Next.js developer",
    "affordable React developer for hire",
    "cheap full stack developer",
    "low cost website development",
    "student project web developer cheap",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatWeBuild />
      <WhyZyro />
      <FeaturedWork />
      <ContactForm />
      <ProcessTimeline />
      <TechStack />
      <AboutStudio />
      <FAQ />
    </>
  );
}
