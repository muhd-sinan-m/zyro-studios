import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, DEFAULT_ADMIN } from "@/lib/auth/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const loginRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const LOGIN_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const LOGIN_RATE_LIMIT_MAX = 5; // Max 5 attempts per 15 mins per IP

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0].trim() || "127.0.0.1";
}

export async function POST(req: NextRequest) {
  try {
    // Brute-force protection rate limit
    const ip = getClientIp(req);
    const now = Date.now();
    const limit = loginRateLimitMap.get(ip);

    if (limit && now < limit.resetAt) {
      if (limit.count >= LOGIN_RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: "Too many login attempts. Account temporarily locked for 15 minutes." },
          { status: 429 }
        );
      }
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    let isValid = false;
    let userPayload = {
      email: DEFAULT_ADMIN.email,
      name: DEFAULT_ADMIN.name,
      role: DEFAULT_ADMIN.role,
    };

    const envAdminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const envAdminPassword = process.env.ADMIN_PASSWORD || "";

    if (
      envAdminEmail &&
      envAdminPassword &&
      email.trim().toLowerCase() === envAdminEmail &&
      password === envAdminPassword
    ) {
      isValid = true;
      userPayload.email = envAdminEmail;
    } else {
      // Check database admin_users table
      try {
        const { query: dbQuery } = await import("@/lib/db");
        const rows = await dbQuery(
          `SELECT * FROM public.admin_users WHERE email = $1 LIMIT 1`,
          [email.trim().toLowerCase()]
        );
        if (rows.length > 0 && rows[0].password_hash === password) {
          isValid = true;
          userPayload = {
            email: rows[0].email,
            name: rows[0].name,
            role: rows[0].role,
          };
        }
      } catch (err) {
        console.error("DB admin auth check error:", err);
      }
    }

    if (!isValid) {
      // Record failed attempt
      const current = loginRateLimitMap.get(ip);
      if (current && now < current.resetAt) {
        current.count++;
      } else {
        loginRateLimitMap.set(ip, { count: 1, resetAt: now + LOGIN_RATE_LIMIT_WINDOW });
      }

      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    // Reset rate limit counter on successful login
    loginRateLimitMap.delete(ip);

    const token = await createAdminToken(userPayload);

    const response = NextResponse.json({
      success: true,
      user: userPayload,
    });

    // Set secure HTTP-only cookie
    response.cookies.set("zyro_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
