import type { Metadata } from "next";
import { AboutStudio } from "@/components/sections/AboutStudio";

export const metadata: Metadata = {
  title: "About Us | Engineering Excellence & Digital Products",
  description:
    "Learn about Zyro Studios — a systems engineering & software studio building high-performance applications, cloud platforms, and conversion-focused products.",
  openGraph: {
    title: "About Us | Engineering Excellence & Digital Products",
    description:
      "Learn about Zyro Studios — a systems engineering & software studio building high-performance applications, cloud platforms, and conversion-focused products.",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#030712] min-h-screen">
      <AboutStudio />
    </div>
  );
}
