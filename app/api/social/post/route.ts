import { NextRequest, NextResponse } from "next/server";

// n8n webhook URLs for each platform (add to .env.local)
const PLATFORM_WEBHOOKS: Record<string, string | undefined> = {
  facebook: process.env.N8N_FACEBOOK_POST_WEBHOOK,
  instagram: process.env.N8N_INSTAGRAM_POST_WEBHOOK,
  pinterest: process.env.N8N_PINTEREST_POST_WEBHOOK,
  tiktok: process.env.N8N_TIKTOK_POST_WEBHOOK,
  linkedin: process.env.N8N_LINKEDIN_POST_WEBHOOK,
  youtube: process.env.N8N_YOUTUBE_POST_WEBHOOK,
  twitter: process.env.N8N_TWITTER_POST_WEBHOOK,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, image, caption } = body;

    console.log("📤 SOCIAL POST REQUEST:");
    console.log("   Platform:", platform);
    console.log("   Caption:", caption?.slice(0, 50) + "...");
    console.log("   Image:", image?.slice(0, 50) + "...");

    // Normalize platform name
    const platformKey = platform?.toLowerCase().replace(/\s/g, "");
    const webhookUrl = PLATFORM_WEBHOOKS[platformKey];

    if (!webhookUrl) {
      console.log("❌ No webhook configured for platform:", platformKey);
      return NextResponse.json(
        { 
          success: false, 
          error: `${platform} posting not configured yet`,
          configured: false 
        },
        { status: 400 }
      );
    }

    console.log("   Webhook:", webhookUrl);

    // Call the n8n webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image, caption }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ n8n error:", data);
      return NextResponse.json(
        { success: false, error: data.message || "Failed to post" },
        { status: response.status }
      );
    }

    console.log("✅ Posted successfully to", platform);
    return NextResponse.json({ 
      success: true, 
      platform,
      postId: data.id || data.post_id,
      data 
    });

  } catch (error) {
    console.error("❌ Social post error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to post to social media" },
      { status: 500 }
    );
  }
}

