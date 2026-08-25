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
    const inqRows = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'unread' THEN 1 END) as unread
      FROM public.inquiries
    `);
    
    const projRows = await query(`
      SELECT COUNT(*) as total FROM public.projects
    `);

    totalInquiries = parseInt(inqRows[0]?.total || "0", 10);
    unreadInquiries = parseInt(inqRows[0]?.unread || "0", 10);
    totalProjects += parseInt(projRows[0]?.total || "0", 10);
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
