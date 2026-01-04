import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "@/lib/supabase";
import { useCart } from "../cart/CartProvider";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  ChevronLeft,
  Plus,
  Minus,
  Share2,
  Maximize2,
} from "lucide-react";
import Layout from "../layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  isNew?: boolean;
  isSoldOut?: boolean;
  description?: string;
  features?: string[];
  careInstructions?: string[];
  additionalImages?: string[];
}

// Products will be loaded from Supabase

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const { openCart, addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;

      try {
        setLoading(true);
        const productData = await getProductById(id);
        if (productData) {
          setProduct(productData);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="pt-24 pb-16 min-h-screen bg-[#F5DDEB]/30 flex items-center justify-center">
          <div className="animate-pulse text-[#5B1A1A]">Loading product...</div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="pt-24 pb-16 min-h-screen bg-[#F5DDEB]/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-[#5B1A1A]">
              Product not found
            </h2>
            <p className="mt-4 text-[#5B1A1A]/70">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/shop" className="mt-6 inline-block">
              <Button className="bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 text-white">
                Return to Shop
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <Layout>
      <div className="pt-24 pb-16 min-h-screen bg-[#F5DDEB]/30">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link
              to="/shop"
              className="inline-flex items-center text-[#5B1A1A] hover:text-[#5B1A1A]/80 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Shop
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-xl">
                  <div
                    className={`cursor-zoom-in transition-transform duration-500 ${isZoomed ? "scale-150" : "scale-100"}`}
                    onClick={toggleZoom}
                  >
                    <img
                      src={
                        product.additionalImages?.[selectedImage] ||
                        product.image
                      }
                      alt={product.name}
                      className="w-full h-[400px] object-cover rounded-xl"
                    />
                  </div>
                  <button
                    className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                    onClick={toggleZoom}
                  >
                    <Maximize2 className="h-5 w-5 text-[#5B1A1A]" />
                  </button>

                  {product.isSoldOut && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Badge className="bg-black/70 text-white px-6 py-3 text-xl font-bold">
                        Sold Out
                      </Badge>
                    </div>
                  )}
                </div>

                {product.additionalImages &&
                  product.additionalImages.length > 0 && (
                    <div className="flex space-x-3 overflow-x-auto pb-2">
                      {product.additionalImages.map((img, index) => (
                        <button
                          key={index}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? "border-[#5B1A1A] scale-105" : "border-transparent opacity-70"}`}
                          onClick={() => setSelectedImage(index)}
                        >
                          <img
                            src={img}
                            alt={`${product.name} view ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className="bg-[#F5DDEB] text-[#5B1A1A] hover:bg-[#F5DDEB]/90">
                      {product.category}
                    </Badge>
                    {product.isNew && (
                      <Badge className="bg-[#5B1A1A] text-white hover:bg-[#5B1A1A]/90">
                        New Arrival
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-[#5B1A1A] mb-2">
                    {product.name}
                  </h1>
                  <p className="text-2xl font-semibold mb-4">
                    ৳{product.price.toFixed(2)}
                  </p>
                  <p className="text-gray-600 mb-6">{product.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-[#5B1A1A] font-medium">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={handleDecrement}
                        disabled={product.isSoldOut}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <button
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={handleIncrement}
                        disabled={product.isSoldOut}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      className="bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 rounded-xl flex-1"
                      onClick={() => {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image:
                            product.image ||
                            product.additionalImages?.[0] ||
                            "",
                          quantity: quantity,
                        });
                        openCart();
                      }}
                      disabled={product.isSoldOut}
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      {product.isSoldOut ? "Sold Out" : "Add to Cart"}
                    </Button>
                  </div>

                  <div className="flex items-center space-x-4 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#5B1A1A] hover:bg-[#F5DDEB]/30"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.tags &&
                      product.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-[#F5DDEB]/50 text-[#5B1A1A] px-2 py-0.5 rounded-full capitalize"
                        >
                          {tag}
                        </span>
                      ))}
                    {product.tags && product.tags.length > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        +{product.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="p-6 border-t">
              <Tabs defaultValue="features">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="care">Care Instructions</TabsTrigger>
                </TabsList>
                <TabsContent value="features" className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#5B1A1A]">
                    Product Features
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {product.features?.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="care" className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#5B1A1A]">
                    Care Instructions
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {product.careInstructions?.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
