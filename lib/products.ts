/**
 * SpiceJax Product Management
 * 
 * Products are stored in localStorage so you can add/edit them
 * without touching code. The default products are your original 5.
 */

export interface SpiceProduct {
  id: string;
  name: string;
  shortName: string;
  ingredients: string[];
  goodOn: string[];
  description: string;
  heat: number; // 1-5
  color: string; // hex color
}

// Default products - your original 5
export const DEFAULT_PRODUCTS: SpiceProduct[] = [
  {
    id: "shichimi-togarashi",
    name: "Shichimi Togarashi Fusion",
    shortName: "Shichimi Togarashi",
    ingredients: ["Black Sesame", "Sesame", "Sea Salt", "Korean Chili", "Garlic", "Orange Peel", "Ginger"],
    goodOn: ["Rice", "Noodles", "Chicken", "Seafood", "Vegetables"],
    description: "A Japanese-inspired spicy and savory blend with chili, sesame, and citrus notes, perfect for global fusion dishes",
    heat: 2,
    color: "#dc2626",
  },
  {
    id: "birria-fiesta",
    name: "Birria Fiesta Taco Blend",
    shortName: "Birria Fiesta",
    ingredients: ["Guajillo Chili Powder", "Brown Sugar", "Sea Salt", "Ancho Chili Powder", "Garlic", "Cumin", "Coriander", "Onion", "Cloves", "Black Pepper", "Cinnamon", "Oregano"],
    goodOn: ["Beef", "Lamb", "Pork", "Chicken", "Vegetables"],
    description: "A vibrant, smoky, and slightly sweet spice blend inspired by traditional birria tacos",
    heat: 1,
    color: "#eab308",
  },
  {
    id: "smokey-honey-habanero",
    name: "Smokey Honey Habanero Rub",
    shortName: "Smokey Honey Habanero",
    ingredients: ["Pink Himalayan Salt", "Honey", "Habanero", "Garlic", "Cayenne", "Paprika", "Hickory Smoke"],
    goodOn: ["Chicken", "Pork", "Seafood", "Vegetables", "Beef"],
    description: "A fiery, sweet, and smoky rub with habanero heat and hickory smoke, balanced by honey",
    heat: 3,
    color: "#ea580c",
  },
  {
    id: "nashville-heat",
    name: "Nashville Heat Wave",
    shortName: "Nashville Heat",
    ingredients: ["Cayenne", "Brown Sugar", "Sea Salt", "Paprika", "Garlic", "Onion", "Black Pepper", "Ancho Chili"],
    goodOn: ["Chicken", "Pork", "Seafood", "Vegetables", "Beef"],
    description: "A bold, fiery spice blend inspired by Nashville hot chicken, with intense heat and rich flavor",
    heat: 4,
    color: "#171717",
  },
  {
    id: "honey-chipotle",
    name: "Honey Chipotle BBQ Rub",
    shortName: "Honey Chipotle",
    ingredients: ["Kosher Salt", "Chipotle Powder", "Honey", "Garlic", "Paprika", "Black Pepper", "Cumin"],
    goodOn: ["Chicken", "Pork", "Seafood", "Vegetables", "Beef"],
    description: "A sweet, smoky, and spicy rub perfect for grilling, with a hint of honey and chipotle heat",
    heat: 3,
    color: "#7f1d1d",
  },
];

const STORAGE_KEY = "spicejax-products";

/**
 * Get all products from localStorage (or defaults if none saved)
 */
export function getProducts(): SpiceProduct[] {
  if (typeof window === "undefined") return DEFAULT_PRODUCTS;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PRODUCTS;
    }
  } catch (e) {
    console.error("Failed to load products:", e);
  }
  return DEFAULT_PRODUCTS;
}

/**
 * Save products to localStorage
 */
export function saveProducts(products: SpiceProduct[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error("Failed to save products:", e);
  }
}

/**
 * Add a new product
 */
export function addProduct(product: Omit<SpiceProduct, "id">): SpiceProduct {
  const products = getProducts();
  const newProduct: SpiceProduct = {
    ...product,
    id: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

/**
 * Update an existing product
 */
export function updateProduct(id: string, updates: Partial<SpiceProduct>): SpiceProduct | null {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  products[index] = { ...products[index], ...updates };
  saveProducts(products);
  return products[index];
}

/**
 * Delete a product
 */
export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  
  saveProducts(filtered);
  return true;
}

/**
 * Reset to default products
 */
export function resetProducts(): void {
  saveProducts(DEFAULT_PRODUCTS);
}

/**
 * Generate a unique ID from a name
 */
export function generateId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
