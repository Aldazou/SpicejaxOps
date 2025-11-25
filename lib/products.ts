// SpiceJax Product Catalog
// Data sourced from https://spicejaxseasonings.com/

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  tags: string[];
}

export const categories = [
  "BBQ Rubs",
  "Global Flavors",
  "Spice Blends",
  "Hot Blends",
  "Sweet & Spicy",
] as const;

export const products: Product[] = [
  {
    id: "birria-fiesta",
    name: "Birria Fiesta Taco Blend",
    category: "Global Flavors",
    price: 7.0,
    rating: 5.0,
    description: "Authentic Mexican seasoning for tacos, stews, and meats. Smoky and slightly sweet spice inspired by authentic Mexican birria.",
    tags: ["Mexican", "Tacos", "Authentic", "No Fillers"],
  },
  {
    id: "nashville-heat-wave",
    name: "Nashville Heat Wave",
    category: "Hot Blends",
    price: 7.0,
    rating: 5.0,
    description: "Authentic heat is always the best choice. Fiery, smoky, and flavorful hot chicken spice blend.",
    tags: ["Hot Chicken", "Spicy", "Southern", "BBQ"],
  },
  {
    id: "honey-chipotle-bbq",
    name: "Honey Chipotle BBQ Rub",
    category: "BBQ Rubs",
    price: 7.0,
    rating: 5.0,
    description: "Sweet, smoky grilling spice with smoky chipotle and honey sweetness. Perfect for chicken, pork, or veggies.",
    tags: ["BBQ", "Sweet", "Smoky", "Grilling"],
  },
  {
    id: "honey-habanero",
    name: "Smoky Honey Habanero Rub",
    category: "Sweet & Spicy",
    price: 7.0,
    rating: 5.0,
    description: "Fiery sweet BBQ seasoning. Hot, smoky, and sweet with habanero heat and honey balance.",
    tags: ["Habanero", "Sweet Heat", "BBQ", "Spicy"],
  },
  {
    id: "shichimi-togarashi",
    name: "Shichimi Togarashi Fusion",
    category: "Global Flavors",
    price: 7.0,
    rating: 5.0,
    description: "Japanese seven-spice blend. Spicy, citrusy flavor perfect for rice, noodles, seafood, and more.",
    tags: ["Japanese", "Seven Spice", "Asian", "Fusion"],
  },
];

export const bundles = [
  {
    id: "global-flavors-duo",
    name: "Global Flavors Duo",
    description: "Take your tastebuds on a world tour with the Global Flavors Duo.",
    products: ["Birria Fiesta", "Shichimi Togarashi"],
  },
  {
    id: "grill-master-trio",
    name: "Grill Master Trio",
    description: "Designed for backyard heroes and BBQ bosses.",
    products: ["BBQ Rubs Collection"],
  },
  {
    id: "sweet-heat-smoke-duo",
    name: "Sweet Heat & Smoke Duo",
    description: "Irresistible combo of sweet, smoky, and spicy.",
    products: ["Honey Chipotle", "Honey Habanero"],
  },
  {
    id: "heat-lovers-trio",
    name: "Heat Lover's Trio",
    description: "Turn up the heat with this fiery trio made for spice enthusiasts!",
    products: ["Nashville Heat Wave", "Honey Habanero", "Shichimi Togarashi"],
  },
  {
    id: "complete-collection",
    name: "The Complete Collection",
    description: "Get the full SpiceJax experience with all five signature blends.",
    products: ["All Products"],
  },
];

export const brandMessages = {
  tagline: "Bold Global Seasonings. No Fillers. Just Flavor",
  subheading: "SpiceJax seasonings are chef-crafted with real ingredients and zero fillers.",
  location: "Miami, FL, USA",
  email: "spicejaxseasonings@gmail.com",
  hours: "Mon-Fri: 10:00 - 18:00",
  usp: [
    "No fillers, no artificial anything",
    "Locally crafted, fast shipping",
    "Bold global blends, loved by foodies",
  ],
};

export const currentPromotion = {
  code: "TD555777",
  description: "Big Sales of Month - Use this discount code in Checkout page",
  active: true,
};

