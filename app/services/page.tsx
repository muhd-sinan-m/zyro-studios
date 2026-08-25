import type { Metadata } from "next";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";

export const metadata: Metadata = {
  title: "Core Services & Engineering Capabilities",
  description:
    "Explore Zyro Studios core engineering services — custom web applications, SaaS platforms, enterprise systems, e-commerce solutions, and high-converting products.",
  openGraph: {
    title: "Core Services & Engineering Capabilities | Zyro Studios",
    description:
      "Explore Zyro Studios core engineering services — custom web applications, SaaS platforms, enterprise systems, e-commerce solutions, and high-converting products.",
  },
};

export default function ServicesPage() {
  return (
    <div className="bg-[#030712] min-h-screen">
      <WhatWeBuild />
    </div>
  );
}
