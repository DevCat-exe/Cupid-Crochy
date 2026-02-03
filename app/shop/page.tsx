"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ShoppingBag, 
  Filter,
  Star,
  Heart
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/providers/CartProvider";
import { useToast } from "@/components/providers/ToastProvider";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  category: string;
  isNewProduct?: boolean;
  isSoldOut?: boolean;
  rating?: number;
  tags?: string[];
  reviews?: Array<{rating: number; comment: string; user: string; createdAt: string}>;
}

const TAGS = [
  "summer", "floral", "boho", "evening", "pastel", "vintage", "minimalist",
  "festival", "small", "medium", "large", "casual", "elegant", "pattern", "colorful"
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  // Filter States
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>(["All"]);

  const { addToCart } = useCart();
  const { success } = useToast();

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      try {
        const parsedWishlist = JSON.parse(saved);
        setWishlist(parsedWishlist);
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);

          // Extract unique categories from products
          const uniqueCategories = Array.from(new Set(data.map((p: Product) => p.category))).sort() as string[];
          setCategories(["All", ...uniqueCategories]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Filter products when filters change
  useEffect(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Tag filter
    if (selectedTags.length > 0) {
      result = result.filter((p) => 
        selectedTags.every((tag) => p.tags?.includes(tag))
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => 
        p.name.toLowerCase().includes(query) || 
        p.description?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Availability filter
    if (availabilityFilter === "inStock") {
      result = result.filter((p) => !p.isSoldOut);
    } else if (availabilityFilter === "soldOut") {
      result = result.filter((p) => p.isSoldOut);
    }

    setFilteredProducts(result);
  }, [products, activeCategory, selectedTags, searchQuery, availabilityFilter]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const toggleWishlist = (product: Product) => {
    const saved = localStorage.getItem("wishlist");
    let wishlist: Product[] = [];
    
    if (saved) {
      try {
        wishlist = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }

    const isInWishlist = wishlist.some((item: Product) => item._id === product._id);

    if (isInWishlist) {
      wishlist = wishlist.filter((item: Product) => item._id !== product._id);
      setWishlist(wishlist);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      success("Removed from wishlist");
    } else {
      wishlist.push(product);
      setWishlist(wishlist);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      success("Added to wishlist");
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item: Product) => item._id === productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-brand-maroon rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-beige/20">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-brand-maroon to-brand-maroon/90 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Our Collection
          </motion.h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Discover our handcrafted crochet bags, each made with love and attention to detail
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-maroon/40" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-brand-maroon/10 rounded-2xl focus:outline-none focus:border-brand-maroon/30"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-6 py-3 rounded-2xl font-medium whitespace-nowrap transition-all",
                  activeCategory === category
                    ? "bg-brand-maroon text-white"
                    : "bg-white text-brand-maroon hover:bg-brand-pink/20"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all",
              showFilters
                ? "bg-brand-maroon text-white"
                : "bg-white text-brand-maroon hover:bg-brand-pink/20"
            )}
          >
            <Filter className="h-5 w-5" />
            Filters
            {selectedTags.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-brand-pink text-brand-maroon text-xs rounded-full">
                {selectedTags.length}
              </span>
            )}
          </button>
        </div>

        {/* Tag Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white rounded-2xl p-6 border border-brand-maroon/5">
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all capitalize",
                        selectedTags.includes(tag)
                          ? "bg-brand-maroon text-white"
                          : "bg-brand-pink/20 text-brand-maroon hover:bg-brand-pink/40"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-brand-maroon/60 text-lg">No products found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-brand-maroon/5">
                    {/* Image */}
                    <Link href={`/product/${product._id}`} className="block aspect-[4/5] relative overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.isNewProduct && (
                          <span className="px-3 py-1 bg-brand-maroon text-white text-xs font-bold rounded-full">
                            New
                          </span>
                        )}
                        {product.isSoldOut && (
                          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            Sold Out
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-4">
                      <div className="mb-3">
                        <p className="text-xs text-brand-maroon/40 font-medium uppercase tracking-wider mb-1">
                          {product.category}
                        </p>
                        <Link href={`/product/${product._id}`}>
                          <h3 className="font-bold text-brand-maroon text-lg mb-1 group-hover:text-brand-maroon/80 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-brand-maroon/60 line-clamp-2">
                          {product.tags?.slice(0, 3).join(" • ")}
                        </p>
                      </div>

                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-brand-maroon/5">
                        <div className="flex items-center text-yellow-500 gap-1">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-bold text-brand-maroon/70">
                            {product.rating && product.rating > 0 
                              ? product.rating.toFixed(1)
                              : product.reviews && product.reviews.length > 0
                                ? (product.reviews.reduce((sum: number, r: {rating: number}) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
                                : "No reviews"
                            }
                          </span>
                        </div>
                        <span className="font-bold text-brand-maroon whitespace-nowrap">
                          ৳{product.price}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => toggleWishlist(product)}
                          className={cn(
                            "p-2 rounded-lg transition-colors flex-1 flex items-center justify-center gap-2",
                            isInWishlist(product._id)
                              ? "bg-brand-pink text-brand-maroon"
                              : "bg-brand-pink/20 text-brand-maroon hover:bg-brand-pink/40"
                          )}
                        >
                          <Heart className={cn("h-4 w-4", isInWishlist(product._id) && "fill-current")} />
                          <span className="text-sm font-medium">
                            {isInWishlist(product._id) ? "Saved" : "Save"}
                          </span>
                        </button>
                        <button
                          disabled={product.isSoldOut}
                          onClick={() => addToCart({
                            id: product._id,
                            name: product.name,
                            price: product.price,
                            image: product.images[0],
                            quantity: 1
                          })}
                          className="p-2 rounded-lg bg-brand-pink/30 text-brand-maroon hover:bg-brand-maroon hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingBag className="h-4 w-4" />
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
