import { NextResponse } from "next/server";

const DEFAULT_N8N_URL = process.env.N8N_BASE_URL || "http://localhost:5678";
// You will need to add N8N_LIBRARY_LIST_WEBHOOK to your .env.local
const LIST_ENDPOINT =
  process.env.N8N_LIBRARY_LIST_WEBHOOK && process.env.N8N_LIBRARY_LIST_WEBHOOK.startsWith("http")
    ? process.env.N8N_LIBRARY_LIST_WEBHOOK
    : `${DEFAULT_N8N_URL}${process.env.N8N_LIBRARY_LIST_WEBHOOK || "/webhook/library-list"}`;

export async function GET() {
  try {
    console.log("Fetching library from:", LIST_ENDPOINT);
    const response = await fetch(LIST_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
