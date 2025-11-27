"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import Image from "next/image";
import ScheduleModal from "@/components/ScheduleModal";
import { getProducts, type SpiceProduct } from "@/lib/products";
import { ImageIcon, Sparkles, X } from "lucide-react";

interface ContentIdea {
  id: string;
  type: "image" | "caption" | "hook";
  content: string;
  imageUrl?: string;
  status: "pending" | "approved" | "discarded";
}

function ContentStudioContent() {
  const searchParams = useSearchParams();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [products, setProducts] = useState<SpiceProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [fromLibrary, setFromLibrary] = useState(false);
  const [platform, setPlatform] = useState<string>("instagram");
  const [formatLabel, setFormatLabel] = useState<string>("");
  
  // Scheduling State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedIdeaForSchedule, setSelectedIdeaForSchedule] = useState<ContentIdea | null>(null);

  // Load products and check for URL params (from Library/Enhance)
  useEffect(() => {
    const loadedProducts = getProducts();
    setProducts(loadedProducts);
    
    // Check if coming from Library/Enhance with pre-loaded image
    const imageParam = searchParams.get("image");
    const productParam = searchParams.get("product");
    const platformParam = searchParams.get("platform");
    const formatParam = searchParams.get("format");
    const fromParam = searchParams.get("from");
    
    if (imageParam) {
      setUploadedImage(decodeURIComponent(imageParam));
      setFromLibrary(fromParam === "library" || fromParam === "enhance");
    }
    
    if (platformParam) {
      setPlatform(platformParam);
    }
    
    if (formatParam) {
      setFormatLabel(decodeURIComponent(formatParam));
    }
    
    if (productParam && loadedProducts.length > 0) {
      // Normalize the param for matching (remove spaces, lowercase)
      const normalizedParam = productParam.toLowerCase().replace(/\s+/g, '');
      
      // Try to find matching product by various methods
      const matchedProduct = loadedProducts.find(p => {
        const normalizedName = p.name.toLowerCase().replace(/\s+/g, '');
        const normalizedShort = p.shortName.toLowerCase().replace(/\s+/g, '');
        const normalizedId = p.id.toLowerCase().replace(/-/g, '');
        
        return normalizedName.includes(normalizedParam) ||
               normalizedShort.includes(normalizedParam) ||
               normalizedParam.includes(normalizedShort) ||
               normalizedId.includes(normalizedParam) ||
               normalizedParam.includes(normalizedId);
      });
      
      if (matchedProduct) {
        setSelectedProductId(matchedProduct.id);
        setIngredients(matchedProduct.ingredients);
      } else {
        console.log('⚠️ No product match for:', productParam);
      }
    }
  }, [searchParams]);

  // When product selection changes, update ingredients
  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    const product = products.find(p => p.id === productId);
    if (product) {
      setIngredients(product.ingredients);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateContent = async () => {
    console.log('🚀 Starting content generation...');
    console.log('Image:', uploadedImage ? 'Present' : 'Missing');
    console.log('Product:', selectedProductId);
    console.log('Ingredients:', ingredients);
    
    setGenerating(true);
    
    try {
      // Get n8n settings
      const settings = JSON.parse(localStorage.getItem('spicejax_settings') || '{}');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (settings.n8nUrl) headers['X-N8N-URL'] = settings.n8nUrl;
      if (settings.apiKey) headers['X-N8N-API-KEY'] = settings.apiKey;

      // Get product name
      const selectedProduct = products.find(p => p.id === selectedProductId);
      const productName = selectedProduct?.name || "SpiceJax Blend";

      const payload = {
        image: uploadedImage,
        ingredients: ingredients,
        productName: productName,
        platform: platform,
        format: formatLabel,
      };
      
      console.log('📤 Calling workflow with payload:', payload);

      // Call the content generation workflow
      const response = await fetch('/api/n8n/content-generate', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      console.log('📥 Response status:', response.status);
      
      const data = await response.json();
      console.log('📥 Response data:', data);
      
      if (data.success && data.contentIdeas) {
        console.log('✅ Success! Setting content ideas:', data.contentIdeas);
        // Add status: "pending" to each idea if not present
        const ideasWithStatus = data.contentIdeas.map((idea: ContentIdea) => ({
          ...idea,
          status: idea.status || "pending",
        }));
        setContentIdeas(ideasWithStatus);
      } else {
        console.warn('⚠️ No content ideas in response, using fallback');
        // Fallback if workflow fails
        setContentIdeas([
          {
            id: "1",
            type: "hook",
            content: "🔥 Transform Your Dishes with Bold Flavors",
            status: "pending",
          },
          {
            id: "2",
            type: "caption",
            content: "Elevate your cooking game with our signature blend",
            status: "pending",
          },
        ]);
      }
    } catch (error) {
      console.error('❌ Content generation error:', error);
      // Show error feedback
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}. Check console for details.`);
      setContentIdeas([
        {
          id: "error",
          type: "caption",
          content: `⚠️ Error: ${error instanceof Error ? error.message : 'Failed to generate content'}`,
          status: "pending",
        },
      ]);
    } finally {
      setGenerating(false);
      console.log('✅ Generation complete');
    }
  };

  const updateStatus = (id: string, status: "approved" | "discarded") => {
    if (status === "approved") {
      const idea = contentIdeas.find(i => i.id === id);
      if (idea) {
        setSelectedIdeaForSchedule(idea);
        setIsScheduleModalOpen(true);
      }
    } else {
      setContentIdeas(
        contentIdeas.map((idea) =>
          idea.id === id ? { ...idea, status } : idea
        )
      );
    }
  };

  const handleScheduleConfirm = async (date: string, time: string, platform: string) => {
    if (!selectedIdeaForSchedule) return;

    console.log(`📅 Scheduling for ${date} at ${time} on ${platform}`);
    
    try {
      // 1. Save to LocalStorage (for immediate UI update in Calendar)
      const scheduledPost = {
        id: `post-${Date.now()}`,
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }), // Derive day name
        date: date,
        time: time,
        platform: platform,
        content: selectedIdeaForSchedule.content,
        image: uploadedImage, // Pass the image if available
        status: "scheduled"
      };

      const existingSchedule = JSON.parse(localStorage.getItem('spicejax_schedule') || '[]');
      localStorage.setItem('spicejax_schedule', JSON.stringify([...existingSchedule, scheduledPost]));

      // 2. Send to n8n (Trigger 'content-schedule' workflow)
      const settings = JSON.parse(localStorage.getItem('spicejax_settings') || '{}');
      
      if (settings.n8nUrl) {
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (settings.n8nUrl) headers['X-N8N-URL'] = settings.n8nUrl;
        if (settings.apiKey) headers['X-N8N-API-KEY'] = settings.apiKey;

        // Fire and forget - don't block UI
        fetch('/api/n8n/content-schedule', {
          method: 'POST',
          headers,
          body: JSON.stringify(scheduledPost),
        }).catch(err => console.error("Failed to trigger n8n schedule workflow:", err));
      }

      // 3. Update UI state
      setContentIdeas(
        contentIdeas.map((idea) =>
          idea.id === selectedIdeaForSchedule.id ? { ...idea, status: "approved" } : idea
        )
      );

      alert("✅ Content scheduled successfully!");

    } catch (error) {
      console.error("Scheduling error:", error);
      alert("Failed to schedule content");
    }
  };

  return (
    <MainLayout>
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onConfirm={handleScheduleConfirm}
        content={selectedIdeaForSchedule?.content || ""}
        defaultPlatform={platform}
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-lime to-spice-600 flex items-center justify-center shadow-lg shadow-brand-lime/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {fromLibrary && (
              <span className="px-2 py-1 bg-brand-gold/10 text-brand-gold text-xs font-bold rounded-lg border border-brand-gold/20">
                From {platform === "instagram" ? "Instagram" : platform === "facebook" ? "Facebook" : platform === "tiktok" ? "TikTok" : platform === "linkedin" ? "LinkedIn" : platform === "youtube" ? "YouTube" : platform === "pinterest" ? "Pinterest" : platform === "twitter" ? "X" : "Library"}
              </span>
            )}
            {formatLabel && (
              <span className="px-2 py-1 bg-brand-lime/10 text-brand-lime text-xs font-bold rounded-lg border border-brand-lime/20">
                {formatLabel}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Content Studio</h1>
          <p className="text-gray-500 mt-2">
            {fromLibrary 
              ? "Generate captions and hooks for your library image"
              : "Upload images, add ingredients, and generate AI-powered content"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Left: Image & Product Info */}
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="relative">
                {uploadedImage ? (
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={uploadedImage}
                      alt="Product"
                      fill
                      className="object-cover"
                    />
                    {!fromLibrary && (
                      <button
                        onClick={() => {
                          setUploadedImage(null);
                          setSelectedProductId("");
                          setIngredients([]);
                        }}
                        className="absolute top-3 right-3 bg-white/90 text-gray-600 p-2 rounded-xl border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    
                    {/* Product badge if selected */}
                    {selectedProductId && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-white/95 backdrop-blur rounded-xl p-3 border border-gray-200">
                          <p className="font-bold text-gray-900 text-sm">
                            {products.find(p => p.id === selectedProductId)?.name}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {ingredients.slice(0, 5).map((ing, i) => (
                              <span key={i} className="px-2 py-0.5 bg-brand-sage text-brand-text text-[10px] font-medium rounded-full">
                                {ing}
                              </span>
                            ))}
                            {ingredients.length > 5 && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-medium rounded-full">
                                +{ingredients.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center py-10">
                      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-4 border border-gray-200">
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700">
                        Drop your image here
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        or click to browse
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
              </div>
            </div>

            {/* Product Selector - only show if NOT from library/enhance */}
            {!fromLibrary && products.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>🌶️</span> Select Product
                </h2>
                
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8bc53f] bg-white text-gray-900 font-medium"
                >
                  <option value="">Select a product...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateContent}
              disabled={!uploadedImage || generating}
              className="w-full py-4 bg-gradient-to-r from-brand-lime to-spice-600 text-white font-bold text-lg rounded-2xl hover:shadow-lg hover:shadow-brand-lime/30 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed disabled:from-gray-200 disabled:to-gray-200 transition-all shadow-md flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Captions
                </>
              )}
            </button>
          </div>

          {/* Right: AI Content Ideas */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              💡 AI-Generated Ideas
            </h2>

            {contentIdeas.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-6xl mb-4">🤖</p>
                <p className="text-gray-500">
                  Upload an image and generate content to see AI suggestions
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {contentIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className={`border-2 rounded-xl p-4 ${
                      idea.status === "approved"
                        ? "border-[#4f7f00] bg-[#eef7e2]"
                        : idea.status === "discarded"
                        ? "border-gray-200 bg-gray-50 opacity-60"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="px-3 py-1 bg-spice-100 text-spice-700 text-xs font-bold rounded-full">
                        {idea.type.toUpperCase()}
                      </span>
                      {idea.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatus(idea.id, "approved")}
                            className="px-3 py-1 bg-[#8bc53f] text-white text-sm font-medium rounded-lg hover:bg-[#77a933]"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => updateStatus(idea.id, "discarded")}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
                          >
                            ✕ Discard
                          </button>
                        </div>
                      )}
                    </div>

                    {idea.imageUrl && (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2 bg-gray-100">
                        <Image
                          src={idea.imageUrl}
                          alt="Content variant"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <p className="text-gray-700">{idea.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Wrap with Suspense for useSearchParams
export default function ContentStudioPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin w-8 h-8 border-4 border-brand-lime border-t-transparent rounded-full"></div>
        </div>
      </MainLayout>
    }>
      <ContentStudioContent />
    </Suspense>
  );
}
