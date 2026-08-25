import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Selected Work & Portfolio | System Showcase",
  description:
    "Explore featured engineering projects built by Zyro Studios, including PyQ Portal and high-performance digital applications.",
  openGraph: {
    title: "Selected Work & Portfolio | Zyro Studios",
    description:
      "Explore featured engineering projects built by Zyro Studios, including PyQ Portal and high-performance digital applications.",
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
