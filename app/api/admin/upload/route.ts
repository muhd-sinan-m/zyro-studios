import { NextRequest, NextResponse } from "next/server";
import { uploadProjectAsset, deleteProjectAsset } from "@/lib/storage/s3";
import { verifyAdminRequest } from "@/lib/auth/admin";

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

    const folder: "thumbnails" | "modals" = folderInput === "modals" ? "modals" : "thumbnails";

    // Delete old picture from storage if user is replacing an existing image
    if (oldUrl && oldUrl.startsWith("http")) {
      await deleteProjectAsset(oldUrl);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const contentType = file.type || "image/png";

    const url = await uploadProjectAsset(buffer, file.name, contentType, folder);

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
