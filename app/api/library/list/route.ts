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

export async function GET(request: NextRequest) {
  try {
    const baseUrl =
      request.headers.get("X-N8N-URL") || process.env.N8N_BASE_URL || "http://localhost:5678";
    const apiKey = request.headers.get("X-N8N-API-KEY");
    const listWebhookOverride = request.headers.get("X-N8N-LIBRARY-LIST-WEBHOOK") || undefined;
    const listEndpoint = buildWebhookUrl(
      baseUrl,
      listWebhookOverride || process.env.N8N_LIBRARY_LIST_WEBHOOK,
      "/webhook/library-list",
    );
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) {
      headers["X-N8N-API-KEY"] = apiKey;
    }

    console.log("Fetching library from:", listEndpoint);
    const response = await fetch(listEndpoint, {
      method: "GET",
      headers,
      // Next.js caching can get in the way of fresh lists, so we disable it
      cache: "no-store",
    });

    console.log("N8N Response Status:", response.status);
    
    // Clone response to log text if json parsing fails
    const text = await response.clone().text();
    console.log("N8N Raw Response:", text.substring(0, 200)); // Log first 200 chars

    const data = await response.json().catch(() => []);

    // Ensure we return an array
    // n8n usually returns an array of items like [{ json: { ...fileData } }]
    // or sometimes just the array of file objects depending on the Respond to Webhook configuration.
    // We need to handle both.
    
    let files = [];
    
    if (Array.isArray(data)) {
        // Check if it's n8n default format [{ json: { id: ... } }]
        if (data.length > 0 && data[0].json) {
            files = data.map((item: any) => item.json);
        } else {
            // Assumes it's already [ { id: ... }, { id: ... } ]
            files = data;
        }
    } else if (data && typeof data === 'object') {
         // Sometimes it might be wrapped { results: [...] }
         files = []; 
         console.log("Data is object, not array:", data);
    }

    console.log("Parsed files count:", files.length);

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Library list error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch library", files: [] },
      { status: 500 },
    );
  }
}
