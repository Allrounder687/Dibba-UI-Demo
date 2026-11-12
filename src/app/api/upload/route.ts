import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession, hasRole } from "@/lib/auth";
import { CURATED_MEDIA_ASSETS } from "@/lib/club-presets";
import { ClubRepository } from "@/db/repository";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

function hasValidImageMagicBytes(buf: Buffer, mime: string): boolean {
  if (buf.length < 12) return false;
  if (mime === "image/png") {
    return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  }
  if (mime === "image/jpeg") {
    return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  }
  if (mime === "image/webp") {
    return (
      buf.subarray(0, 4).toString("ascii") === "RIFF" &&
      buf.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }
  return false;
}

export async function GET() {
  const session = await getServerSession();
  if (!session || !hasRole(session, ["super_admin", "editor", "academy_manager"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let uploaded: { url: string; label: string; category: "uploaded" }[] = [];
  if (fs.existsSync(UPLOADS_DIR)) {
    const files = fs
      .readdirSync(UPLOADS_DIR)
      .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
      .sort()
      .reverse();
    uploaded = files.map((file) => ({
      url: `/uploads/${file}`,
      label: file,
      category: "uploaded" as const,
    }));
  }

  return NextResponse.json({
    uploaded,
    curated: CURATED_MEDIA_ASSETS,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session || !hasRole(session, ["super_admin", "editor"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const file = formData.get("file");
  const removeBg = formData.get("removeBg") === "true";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = ALLOWED_EXTENSIONS[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Unsupported format. Allowed: PNG, JPG, WebP." },
      { status: 400 }
    );
  }

  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "File size must be between 1 byte and 5 MB." },
      { status: 400 }
    );
  }

  let buffer: Buffer = Buffer.from(await file.arrayBuffer());
  if (!hasValidImageMagicBytes(buffer, file.type)) {
    return NextResponse.json(
      { error: "Image binary signature did not match declared MIME type." },
      { status: 400 }
    );
  }

  let finalExt = ext;
  let finalMime = file.type;
  let backgroundRemoved = false;

  // Optional automated background removal via remove.bg when REMOVE_BG_API_KEY is configured
  const removeBgKey = process.env.REMOVE_BG_API_KEY;
  if (removeBg && removeBgKey) {
    try {
      const bgForm = new FormData();
      bgForm.append("image_file", new Blob([new Uint8Array(buffer)], { type: file.type }), file.name);
      bgForm.append("size", "auto");
      const bgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": removeBgKey },
        body: bgForm,
      });
      if (bgRes.ok) {
        buffer = Buffer.from(await bgRes.arrayBuffer());
        finalExt = "png";
        finalMime = "image/png";
        backgroundRemoved = true;
      }
    } catch {
      // Fallback safely to original image if remove.bg is unavailable
    }
  }

  const safeSlug = path
    .basename(file.name, path.extname(file.name))
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const uniqueName = `${safeSlug || "club-media"}-${Date.now()}-${crypto
    .randomBytes(3)
    .toString("hex")}.${finalExt}`;

  // Optional Supabase Storage upload when configured
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseBucket = process.env.SUPABASE_STORAGE_BUCKET || "club-media";
  if (supabaseUrl && supabaseKey) {
    const uploadEndpoint = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${supabaseBucket}/${uniqueName}`;
    const supaRes = await fetch(uploadEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": finalMime,
        "x-upsert": "true",
      },
      body: new Uint8Array(buffer),
    });
    if (supaRes.ok) {
      const publicUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${supabaseBucket}/${uniqueName}`;
      await ClubRepository.addAuditLog(
        session.email,
        "UPLOAD_MEDIA",
        "media",
        uniqueName,
        `Supabase Storage (${backgroundRemoved ? "cutout" : "original"})`
      );
      return NextResponse.json(
        { url: publicUrl, storage: "supabase", backgroundRemoved },
        { status: 201 }
      );
    }
  }

  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    fs.writeFileSync(path.join(UPLOADS_DIR, uniqueName), buffer);
    const url = `/uploads/${uniqueName}`;

    await ClubRepository.addAuditLog(
      session.email,
      "UPLOAD_MEDIA",
      "media",
      uniqueName,
      `Local public/uploads (${backgroundRemoved ? "cutout" : "original"})`
    );

    return NextResponse.json(
      { url, storage: "local", backgroundRemoved },
      { status: 201 }
    );
  } catch {
    // Serverless read-only fallback: return inline data URI when Supabase Storage is not configured
    const dataUri = `data:${finalMime};base64,${buffer.toString("base64")}`;
    return NextResponse.json(
      { url: dataUri, storage: "inline_demo", backgroundRemoved },
      { status: 201 }
    );
  }
}
