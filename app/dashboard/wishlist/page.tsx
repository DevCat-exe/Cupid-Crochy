"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import UserSidebar from "@/components/ui/UserSidebar";
import { useToast } from "@/components/providers/ToastProvider";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

export default function WishlistPage() {
  const { status } = useSession();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { success } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/wishlist");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && !isLoaded) {
      const saved = localStorage.getItem("wishlist");
      if (saved) {
        try {
          const parsedWishlist = JSON.parse(saved);
          // eslint-disable-next-line
          setWishlist(parsedWishlist);
        } catch (e) {
          console.error("Failed to parse wishlist", e);
        }
      }
      setIsLoaded(true);
    }
  }, [status, isLoaded]);

  const removeFromWishlist = (productId: string) => {
    const newWishlist = wishlist.filter(item => item._id !== productId);
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    success("Removed from wishlist");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-beige/30">
        <Loader2 className="h-8 w-8 animate-spin text-brand-maroon" />
      </div>
    );
  }

  return (
    <>
      <UserSidebar />

      <div className="ml-64 min-h-screen bg-brand-beige/20 pt-16 pb-16">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-brand-maroon mb-2">My Wishlist</h1>
                <p className="text-lg text-brand-maroon/60">Items you&apos;ve saved for later</p>
              <span className="px-4 py-2 bg-brand-pink text-brand-maroon text-xs font-bold uppercase tracking-widest rounded-full">
              </span>
              </div>
              <span className="px-4 py-2 bg-brand-pink text-brand-maroon text-xs font-bold uppercase tracking-widest rounded-full">
              </span>
            </div>

            {wishlist.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-16 text-center border border-brand-maroon/5">
                <Heart className="h-24 w-24 mx-auto text-brand-pink/20 mb-6" />
                <h3 className="text-2xl font-bold text-brand-maroon mb-2">Your wishlist is empty</h3>
                <p className="text-brand-maroon/60 mb-6">Save items you love by clicking the heart icon</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-maroon text-white font-bold rounded-2xl hover:bg-brand-maroon/90 transition-all"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((product) => (
                  <div key={product._id} className="bg-white rounded-2xl overflow-hidden border border-brand-maroon/5 shadow-sm group">
                    <Link href={`/product/${product._id}`} className="block aspect-4/5 relative overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromWishlist(product._id);
                        }}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-red-50 transition-all group-hover:opacity-100 opacity-0"
                      >
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </button>
                    </Link>
                    <div className="p-4">
                      <p className="text-xs text-brand-maroon/40 font-bold uppercase tracking-wider mb-1">{product.category}</p>
                      <h3 className="font-bold text-brand-maroon text-lg mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-brand-maroon">৳{product.price}</span>
                        <Link
                          href={`/product/${product._id}`}
                          className="px-4 py-2 bg-brand-maroon text-white font-bold rounded-xl hover:bg-brand-maroon/90 transition-all text-sm"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
