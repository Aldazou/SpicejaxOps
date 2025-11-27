"use client";

import { useMemo, useState } from "react";
import MainLayout from "@/components/MainLayout";
import Image from "next/image";
import { Expand, Download, Trash2, Sparkles, ImageIcon, Check, X } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

// 🔥 HIGH-CONVERTING SCENE PRESETS
// Curated by professional food/product photography principles
// Each scene is designed to evoke emotion, appetite appeal, and purchase intent

const SCENE_PRESETS = [
  // ═══════════════════════════════════════════════════════════════
  // HERO SHOTS — Clean, premium, e-commerce ready
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "hero-dark", 
    label: "Dark Luxe", 
    category: "hero",
    prompt: "Ultra-premium product photography on matte black slate surface, dramatic side lighting from left creating sharp highlights and deep shadows, shallow depth of field f/1.8, subtle smoke wisps, scattered peppercorns and sea salt flakes as props, reflection on surface, moody editorial aesthetic, 85mm lens, Phase One medium format quality." 
  },
  { 
    id: "hero-marble", 
    label: "Marble Editorial", 
    category: "hero",
    prompt: "High-end product shot on Carrara marble surface with subtle grey veining, soft diffused natural window light from above-right, minimalist styling with single fresh herb sprig, clean negative space for copy, luxury brand aesthetic, sharp focus throughout, color-accurate white balance, commercial catalog quality." 
  },
  { 
    id: "hero-wood", 
    label: "Artisan Board", 
    category: "hero",
    prompt: "Rustic-luxe product photography on live-edge walnut cutting board, warm directional tungsten lighting, artisanal props including hand-forged knife and linen napkin, visible wood grain texture, shallow depth of field with creamy bokeh, farm-to-table premium aesthetic, Kinfolk magazine style." 
  },
  { 
    id: "hero-terracotta", 
    label: "Terra Warm", 
    category: "hero",
    prompt: "Mediterranean-inspired product shot on terracotta tiles with natural patina, golden hour warm sunlight streaming in, olive oil drizzle and fresh rosemary as props, earthy color palette, slight dust particles in light rays, authentic handcrafted feel, travel and lifestyle brand aesthetic." 
  },

  // ═══════════════════════════════════════════════════════════════
  // LIFESTYLE — Aspirational, story-driven, social-ready
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "kitchen-action", 
    label: "Chef in Motion", 
    category: "lifestyle",
    prompt: "Dynamic kitchen scene with professional chef's hands seasoning a sizzling cast-iron skillet, motion blur on the seasoning action, steam rising dramatically backlit, stainless steel professional kitchen background blurred, action photography style, f/2.8 capturing the moment, editorial food magazine cover quality." 
  },
  { 
    id: "gather-table", 
    label: "Gathering Table", 
    category: "lifestyle",
    prompt: "Overhead 45-degree angle of abundant dinner party table, multiple hands reaching for dishes, warm candlelight mixed with golden hour window light, linen tablecloth with natural wrinkles, wine glasses half-full, fresh bread being torn, authentic connection and celebration, lifestyle brand campaign quality." 
  },
  { 
    id: "grill-master", 
    label: "Backyard Grill", 
    category: "lifestyle",
    prompt: "Atmospheric backyard grilling scene at magic hour, glowing charcoal embers with smoke wisps rising, seasoned meat on grill grates with beautiful char marks, warm rim lighting on the product, blurred string lights in background bokeh, summer entertaining vibes, aspirational lifestyle photography." 
  },
  { 
    id: "morning-ritual", 
    label: "Morning Light", 
    category: "lifestyle",
    prompt: "Serene breakfast scene with soft diffused morning light through sheer curtains, product on wooden breakfast tray with fresh eggs and coffee, crisp white bedding visible in frame, peaceful slow-living aesthetic, hygge lifestyle, warm and inviting color grade, editorial home and living quality." 
  },

  // ═══════════════════════════════════════════════════════════════
  // INGREDIENT STORY — Context, origin, authenticity
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "spice-market", 
    label: "Spice Souk", 
    category: "ingredient",
    prompt: "Vibrant spice market scene with overflowing burlap sacks of colorful spices, warm ambient lighting, shallow depth of field focusing on product with market bustle softly blurred behind, rich saturated colors of turmeric yellow and paprika red, authentic travel photography aesthetic, National Geographic food story quality." 
  },
  { 
    id: "harvest-fresh", 
    label: "Fresh Harvest", 
    category: "ingredient",
    prompt: "Farm-fresh scene with just-picked vegetables and herbs scattered artfully, morning dew droplets visible, natural outdoor light, weathered wooden farm table, garden and greenhouse softly blurred in background, organic and sustainable brand messaging, Whole Foods editorial quality." 
  },
  { 
    id: "mortar-craft", 
    label: "Craft Process", 
    category: "ingredient",
    prompt: "Artisan spice-grinding scene with granite mortar and pestle, whole spices mid-grind with some scattered on aged butcher block, dramatic raking light revealing textures, visible spice dust particles floating in air, handcrafted small-batch aesthetic, documentary food photography style." 
  },
  { 
    id: "smoke-cure", 
    label: "Smokehouse", 
    category: "ingredient",
    prompt: "Atmospheric smokehouse interior with hanging dried peppers and herbs, shafts of light cutting through aromatic smoke, aged wood walls, copper and cast iron props, rich warm color palette with deep shadows, artisanal craft production aesthetic, heritage brand storytelling." 
  },

  // ═══════════════════════════════════════════════════════════════
  // CUISINE CONTEXTS — Specific food culture moments
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "taco-night", 
    label: "Taco Tuesday", 
    category: "cuisine",
    prompt: "Vibrant taco night spread with colorful toppings in small bowls, warm tortillas in cloth-lined basket, lime wedges and fresh cilantro, festive but authentic Mexican home cooking aesthetic, warm overhead lighting, family-style presentation, food blog hero image quality, appetite appeal maximized." 
  },
  { 
    id: "bbq-pit", 
    label: "Pitmaster", 
    category: "cuisine",
    prompt: "Authentic Texas BBQ scene with offset smoker in background, butcher paper with sliced brisket showing perfect smoke ring, product prominently featured as the secret weapon, wood smoke haze, rustic outdoor setting, competitive BBQ aesthetic, serious pitmaster credibility." 
  },
  { 
    id: "asian-wok", 
    label: "Wok Hei", 
    category: "cuisine",
    prompt: "High-heat wok cooking action shot with flames visible, dramatic toss of ingredients mid-air, steam and wok hei smoke, professional Asian kitchen setting, dynamic motion photography, product as essential ingredient, authentic street food energy, action food photography." 
  },
  { 
    id: "mediterranean", 
    label: "Coastal Med", 
    category: "cuisine",
    prompt: "Sun-drenched Mediterranean table scene overlooking blurred sea horizon, grilled fish with lemon and herbs, olive oil drizzle moment, terracotta and blue ceramic dishes, relaxed coastal European lifestyle, vacation aspirational, travel and food editorial crossover." 
  },

  // ═══════════════════════════════════════════════════════════════
  // SEASONAL — Timely, campaign-ready
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "summer-cookout", 
    label: "Summer Party", 
    category: "seasonal",
    prompt: "Peak summer outdoor party scene, picnic table with checkered cloth, corn on the cob and watermelon slices, condensation on cold drinks, golden afternoon sunlight, blurred guests and string lights in background, carefree summer celebration, seasonal campaign hero image." 
  },
  { 
    id: "fall-harvest", 
    label: "Autumn Harvest", 
    category: "seasonal",
    prompt: "Cozy fall harvest scene with pumpkins, root vegetables, and autumn leaves as props, warm tungsten lighting mixed with cool window light, chunky knit textiles, cinnamon sticks and warming spices, hygge comfort food aesthetic, Thanksgiving and fall campaign ready." 
  },
  { 
    id: "holiday-feast", 
    label: "Holiday Table", 
    category: "seasonal",
    prompt: "Elegant holiday dinner table with candlelight, evergreen sprigs and gold accents, prime rib or turkey as hero dish with product featured as star seasoning, crystal glassware catching light, festive but sophisticated, premium holiday gifting and entertaining campaign." 
  },
  { 
    id: "winter-comfort", 
    label: "Winter Warmth", 
    category: "seasonal",
    prompt: "Intimate winter comfort scene with steaming soup or stew in cast iron, frost visible on window in background, warm interior lighting contrast, cozy blankets and fireplace glow suggested, hearty comfort food aesthetic, cold weather cooking campaign." 
  },

  // ═══════════════════════════════════════════════════════════════
  // SOCIAL MEDIA — Platform-optimized, scroll-stopping
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "flat-lay", 
    label: "Perfect Flat Lay", 
    category: "social",
    prompt: "Instagram-perfect overhead flat lay on clean white surface, product centered with symmetrical arrangement of complementary ingredients, geometric precision, negative space for text overlay, bright and airy with soft shadows, social media optimized composition, influencer collaboration ready." 
  },
  { 
    id: "hand-model", 
    label: "In Hand", 
    category: "social",
    prompt: "Authentic hand-held product shot with natural manicured hands, casual kitchen or dining background blurred, lifestyle authenticity, relatable and approachable, UGC-style but professionally lit, social proof and real-use context, Instagram Stories and Reels optimized." 
  },
  { 
    id: "pour-shot", 
    label: "Action Pour", 
    category: "social",
    prompt: "Dynamic pouring or sprinkling action shot with product mid-air, high shutter speed freezing the moment, dramatic lighting catching particles, clean dark background for contrast, satisfying visual ASMR quality, viral potential, TikTok and Reels scroll-stopper." 
  },

  // ═══════════════════════════════════════════════════════════════
  // CUSTOM — User's creative vision
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "custom", 
    label: "Custom Scene", 
    category: "custom",
    prompt: "" 
  },
];

