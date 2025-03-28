import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Ensure the directory exists
const uploadDir = path.join(process.cwd(), "public/uploads");

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
        }

        // Convert file to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure the uploads folder exists
        await mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const filename = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, filename);

        // Save the file
        await writeFile(filePath, buffer);

        // Return the URL
        const fileUrl = `/uploads/${filename}`;
        return NextResponse.json({ url: fileUrl }, { status: 200 });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
