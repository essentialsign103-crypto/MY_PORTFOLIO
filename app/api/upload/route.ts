import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // "image" or "video"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!type || !["image", "video"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Validate file type
    const validImageTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
    const validVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];

    const isValidImage = validImageTypes.includes(file.type);
    const isValidVideo = validVideoTypes.includes(file.type);

    if (type === "image" && !isValidImage) {
      return NextResponse.json({ error: "Invalid image type" }, { status: 400 });
    }

    if (type === "video" && !isValidVideo) {
      return NextResponse.json({ error: "Invalid video type" }, { status: 400 });
    }

    // Create filename with timestamp to avoid conflicts
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, "-").toLowerCase();
    const filename = `${timestamp}-${originalName}`;

    // Determine folder path
    const folder = type === "image" ? "images" : "videos";
    const publicPath = join(process.cwd(), "public", folder);

    // Ensure directory exists
    await mkdir(publicPath, { recursive: true });

    // Write file
    const filepath = join(publicPath, filename);
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    // Return the public path
    const publicUrl = `/${folder}/${filename}`;

    return NextResponse.json({ success: true, path: publicUrl, filename });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
