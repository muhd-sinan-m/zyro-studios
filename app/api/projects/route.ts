import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/auth/admin";
import { deleteProjectAsset } from "@/lib/storage/s3";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const includeAll = searchParams.get("all") === "true";

  let dbProjects: any[] = [];
  try {
    const sql = includeAll
      ? `SELECT * FROM public.projects ORDER BY created_at ASC, id ASC`
      : `SELECT * FROM public.projects WHERE status != 'archived' ORDER BY created_at ASC, id ASC`;
    dbProjects = await query(sql);
  } catch (err) {
    console.error("Error fetching projects from DB:", err);
  }

  // Transform db format to Project schema (without results and technologies)
  const formattedDbProjects = dbProjects.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    shortDescription: p.short_description,
    fullDescription: p.full_description || p.short_description,
    features: Array.isArray(p.features) ? p.features : [],
    thumbnail: p.thumbnail_url || (Array.isArray(p.screenshots) && p.screenshots[0]) || "",
    modalImage: p.modal_image_url || p.thumbnail_url || (Array.isArray(p.screenshots) && p.screenshots[1]) || "",
    screenshots: Array.isArray(p.screenshots) ? p.screenshots : [],
    liveUrl: p.live_url || "",
    year: p.year || 2026,
    featured: Boolean(p.featured),
    status: p.status || "live",
    problemStatement: p.problem_statement || "",
    solution: p.solution || "",
    client: p.client || "",
    createdAt: p.created_at,
  }));

  return NextResponse.json({ projects: formattedDbProjects });
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      category,
      shortDescription,
      fullDescription,
      features,
      thumbnailUrl,
      modalImageUrl,
      screenshots,
      liveUrl,
      year,
      featured,
      status,
      problemStatement,
      solution,
      client,
    } = body;

    if (!title || !category || !shortDescription) {
      return NextResponse.json(
        { error: "Title, Category, and Short Description are required" },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug?.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const rows = await query(
      `
      INSERT INTO public.projects (
        title, slug, category, short_description, full_description,
        features, thumbnail_url, modal_image_url, screenshots, live_url,
        year, featured, status, problem_statement, solution, client
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
      `,
      [
        title,
        generatedSlug,
        category,
        shortDescription,
        fullDescription || shortDescription,
        JSON.stringify(Array.isArray(features) ? features : []),
        thumbnailUrl || (Array.isArray(screenshots) ? screenshots[0] : null),
        modalImageUrl || thumbnailUrl || null,
        JSON.stringify(Array.isArray(screenshots) ? screenshots : []),
        liveUrl || null,
        Number(year) || 2026,
        Boolean(featured),
        status || "live",
        problemStatement || null,
        solution || null,
        client || null,
      ]
    );

    return NextResponse.json({ success: true, project: rows[0] });
  } catch (error: any) {
    console.error("Project insert error:", error);
    return NextResponse.json(
      { error: "Unable to create project. Please try again." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await verifyAdminRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      id,
      title,
      slug,
      category,
      shortDescription,
      fullDescription,
      features,
      thumbnailUrl,
      modalImageUrl,
      screenshots,
      liveUrl,
      year,
      featured,
      status,
      problemStatement,
      solution,
      client,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const rows = await query(
      `
      UPDATE public.projects
      SET
        title = COALESCE($1, title),
        slug = COALESCE($2, slug),
        category = COALESCE($3, category),
        short_description = COALESCE($4, short_description),
        full_description = COALESCE($5, full_description),
        features = CASE WHEN $6::jsonb IS NOT NULL THEN $6::jsonb ELSE features END,
        thumbnail_url = COALESCE($7, thumbnail_url),
        modal_image_url = COALESCE($8, modal_image_url),
        screenshots = CASE WHEN $9::jsonb IS NOT NULL THEN $9::jsonb ELSE screenshots END,
        live_url = COALESCE($10, live_url),
        year = COALESCE($11, year),
        featured = COALESCE($12, featured),
        status = COALESCE($13, status),
        problem_statement = COALESCE($14, problem_statement),
        solution = COALESCE($15, solution),
        client = COALESCE($16, client),
        updated_at = now()
      WHERE id::text = $17 OR slug = $17
      RETURNING *
      `,
      [
        title || null,
        slug || null,
        category || null,
        shortDescription || null,
        fullDescription || null,
        features ? JSON.stringify(features) : null,
        thumbnailUrl || null,
        modalImageUrl || null,
        screenshots ? JSON.stringify(screenshots) : null,
        liveUrl || null,
        year ? Number(year) : null,
        featured !== undefined ? featured : null,
        status || null,
        problemStatement || null,
        solution || null,
        client || null,
        id,
      ]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: rows[0] });
  } catch (error: any) {
    console.error("Project update error:", error);
    return NextResponse.json(
      { error: "Unable to update project. Please try again." },
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Clean up assets from Supabase Storage
    const existing = await query(`SELECT thumbnail_url, modal_image_url FROM public.projects WHERE id::text = $1 OR slug = $1`, [id]);
    if (existing.length > 0) {
      if (existing[0].thumbnail_url) await deleteProjectAsset(existing[0].thumbnail_url);
      if (existing[0].modal_image_url) await deleteProjectAsset(existing[0].modal_image_url);
    }

    await query(`DELETE FROM public.projects WHERE id::text = $1 OR slug = $1`, [id]);
    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Unable to delete project. Please try again." },
      { status: 500 }
    );
  }
}
