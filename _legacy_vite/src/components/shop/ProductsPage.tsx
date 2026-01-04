import { useState, useEffect } from "react";
import { getProducts } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Search, Filter, X, ArrowRight } from "lucide-react";
import Layout from "../layout/Layout";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  isNew?: boolean;
  isSoldOut?: boolean;
}

// Products will be loaded from Supabase

const categories = [
  "All",
  "Tote",
  "Crossbody",
  "Bucket",
  "Clutch",
  "Shoulder",
  "Handbag",
];
const tags = [
  "summer",
  "floral",
  "boho",
  "evening",
  "pastel",
  "vintage",
  "minimalist",
  "festival",
  "small",
  "medium",
  "large",
  "casual",
  "elegant",
  "pattern",
  "colorful",
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  // Load products from Supabase
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const productsData = await getProducts();
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory,
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter(
        (product) =>
          product.tags &&
          selectedTags.some((tag) => product.tags.includes(tag)),
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          (product.tags &&
            product.tags.some((tag) => tag.toLowerCase().includes(query))),
      );
    }

    // Filter by availability
    if (availabilityFilter === "available") {
      result = result.filter((product) => !product.isSoldOut);
    } else if (availabilityFilter === "soldout") {
      result = result.filter((product) => product.isSoldOut);
    }

    setFilteredProducts(result);
  }, [
    selectedCategory,
    selectedTags,
    searchQuery,
    availabilityFilter,
    products,
  ]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedTags([]);
    setSearchQuery("");
    setAvailabilityFilter("all");
  };

  return (
    <Layout>
      <div className="pt-24 pb-16 min-h-screen bg-[#F5DDEB]/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#5B1A1A] mb-2">
                Shop Our Collection
              </h1>
              <p className="text-[#5B1A1A]/70 max-w-2xl">
                Browse our handcrafted crochet bags, each made with love and
                attention to detail
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-64">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5B1A1A]/50"
                  size={18}
                />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#5B1A1A]/20 focus:border-[#5B1A1A] rounded-xl"
                />
              </div>

              <Button
                variant="outline"
                className="md:hidden flex items-center gap-2 border-[#5B1A1A]/20 text-[#5B1A1A]"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters - Desktop */}
            <div className="hidden md:block w-64 bg-white p-6 rounded-2xl shadow-sm sticky top-24">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-[#5B1A1A]">Categories</h3>
                  {(selectedCategory !== "All" ||
                    selectedTags.length > 0 ||
                    availabilityFilter !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8 text-[#5B1A1A]/70 hover:text-[#5B1A1A] p-0"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "ghost"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full justify-start ${selectedCategory === category ? "bg-[#5B1A1A] text-white" : "text-[#5B1A1A]/70 hover:text-[#5B1A1A]"}`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-[#5B1A1A] mb-4">
                  Availability
                </h3>
                <div className="space-y-2">
                  <Button
                    variant={availabilityFilter === "all" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setAvailabilityFilter("all")}
                    className={`w-full justify-start ${availabilityFilter === "all" ? "bg-[#5B1A1A] text-white" : "text-[#5B1A1A]/70 hover:text-[#5B1A1A]"}`}
                  >
                    All Items
                  </Button>
                  <Button
                    variant={
                      availabilityFilter === "available" ? "default" : "ghost"
                    }
                    size="sm"
                    onClick={() => setAvailabilityFilter("available")}
                    className={`w-full justify-start ${availabilityFilter === "available" ? "bg-[#5B1A1A] text-white" : "text-[#5B1A1A]/70 hover:text-[#5B1A1A]"}`}
                  >
                    In Stock
                  </Button>
                  <Button
                    variant={
                      availabilityFilter === "soldout" ? "default" : "ghost"
                    }
                    size="sm"
                    onClick={() => setAvailabilityFilter("soldout")}
                    className={`w-full justify-start ${availabilityFilter === "soldout" ? "bg-[#5B1A1A] text-white" : "text-[#5B1A1A]/70 hover:text-[#5B1A1A]"}`}
                  >
                    Sold Out
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#5B1A1A] mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags &&
                    tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={
                          selectedTags.includes(tag) ? "default" : "outline"
                        }
                        className={`cursor-pointer capitalize ${selectedTags.includes(tag) ? "bg-[#5B1A1A] hover:bg-[#5B1A1A]/90" : "border-[#5B1A1A]/30 text-[#5B1A1A]/70 hover:border-[#5B1A1A]/50 hover:text-[#5B1A1A]"}`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>

            {/* Filters - Mobile */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden w-full bg-white p-6 rounded-2xl shadow-sm mb-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-[#5B1A1A]">Filters</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowFilters(false)}
                    className="h-8 w-8 text-[#5B1A1A]/70 hover:text-[#5B1A1A]"
                  >
                    <X size={18} />
                  </Button>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-[#5B1A1A] mb-2">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={
                          selectedCategory === category ? "default" : "outline"
                        }
                        className={`cursor-pointer ${selectedCategory === category ? "bg-[#5B1A1A] hover:bg-[#5B1A1A]/90" : "border-[#5B1A1A]/30 text-[#5B1A1A]/70 hover:border-[#5B1A1A]/50 hover:text-[#5B1A1A]"}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-[#5B1A1A] mb-2">
                    Availability
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={
                        availabilityFilter === "all" ? "default" : "outline"
                      }
                      className={`cursor-pointer ${availabilityFilter === "all" ? "bg-[#5B1A1A] hover:bg-[#5B1A1A]/90" : "border-[#5B1A1A]/30 text-[#5B1A1A]/70 hover:border-[#5B1A1A]/50 hover:text-[#5B1A1A]"}`}
                      onClick={() => setAvailabilityFilter("all")}
                    >
                      All Items
                    </Badge>
                    <Badge
                      variant={
                        availabilityFilter === "available"
                          ? "default"
                          : "outline"
                      }
                      className={`cursor-pointer ${availabilityFilter === "available" ? "bg-[#5B1A1A] hover:bg-[#5B1A1A]/90" : "border-[#5B1A1A]/30 text-[#5B1A1A]/70 hover:border-[#5B1A1A]/50 hover:text-[#5B1A1A]"}`}
                      onClick={() => setAvailabilityFilter("available")}
                    >
                      In Stock
                    </Badge>
                    <Badge
                      variant={
                        availabilityFilter === "soldout" ? "default" : "outline"
                      }
                      className={`cursor-pointer ${availabilityFilter === "soldout" ? "bg-[#5B1A1A] hover:bg-[#5B1A1A]/90" : "border-[#5B1A1A]/30 text-[#5B1A1A]/70 hover:border-[#5B1A1A]/50 hover:text-[#5B1A1A]"}`}
                      onClick={() => setAvailabilityFilter("soldout")}
                    >
                      Sold Out
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[#5B1A1A] mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags &&
                      tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={
                            selectedTags.includes(tag) ? "default" : "outline"
                          }
                          className={`cursor-pointer capitalize ${selectedTags.includes(tag) ? "bg-[#5B1A1A] hover:bg-[#5B1A1A]/90" : "border-[#5B1A1A]/30 text-[#5B1A1A]/70 hover:border-[#5B1A1A]/50 hover:text-[#5B1A1A]"}`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="text-[#5B1A1A]"
                  >
                    Clear All
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="bg-[#5B1A1A] hover:bg-[#5B1A1A]/90"
                  >
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium text-[#5B1A1A] mb-2">
                    No products found
                  </h3>
                  <p className="text-[#5B1A1A]/70 mb-4">
                    Try adjusting your filters or search query
                  </p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="border-[#5B1A1A] text-[#5B1A1A] hover:bg-[#5B1A1A] hover:text-white"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Link to={`/product/${product.id}`}>
                        <Card className="overflow-hidden rounded-2xl border-none shadow-md hover:shadow-xl transition-shadow duration-300 h-full bg-white">
                          <div className="relative overflow-hidden group">
                            <img
                              src={product.image}
                              alt={product.name}
                              className={`w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-500 ${product.isSoldOut ? "opacity-70" : ""}`}
                            />
                            {product.isNew && (
                              <Badge className="absolute top-4 left-4 bg-[#5B1A1A] text-white">
                                New Arrival
                              </Badge>
                            )}
                            {product.isSoldOut && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Badge className="bg-black/70 text-white px-4 py-2 text-lg font-bold">
                                  Sold Out
                                </Badge>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <Button
                                variant="default"
                                size="sm"
                                className="rounded-xl bg-white text-[#5B1A1A] hover:bg-[#F5DDEB] transition-colors"
                              >
                                View Details{" "}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-lg text-[#5B1A1A]">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-[#5B1A1A]/70">
                                  {product.category}
                                </p>
                              </div>
                              <p className="font-bold text-lg">
                                ৳
                                {typeof product.price === "number"
                                  ? product.price.toFixed(2)
                                  : product.price}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
