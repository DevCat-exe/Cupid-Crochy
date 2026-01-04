import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, ShoppingBag } from "lucide-react";
import CartItem from "./CartItem";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartProvider";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cartItems, updateQuantity, removeItem, getCartTotal } = useCart();
  const subtotal = getCartTotal();

  // Fixed shipping cost
  const shipping = 50;
  // Calculate total
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#F5DDEB]/20 z-50 shadow-xl rounded-l-3xl overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 text-[#5B1A1A] mr-2" />
                  <h2 className="text-lg font-semibold text-[#5B1A1A]">
                    {cartItems.length > 0 ? (
                      <>
                        Your Cart (
                        {cartItems.reduce(
                          (total, item) => total + item.quantity,
                          0,
                        )}{" "}
                        items)
                      </>
                    ) : (
                      <>Shopping Cart</>
                    )}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 rounded-full hover:bg-[#5B1A1A]/10 text-[#5B1A1A]"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Cart Items */}
              <ScrollArea className="flex-1 p-6 bg-white rounded-t-3xl">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <ShoppingBag className="h-12 w-12 text-[#5B1A1A]/30 mb-4" />
                    <h3 className="text-lg font-medium text-[#5B1A1A] mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-[#5B1A1A]/70 mb-6">
                      Looks like you haven't added any items to your cart yet.
                    </p>
                    <Button
                      onClick={onClose}
                      className="bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 rounded-xl mb-3"
                    >
                      Continue Shopping
                    </Button>
                    <Link to="/order-tracking" onClick={onClose}>
                      <Button
                        variant="outline"
                        className="border-[#5B1A1A]/30 text-[#5B1A1A] hover:bg-[#F5DDEB]/20 rounded-xl"
                      >
                        Track Your Order
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        {...item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Summary and Checkout */}
              {cartItems.length > 0 && (
                <div className="p-6 bg-white border-t">
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5B1A1A]/70">Subtotal</span>
                      <span className="font-medium">
                        ৳{subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5B1A1A]/70">Shipping</span>
                      <span className="font-medium">
                        ৳{shipping.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base pt-2 border-t border-gray-200">
                      <span className="font-medium text-[#5B1A1A]">Total</span>
                      <span className="font-bold text-[#5B1A1A]">
                        ৳{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link to="/checkout" className="w-full">
                      <Button
                        className="w-full bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 rounded-xl py-6"
                        onClick={onClose}
                      >
                        Proceed to Checkout
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full border-[#5B1A1A]/30 text-[#5B1A1A] hover:bg-[#F5DDEB]/20 rounded-xl"
                      onClick={onClose}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
