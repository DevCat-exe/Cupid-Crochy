"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Minus, Trash2 } from "lucide-react";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({
  id,
  name,
  price,
  image,
  quantity,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-gray-100 mb-2 group transition-shadow hover:shadow-md"
    >
      <div className="h-24 w-24 rounded-2xl overflow-hidden bg-brand-pink/20 shrink-0 relative">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="grow">
        <h4 className="font-bold text-brand-maroon text-sm line-clamp-1">{name}</h4>
        <p className="text-brand-maroon/60 text-xs font-medium mb-2">৳{price}</p>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-brand-pink/30 rounded-lg overflow-hidden border border-brand-maroon/5">
            <button
              onClick={() => onUpdateQuantity(id, Math.max(1, quantity - 1))}
              className="p-1 px-2 hover:bg-brand-pink/50 transition-colors text-brand-maroon"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-xs font-bold text-brand-maroon">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(id, quantity + 1)}
              className="p-1 px-2 hover:bg-brand-pink/50 transition-colors text-brand-maroon"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => onRemove(id)}
        className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
