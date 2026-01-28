"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function HeroBanner() {
  const settings = {
    heroImage: "https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?w=1200&q=80",
    heroTitle: "Handcrafted Crochet Bags",
    heroSubtitle: "Made with love, carried with pride",
  };

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden rounded-b-[3rem] bg-brand-pink/50">
      <div className="container relative z-10 mx-auto h-full flex flex-col justify-center items-start px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1 rounded-full bg-brand-maroon/10 text-brand-maroon text-sm font-semibold mb-6"
          >
            New Collection 2026
          </motion.span>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-brand-maroon mb-6 leading-tight">
            {settings.heroTitle}
            <span className="block text-3xl md:text-4xl mt-3 font-medium opacity-90 font-outfit">
              {settings.heroSubtitle}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-brand-maroon/80 mb-10 max-w-lg leading-relaxed">
            Each bag tells a unique story, crafted with care and designed to bring joy to your everyday style. Our artisans spend hours on every stitch.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link
              href="/shop"
              className="inline-flex items-center bg-brand-maroon hover:bg-brand-maroon/90 text-white rounded-2xl px-10 py-5 text-lg font-semibold group transition-all transform hover:scale-105 shadow-xl hover:shadow-brand-maroon/20"
            >
              Shop Now
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Image */}
      <motion.div
        className="absolute bottom-0 right-0 w-[50%] h-[95%] hidden lg:block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
      >
        <div className="relative w-full h-full">
          <Image
            src={settings.heroImage}
            alt="Featured crochet bag"
            fill
            className="object-cover object-center rounded-tl-[4rem] shadow-[-20px_0_40px_rgba(0,0,0,0.1)]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon/10 to-transparent pointer-events-none rounded-tl-[4rem]" />
        </div>
      </motion.div>

      {/* Shapes for extra depth */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-brand-beige/20 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-brand-pink/30 rounded-full blur-2xl -z-0" />
    </div>
  );
}
