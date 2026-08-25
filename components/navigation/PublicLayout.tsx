"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import MouseEffects from "@/components/effects/MouseEffects";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <MouseEffects color="#38bdf8" interactionMode="sniper" />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
