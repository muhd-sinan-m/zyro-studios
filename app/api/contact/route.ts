import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional(),
  company: z.string().max(100).optional(),
  projectType: z.string().min(1, "Project type is required"),
  description: z.string().min(20, "Please provide more detail").max(2000),
  budget: z.string().max(50).optional(),
  timeline: z.string().max(50).optional(),
});

// Simple in-memory rate limiting (resets on server restart — use Upstash for production)
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3;

function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0].trim() ?? "unknown";
}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const key = getRateLimitKey(req);
    const now = Date.now();
    const record = rateLimit.get(key);

    if (record && now < record.resetAt) {
      if (record.count >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
      record.count++;
    } else {
      rateLimit.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    }

    // Parse body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    // Validate
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: result.error.issues },
        { status: 422 }
      );
    }

    const data = result.data;

    // Secure database storage with parameterized query; never log raw PII to server stdout
    try {
      const { query } = await import("@/lib/db");
      const { invalidateCache } = await import("@/lib/cache");
      await query(
        `
        INSERT INTO public.inquiries (project_type, timeline, name, email, phone, company, details, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'unread')
        `,
        [
          data.projectType,
          data.timeline || "Flexible",
          data.name,
          data.email,
          data.phone || "",
          data.company || "",
          data.description + (data.budget ? ` [Budget: ${data.budget}]` : ""),
        ]
      );
      // Invalidate cache immediately so new inquiry appears live on admin dashboard without reload
      invalidateCache(["inquiries:all", "admin:stats"]);
    } catch (dbErr) {
      // In case database connection is unreachable, log masked error without exposing user PII
      console.error("Inquiry database insert error:", (dbErr as Error).message);
    }

    return NextResponse.json(
      { success: true, message: "Your inquiry has been received." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
