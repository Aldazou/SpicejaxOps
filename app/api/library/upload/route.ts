import { NextRequest, NextResponse } from "next/server";

const DEFAULT_N8N_URL = process.env.N8N_BASE_URL || "http://localhost:5678";
const LIBRARY_ENDPOINT =
  process.env.N8N_LIBRARY_WEBHOOK && process.env.N8N_LIBRARY_WEBHOOK.startsWith("http")
    ? process.env.N8N_LIBRARY_WEBHOOK
    : `${DEFAULT_N8N_URL}${process.env.N8N_LIBRARY_WEBHOOK || "/webhook/library-upload"}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const imagePreview = body.enhancedImage ? body.enhancedImage.substring(0, 50) + "..." : "MISSING";
    
    console.log("📸 LIBRARY UPLOAD REQUEST:");
    console.log("   Target:", LIBRARY_ENDPOINT);
    console.log("   Scene:", body.sceneId);
    console.log("   Scene Label:", body.sceneLabel);
    console.log("   Format:", body.formatLabel);
    console.log("   FileName:", body.fileName);
    console.log("   Image Data Start:", imagePreview);

    const response = await fetch(LIBRARY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("✅ N8N Response Status:", response.status);
    const data = await response.json().catch(() => ({}));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("❌ Library upload error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload to library" },
      { status: 500 },
    );
  }
}
