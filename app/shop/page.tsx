"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ShoppingBag, 
  Filter,
  ArrowRight,
  Star,
  Heart
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/providers/CartProvider";
import { useToast } from "@/components/providers/ToastProvider";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  isNewProduct?: boolean;
  isSoldOut?: boolean;
  rating?: number;
  reviews?: Array<{user: string; userImage?: string; rating: number; comment: string; createdAt: string}>;
  tags?: string[];
}

const TAGS = [
  "summer", "floral", "boho", "evening", "pastel", "vintage", "minimalist",
  "festival", "small", "medium", "large", "casual", "elegant", "pattern", "colorful"
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const { addToCart } = useCart();
  const { success } = useToast();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);

        // Extract unique categories from products
        const uniqueCategories = Array.from(new Set(data.map((p: Product) => p.category))).sort() as string[];
        setCategories(["All", ...uniqueCategories]);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    let result = [...products];

    // Category
    if (activeCategory !== "All") {
      result = result.filter(p => p.category === activeCategory);
    }

    // Tags
    if (selectedTags.length > 0) {
      result = result.filter(p => 
        p.tags && selectedTags.some(tag => p.tags?.includes(tag))
      );
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Availability
    if (availabilityFilter === "available") {
      result = result.filter(p => !p.isSoldOut);
    } else if (availabilityFilter === "soldout") {
      result = result.filter(p => p.isSoldOut);
    }

    setFilteredProducts(result);
  }, [products, activeCategory, selectedTags, searchQuery, availabilityFilter]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const clearFilters = () => {
    setActiveCategory("All");
    setSelectedTags([]);
    setSearchQuery("");
    setAvailabilityFilter("all");
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item._id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product._id)) {
      setWishlist(prev => prev.filter(item => item._id !== product._id));
      success("Removed from wishlist");
    } else {
      setWishlist(prev => [...prev, product]);
      success("Added to wishlist");
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige/30 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-maroon mb-2 font-outfit">
              Shop Our Collection
            </h1>
            <p className="text-brand-maroon/70 max-w-2xl font-outfit">
              Browse our handcrafted crochet bags, each made with love and attention to detail
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-maroon/50 h-4 w-4" />
              <input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-brand-maroon/20 focus:outline-none focus:border-brand-maroon bg-white text-brand-maroon placeholder:text-brand-maroon/40"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2 border border-brand-maroon/20 rounded-xl text-brand-maroon bg-white"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden md:block w-64 shrink-0 space-y-8 sticky top-32 h-fit overflow-y-auto max-h-[calc(100vh-8rem)] scrollbar-thin scrollbar-thumb-brand-maroon/20 scrollbar-track-transparent">
            <div className="bg-white rounded-2xl border border-brand-maroon/5 p-6">
              {/* Category Filter */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-brand-maroon font-outfit">Categories</h3>
                  {(activeCategory !== "All" || selectedTags.length > 0 || availabilityFilter !== "all" || searchQuery) && (
                    <button onClick={clearFilters} className="text-xs text-brand-maroon/60 hover:text-brand-maroon font-bold">
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        activeCategory === cat
                          ? "bg-brand-maroon text-white"
                          : "text-brand-maroon/70 hover:bg-brand-pink/20 hover:text-brand-maroon"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <h3 className="font-bold text-brand-maroon mb-4 font-outfit">Availability</h3>
                <div className="space-y-1">
                  {[
                    { id: "all", label: "All Items" },
                    { id: "available", label: "In Stock" },
                    { id: "soldout", label: "Sold Out" }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setAvailabilityFilter(opt.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        availabilityFilter === opt.id
                          ? "bg-brand-maroon text-white"
                          : "text-brand-maroon/70 hover:bg-brand-pink/20 hover:text-brand-maroon"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <h3 className="font-bold text-brand-maroon mb-4 font-outfit">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold border transition-all capitalize",
                        selectedTags.includes(tag)
                          ? "bg-brand-maroon text-white border-brand-maroon"
                          : "bg-transparent text-brand-maroon/70 border-brand-maroon/30 hover:border-brand-maroon hover:text-brand-maroon"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
           </div>

          {/* Product Grid */}
          <div className="grow">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[...Array(6)].map((_, i) => (
                   <div key={i} className="aspect-3/4 bg-brand-pink/10 rounded-2xl animate-pulse" />
                 ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-brand-maroon/5">
                <h3 className="text-xl font-bold text-brand-maroon mb-2">No products found</h3>
                <p className="text-brand-maroon/60 mb-4">Try adjusting your filters or search query</p>
                <button 
                  onClick={clearFilters}
                  className="px-6 py-2 border border-brand-maroon text-brand-maroon rounded-xl font-bold hover:bg-brand-maroon hover:text-white transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="group relative bg-white rounded-2xl border border-brand-maroon/5 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                        <Link href={`/product/${product._id}`} className="relative aspect-4/5 overflow-hidden bg-brand-pink/20">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className={cn(
                              "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
                              product.isSoldOut && "grayscale opacity-80"
                            )}
                          />
                          {product.isNewProduct && (
                            <span className="absolute top-3 left-3 bg-brand-maroon text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                              New
                            </span>
                          )}
                          {product.isSoldOut && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="bg-white/90 text-brand-maroon font-bold px-6 py-2 rounded-xl transform -rotate-3">
                                Sold Out
                              </span>
                            </div>
                          )}
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button className="bg-white text-brand-maroon font-bold px-6 py-3 rounded-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-brand-beige">
                              View Details <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </Link>

                         <div className="p-4 grow flex flex-col">
                           {/* Tags */}
                           {product.tags && product.tags.length > 0 && (
                             <div className="flex flex-wrap gap-2 mb-3">
                               {product.tags.slice(0, 3).map(tag => (
                                 <span key={tag} className="px-2 py-1 bg-brand-pink/30 text-brand-maroon/80 text-[10px] font-medium rounded-full capitalize">
                                   {tag}
                                 </span>
                               ))}
                               {product.tags.length > 3 && (
                                 <span className="px-2 py-1 bg-brand-pink/20 text-brand-maroon/60 text-[10px] font-medium rounded-full">
                                   +{product.tags.length - 3}
                                 </span>
                               )}
                             </div>
                           )}

                           <div className="flex justify-between items-start mb-2">
                             <div>
                               <h3 className="font-bold text-brand-maroon text-lg leading-tight line-clamp-1">
                                 {product.name}
                               </h3>
                               <p className="text-xs text-brand-maroon/60 font-medium uppercase tracking-wider mt-1">
                                 {product.category}
                               </p>
                             </div>
                             <span className="font-bold text-brand-maroon whitespace-nowrap">
                               ৳{product.price}
                             </span>
                           </div>

                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-brand-maroon/5">
                              <div className="flex items-center text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < Math.round(product.rating || 0) ? 'fill-current' : 'text-brand-maroon/20'}`} 
                                  />
                                ))}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleWishlist(product)}
                                  className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    isInWishlist(product._id)
                                      ? "bg-brand-maroon text-white"
                                      : "bg-brand-pink/30 text-brand-maroon hover:bg-brand-maroon hover:text-white"
                                  )}
                                >
                                  <Heart className={cn("h-4 w-4", isInWishlist(product._id) && "fill-current")} />
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
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="fixed inset-0 z-50 flex md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setShowFilters(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="ml-auto h-full w-full max-w-sm bg-white p-6 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-brand-maroon font-outfit">Filters</h3>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="text-sm font-bold text-brand-maroon/60 hover:text-brand-maroon"
                >
                  Close
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-brand-maroon">Categories</h4>
                    {(activeCategory !== "All" || selectedTags.length > 0 || availabilityFilter !== "all" || searchQuery) && (
                      <button
                        onClick={clearFilters}
                        className="text-xs font-bold text-brand-maroon/60 hover:text-brand-maroon"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium border transition-colors",
                          activeCategory === cat
                            ? "bg-brand-maroon text-white border-brand-maroon"
                            : "border-brand-maroon/30 text-brand-maroon/70"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-brand-maroon mb-3">Availability</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "all", label: "All Items" },
                      { id: "available", label: "In Stock" },
                      { id: "soldout", label: "Sold Out" }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setAvailabilityFilter(opt.id)}
                        className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium border transition-colors",
                          availabilityFilter === opt.id
                            ? "bg-brand-maroon text-white border-brand-maroon"
                            : "border-brand-maroon/30 text-brand-maroon/70"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-brand-maroon mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold border transition-all capitalize",
                          selectedTags.includes(tag)
                            ? "bg-brand-maroon text-white border-brand-maroon"
                            : "bg-transparent text-brand-maroon/70 border-brand-maroon/30 hover:border-brand-maroon hover:text-brand-maroon"
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-3">
                <button
                  onClick={clearFilters}
                  className="w-full py-3 border border-brand-maroon rounded-xl text-brand-maroon font-bold text-sm"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-3 bg-brand-maroon rounded-xl text-white font-bold text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
