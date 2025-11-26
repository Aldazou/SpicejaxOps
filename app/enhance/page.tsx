"use client";

import { useMemo, useState } from "react";
import MainLayout from "@/components/MainLayout";
import Image from "next/image";
import { Expand, Download, Trash2, Sparkles, ImageIcon } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const SCENE_PRESETS = [
  { id: "ember", label: "Backyard Ember", prompt: "Backyard grill at dusk, glowing embers, smoke drifting, warm rim light, cozy outdoor dinner vibes." },
  { id: "chef-pass", label: "Chef’s Pass Heat Lamp", prompt: "Restaurant pass, stainless counter, heat lamps glowing, plated tacos waiting, steam curling under moody overhead light." },
  { id: "midnight-kitchen", label: "Midnight Test Kitchen", prompt: "Marble island, stacks of cookbooks, scribbled notes, single desk lamp casting dramatic pools of warm light." },
  { id: "heritage-stove", label: "Heritage Stove Top", prompt: "Vintage cast-iron on an heirloom stove, flour dust floating in amber window light, rustic spoon and spices around." },
  { id: "grinding-ritual", label: "Spice Grinding Ritual", prompt: "Close up mortar and pestle in motion, dried chiles mid-air, vibrant spices scattered, gritty artisan workbench." },
  { id: "sous-vide", label: "Modern Sous Vide Lab", prompt: "Minimal induction setup, sous-vide bags steaming, cool blue accent light, precision chef tools, stainless surfaces." },
  { id: "campfire", label: "Campfire Cast-Iron", prompt: "Rustic campfire ring, cast-iron skillet sizzling over open flame, pine forest at dusk, enamel mugs nearby." },
  { id: "tailgate", label: "Tailgate Smoke Show", prompt: "Pickup truck bed setup, portable smoker, stadium lights in background, fans blurred, energetic game-day vibe." },
  { id: "pitmaster", label: "Pitmaster Tent", prompt: "Massive offset smoker, chalkboard menu, butcher paper, midday sun haze, pitmaster tools leaning nearby." },
  { id: "seaside", label: "Seaside Grill", prompt: "Beach bonfire pit, driftwood seating, sea spray mist, sunset horizon, grilled seafood props shimmering." },
  { id: "feast-table", label: "Family Feast Table", prompt: "Long farmhouse table, mismatched plates, multiple dishes mid-serve, hands reaching, golden hour sunlight." },
  { id: "tapas", label: "Tapas Night", prompt: "Dim candlelight, small plates, olives and crostini, warm golden tones, wine glasses catching reflections." },
  { id: "street-taco", label: "Street Taco Counter", prompt: "Griddle with sizzling meats, cilantro and diced onions, neon signage, urban night energy, motion blur crowd." },
  { id: "brunch", label: "Brunch Board", prompt: "Cast-iron frittata, jars of pickled veg, linen napkins, bright morning backlight, airy weekend vibe." },
  { id: "wine", label: "Wine & Spice Pairing", prompt: "Charcuterie board, deep red wine glass, slate serving board, moody shadows, sophisticated tasting room feel." },
  { id: "market-shelf", label: "Gourmet Market Shelf", prompt: "Dark wood shelving, multiple jars lined up, hand-written price tags, artisanal grocery environment." },
  { id: "popup", label: "Pop-up Booth", prompt: "Branded tablecloth, tasting spoons, curious customer hand reaching, soft fair lighting." },
  { id: "subscription", label: "Subscription Unboxing", prompt: "Stylized top-down shot, tissue paper, branded cards, herb bundles, natural daylight." },
  { id: "food-truck", label: "Food Truck Pass", prompt: "Service window, stainless counter, order slips, busy city street blurred, afternoon sun streaks." },
  { id: "studio-clean", label: "Clean Studio Sweep", prompt: "Minimal white cyclorama, glossy reflections, controlled softbox lighting, editorial product focus." },
  { id: "herb-garden", label: "Herb Garden Morning", prompt: "Fresh basil and rosemary pots, dew on leaves, soft morning window light, earthy textures." },
  { id: "citrus-zest", label: "Citrus Zest Burst", prompt: "Sliced oranges and lemons, microplane mid-action, bright highlights, vibrant yellow pops." },
  { id: "global-pantry", label: "Global Pantry Map", prompt: "Saffron threads, star anise, turmeric roots spread over aged atlas, brass compass props." },
  { id: "smoked-pepper", label: "Smoked Pepper Lab", prompt: "Hanging dried peppers, smoke haze, industrial fan, gritty warehouse vibe." },
  { id: "dessert-spice", label: "Dessert Spice Spread", prompt: "Cinnamon sticks, vanilla beans, pastries dusted in powdered sugar, soft studio light." },
  { id: "motion-splash", label: "Motion Splash", prompt: "High-speed capture of marinade pouring over protein, frozen droplets, jar sharp in foreground." },
  { id: "xray-flavor", label: "X-Ray Flavor", prompt: "Cutaway look showing rub, smoke ring, charred crust, scientific yet appetizing aesthetic." },
  { id: "flavor-wave", label: "Flavor Wave", prompt: "Abstract colored spice powders exploding behind the jar, vibrant editorial feel." },
  { id: "spice-trail", label: "Spice Trail Map", prompt: "Jar atop aged travel map with passport stamps, brass compass, explorer vibe." },
  { id: "future-lab", label: "Future Flavor Lab", prompt: "Chrome lab surfaces, holographic UI overlays, neon accent lighting, experimental culinary tech mood." },
  { id: "custom", label: "Custom", prompt: "" },
];

