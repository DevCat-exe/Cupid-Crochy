"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingBag, ArrowLeft, Check, Truck, ShieldCheck, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/providers/CartProvider";
import ProductReviews from "@/components/product/ProductReviews";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  tags?: string[];
  reviews: { user: string; rating: number; comment: string; createdAt: string }[];
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        router.push("/shop");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-maroon" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="container mx-auto px-6 py-12">
        <Link 
          href="/shop" 
          className="inline-flex items-center text-brand-maroon/60 hover:text-brand-maroon font-bold mb-8 transition-colors group"
        >
          <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-[3rem] overflow-hidden bg-brand-pink/20 shadow-2xl relative"
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    "aspect-square rounded-2xl overflow-hidden border-4 transition-all relative",
                    selectedImage === idx ? "border-brand-maroon shadow-lg scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image 
                    src={img} 
                    alt={`${product.name} thumbnail ${idx}`} 
                    fill 
                    className="object-cover" 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
               <div>
                 <span className="text-xs font-bold text-brand-maroon/40 uppercase tracking-[0.2em] mb-2 block">
                   {product.category}
                 </span>
                 <h1 className="text-4xl lg:text-5xl font-bold text-brand-maroon leading-tight mb-4">
                   {product.name}
                 </h1>
                 {product.tags && product.tags.length > 0 && (
                   <div className="flex flex-wrap gap-2 mb-4">
                     {product.tags.map(tag => (
                       <span key={tag} className="px-3 py-1 bg-brand-pink/30 text-brand-maroon/80 text-sm font-medium rounded-full capitalize border border-brand-maroon/10">
                         {tag}
                       </span>
                     ))}
                   </div>
                 )}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("h-5 w-5 fill-current", i >= Math.floor(product.rating) && "opacity-30")} />
                    ))}
                    <span className="ml-2 text-brand-maroon font-bold">{product.rating || "5.0"}</span>
                  </div>
                  <span className="text-brand-maroon/20 text-xl">|</span>
                  <span className="text-brand-maroon/60 text-sm font-medium">{product.reviews.length} reviews</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-brand-maroon">
                ৳{product.price}
              </div>

              <div className="space-y-4">
                <p className="text-brand-maroon/70 leading-relaxed text-lg">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                    <Check className="h-3 w-3 mr-1" /> In Stock
                  </span>
                  <span className="inline-flex items-center bg-brand-pink/30 text-brand-maroon px-3 py-1 rounded-full text-xs font-bold border border-brand-maroon/5">
                    Handmade in BD
                  </span>
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="pt-8 space-y-6 border-t border-brand-maroon/5">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center bg-brand-pink/30 rounded-2xl p-1 border border-brand-maroon/10">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-white rounded-xl transition-all"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-white rounded-xl transition-all"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => addToCart({
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.images[0],
                      quantity: quantity
                    })}
                    className="grow bg-brand-maroon text-white font-bold h-14 rounded-2xl shadow-xl hover:shadow-brand-maroon/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-3 group"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                  
                  <button className="h-14 w-14 rounded-2xl border border-brand-maroon/10 flex items-center justify-center hover:bg-brand-pink/20 transition-all text-brand-maroon">
                    <Heart className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-brand-pink/30 p-3 rounded-xl">
                    <Truck className="h-5 w-5 text-brand-maroon" />
                  </div>
                  <span className="text-sm font-bold text-brand-maroon/70">Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-brand-pink/30 p-3 rounded-xl">
                    <ShieldCheck className="h-5 w-5 text-brand-maroon" />
                  </div>
                  <span className="text-sm font-bold text-brand-maroon/70">Secure Payment</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews 
          productId={product._id} 
          initialReviews={product.reviews} 
          initialRating={product.rating} 
        />
      </div>
    </div>
  );
}
