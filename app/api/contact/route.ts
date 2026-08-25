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

    // Log to console (replace with Supabase when ready)
    console.log("━━━ New Project Inquiry ━━━");
    console.log(`Name: ${data.name}`);
    console.log(`Email: ${data.email}`);
    console.log(`Phone: ${data.phone ?? "—"}`);
    console.log(`Company: ${data.company ?? "—"}`);
    console.log(`Project Type: ${data.projectType}`);
    console.log(`Budget: ${data.budget ?? "—"}`);
    console.log(`Timeline: ${data.timeline ?? "—"}`);
    console.log(`Description:\n${data.description}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // TODO: Replace with Supabase insert when credentials are available:
    // const supabase = createSupabaseServerClient();
    // await supabase.from("project_inquiries").insert({ ...data, status: "new" });

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
