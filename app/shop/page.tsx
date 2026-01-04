"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ShoppingBag, 
  Star
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/providers/CartProvider";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  isNewProduct?: boolean;
  isSoldOut?: boolean;
  rating?: number;
}

const CATEGORIES = ["All", "Totes", "Crossbody", "Buckets", "Shoulder", "Clutches"];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const url = activeCategory === "All" 
          ? "/api/products" 
          : `/api/products?category=${activeCategory}`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [activeCategory]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Shop Header */}
      <div className="bg-brand-pink/30 py-16 lg:py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-6xl font-bold text-brand-maroon mb-6"
          >
            Our Collection
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-brand-maroon/70 max-w-2xl mx-auto"
          >
            Each piece is handcrafted with premium threads and endless love. Browse our unique crochet designs.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                  activeCategory === cat
                    ? "bg-brand-maroon text-white shadow-lg"
                    : "bg-brand-pink/50 text-brand-maroon hover:bg-brand-maroon/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative group max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-maroon/40 group-focus-within:text-brand-maroon transition-colors" />
            <input
              type="text"
              placeholder="Search for your favorite bag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-pink/20 border border-brand-maroon/5 rounded-2xl py-4 pl-12 pr-6 focus:bg-white focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-medium"
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-3/4 bg-brand-pink/20 rounded-4xl" />
                <div className="h-4 bg-brand-pink/20 rounded w-3/4" />
                <div className="h-4 bg-brand-pink/20 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <h3 className="text-2xl font-bold text-brand-maroon mb-2">No items found</h3>
            <p className="text-brand-maroon/60">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div className="group relative bg-white rounded-4xl border border-brand-maroon/5 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full flex flex-col p-2">
                    <Link href={`/product/${product._id}`} className="relative aspect-3/4 rounded-3xl overflow-hidden bg-brand-pink/20">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className={cn(
                          "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
                          product.isSoldOut && "grayscale-40 opacity-80"
                        )}
                      />
                      {product.isNewProduct && (
                        <span className="absolute top-4 left-4 bg-brand-maroon text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full z-10">
                          New
                        </span>
                      )}
                      {product.isSoldOut && (
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-10">
                          <span className="bg-white/90 text-brand-maroon font-bold px-6 py-2 rounded-2xl transform -rotate-3 text-sm">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </Link>

                    <div className="p-6 grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <Link href={`/product/${product._id}`}>
                          <h3 className="font-bold text-brand-maroon text-lg leading-tight hover:text-brand-maroon/70 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <span className="font-bold text-lg text-brand-maroon">৳{product.price}</span>
                      </div>
                      <p className="text-xs font-bold text-brand-maroon/40 uppercase tracking-widest mb-4">
                        {product.category}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center text-yellow-600 space-x-1">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-bold">{product.rating || "5.0"}</span>
                        </div>
                        <button
                          disabled={product.isSoldOut}
                          onClick={() => addToCart({
                            id: product._id,
                            name: product.name,
                            price: product.price,
                            image: product.images[0],
                            quantity: 1
                          })}
                          className="p-3 rounded-2xl bg-brand-pink/50 text-brand-maroon hover:bg-brand-maroon hover:text-white transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingBag className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
