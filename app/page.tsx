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

export const metadata: Metadata = {
  title: "Zyro Studios | High-Performance Engineering & Digital Products",
  description:
    "Zyro Studios designs, engineers, and deploys high-performance web applications, enterprise software, and scalable digital systems.",
  openGraph: {
    title: "Zyro Studios | High-Performance Engineering & Digital Products",
    description:
      "Zyro Studios designs, engineers, and deploys high-performance web applications, enterprise software, and scalable digital systems.",
  },
};

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
