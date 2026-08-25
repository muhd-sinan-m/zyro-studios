import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, verifyPassword, hashPassword } from "@/lib/auth/admin";
import { query } from "@/lib/db";

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

    // Check env password using constant-time comparison
    if (envAdminPassword && (await verifyPassword(currentPassword, envAdminPassword))) {
      isCurrentValid = true;
    } else {
      // Check admin_users DB table
      try {
        const rows = await query(
          `SELECT * FROM public.admin_users WHERE email = $1 LIMIT 1`,
          [session.email]
        );
        if (rows.length > 0 && (await verifyPassword(currentPassword, rows[0].password_hash))) {
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

    // Hash the new password using bcrypt
    const hashedPassword = await hashPassword(newPassword);

    // Update database admin_users table (or insert if env admin)
    try {
      const existing = await query(
        `SELECT id FROM public.admin_users WHERE email = $1 LIMIT 1`,
        [session.email]
      );

      if (existing.length > 0) {
        await query(
          `
          UPDATE public.admin_users 
          SET password_hash = $1, updated_at = NOW()
          WHERE email = $2
          `,
          [hashedPassword, session.email]
        );
      } else {
        await query(
          `
          INSERT INTO public.admin_users (email, name, role, password_hash)
          VALUES ($1, $2, 'superadmin', $3)
          `,
          [session.email, session.name || "Zyro Admin", hashedPassword]
        );
      }
    } catch (dbErr) {
      console.error("Failed to update password in DB:", dbErr);
      return NextResponse.json(
        { error: "Failed to persist password update." },
        { status: 500 }
      );
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
