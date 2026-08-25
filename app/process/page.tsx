import type { Metadata } from "next";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";

export const metadata: Metadata = {
  title: "Engineering Process & Workflow",
  description:
    "Discover the 5-phase engineering workflow at Zyro Studios — from discovery and architecture design to automated deployment and continuous iteration.",
  openGraph: {
    title: "Engineering Process & Workflow | Zyro Studios",
    description:
      "Discover the 5-phase engineering workflow at Zyro Studios — from discovery and architecture design to automated deployment and continuous iteration.",
  },
};

export default function ProcessPage() {
  return (
    <div className="bg-[#030712] min-h-screen">
      <ProcessTimeline />
    </div>
  );
}
