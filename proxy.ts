import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.trim().length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[SECURITY CRITICAL] ADMIN_JWT_SECRET must be configured and at least 32 characters."
      );
    }
    return new TextEncoder().encode(
      secret || "zyro_studios_development_jwt_secret_min_32_characters_long_key"
    );
  }
  return new TextEncoder().encode(secret);
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes except the login page and login API
  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    !pathname.startsWith("/api/admin/auth")
  ) {
    const token = req.cookies.get("zyro_admin_session")?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secret = getJwtSecret();
      await jwtVerify(token, secret, { algorithms: ["HS256"] });
      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
