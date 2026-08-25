import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const JWT_SECRET_STRING = process.env.ADMIN_JWT_SECRET || "";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL || "",
  password: process.env.ADMIN_PASSWORD || "",
  name: "Zyro Lead Admin",
  role: "superadmin",
};

export interface AdminSession {
  email: string;
  name: string;
  role: string;
}

export async function verifyPassword(password: string, hashOrPlain: string): Promise<boolean> {
  if (!password || !hashOrPlain) return false;

  // Check if hashOrPlain is a bcrypt hash
  if (hashOrPlain.startsWith("$2a$") || hashOrPlain.startsWith("$2b$")) {
    return await bcrypt.compare(password, hashOrPlain);
  }

  // Fallback constant-time string comparison for env password
  const a = Buffer.from(password);
  const b = Buffer.from(hashOrPlain);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function createAdminToken(payload: AdminSession): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    // Cryptographically verify signature using HS256 HMAC-SHA256 strictly (prevents alg:none forgery)
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (!payload.email || !payload.role) return null;

    return {
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("zyro_admin_session")?.value;
  if (!token) return null;
  return await verifyAdminToken(token);
}

export async function verifyAdminRequest(req: NextRequest): Promise<AdminSession | null> {
  const cookieToken = req.cookies.get("zyro_admin_session")?.value;
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  const token = cookieToken || bearerToken;
  if (!token) return null;
  return await verifyAdminToken(token);
}
