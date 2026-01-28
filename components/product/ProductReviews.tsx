"use client";

import { useState } from "react";
import { Star, MessageSquare, Send, Loader2, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Review {
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsProps {
  productId: string;
  initialReviews: Review[];
  initialRating: number;
}

export default function ProductReviews({ productId, initialReviews, initialRating }: ReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/products/review/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment })
      });

      if (!res.ok) throw new Error("Failed to post review");
      const updatedProduct = await res.json();
      setReviews(updatedProduct.reviews);
      setComment("");
      setRating(5);
} catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to post review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-24 space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h2 className="text-3xl font-bold text-brand-maroon">Customer Feedback</h2>
          <p className="text-brand-maroon/60 font-medium">Hear what others say about this creation</p>
        </div>
        
        <div className="bg-brand-pink/30 p-6 rounded-[2rem] flex items-center space-x-8 border border-brand-maroon/5 shadow-inner">
          <div className="text-center">
            <span className="text-4xl font-bold text-brand-maroon block leading-none">{initialRating.toFixed(1)}</span>
            <span className="text-[10px] font-bold text-brand-maroon/40 uppercase tracking-widest mt-1 block">Rating</span>
          </div>
          <div className="h-10 w-px bg-brand-maroon/10" />
          <div className="text-center">
            <span className="text-4xl font-bold text-brand-maroon block leading-none">{reviews.length}</span>
            <span className="text-[10px] font-bold text-brand-maroon/40 uppercase tracking-widest mt-1 block">Reviews</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Review Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-brand-maroon/5 shadow-xl sticky top-24">
            <h3 className="text-xl font-bold text-brand-maroon mb-2">Share your thoughts</h3>
            <p className="text-sm text-brand-maroon/60 mb-8">How was your experience with this item?</p>

            {session ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-brand-maroon/40 uppercase tracking-widest pl-1">Rate product</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform active:scale-95"
                      >
                        <Star className={cn(
                          "h-8 w-8 transition-all",
                          star <= rating ? "fill-yellow-500 text-yellow-500 scale-110" : "text-brand-pink stroke-[1.5px]"
                        )} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-maroon/40 uppercase tracking-widest pl-1">Your Comment</label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe the quality, texture, and look..."
                    className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-medium resize-none shadow-inner"
                  />
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-brand-maroon text-white font-bold py-5 rounded-[1.5rem] shadow-xl hover:shadow-brand-maroon/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-4 w-4" /> <span>Post Review</span></>}
                </button>
                
                {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
              </form>
            ) : (
              <div className="text-center py-10 space-y-4 bg-brand-pink/5 rounded-3xl border-2 border-dashed border-brand-maroon/10">
                <p className="text-brand-maroon/60 font-medium px-4">You need to be logged in to share your experience.</p>
                <button 
                  onClick={() => window.location.href = "/login"}
                  className="text-brand-maroon font-bold hover:underline"
                >
                  Log in now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-8">
          {reviews.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20 bg-brand-pink/5 rounded-[3rem] border border-brand-maroon/5 border-dashed">
              <MessageSquare className="h-12 w-12 text-brand-maroon/20 mb-4" />
              <p className="text-brand-maroon/40 font-bold uppercase tracking-widest">Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={idx}
                  className="bg-white p-8 rounded-[2.5rem] border border-brand-maroon/5 shadow-sm group hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-brand-pink flex items-center justify-center">
                        <User className="h-5 w-5 text-brand-maroon/40" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-maroon text-sm">{review.user}</p>
                        <p className="text-[10px] font-bold text-brand-maroon/40 uppercase tracking-widest">Verified Customer</p>
                      </div>
                    </div>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("h-4 w-4 fill-current", i >= review.rating && "opacity-20")} />
                      ))}
                    </div>
                  </div>
                  <p className="text-brand-maroon/70 leading-relaxed font-medium pl-13">
                    {review.comment}
                  </p>
                  <div className="mt-6 pl-13 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-brand-maroon/20 uppercase tracking-widest">
                      Posted on {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
