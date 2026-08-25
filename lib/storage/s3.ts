import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const endpoint = process.env.SUPABASE_STORAGE_S3_ENDPOINT || "";
const accessKeyId = process.env.SUPABASE_STORAGE_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.SUPABASE_STORAGE_SECRET_ACCESS_KEY || "";
const region = process.env.SUPABASE_STORAGE_REGION || "ap-southeast-1";
const defaultBucket = process.env.SUPABASE_STORAGE_BUCKET || "project-assets";

export const s3 = new S3Client({
  forcePathStyle: true,
  region,
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function uploadProjectAsset(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  folder: "thumbnails" | "modals" = "thumbnails",
  bucket: string = defaultBucket
): Promise<string> {
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `projects/${folder}/${Date.now()}-${cleanFileName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    })
  );

  // Return clean permanent public URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const publicUrl = supabaseUrl
    ? `${supabaseUrl}/storage/v1/object/public/${bucket}/${key}`
    : `/storage/v1/object/public/${bucket}/${key}`;
  return publicUrl;
}

export async function deleteProjectAsset(
  fileUrl: string,
  bucket: string = defaultBucket
): Promise<boolean> {
  if (!fileUrl) return false;
  try {
    let key = "";
    if (fileUrl.includes("projects/")) {
      key = "projects/" + fileUrl.split("projects/")[1].split("?")[0];
    } else {
      const urlObj = new URL(fileUrl);
      const pathname = urlObj.pathname;
      const bucketIdx = pathname.indexOf(bucket);
      if (bucketIdx !== -1) {
        key = pathname.substring(bucketIdx + bucket.length + 1);
      }
    }

    if (!key) return false;

    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    return true;
  } catch (err) {
    console.error("Error deleting old asset from storage:", err);
    return false;
  }
}
