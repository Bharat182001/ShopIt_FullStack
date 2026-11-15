const Product = require("../models/productModel");

const demoProducts = [
  {
    name: "Demo Wireless Headphones",
    description: "Demo catalog item with cushioned ear cups and wireless playback.",
    price: 2499,
    category: "Electronics",
    Stock: 18,
    ratings: 4.5,
    images: [{
      public_id: "demo/wireless-headphones",
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    }],
  },
  {
    name: "Demo Everyday Backpack",
    description: "Demo catalog item with a roomy main compartment for daily use.",
    price: 1899,
    category: "Accessories",
    Stock: 24,
    ratings: 4.2,
    images: [{
      public_id: "demo/everyday-backpack",
      url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    }],
  },
  {
    name: "Demo Classic Wristwatch",
    description: "Demo catalog item with a minimalist dial and adjustable strap.",
    price: 3299,
    category: "Accessories",
    Stock: 12,
    ratings: 4.4,
    images: [{
      public_id: "demo/classic-wristwatch",
      url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    }],
  },
  {
    name: "Demo Running Sneakers",
    description: "Demo catalog item with a lightweight build for everyday runs.",
    price: 2799,
    category: "Footwear",
    Stock: 20,
    ratings: 4.3,
    images: [{
      public_id: "demo/running-sneakers",
      url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    }],
  },
  {
    name: "Demo Cotton T-Shirt",
    description: "Demo catalog item made for a comfortable everyday fit.",
    price: 799,
    category: "Clothing",
    Stock: 30,
    ratings: 4.1,
    images: [{
      public_id: "demo/cotton-t-shirt",
      url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    }],
  },
  {
    name: "Demo Compact Camera",
    description: "Demo catalog item with a compact body for travel and casual photography.",
    price: 8999,
    category: "Electronics",
    Stock: 7,
    ratings: 4.6,
    images: [{
      public_id: "demo/compact-camera",
      url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    }],
  },
];

async function seedDemoProducts() {
  if (process.env.SEED_DEMO_PRODUCTS === "false") return 0;

  // Bootstrap an empty catalog once. Existing inventory is never overwritten
  // or mixed with demo records.
  if (await Product.estimatedDocumentCount()) return 0;

  const result = await Product.bulkWrite(
    demoProducts.map((product) => ({
      updateOne: {
        filter: { name: product.name, "images.public_id": product.images[0].public_id },
        update: { $setOnInsert: product },
        upsert: true,
      },
    }))
  );

  return result.upsertedCount || 0;
}

module.exports = seedDemoProducts;
