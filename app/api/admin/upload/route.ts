import { NextRequest, NextResponse } from "next/server";
import { uploadProjectAsset, deleteProjectAsset } from "@/lib/storage/s3";
import { verifyAdminRequest } from "@/lib/auth/admin";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/avif",
]);

const ALLOWED_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "avif"]);

export async function POST(req: NextRequest) {
  const session = await verifyAdminRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folderInput = formData.get("folder") as string | null;
    const oldUrl = formData.get("oldUrl") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Validate file size (10MB limit)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds maximum limit of 10MB." },
        { status: 400 }
      );
    }

    // 2. Validate MIME type
    const mimeType = (file.type || "").toLowerCase().trim();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PNG, JPEG, WEBP, and AVIF images are allowed." },
        { status: 400 }
      );
    }

    // 3. Validate File Extension
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_EXTENSIONS.has(fileExt)) {
      return NextResponse.json(
        { error: "Invalid file extension." },
        { status: 400 }
      );
    }

    const folder: "thumbnails" | "modals" = folderInput === "modals" ? "modals" : "thumbnails";

    // Delete old picture from storage if user is replacing an existing image
    if (oldUrl && oldUrl.startsWith("http")) {
      await deleteProjectAsset(oldUrl);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const url = await uploadProjectAsset(buffer, file.name, mimeType, folder);

    return NextResponse.json({
      success: true,
      url,
      fileName: file.name,
      folder,
    });
  } catch (error: any) {
    console.error("Storage upload error:", error);
    return NextResponse.json(
      { error: error?.message || "File upload failed" },
      { status: 500 }
    );
  }
}
