import React from "react";
import { getAdminSession } from "@/lib/auth/admin";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Command Center | Zyro Studios",
  description: "Executive control panel for project showcasing and client lead management.",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <div
      className="flex h-screen flex-col font-sans antialiased overflow-hidden"
      style={{ backgroundColor: "#f8fafc", color: "#0f172a" }}
    >
      {session ? (
        <>
          <AdminNavbar
            userName={session.name || "Zyro Lead Admin"}
            userRole={session.role || "superadmin"}
          />
          <div className="flex flex-1 overflow-hidden min-h-0">
            <AdminSidebar dbConnected={true} storageBucket="project-assets" />
            <main
              className="flex-1 overflow-y-auto"
              style={{
                backgroundColor: "#f8fafc",
                color: "#0f172a",
                padding: "36px 48px 48px 48px",
              }}
            >
              <div className="max-w-6xl w-full">{children}</div>
            </main>
          </div>
        </>
      ) : (
        // Not logged in — render children (e.g. login page)
        <div
          className="min-h-screen flex items-center justify-center p-4"
          style={{ backgroundColor: "#f8fafc", color: "#0f172a" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
