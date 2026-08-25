import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/auth/admin";

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

  try {
    const rows = await query(
      `SELECT * FROM public.inquiries ORDER BY created_at DESC`
    );
    return NextResponse.json({ inquiries: rows });
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
    const { id, status, notes } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Inquiry ID is required" }, { status: 400 });
    }

    const rows = await query(
      `
      UPDATE public.inquiries 
      SET status = COALESCE($1, status), notes = COALESCE($2, notes)
      WHERE id = $3
      RETURNING *
      `,
      [status || null, notes !== undefined ? notes : null, id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry: rows[0] });
  } catch (error: any) {
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

    let idToDelete = idParam;
    if (!idToDelete) {
      const body = await req.json().catch(() => ({}));
      idToDelete = body.id;
    }

    if (!idToDelete) {
      return NextResponse.json(
        { error: "Inquiry ID is required for deletion." },
        { status: 400 }
      );
    }

    const rows = await query(
      `DELETE FROM public.inquiries WHERE id = $1 RETURNING id`,
      [idToDelete]
    );

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully.",
      deletedId: idToDelete,
    });
  } catch (error: any) {
    console.error("Delete inquiry error:", error);
    return NextResponse.json(
      { error: "Unable to delete inquiry. Please try again." },
      { status: 500 }
    );
  }
}
