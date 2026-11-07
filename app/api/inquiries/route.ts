import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/auth/admin";
import { getCachedOrFetch, invalidateCache } from "@/lib/cache";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5; // Max 5 submissions per 15 mins per IP

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0].trim() || "127.0.0.1";
}

export async function POST(req: NextRequest) {
  try {
    // Rate Limiting Security Check
    const ip = getClientIp(req);
    const now = Date.now();
    const limit = rateLimitMap.get(ip);

    if (limit && now < limit.resetAt) {
      if (limit.count >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: "Too many submission attempts. Please try again in a few minutes." },
          { status: 429 }
        );
      }
      limit.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    }

    const body = await req.json();
    const { projectType, timeline, name, email, phone, company, details } = body;

    if (!name || !email || !phone || !details || !projectType) {
      return NextResponse.json(
        { error: "Please fill in all required fields including your phone number." },
        { status: 400 }
      );
    }

    const rows = await query(
      `
      INSERT INTO public.inquiries (project_type, timeline, name, email, phone, company, details, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'unread')
      RETURNING id, created_at
      `,
      [projectType, timeline || "Flexible", name, email, phone, company || "", details]
    );

    // Invalidate cache immediately so new inquiry appears live on admin dashboard without reload
    invalidateCache(["inquiries:all", "admin:stats"]);

    return NextResponse.json({
      success: true,
      message: "Inquiry received successfully! Our team will contact you within 24 hours.",
      id: rows[0]?.id,
    });
  } catch (error: any) {
    console.error("Inquiry insert error:", error);
    return NextResponse.json(
      { error: "Unable to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await verifyAdminRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ifNoneMatch = req.headers.get("if-none-match");

  try {
    const result = await getCachedOrFetch(
      "inquiries:all",
      async () => {
        return await query(`SELECT * FROM public.inquiries ORDER BY created_at DESC`);
      },
      { ttlMs: 15000, ifNoneMatch }
    );

    if (result.notModified) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: result.etag,
          "Cache-Control": "private, no-cache",
        },
      });
    }

    return NextResponse.json(
      { inquiries: result.data },
      {
        headers: {
          ETag: result.etag,
          "Cache-Control": "private, no-cache",
          "X-Cache": result.isCached ? "HIT" : "MISS",
        },
      }
    );
  } catch (error: any) {
    console.error("Fetch inquiries error:", error);
    return NextResponse.json({ inquiries: [] });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await verifyAdminRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, ids: rawIds, status, notes } = await req.json();
    const targetIds = Array.isArray(rawIds) ? rawIds : (id ? [id] : []);

    if (targetIds.length === 0) {
      return NextResponse.json({ error: "Inquiry ID or IDs array is required" }, { status: 400 });
    }

    // Batch update using ANY($3::uuid[]) to eliminate N+1 queries
    const rows = await query(
      `
      UPDATE public.inquiries 
      SET status = COALESCE($1, status), notes = COALESCE($2, notes)
      WHERE id = ANY($3::uuid[])
      RETURNING *
      `,
      [status || null, notes !== undefined ? notes : null, targetIds]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "No matching inquiries found to update" }, { status: 404 });
    }

    invalidateCache(["inquiries:all", "admin:stats"]);

    return NextResponse.json({
      success: true,
      updatedCount: rows.length,
      inquiries: rows,
      inquiry: rows[0],
    });
  } catch (error: any) {
    console.error("Update inquiry error:", error);
    return NextResponse.json(
      { error: "Unable to update inquiry. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await verifyAdminRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const body = await req.json().catch(() => ({}));
    const targetIds = Array.isArray(body.ids)
      ? body.ids
      : (body.id ? [body.id] : (idParam ? [idParam] : []));

    if (targetIds.length === 0) {
      return NextResponse.json(
        { error: "Inquiry ID or IDs array is required for deletion." },
        { status: 400 }
      );
    }

    // Batch delete using ANY($1::uuid[]) to eliminate N+1 queries
    const rows = await query(
      `DELETE FROM public.inquiries WHERE id = ANY($1::uuid[]) RETURNING id`,
      [targetIds]
    );

    invalidateCache(["inquiries:all", "admin:stats"]);

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${rows.length} inquiry(s).`,
      deletedCount: rows.length,
      deletedIds: rows.map((r: any) => r.id),
    });
  } catch (error: any) {
    console.error("Delete inquiry error:", error);
    return NextResponse.json(
      { error: "Unable to delete inquiry. Please try again." },
      { status: 500 }
    );
  }
}
