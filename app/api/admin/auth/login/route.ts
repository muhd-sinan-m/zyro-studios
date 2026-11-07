import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, DEFAULT_ADMIN, verifyPassword } from "@/lib/auth/admin";

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
      email: "",
      name: DEFAULT_ADMIN.name,
      role: DEFAULT_ADMIN.role,
    };

    const requestedEmail = email.trim().toLowerCase();
    const envAdminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const envAdminPassword = process.env.ADMIN_PASSWORD || "";

    // 1. Database admin check takes absolute precedence to prevent zombie credential bypass
    let userFoundInDb = false;
    let dbHasAnyUsers = false;

    try {
      const { query: dbQuery } = await import("@/lib/db");
      const rows = await dbQuery(
        `SELECT * FROM public.admin_users WHERE email = $1 LIMIT 1`,
        [requestedEmail]
      );

      if (rows.length > 0) {
        userFoundInDb = true;
        // Verify exclusively against database password hash
        if (await verifyPassword(password, rows[0].password_hash)) {
          isValid = true;
          userPayload = {
            email: rows[0].email,
            name: rows[0].name || DEFAULT_ADMIN.name,
            role: rows[0].role || DEFAULT_ADMIN.role,
          };
        }
      } else {
        // Check if there are any other admin users in DB
        const countRes = await dbQuery(`SELECT COUNT(*)::int as count FROM public.admin_users`);
        dbHasAnyUsers = (countRes[0]?.count ?? 0) > 0;
      }
    } catch (err) {
      console.error("DB admin auth check error:", err);
    }

    // 2. Safe bootstrap fallback: ONLY allowed if user is not in DB AND the DB has zero registered admin users
    if (!isValid && !userFoundInDb && !dbHasAnyUsers) {
      if (
        envAdminEmail &&
        envAdminPassword &&
        requestedEmail === envAdminEmail &&
        (await verifyPassword(password, envAdminPassword))
      ) {
        isValid = true;
        userPayload = {
          email: envAdminEmail,
          name: DEFAULT_ADMIN.name,
          role: DEFAULT_ADMIN.role,
        };
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