export default function ImageEnhancerPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [sceneId, setSceneId] = useState<string>("ember");
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
        setEnhancedImage(null); // Reset enhanced image on new upload
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const enhanceImage = async () => {
    if (!uploadedImage) return;

    setEnhancing(true);
    setError(null);

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
      
      // Fallback for demo purposes if n8n isn't connected yet
      // In a real app, remove this or make it clear it's a demo
      // setEnhancedImage(uploadedImage); // Just show original as fallback for now
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Upload */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-slate-100 p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    Step 01
                  </p>
                  <h2 className="text-xl font-bold text-gray-900">Original Image</h2>
                </div>
              </div>

                {uploadedImage ? (
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 ring-1 ring-gray-100">
                    <Image
                      src={uploadedImage}
                      alt="Original"
                      fill
                    className="object-contain p-6"
                    />
                    <button
                      onClick={() => {
                        setUploadedImage(null);
                        setEnhancedImage(null);
                      }}
                    className="absolute top-3 right-3 bg-white/90 text-[#4f7f00] p-2 rounded-full border border-[#d2e6b5] hover:bg-[#8bc53f] hover:text-white transition-colors shadow-sm"
                    >
                    <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center py-10 space-y-3">
                    <span className="rounded-full bg-white shadow px-6 py-3 text-sm font-semibold text-gray-700">
                      Drag & drop or click to upload
                    </span>
                    <p className="text-xs text-gray-500">
                      High-res PNG, JPG or WEBP for best results
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
              )}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900">Scene vibe</p>
                <div className="grid grid-cols-2 gap-2">
                  {SCENE_PRESETS.map((scene) => (
                    <button
                      key={scene.id}
                      onClick={() => setSceneId(scene.id)}
                      className={`px-3 py-2 rounded-xl text-sm border text-left ${
                        sceneId === scene.id
                          ? "border-black bg-black text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {scene.label}
                    </button>
                  ))}
                </div>
                {sceneId === "custom" && (
                  <textarea
                    value={customScene}
                    onChange={(e) => setCustomScene(e.target.value)}
                    placeholder="Describe the exact scene you want..."
                    className="w-full rounded-2xl border border-gray-200 focus:border-black focus:ring-black text-sm p-3"
                    rows={3}
                  />
                )}
              </div>
            </div>

            <button
              onClick={enhanceImage}
              disabled={!uploadedImage || enhancing}
              className="w-full py-3 sm:py-4 bg-black text-white font-semibold text-base sm:text-lg rounded-2xl hover:bg-gray-900 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg"
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
              <div className="p-4 bg-[#f3fbe3] text-[#4f7f00] rounded-2xl border border-[#cfe7b1]">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Right: Result */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-slate-100 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                  Step 02
                </p>
                <h2 className="text-xl font-bold text-gray-900">Enhanced Result</h2>
              </div>
            </div>

            {enhancedImage ? (
              <div className="space-y-4">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                  <Image
                    src={enhancedImage}
                    alt="Enhanced"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                    ✨ ENHANCED
                    </div>
                    <div className="px-3 py-1 bg-white/90 text-gray-700 text-xs font-semibold rounded-full shadow">
                      Studio Build: Backyard Ember
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsPreviewOpen(true)}
                      className="flex items-center justify-center rounded-xl border border-gray-200 p-2 text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Expand className="w-5 h-5" />
                    </button>
                  <button
                    onClick={handleDownload}
                      className="flex items-center justify-center rounded-xl bg-black text-white p-2 hover:bg-gray-900 transition shadow"
                  >
                      <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEnhancedImage(null)}
                      className="flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 p-2 hover:bg-gray-50 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleApprove}
                    disabled={approving}
                    className="flex-1 min-w-[160px] py-2 rounded-xl bg-[#8bc53f] text-white font-semibold text-sm hover:bg-[#77a933] transition disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    {approving ? "Saving..." : "Approve & Save"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                {enhancing ? (
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">🪄</div>
                    <p className="font-medium">Working on it...</p>
                    <p className="text-sm mt-2">Sending to n8n for enhancement</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-6xl mb-4">🖼️</p>
                    <p>Upload an image and click Enhance</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </MainLayout>
    {isPreviewOpen && enhancedImage && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
        <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl p-6">
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
          >
            ✕
          </button>
          <Zoom zoomMargin={32}>
            <div
              className="relative w-full rounded-2xl overflow-hidden bg-gray-100"
              style={{ aspectRatio: "3 / 4", maxHeight: "80vh", margin: "0 auto" }}
            >
              <Image
                src={enhancedImage}
                alt="Enhanced preview"
                fill
                className="object-contain p-4"
                priority
              />
            </div>
          </Zoom>
          <p className="text-sm text-gray-500 text-center mt-4">
            Click or tap to zoom. Scroll or pinch to inspect details.
          </p>
        </div>
      </div>
    )}
    </>
  );
}

