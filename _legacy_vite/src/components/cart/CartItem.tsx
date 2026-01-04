import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";

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
  const handleIncrement = () => {
    onUpdateQuantity(id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(id, quantity - 1);
    }
  };

  return (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-200 last:border-0">
      <div className="h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden">
        <img src={image} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-[#5B1A1A] truncate">{name}</h4>
        <p className="text-sm text-[#5B1A1A]/70 mt-1">৳{price.toFixed(2)}</p>
        <div className="flex items-center mt-2">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={handleDecrement}
              className="px-2 py-1 bg-gray-50 hover:bg-gray-100 transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-3 py-1 text-sm">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="px-2 py-1 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <p className="font-medium text-[#5B1A1A]">
          ৳{(price * quantity).toFixed(2)}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#5B1A1A]/70 hover:text-[#5B1A1A] hover:bg-[#F5DDEB]/20"
          onClick={() => onRemove(id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
