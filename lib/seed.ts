import mongoose from "mongoose";
import connectDB from "./mongodb";
import Product from "../models/Product";
import * as dotenv from "dotenv";

import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const products = [
  {
    name: "Daisy Tote Bag",
    description: "A beautiful handcrafted daisy tote bag made with premium cotton yarn. Perfect for spring and summer outings.",
    price: 3500,
    images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80", "https://images.unsplash.com/photo-1544816153-16ad4b13bd3b?w=800&q=80"],
    category: "Totes",
    stock: 10,
    rating: 4.8,
    isNewProduct: true,
    tags: ["handmade", "crochet", "floral"]
  },
  {
    name: "Summer Crossbody",
    description: "Compact and stylish crossbody bag for your daily essentials. Features adjustable straps and a secure magnetic clasp.",
    price: 2800,
    images: ["https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80"],
    category: "Crossbody",
    stock: 15,
    rating: 4.5,
    isNewProduct: false,
    tags: ["summer", "daily", "lightweight"]
  },
  {
    name: "Boho Bucket Bag",
    description: "Spacious bucket bag with a bohemian flair. Great for carrying your yarn stash or books.",
    price: 4200,
    images: ["https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80"],
    category: "Buckets",
    stock: 0,
    rating: 4.9,
    isNewProduct: false,
    isSoldOut: true,
    tags: ["boho", "large", "buckethat"]
  },
  {
    name: "Pastel Shoulder Bag",
    description: "Soft pastel colors combine in this elegant shoulder bag. Ideal for weddings or coffee dates.",
    price: 3200,
    images: ["https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=800&q=80"],
    category: "Shoulder",
    stock: 8,
    rating: 4.7,
    isNewProduct: true,
    tags: ["pastel", "elegant", "party"]
  }
];

async function seed() {
  await connectDB();
  console.log("Connected to MongoDB for seeding...");
  
  await Product.deleteMany({});
  console.log("Cleared existing products.");
  
  await Product.insertMany(products);
  console.log("Successfully seeded products!");
  
  process.exit(0);
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
