import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function buildWebhookUrl(baseUrl: string, envValue: string | undefined, defaultPath: string) {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  if (envValue) {
    if (envValue.startsWith("http")) {
      return envValue;
    }
    const path = envValue.startsWith("/") ? envValue : `/${envValue}`;
    return `${normalizedBase}${path}`;
  }
  return `${normalizedBase}${defaultPath}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const baseUrl =
      request.headers.get("X-N8N-URL") || process.env.N8N_BASE_URL || "http://localhost:5678";
    const apiKey = request.headers.get("X-N8N-API-KEY");
    const uploadWebhookOverride = request.headers.get("X-N8N-LIBRARY-UPLOAD-WEBHOOK") || undefined;
    const libraryEndpoint = buildWebhookUrl(
      baseUrl,
      uploadWebhookOverride || process.env.N8N_LIBRARY_WEBHOOK,
      "/webhook/library-upload",
    );
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) {
      headers["X-N8N-API-KEY"] = apiKey;
    }
    const imagePreview = body.enhancedImage ? body.enhancedImage.substring(0, 50) + "..." : "MISSING";
    
    console.log("📸 LIBRARY UPLOAD REQUEST:");
    console.log("   Target:", libraryEndpoint);
    console.log("   Scene:", body.sceneId);
    console.log("   Scene Label:", body.sceneLabel);
    console.log("   Format:", body.formatLabel);
    console.log("   FileName:", body.fileName);
    console.log("   Image Data Start:", imagePreview);

    const response = await fetch(libraryEndpoint, {
      method: "POST",
      headers,
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
