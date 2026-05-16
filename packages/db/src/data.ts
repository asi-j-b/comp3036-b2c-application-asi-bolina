export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  rating: number;
  reviews: number;
  featured?: boolean;
  active: boolean;
};

export const mockProducts: Product[] = [
  {
    id: 1,
    slug: "aeropulse-smart-watch",
    name: "AeroPulse Smart Watch",
    description:
      "Track workouts, sleep, and notifications with a bright always-on display.",
    price: 219,
    category: "Electronics",
    stock: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    reviews: 142,
    featured: true,
    active: true,
  },
  {
    id: 2,
    slug: "studio-noise-cancel-headphones",
    name: "Studio Noise-Cancel Headphones",
    description:
      "Comfort fit headphones with deep bass and active noise cancellation.",
    price: 349,
    category: "Electronics",
    stock: 11,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    reviews: 213,
    featured: true,
    active: true,
  },
  {
    id: 3,
    slug: "metroline-hoodie",
    name: "MetroLine Hoodie",
    description:
      "A heavyweight everyday hoodie with a relaxed cut and brushed interior.",
    price: 78,
    category: "Clothing",
    stock: 32,
    imageUrl:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    reviews: 89,
    active: true,
  },
  {
    id: 4,
    slug: "everyday-running-shoes",
    name: "Everyday Running Shoes",
    description:
      "Lightweight cushioning and a breathable upper for all-day comfort.",
    price: 129,
    category: "Footwear",
    stock: 19,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    reviews: 176,
    active: true,
  },
  {
    id: 5,
    slug: "minimal-desk-lamp",
    name: "Minimal Desk Lamp",
    description:
      "Warm lighting, a compact footprint, and a matte finish for modern spaces.",
    price: 64,
    category: "Home",
    stock: 24,
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    rating: 4.5,
    reviews: 64,
    active: true,
  },
  {
    id: 6,
    slug: "kitchen-prep-set",
    name: "Kitchen Prep Set",
    description:
      "A durable prep kit with the essentials for quick weeknight meals.",
    price: 52,
    category: "Kitchen",
    stock: 27,
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80",
    rating: 4.4,
    reviews: 48,
    active: true,
  },
  {
    id: 7,
    slug: "everyday-canvas-tote",
    name: "Everyday Canvas Tote",
    description:
      "A sturdy tote bag with reinforced handles and a spacious interior.",
    price: 39,
    category: "Accessories",
    stock: 41,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    rating: 4.3,
    reviews: 33,
    active: false,
  },
  {
    id: 8,
    slug: "compact-bluetooth-speaker",
    name: "Compact Bluetooth Speaker",
    description:
      "Portable sound with rich bass and a 12-hour battery life.",
    price: 89,
    category: "Electronics",
    stock: 14,
    imageUrl:
      "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    reviews: 97,
    active: true,
  },
];

export const products = mockProducts;