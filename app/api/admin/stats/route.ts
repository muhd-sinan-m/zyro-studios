import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  const session = await verifyAdminRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let totalInquiries = 0;
  let unreadInquiries = 0;
  let totalProjects = 1; // Includes baseline PyQ Portal
  let isDbConnected = true;

  try {
    // Single batched query for all statistics in 1 database roundtrip
    const rows = await query(`
      SELECT 
        (SELECT COUNT(*) FROM public.inquiries) as total_inquiries,
        (SELECT COUNT(*) FROM public.inquiries WHERE status = 'unread') as unread_inquiries,
        (SELECT COUNT(*) FROM public.projects) as total_projects
    `);

    totalInquiries = parseInt(rows[0]?.total_inquiries || "0", 10);
    unreadInquiries = parseInt(rows[0]?.unread_inquiries || "0", 10);
    totalProjects += parseInt(rows[0]?.total_projects || "0", 10);
  } catch (e) {
    console.error("Stats query error:", e);
    isDbConnected = false;
  }

  return NextResponse.json({
    stats: {
      totalInquiries,
      unreadInquiries,
      totalProjects,
      activeProjects: totalProjects,
      isDbConnected,
      supabaseHost: "aws-0-ap-southeast-1.pooler.supabase.com",
      storageBucket: "project-assets",
    },
  });
}
