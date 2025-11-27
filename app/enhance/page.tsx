"use client";

import { useMemo, useState } from "react";
import MainLayout from "@/components/MainLayout";
import Image from "next/image";
import { Expand, Download, Trash2, Sparkles, ImageIcon, Check, X } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const SCENE_PRESETS = [
  { id: "ember", label: "Backyard Ember", prompt: "Backyard grill at dusk, glowing embers, smoke drifting, warm rim light, cozy outdoor dinner vibes." },
  { id: "chef-pass", label: "Chef's Pass", prompt: "Restaurant pass, stainless counter, heat lamps glowing, plated tacos waiting, steam curling under moody overhead light." },
  { id: "midnight-kitchen", label: "Midnight Kitchen", prompt: "Marble island, stacks of cookbooks, scribbled notes, single desk lamp casting dramatic pools of warm light." },
  { id: "heritage-stove", label: "Heritage Stove", prompt: "Vintage cast-iron on an heirloom stove, flour dust floating in amber window light, rustic spoon and spices around." },
  { id: "grinding-ritual", label: "Spice Ritual", prompt: "Close up mortar and pestle in motion, dried chiles mid-air, vibrant spices scattered, gritty artisan workbench." },
  { id: "campfire", label: "Campfire", prompt: "Rustic campfire ring, cast-iron skillet sizzling over open flame, pine forest at dusk, enamel mugs nearby." },
  { id: "tailgate", label: "Tailgate", prompt: "Pickup truck bed setup, portable smoker, stadium lights in background, fans blurred, energetic game-day vibe." },
  { id: "seaside", label: "Seaside Grill", prompt: "Beach bonfire pit, driftwood seating, sea spray mist, sunset horizon, grilled seafood props shimmering." },
  { id: "feast-table", label: "Feast Table", prompt: "Long farmhouse table, mismatched plates, multiple dishes mid-serve, hands reaching, golden hour sunlight." },
  { id: "street-taco", label: "Street Taco", prompt: "Griddle with sizzling meats, cilantro and diced onions, neon signage, urban night energy, motion blur crowd." },
  { id: "studio-clean", label: "Studio Clean", prompt: "Minimal white cyclorama, glossy reflections, controlled softbox lighting, editorial product focus." },
  { id: "herb-garden", label: "Herb Garden", prompt: "Fresh basil and rosemary pots, dew on leaves, soft morning window light, earthy textures." },
  { id: "custom", label: "Custom Scene", prompt: "" },
];

export default function ImageEnhancerPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
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
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <p className="uppercase tracking-[0.3em] text-[10px] font-bold text-purple-500">
                AI Studio
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Image Lab
            </h1>
            <p className="text-gray-500 mt-1">
              Transform product shots with AI-powered scene generation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left: Upload */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step 01</p>
                    <h2 className="font-bold text-gray-900">Upload Original</h2>
                  </div>
                </div>

                {uploadedImage ? (
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 ring-1 ring-gray-200/50">
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
                      className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gradient-to-br from-gray-50 to-white hover:border-[#8bc53f]/50 hover:bg-[#f8fdf3] transition-all group">
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 group-hover:bg-[#8bc53f]/10 flex items-center justify-center transition-colors">
                        <ImageIcon className="w-8 h-8 text-gray-300 group-hover:text-[#8bc53f] transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-700">Drop your image here</p>
                        <p className="text-sm text-gray-400 mt-1">or click to browse</p>
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
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6">
                <p className="text-sm font-bold text-gray-900 mb-4">Choose a scene vibe</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SCENE_PRESETS.map((scene) => (
                    <button
                      key={scene.id}
                      onClick={() => setSceneId(scene.id)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${
                        sceneId === scene.id
                          ? "bg-gray-900 text-white shadow-lg"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
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
                    className="mt-4 w-full rounded-2xl border border-gray-200 focus:border-[#8bc53f] focus:ring-2 focus:ring-[#8bc53f]/20 text-sm p-4 transition-all"
                    rows={3}
                  />
                )}
              </div>

              {/* Enhance Button */}
              <button
                onClick={enhanceImage}
                disabled={!uploadedImage || enhancing}
                className="w-full py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold text-lg rounded-2xl hover:from-gray-800 hover:to-gray-700 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-900/20 disabled:shadow-none"
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
                <div className="p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 text-sm">
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* Right: Result */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8bc53f] to-[#6ba82a] flex items-center justify-center shadow-lg shadow-[#8bc53f]/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step 02</p>
                  <h2 className="font-bold text-gray-900">Enhanced Result</h2>
                </div>
              </div>

              {enhancedImage ? (
                <div className="flex-1 flex flex-col gap-4">
                  <div className="relative flex-1 min-h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                    <Image
                      src={enhancedImage}
                      alt="Enhanced"
                      fill
                      className="object-cover"
                    />
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1.5 bg-[#8bc53f] text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        ENHANCED
                      </span>
                    </div>
                    {approved && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 bg-white text-[#8bc53f] text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5">
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
                        className="w-11 h-11 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
                        title="Preview"
                      >
                        <Expand className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleDownload}
                        className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-lg"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setEnhancedImage(null);
                          setApproved(false);
                        }}
                        className="w-11 h-11 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
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
                          ? "bg-[#f0f9e8] text-[#5a8c1a] border border-[#d4ebc4]"
                          : "bg-gradient-to-r from-[#8bc53f] to-[#7ab82f] text-white shadow-lg shadow-[#8bc53f]/30 hover:shadow-xl hover:shadow-[#8bc53f]/40 disabled:opacity-50"
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
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-gray-400 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200">
                  {enhancing ? (
                    <div className="text-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-[#8bc53f]/20 rounded-full blur-2xl animate-pulse"></div>
                        <div className="relative text-6xl animate-bounce">🪄</div>
                      </div>
                      <p className="font-semibold text-gray-600">Creating magic...</p>
                      <p className="text-sm mt-1">AI is building your scene</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-10 h-10 text-gray-300" />
                      </div>
                      <p className="font-semibold text-gray-600">No result yet</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl p-6 overflow-hidden">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <Zoom zoomMargin={32}>
              <div
                className="relative w-full rounded-2xl overflow-hidden bg-gray-100"
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
            <p className="text-sm text-gray-400 text-center mt-4">
              Click to zoom • Scroll to inspect details
            </p>
          </div>
        </div>
      )}
    </>
  );
}
