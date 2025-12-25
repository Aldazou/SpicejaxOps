import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    n8nBaseUrl: process.env.N8N_BASE_URL || "http://localhost:5678",
    hasContentGenerateOverride: Boolean(process.env.N8N_CONTENT_GENERATE_WEBHOOK),
    hasImageEnhanceOverride: Boolean(process.env.N8N_IMAGE_ENHANCE_WEBHOOK),
    hasLibraryWebhook: Boolean(process.env.N8N_LIBRARY_WEBHOOK),
    hasLibraryListWebhook: Boolean(process.env.N8N_LIBRARY_LIST_WEBHOOK),
    hasFacebookWebhook: Boolean(process.env.N8N_FACEBOOK_POST_WEBHOOK),
    hasApiKey: Boolean(process.env.N8N_API_KEY),
  });
}