export default function ImageEnhancerPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [sceneId, setSceneId] = useState<string>("hero-dark");
  const [activeCategory, setActiveCategory] = useState<string>("hero");
  const [customScene, setCustomScene] = useState<string>("");

  const activeScenePrompt = useMemo(() => {
    if (sceneId === "custom") {
      return customScene.trim();
    }
    return (
      SCENE_PRESETS.find((scene) => scene.id === sceneId)?.prompt ??
      "Backyard grill at dusk with ember glow and smoke trails."
    );
  }, [sceneId, customScene]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setEnhancedImage(null);
        setError(null);
        setApproved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const enhanceImage = async () => {
    if (!uploadedImage) return;

    setEnhancing(true);
    setError(null);
    setApproved(false);

    try {
      const settings = JSON.parse(localStorage.getItem('spicejax_settings') || '{}');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (settings.n8nUrl) headers['X-N8N-URL'] = settings.n8nUrl;
      if (settings.apiKey) headers['X-N8N-API-KEY'] = settings.apiKey;

      const payload = {
        image: uploadedImage,
        action: "enhance",
        sceneId,
        scenePrompt: activeScenePrompt,
      };

      const response = await fetch('/api/n8n/image-enhance', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success && data.enhancedImage) {
        setEnhancedImage(data.enhancedImage);
      } else {
        throw new Error(data.message || "Failed to enhance image");
      }
    } catch (err) {
      console.error("Enhancement error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setEnhancing(false);
    }
  };

  const handleDownload = () => {
    if (enhancedImage) {
      const link = document.createElement('a');
      link.href = enhancedImage;
      link.download = `spicejax-enhanced-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleApprove = async () => {
    if (!enhancedImage) return;
    setApproving(true);
    try {
      await fetch("/api/library/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enhancedImage,
          sceneId,
          scenePrompt: activeScenePrompt,
        }),
      });
      setApproved(true);
    } catch (err) {
      console.error("Failed to upload to library:", err);
    } finally {
      setApproving(false);
    }
  };

  return (
    <>
      <MainLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-rust to-rust-600 flex items-center justify-center shadow-lg shadow-brand-rust/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <p className="uppercase tracking-[0.3em] text-[10px] font-bold text-brand-rust">
                AI Studio
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Image Lab
            </h1>
            <p className="text-brand-text/70 mt-1">
              Transform product shots with AI-powered scene generation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left: Upload */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-brand-gold/20 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-brand-sage flex items-center justify-center border border-brand-gold/20">
                    <ImageIcon className="w-5 h-5 text-brand-text/50" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-text/50 uppercase tracking-wider">Step 01</p>
                    <h2 className="font-bold">Upload Original</h2>
                  </div>
                </div>

                {uploadedImage ? (
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-sage ring-1 ring-brand-gold/20">
                    <Image
                      src={uploadedImage}
                      alt="Original"
                      fill
                      className="object-contain p-4"
                    />
                    <button
                      onClick={() => {
                        setUploadedImage(null);
                        setEnhancedImage(null);
                        setApproved(false);
                      }}
                      className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center text-brand-text/50 hover:text-brand-rust hover:bg-rust-50 transition-colors shadow-lg border border-brand-gold/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-brand-gold/30 rounded-2xl cursor-pointer bg-brand-sage hover:border-brand-lime hover:bg-spice-50 transition-all group">
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-white group-hover:bg-brand-lime/10 flex items-center justify-center transition-colors border border-brand-gold/20">
                        <ImageIcon className="w-8 h-8 text-brand-text/30 group-hover:text-brand-lime transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-brand-title">Drop your image here</p>
                        <p className="text-sm text-brand-text/50 mt-1">or click to browse</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              {/* Scene Selection */}
              <div className="bg-white rounded-3xl border border-brand-gold/20 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6">
                <p className="text-sm font-bold text-brand-title mb-4">Choose a scene vibe</p>
                
                {/* Category Tabs */}
                <div className="flex gap-1 overflow-x-auto no-scrollbar pb-3 mb-4 border-b border-brand-gold/10">
                  {[
                    { id: "hero", label: "Hero Shots" },
                    { id: "lifestyle", label: "Lifestyle" },
                    { id: "ingredient", label: "Ingredient" },
                    { id: "cuisine", label: "Cuisine" },
                    { id: "seasonal", label: "Seasonal" },
                    { id: "social", label: "Social" },
                    { id: "custom", label: "Custom" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                        activeCategory === cat.id
                          ? "bg-[#243530] text-white"
                          : "text-brand-text/60 hover:text-brand-title hover:bg-brand-sage"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Scene Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {SCENE_PRESETS
                    .filter((scene) => scene.category === activeCategory)
                    .map((scene) => (
                      <button
                        key={scene.id}
                        onClick={() => setSceneId(scene.id)}
                        className={`px-3 py-3 rounded-xl text-sm font-medium text-left transition-all ${
                          sceneId === scene.id
                            ? "bg-[#243530] text-white shadow-lg"
                            : "bg-brand-sage text-brand-text hover:bg-spice-100 border border-transparent hover:border-brand-gold/20"
                        }`}
                      >
                        {scene.label}
                      </button>
                    ))}
                </div>

                {/* Selected Scene Preview */}
                {sceneId !== "custom" && (
                  <div className="mt-4 p-3 bg-brand-sage rounded-xl border border-brand-gold/10">
                    <p className="text-[10px] font-bold text-brand-text/40 uppercase tracking-wider mb-1">Scene Prompt</p>
                    <p className="text-xs text-brand-text/70 leading-relaxed">
                      {SCENE_PRESETS.find((s) => s.id === sceneId)?.prompt.slice(0, 120)}...
                    </p>
                  </div>
                )}

                {activeCategory === "custom" && (
                  <textarea
                    value={customScene}
                    onChange={(e) => {
                      setCustomScene(e.target.value);
                      setSceneId("custom");
                    }}
                    placeholder="Describe your exact vision... Be specific about lighting, props, mood, camera angle, and style references."
                    className="mt-4 w-full rounded-2xl border border-brand-gold/30 bg-brand-sage focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/20 text-sm p-4 transition-all"
                    rows={4}
                  />
                )}
              </div>

              {/* Enhance Button */}
              <button
                onClick={enhanceImage}
                disabled={!uploadedImage || enhancing}
                className="w-full py-4 bg-gradient-to-r from-brand-title to-brand-black text-white font-bold text-lg rounded-2xl hover:from-brand-black hover:to-brand-title disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-title/20 disabled:shadow-none"
              >
                {enhancing ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Generating Scene…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Run Enhancement
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-rust-50 text-brand-rust rounded-2xl border border-brand-rust/20 text-sm">
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* Right: Result */}
            <div className="bg-white rounded-3xl border border-brand-gold/20 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-lime to-spice-600 flex items-center justify-center shadow-lg shadow-brand-lime/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-text/50 uppercase tracking-wider">Step 02</p>
                  <h2 className="font-bold">Enhanced Result</h2>
                </div>
              </div>

              {enhancedImage ? (
                <div className="flex-1 flex flex-col gap-4">
                  <div className="relative flex-1 min-h-[400px] rounded-2xl overflow-hidden bg-brand-sage">
                    <Image
                      src={enhancedImage}
                      alt="Enhanced"
                      fill
                      className="object-cover"
                    />
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1.5 bg-brand-lime text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        ENHANCED
                      </span>
                    </div>
                    {approved && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 bg-white text-brand-lime text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5 border border-brand-lime/20">
                          <Check className="w-3 h-3" />
                          SAVED
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsPreviewOpen(true)}
                        className="w-11 h-11 flex items-center justify-center rounded-xl border border-brand-gold/30 text-brand-text hover:bg-brand-sage hover:border-brand-gold transition-all"
                        title="Preview"
                      >
                        <Expand className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleDownload}
                        className="w-11 h-11 flex items-center justify-center rounded-xl bg-brand-title text-white hover:bg-brand-black transition-all shadow-lg"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setEnhancedImage(null);
                          setApproved(false);
                        }}
                        className="w-11 h-11 flex items-center justify-center rounded-xl border border-brand-gold/30 text-brand-text/50 hover:text-brand-rust hover:border-brand-rust/30 hover:bg-rust-50 transition-all"
                        title="Discard"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={handleApprove}
                      disabled={approving || approved}
                      className={`flex-1 min-w-[160px] py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        approved
                          ? "bg-spice-50 text-brand-title border border-brand-lime/30"
                          : "bg-gradient-to-r from-brand-lime to-spice-600 text-white shadow-lg shadow-brand-lime/30 hover:shadow-xl hover:shadow-brand-lime/40 disabled:opacity-50"
                      }`}
                    >
                      {approved ? (
                        <>
                          <Check className="w-4 h-4" />
                          Saved to Library
                        </>
                      ) : approving ? (
                        "Saving..."
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Approve & Save
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-brand-text/50 bg-brand-sage rounded-2xl border-2 border-dashed border-brand-gold/20">
                  {enhancing ? (
                    <div className="text-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-brand-rust/20 rounded-full blur-2xl animate-pulse"></div>
                        <div className="relative text-6xl animate-bounce">🪄</div>
                      </div>
                      <p className="font-semibold text-brand-title">Creating magic...</p>
                      <p className="text-sm mt-1">AI is building your scene</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mx-auto mb-4 border border-brand-gold/20">
                        <ImageIcon className="w-10 h-10 text-brand-text/20" />
                      </div>
                      <p className="font-semibold text-brand-title">No result yet</p>
                      <p className="text-sm mt-1">Upload an image and hit enhance</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>

      {/* Preview Modal */}
      {isPreviewOpen && enhancedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/90 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl p-6 overflow-hidden border border-brand-gold/20">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-brand-sage text-brand-text hover:bg-rust-50 hover:text-brand-rust transition-colors z-10 border border-brand-gold/20"
            >
              <X className="w-5 h-5" />
            </button>
            <Zoom zoomMargin={32}>
              <div
                className="relative w-full rounded-2xl overflow-hidden bg-brand-sage"
                style={{ aspectRatio: "3 / 4", maxHeight: "75vh", margin: "0 auto" }}
              >
                <Image
                  src={enhancedImage}
                  alt="Enhanced preview"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Zoom>
            <p className="text-sm text-brand-text/50 text-center mt-4">
              Click to zoom • Scroll to inspect details
            </p>
          </div>
        </div>
      )}
    </>
  );
}
