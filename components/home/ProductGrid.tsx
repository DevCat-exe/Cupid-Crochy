"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSoldOut?: boolean;
  rating?: number;
}

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Daisy Tote Bag",
    price: 3500,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    category: "Totes",
    isNew: true,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Summer Crossbody",
    price: 2800,
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
    category: "Crossbody",
    rating: 4.5,
  },
  {
    id: "3",
    name: "Boho Bucket Bag",
    price: 4200,
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80",
    category: "Buckets",
    isSoldOut: true,
    rating: 4.9,
  },
  {
    id: "4",
    name: "Pastel Shoulder Bag",
    price: 3200,
    image: "https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=800&q=80",
    category: "Shoulder",
    isNew: true,
    rating: 4.7,
  },
];

export default function ProductGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-brand-maroon mb-4"
          >
            Our Latest Creations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-brand-maroon/70 max-w-2xl mx-auto"
          >
            Discover our newest handcrafted crochet bags, each made with love and attention to detail.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {defaultProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link href={`/product/${product.id}`} className="group block h-full">
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-brand-pink/20 mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={cn(
                      "w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700",
                      product.isSoldOut && "opacity-60 grayscale-[50%]"
                    )}
                  />
                  
                  {product.isNew && (
                    <div className="absolute top-4 left-4 bg-brand-maroon text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                      New
                    </div>
                  )}

                  {product.isSoldOut && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                      <div className="bg-white/90 text-brand-maroon font-bold px-6 py-2 rounded-2xl shadow-xl transform -rotate-3 border-2 border-brand-maroon/20">
                        Sold Out
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white font-semibold flex items-center transition-transform transform translate-y-4 group-hover:translate-y-0 duration-300">
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </div>
                </div>

                <div className="space-y-1 px-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-brand-maroon leading-tight group-hover:text-brand-maroon/80 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-brand-maroon/60">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-brand-maroon">৳{product.price}</p>
                      {product.rating && (
                        <div className="flex items-center justify-end text-yellow-600 space-x-1">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs font-bold">{product.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center text-brand-maroon font-bold text-lg hover:underline underline-offset-8 decoration-2"
          >
            Explore the full collection <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
