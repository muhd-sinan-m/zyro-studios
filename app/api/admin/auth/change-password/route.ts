import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth/admin";
import { query } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await verifyAdminRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both current and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const envAdminPassword = process.env.ADMIN_PASSWORD || "";
    let isCurrentValid = false;

    // Check env password
    if (envAdminPassword && currentPassword === envAdminPassword) {
      isCurrentValid = true;
    } else {
      // Check admin_users DB table
      try {
        const rows = await query(
          `SELECT * FROM public.admin_users WHERE email = $1 LIMIT 1`,
          [session.email]
        );
        if (rows.length > 0 && rows[0].password_hash === currentPassword) {
          isCurrentValid = true;
        }
      } catch (err) {
        console.error("DB password check error:", err);
      }
    }

    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    // 1. Update database table
    try {
      await query(
        `
        UPDATE public.admin_users 
        SET password_hash = $1, updated_at = NOW()
        WHERE email = $2
        `,
        [newPassword, session.email]
      );
    } catch (dbErr) {
      console.error("Failed to update password in DB:", dbErr);
    }

    // 2. Update .env.local file if present
    try {
      const envPath = path.join(process.cwd(), ".env.local");
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, "utf8");
        if (envContent.includes("ADMIN_PASSWORD=")) {
          envContent = envContent.replace(
            /ADMIN_PASSWORD=.*/g,
            `ADMIN_PASSWORD="${newPassword}"`
          );
          fs.writeFileSync(envPath, envContent, "utf8");
        }
      }
    } catch (fsErr) {
      console.error("Failed to update .env.local password:", fsErr);
    }

    return NextResponse.json({
      success: true,
      message: "Admin password changed successfully!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to change password." },
      { status: 500 }
    );
  }
}
