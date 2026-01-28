import mongoose from "mongoose";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import Coupon from "@/models/Coupon";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cupid-crochy";

// Generate short order ID helper
function generateShortOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate random date within last 90 days
function randomDate(daysBack: number = 90): Date {
  const now = new Date('2026-01-28');
  const pastDate = new Date(now.getTime() - (Math.random() * daysBack * 24 * 60 * 60 * 1000));
  return pastDate;
}

// Generate future date for coupons
function futureDate(daysForward: number = 30): Date {
  const now = new Date('2026-01-28');
  const future = new Date(now.getTime() + (daysForward * 24 * 60 * 60 * 1000));
  return future;
}

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Payment.deleteMany({});
    await Coupon.deleteMany({});
    console.log("All collections cleared");

    // Seed Users
    console.log("Seeding users...");
    const adminPassword = await bcrypt.hash("admin123", 10);
    const staffPassword = await bcrypt.hash("staff123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    await User.create({
      name: "Admin User",
      email: "admin@cupidcrochy.com",
      password: adminPassword,
      role: "admin",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    });

    await User.create({
      name: "Staff Member",
      email: "staff@cupidcrochy.com",
      password: staffPassword,
      role: "staff",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=staff",
    });

    const users = await User.create([
      {
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        password: userPassword,
        role: "user",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      },
      {
        name: "Michael Chen",
        email: "michael.chen@example.com",
        password: userPassword,
        role: "user",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      },
      {
        name: "Emily Davis",
        email: "emily.davis@example.com",
        password: userPassword,
        role: "user",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      },
      {
        name: "James Wilson",
        email: "james.wilson@example.com",
        password: userPassword,
        role: "user",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
      },
      {
        name: "Olivia Brown",
        email: "olivia.brown@example.com",
        password: userPassword,
        role: "user",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=olivia",
      },
    ]);

    console.log("Users seeded successfully");

    // Seed Products
    console.log("Seeding products...");
    const products = await Product.create([
      {
        name: "Floral Crossbody Bag",
        description: "Handcrafted crossbody bag featuring beautiful floral crochet patterns. Perfect for everyday use and special occasions.",
        price: 2800,
        stock: 15,
        category: "Crossbody",
        rating: 4.7,
        tags: ["floral", "handmade", "everyday", "summer"],
        images: [
          "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
        ],
        isNewProduct: true,
        isSoldOut: false,
        createdAt: randomDate(30),
      },
      {
        name: "Cozy Crochet Scarf",
        description: "Warm and stylish scarf made with premium wool blend. Available in various colors and patterns.",
        price: 1500,
        stock: 25,
        category: "Accessories",
        rating: 4.5,
        tags: ["winter", "warm", "cozy", "accessories"],
        images: [
          "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80",
          "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=800&q=80",
        ],
        isNewProduct: false,
        isSoldOut: false,
        createdAt: randomDate(60),
      },
      {
        name: "Crochet Bunny Plush",
        description: "Adorable handmade bunny plush toy. Perfect gift for children and collectors.",
        price: 1200,
        stock: 20,
        category: "Toys",
        rating: 4.9,
        tags: ["cute", "gift", "toy", "handmade"],
        images: [
          "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&q=80",
        ],
        isNewProduct: false,
        isSoldOut: false,
        createdAt: randomDate(45),
      },
      {
        name: "Boho Tote Bag",
        description: "Spacious tote bag with bohemian crochet patterns. Great for shopping, beach, or everyday use.",
        price: 2200,
        stock: 30,
        category: "Tote",
        rating: 4.6,
        tags: ["boho", "summer", "large", "shopping"],
        images: [
          "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
        ],
        isNewProduct: true,
        isSoldOut: false,
        createdAt: randomDate(15),
      },
      {
        name: "Mini Coin Purse",
        description: "Small and adorable coin purse perfect for carrying essentials.",
        price: 800,
        stock: 0,
        category: "Purse",
        rating: 4.3,
        tags: ["small", "cute", "everyday", "accessories"],
        images: [
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
        ],
        isNewProduct: false,
        isSoldOut: true,
        createdAt: randomDate(20),
      },
      {
        name: "Vintage Doily Set",
        description: "Set of 3 handcrafted crochet doilies. Perfect for home decor.",
        price: 1800,
        stock: 18,
        category: "Home Decor",
        rating: 4.4,
        tags: ["vintage", "home", "decor", "pattern"],
        images: [
          "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
        ],
        isNewProduct: false,
        isSoldOut: false,
        createdAt: randomDate(70),
      },
      {
        name: "Pastel Cardigan",
        description: "Soft pastel-colored cardigan with crochet details. Perfect for layering.",
        price: 3200,
        stock: 12,
        category: "Clothing",
        rating: 4.8,
        tags: ["pastel", "clothing", "cozy", "vintage"],
        images: [
          "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80",
        ],
        isNewProduct: true,
        isSoldOut: false,
        createdAt: randomDate(10),
      },
      {
        name: "Market String Bag",
        description: "Classic string bag with crochet details. Roomy interior with secure closure.",
        price: 2600,
        stock: 22,
        category: "String Bag",
        rating: 4.2,
        tags: ["minimalist", "everyday", "large", "shopping"],
        images: [
          "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
        ],
        isNewProduct: false,
        isSoldOut: false,
        createdAt: randomDate(50),
      },
      {
        name: "Boho Tote Bag",
        description: "Spacious tote bag with bohemian crochet patterns. Great for shopping, beach, or everyday use.",
        price: 2200,
        stock: 30,
        category: "Tote",
        tags: ["boho", "summer", "large", "shopping"],
        images: [
          "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
        ],
        features: ["100% Cotton", "Reinforced Handles", "Lined Interior"],
      },
      {
        name: "Mini Coin Purse",
        description: "Small and adorable coin purse perfect for carrying essentials.",
        price: 800,
        stock: 40,
        category: "Purse",
        tags: ["small", "cute", "everyday", "accessories"],
        images: [
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
        ],
        features: ["Snap Closure", "Lined Interior", "Compact Size"],
      },
      {
        name: "Vintage Doily Set",
        description: "Set of 3 handcrafted crochet doilies. Perfect for home decor.",
        price: 1800,
        stock: 18,
        category: "Home Decor",
        tags: ["vintage", "home", "decor", "pattern"],
        images: [
          "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
        ],
        features: ["Set of 3", "100% Cotton", "Machine Washable"],
      },
      {
        name: "Pastel Cardigan",
        description: "Soft pastel-colored cardigan for layering. Perfect for cool weather.",
        price: 3200,
        stock: 12,
        category: "Clothing",
        tags: ["pastel", "clothing", "cozy", "vintage"],
        images: [
          "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80",
        ],
        features: ["Soft Blend", "Open Front", "Side Pockets"],
      },
      {
        name: "Market String Bag",
        description: "Classic string bag with crochet details. Roomy interior with secure closure.",
        price: 2600,
        stock: 22,
        category: "String Bag",
        tags: ["minimalist", "everyday", "large", "shopping"],
        images: [
          "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
        ],
        features: ["Zipper Closure", "Adjustable Strap", "Multiple Pockets"],
      },
    ]);

    console.log("Products seeded successfully");

    // Seed Coupons
    console.log("Seeding coupons...");
    await Coupon.create([
      {
        code: "WELCOME10",
        discount: 10,
        discountType: "percentage",
        maxUses: 100,
        minOrderAmount: 500,
        validFrom: new Date("2026-01-28"),
        validUntil: futureDate(60),
        isActive: true,
        usageCount: 0,
      },
      {
        code: "SUMMER20",
        discount: 20,
        discountType: "percentage",
        maxUses: 50,
        minOrderAmount: 2000,
        validFrom: new Date("2026-02-01"),
        validUntil: futureDate(120),
        isActive: true,
        usageCount: 0,
      },
      {
        code: "SPECIAL15",
        discount: 15,
        discountType: "percentage",
        maxUses: 75,
        minOrderAmount: 1000,
        validFrom: new Date("2026-01-28"),
        validUntil: futureDate(90),
        isActive: true,
        usageCount: 0,
      },
      {
        code: "FLAT500",
        discount: 500,
        discountType: "fixed",
        maxUses: 30,
        minOrderAmount: 3000,
        validFrom: new Date("2024-01-01"),
        validUntil: new Date("2024-12-31"),
        isActive: true,
        usageCount: 0,
      },
      {
        code: "CUPIDLOVE",
        discount: 15,
        discountType: "percentage",
        maxUses: 25,
        minOrderAmount: 1500,
        validFrom: new Date("2024-01-01"),
        validUntil: new Date("2024-12-31"),
        isActive: true,
        usageCount: 0,
      },
    ]);

    console.log("Coupons seeded successfully");

    // Seed Orders
    console.log("Seeding orders...");
    const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    const paymentStatuses = ["paid", "paid", "paid", "paid", "failed"];

    const orders = await Order.create([
      {
        shortOrderId: generateShortOrderId(),
        userId: users[0]._id,
        userName: users[0].name,
        userEmail: users[0].email,
        items: [
          {
            productId: products[0]._id,
            name: products[0].name,
            price: products[0].price,
            quantity: 1,
            image: products[0].images[0],
          },
          {
            productId: products[1]._id,
            name: products[1].name,
            price: products[1].price,
            quantity: 2,
            image: products[1].images[0],
          },
        ],
        total: 2800 + 1500 * 2,
        status: orderStatuses[3],
        paymentStatus: paymentStatuses[0],
        stripePaymentId: "pi_1Demo1",
        shippingAddress: {
          line1: "123 Park Avenue",
          line2: "Apt 4B",
          city: "Dhaka",
          state: "Dhaka",
          postalCode: "1212",
          country: "BD",
        },
      },
      {
        shortOrderId: generateShortOrderId(),
        userId: users[1]._id,
        userName: users[1].name,
        userEmail: users[1].email,
        items: [
          {
            productId: products[2]._id,
            name: products[2].name,
            price: products[2].price,
            quantity: 1,
            image: products[2].images[0],
          },
        ],
        total: 1200,
        status: orderStatuses[2],
        paymentStatus: paymentStatuses[1],
        stripePaymentId: "pi_1Demo2",
        shippingAddress: {
          line1: "456 Elm Street",
          city: "Chittagong",
          state: "Chittagong",
          postalCode: "4000",
          country: "BD",
        },
      },
      {
        shortOrderId: generateShortOrderId(),
        userId: users[2]._id,
        userName: users[2].name,
        userEmail: users[2].email,
        items: [
          {
            productId: products[3]._id,
            name: products[3].name,
            price: products[3].price,
            quantity: 1,
            image: products[3].images[0],
          },
        ],
        total: 2200,
        status: orderStatuses[1],
        paymentStatus: paymentStatuses[2],
        stripePaymentId: "pi_1Demo3",
        shippingAddress: {
          line1: "789 Oak Road",
          city: "Sylhet",
          state: "Sylhet",
          postalCode: "3100",
          country: "BD",
        },
      },
      {
        shortOrderId: generateShortOrderId(),
        userId: users[3]._id,
        userName: users[3].name,
        userEmail: users[3].email,
        items: [
          {
            productId: products[4]._id,
            name: products[4].name,
            price: products[4].price,
            quantity: 1,
            image: products[4].images[0],
          },
        ],
        total: 800,
        status: orderStatuses[0],
        paymentStatus: paymentStatuses[3],
        stripePaymentId: "pi_1Demo4",
        shippingAddress: {
          line1: "321 Pine Lane",
          city: "Rajshahi",
          state: "Rajshahi",
          postalCode: "6000",
          country: "BD",
        },
      },
      {
        shortOrderId: generateShortOrderId(),
        userId: users[4]._id,
        userName: users[4].name,
        userEmail: users[4].email,
        items: [
          {
            productId: products[5]._id,
            name: products[5].name,
            price: products[5].price,
            quantity: 1,
            image: products[5].images[0],
          },
        ],
        total: 1800,
        status: orderStatuses[0],
        paymentStatus: paymentStatuses[4],
        shippingAddress: {
          line1: "654 Maple Drive",
          city: "Khulna",
          state: "Khulna",
          postalCode: "9000",
          country: "BD",
        },
      },
    ]);

    console.log("Orders seeded successfully");

    // Seed Payments
    console.log("Seeding payments...");
    await Payment.create([
      {
        userId: users[0]._id,
        orderId: orders[0]._id,
        amount: 5800,
        currency: "bdt",
        status: "succeeded",
        paymentMethod: "card",
        stripePaymentId: "pi_1Demo1",
        stripeCustomerId: "cus_demo1",
        description: `Payment for Order #${orders[0].shortOrderId}`,
        metadata: {
          userName: users[0].name,
          userEmail: users[0].email,
        },
      },
      {
        userId: users[1]._id,
        orderId: orders[1]._id,
        amount: 1200,
        currency: "bdt",
        status: "succeeded",
        paymentMethod: "card",
        stripePaymentId: "pi_1Demo2",
        stripeCustomerId: "cus_demo2",
        description: `Payment for Order #${orders[1].shortOrderId}`,
        metadata: {
          userName: users[1].name,
          userEmail: users[1].email,
        },
      },
      {
        userId: users[2]._id,
        orderId: orders[2]._id,
        amount: 2200,
        currency: "bdt",
        status: "succeeded",
        paymentMethod: "card",
        stripePaymentId: "pi_1Demo3",
        stripeCustomerId: "cus_demo3",
        description: `Payment for Order #${orders[2].shortOrderId}`,
        metadata: {
          userName: users[2].name,
          userEmail: users[2].email,
        },
      },
      {
        userId: users[3]._id,
        orderId: orders[3]._id,
        amount: 800,
        currency: "bdt",
        status: "succeeded",
        paymentMethod: "card",
        stripePaymentId: "pi_1Demo4",
        stripeCustomerId: "cus_demo4",
        description: `Payment for Order #${orders[3].shortOrderId}`,
        metadata: {
          userName: users[3].name,
          userEmail: users[3].email,
        },
      },
    ]);

    console.log("Payments seeded successfully");

    console.log("\n✅ Seeding completed successfully!");
    console.log("\n📝 Login credentials:");
    console.log("   Admin: admin@cupidcrochy.com / admin123");
    console.log("   Staff: staff@cupidcrochy.com / staff123");
    console.log("   User: sarah.johnson@example.com / user123");
    console.log("\n🛒 Example short order IDs:");
    orders.forEach((order: { shortOrderId: string; status: string }) => {
      console.log(`   ${order.shortOrderId} - ${order.status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
