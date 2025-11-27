"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { getSettings, saveSettings, clearSettings, type N8NSettings } from "@/lib/settings";
import { getProducts, saveProducts, addProduct, deleteProduct, resetProducts, type SpiceProduct, DEFAULT_PRODUCTS } from "@/lib/products";
import { Plus, Trash2, Edit2, Save, X, RotateCcw, Flame, Package, Settings2, ChevronDown, ChevronUp } from "lucide-react";

// Heat level colors
const HEAT_COLORS = [
  "bg-green-500", // 1 - Mild
  "bg-yellow-500", // 2 - Medium
  "bg-orange-500", // 3 - Hot
  "bg-red-500", // 4 - Very Hot
  "bg-red-700", // 5 - Extreme
];

// Preset colors for new products
const PRESET_COLORS = [
  "#dc2626", "#ea580c", "#eab308", "#22c55e", "#14b8a6", 
  "#0ea5e9", "#6366f1", "#a855f7", "#ec4899", "#171717", "#7f1d1d"
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<N8NSettings>({
    n8nUrl: '',
    apiKey: '',
  });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Product management state
  const [products, setProducts] = useState<SpiceProduct[]>([]);
  const [editingProduct, setEditingProduct] = useState<SpiceProduct | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [productSaved, setProductSaved] = useState(false);
  const [expandedSection, setExpandedSection] = useState<"n8n" | "products" | null>("products");

  // New product form state
  const [newProduct, setNewProduct] = useState<Omit<SpiceProduct, "id">>({
    name: "",
    shortName: "",
    ingredients: [],
    goodOn: [],
    description: "",
    heat: 2,
    color: "#ea580c",
  });
  const [ingredientInput, setIngredientInput] = useState("");
  const [goodOnInput, setGoodOnInput] = useState("");

  useEffect(() => {
    const loadedSettings = getSettings();
    setSettings(loadedSettings);
    setProducts(getProducts());
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default settings?')) {
      clearSettings();
      setSettings({
        n8nUrl: 'http://localhost:5678',
        apiKey: '',
      });
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (settings.n8nUrl) {
        headers['X-N8N-URL'] = settings.n8nUrl;
      }
      if (settings.apiKey) {
        headers['X-N8N-API-KEY'] = settings.apiKey;
      }
      
      const response = await fetch('/api/test-n8n', { headers });
      const result = await response.json();
      
      if (result.success) {
        setTestResult({
          success: true,
          message: `✅ Connected successfully! n8n is reachable at ${result.n8nUrl}`,
        });
      } else {
        setTestResult({
          success: false,
          message: `❌ ${result.message}\n\nURL: ${result.n8nUrl}\n\n💡 Make sure n8n is running: n8n start`,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      
      setTestResult({
        success: false,
        message: `❌ Cannot connect to n8n.\n\nError: ${errorMsg}\n\n💡 Make sure n8n is running on the correct URL.`,
      });
    } finally {
      setTesting(false);
    }
  };

  // Product management functions
  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      if (editingProduct) {
        setEditingProduct({
          ...editingProduct,
          ingredients: [...editingProduct.ingredients, ingredientInput.trim()]
        });
      } else {
        setNewProduct({
          ...newProduct,
          ingredients: [...newProduct.ingredients, ingredientInput.trim()]
        });
      }
      setIngredientInput("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        ingredients: editingProduct.ingredients.filter((_, i) => i !== index)
      });
    } else {
      setNewProduct({
        ...newProduct,
        ingredients: newProduct.ingredients.filter((_, i) => i !== index)
      });
    }
  };

  const handleAddGoodOn = () => {
    if (goodOnInput.trim()) {
      if (editingProduct) {
        setEditingProduct({
          ...editingProduct,
          goodOn: [...editingProduct.goodOn, goodOnInput.trim()]
        });
      } else {
        setNewProduct({
          ...newProduct,
          goodOn: [...newProduct.goodOn, goodOnInput.trim()]
        });
      }
      setGoodOnInput("");
    }
  };

  const handleRemoveGoodOn = (index: number) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        goodOn: editingProduct.goodOn.filter((_, i) => i !== index)
      });
    } else {
      setNewProduct({
        ...newProduct,
        goodOn: newProduct.goodOn.filter((_, i) => i !== index)
      });
    }
  };

  const handleSaveNewProduct = () => {
    if (!newProduct.name.trim() || !newProduct.shortName.trim()) {
      alert("Product name and short name are required");
      return;
    }
    
    addProduct(newProduct);
    setProducts(getProducts());
    setNewProduct({
      name: "",
      shortName: "",
      ingredients: [],
      goodOn: [],
      description: "",
      heat: 2,
      color: "#ea580c",
    });
    setIsAddingNew(false);
    setProductSaved(true);
    setTimeout(() => setProductSaved(false), 3000);
  };

  const handleSaveEditedProduct = () => {
    if (!editingProduct) return;
    
    const updatedProducts = products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    );
    saveProducts(updatedProducts);
    setProducts(updatedProducts);
    setEditingProduct(null);
    setProductSaved(true);
    setTimeout(() => setProductSaved(false), 3000);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
      setProducts(getProducts());
    }
  };

  const handleResetProducts = () => {
    if (confirm("Reset to original 5 SpiceJax products? This will remove any products you've added.")) {
      resetProducts();
      setProducts(DEFAULT_PRODUCTS);
    }
  };

  const renderProductForm = (product: Omit<SpiceProduct, "id"> | SpiceProduct, isEditing: boolean) => (
    <div className="space-y-4 p-4 bg-brand-sage/50 rounded-2xl border border-dark-forest/10">
      {/* Name fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-title mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => isEditing 
              ? setEditingProduct({ ...editingProduct!, name: e.target.value })
              : setNewProduct({ ...newProduct, name: e.target.value })
            }
            placeholder="e.g., Smokey Honey Habanero Rub"
            className="w-full px-3 py-2 border border-dark-forest/20 rounded-xl focus:ring-2 focus:ring-brand-lime focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-title mb-1">
            Short Name *
          </label>
          <input
            type="text"
            value={product.shortName}
            onChange={(e) => isEditing 
              ? setEditingProduct({ ...editingProduct!, shortName: e.target.value })
              : setNewProduct({ ...newProduct, shortName: e.target.value })
            }
            placeholder="e.g., Smokey Honey Habanero"
            className="w-full px-3 py-2 border border-dark-forest/20 rounded-xl focus:ring-2 focus:ring-brand-lime focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-brand-title mb-1">
          Description
        </label>
        <textarea
          value={product.description}
          onChange={(e) => isEditing 
            ? setEditingProduct({ ...editingProduct!, description: e.target.value })
            : setNewProduct({ ...newProduct, description: e.target.value })
          }
          placeholder="A brief description of the flavor profile..."
          rows={2}
          className="w-full px-3 py-2 border border-dark-forest/20 rounded-xl focus:ring-2 focus:ring-brand-lime focus:border-transparent text-sm resize-none"
        />
      </div>

      {/* Ingredients */}
      <div>
        <label className="block text-sm font-medium text-brand-title mb-1">
          Ingredients
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddIngredient())}
            placeholder="Add ingredient..."
            className="flex-1 px-3 py-2 border border-dark-forest/20 rounded-xl focus:ring-2 focus:ring-brand-lime focus:border-transparent text-sm"
          />
          <button
            onClick={handleAddIngredient}
            className="px-3 py-2 bg-brand-lime text-white rounded-xl hover:bg-brand-lime/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.ingredients.map((ing, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs border border-dark-forest/10">
              {ing}
              <button onClick={() => handleRemoveIngredient(i)} className="text-brand-rust hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Good On */}
      <div>
        <label className="block text-sm font-medium text-brand-title mb-1">
          Best Used On
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={goodOnInput}
            onChange={(e) => setGoodOnInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddGoodOn())}
            placeholder="Add food type..."
            className="flex-1 px-3 py-2 border border-dark-forest/20 rounded-xl focus:ring-2 focus:ring-brand-lime focus:border-transparent text-sm"
          />
          <button
            onClick={handleAddGoodOn}
            className="px-3 py-2 bg-brand-lime text-white rounded-xl hover:bg-brand-lime/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.goodOn.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs border border-dark-forest/10">
              {item}
              <button onClick={() => handleRemoveGoodOn(i)} className="text-brand-rust hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Heat Level & Color */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-title mb-1">
            Heat Level (1-5)
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => isEditing 
                  ? setEditingProduct({ ...editingProduct!, heat: level })
                  : setNewProduct({ ...newProduct, heat: level })
                }
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  product.heat >= level 
                    ? HEAT_COLORS[level - 1] + " text-white" 
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <Flame className="w-4 h-4" />
              </button>
            ))}
            <span className="text-sm text-brand-text ml-2">
              {product.heat === 1 && "Mild"}
              {product.heat === 2 && "Medium"}
              {product.heat === 3 && "Hot"}
              {product.heat === 4 && "Very Hot"}
              {product.heat === 5 && "Extreme"}
            </span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-title mb-1">
            Brand Color
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => isEditing 
                  ? setEditingProduct({ ...editingProduct!, color })
                  : setNewProduct({ ...newProduct, color })
                }
                className={`w-7 h-7 rounded-lg border-2 transition-all ${
                  product.color === color ? "border-dark-forest scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons - sticky on mobile */}
      <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-dark-forest/10 sticky bottom-0 bg-brand-sage/50 -mx-4 px-4 pb-4 -mb-4 rounded-b-2xl">
        <button
          onClick={() => isEditing ? setEditingProduct(null) : setIsAddingNew(false)}
          className="px-4 py-3 text-brand-text hover:bg-white rounded-xl transition-colors text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={isEditing ? handleSaveEditedProduct : handleSaveNewProduct}
          className="px-6 py-3 bg-dark-forest text-white rounded-xl hover:bg-dark-forest/90 transition-colors text-sm font-medium flex items-center gap-2 shadow-lg"
        >
          <Save className="w-4 h-4" />
          {isEditing ? "Save Changes" : "Add Product"}
        </button>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-dark-forest/10 shadow-soft p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-title font-display mb-2">Settings</h1>
          <p className="text-brand-text">Manage your products and n8n connection</p>
        </div>

        {/* Success Toast */}
        {productSaved && (
          <div className="fixed bottom-4 right-4 bg-dark-forest text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-slide-up z-50">
            <Package className="w-5 h-5" />
            Product saved successfully!
          </div>
        )}

        {/* Product Management Section */}
        <div className="bg-white rounded-3xl border border-dark-forest/10 shadow-soft overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === "products" ? null : "products")}
            className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-brand-sage/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-lime to-brand-gold rounded-2xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-semibold text-brand-title font-display">Product Catalog</h2>
                <p className="text-sm text-brand-text">{products.length} products configured</p>
              </div>
            </div>
            {expandedSection === "products" ? (
              <ChevronUp className="w-5 h-5 text-brand-text" />
            ) : (
              <ChevronDown className="w-5 h-5 text-brand-text" />
            )}
          </button>

          {expandedSection === "products" && (
            <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4">
              {/* Add New Product Button */}
              {!isAddingNew && !editingProduct && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setIsAddingNew(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-lime text-white rounded-xl hover:bg-brand-lime/90 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Product
                  </button>
                  <button
                    onClick={handleResetProducts}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-brand-text rounded-xl hover:bg-gray-200 transition-colors text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset to Defaults
                  </button>
                </div>
              )}

              {/* Add New Product Form */}
              {isAddingNew && renderProductForm(newProduct, false)}

              {/* Edit Product Form */}
              {editingProduct && renderProductForm(editingProduct, true)}

              {/* Product List */}
              {!isAddingNew && !editingProduct && (
                <div className="space-y-3">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 bg-brand-sage/30 rounded-2xl border border-dark-forest/5 hover:border-dark-forest/10 transition-colors"
                    >
                      {/* Color indicator */}
                      <div
                        className="w-3 h-12 rounded-full flex-shrink-0"
                        style={{ backgroundColor: product.color }}
                      />
                      
                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-brand-title truncate">{product.name}</h3>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: product.heat }).map((_, i) => (
                              <Flame key={i} className={`w-3 h-3 ${HEAT_COLORS[product.heat - 1].replace("bg-", "text-")}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-brand-text truncate">
                          {product.ingredients.slice(0, 4).join(", ")}
                          {product.ingredients.length > 4 && ` +${product.ingredients.length - 4} more`}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIngredientInput("");
                            setGoodOnInput("");
                          }}
                          className="p-2 text-brand-text hover:text-dark-forest hover:bg-white rounded-xl transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-brand-text hover:text-brand-rust hover:bg-white rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* n8n Configuration Section */}
        <div className="bg-white rounded-3xl border border-dark-forest/10 shadow-soft overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === "n8n" ? null : "n8n")}
            className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-brand-sage/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-dark-forest to-brand-title rounded-2xl flex items-center justify-center">
                <Settings2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-semibold text-brand-title font-display">n8n Configuration</h2>
                <p className="text-sm text-brand-text">Workflow automation connection</p>
              </div>
            </div>
            {expandedSection === "n8n" ? (
              <ChevronUp className="w-5 h-5 text-brand-text" />
            ) : (
              <ChevronDown className="w-5 h-5 text-brand-text" />
            )}
          </button>

          {expandedSection === "n8n" && (
            <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-6">
              {/* n8n URL */}
              <div>
                <label className="block text-sm font-medium text-brand-title mb-2">
                  n8n Instance URL *
                </label>
                <input
                  type="text"
                  value={settings.n8nUrl}
                  onChange={(e) => setSettings({ ...settings, n8nUrl: e.target.value })}
                  placeholder="http://localhost:5678"
                  className="w-full px-4 py-3 border border-dark-forest/20 rounded-xl focus:ring-2 focus:ring-brand-lime focus:border-transparent"
                />
                <p className="mt-2 text-sm text-brand-text">
                  The base URL of your n8n instance
                </p>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm font-medium text-brand-title mb-2">
                  API Key (Optional)
                </label>
                <input
                  type="password"
                  value={settings.apiKey || ''}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  placeholder="Enter your n8n API key (if required)"
                  className="w-full px-4 py-3 border border-dark-forest/20 rounded-xl focus:ring-2 focus:ring-brand-lime focus:border-transparent"
                />
                <p className="mt-2 text-sm text-brand-text">
                  Only needed if your n8n instance requires API authentication
                </p>
              </div>

              {/* Test Connection */}
              {testResult && (
                <div
                  className={`p-4 rounded-xl ${
                    testResult.success
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <p
                    className={`text-sm whitespace-pre-line ${
                    testResult.success ? 'text-green-800' : 'text-gray-700'
                    }`}
                  >
                    {testResult.message}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-dark-forest/10">
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-dark-forest hover:bg-dark-forest/90 text-white font-medium rounded-xl transition-colors"
                >
                  {saved ? '✓ Saved!' : 'Save Settings'}
                </button>
                <button
                  onClick={handleTest}
                  disabled={testing || !settings.n8nUrl}
                  className="px-6 py-3 bg-brand-lime hover:bg-brand-lime/90 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {testing ? 'Testing...' : 'Test Connection'}
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-brand-text font-medium rounded-xl transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-brand-sage/50 border border-dark-forest/10 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-brand-title mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Product Tips
            </h3>
            <ul className="space-y-2 text-sm text-brand-text">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Products are saved in your browser</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Add all ingredients for better AI prompts</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Heat level affects visual styling</span>
              </li>
            </ul>
          </div>

          <div className="bg-brand-sage/50 border border-dark-forest/10 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-brand-title mb-3 flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Quick Tips
            </h3>
            <ul className="space-y-2 text-sm text-brand-text">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Local n8n: <code className="bg-white px-2 py-0.5 rounded">localhost:5678</code></span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Settings persist across sessions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Test connection before saving</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
