import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "@/lib/supabase";
import { motion } from "framer-motion";
import Layout from "../layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "../cart/CartProvider";
import { CreditCard, ShoppingBag, Truck, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Generate a unique order ID
  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`.toUpperCase();
  };

  const subtotal = getCartTotal();
  const shipping = 50;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate processing
    setTimeout(() => {
      const orderId = generateOrderId();

      // Create order details
      const orderDetails = {
        id: orderId,
        email,
        name,
        items: cartItems,
        total,
        date: new Date().toISOString(),
        status: "Processing",
        address,
        phone,
      };

      // Save to Supabase (with localStorage fallback)
      createOrder(orderDetails);

      // Clear cart
      clearCart();

      // Move to confirmation step
      setStep(3);
      setIsSubmitting(false);

      // Store the latest order ID for tracking
      sessionStorage.setItem("latestOrderId", orderId);
    }, 1500);
  };

  const goToTracking = () => {
    navigate("/order-tracking");
  };

  return (
    <Layout>
      <div className="pt-24 pb-16 bg-[#F5DDEB]/30 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#5B1A1A] mb-2">
              {step === 1
                ? "Checkout"
                : step === 2
                  ? "Payment"
                  : "Order Confirmed"}
            </h1>
            <div className="flex items-center justify-center space-x-4 mt-6">
              <div
                className={`flex items-center ${step >= 1 ? "text-[#5B1A1A]" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-[#5B1A1A] text-white" : "bg-gray-200"}`}
                >
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <span className="ml-2 text-sm font-medium">Details</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-200">
                <div
                  className={`h-full ${step >= 2 ? "bg-[#5B1A1A]" : "bg-gray-200"}`}
                  style={{
                    width: step >= 2 ? "100%" : "0%",
                    transition: "width 0.5s ease-in-out",
                  }}
                ></div>
              </div>
              <div
                className={`flex items-center ${step >= 2 ? "text-[#5B1A1A]" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-[#5B1A1A] text-white" : "bg-gray-200"}`}
                >
                  <CreditCard className="h-4 w-4" />
                </div>
                <span className="ml-2 text-sm font-medium">Payment</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-200">
                <div
                  className={`h-full ${step >= 3 ? "bg-[#5B1A1A]" : "bg-gray-200"}`}
                  style={{
                    width: step >= 3 ? "100%" : "0%",
                    transition: "width 0.5s ease-in-out",
                  }}
                ></div>
              </div>
              <div
                className={`flex items-center ${step >= 3 ? "text-[#5B1A1A]" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-[#5B1A1A] text-white" : "bg-gray-200"}`}
                >
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="ml-2 text-sm font-medium">Confirmation</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-6 rounded-2xl shadow-md"
                >
                  <h2 className="text-xl font-semibold text-[#5B1A1A] mb-6">
                    Contact Information
                  </h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[#5B1A1A]">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="border-[#5B1A1A]/20 focus:border-[#5B1A1A] rounded-xl"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#5B1A1A]">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="border-[#5B1A1A]/20 focus:border-[#5B1A1A] rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-[#5B1A1A]">
                        Delivery Address
                      </Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your full address"
                        className="border-[#5B1A1A]/20 focus:border-[#5B1A1A] rounded-xl"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#5B1A1A]">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="border-[#5B1A1A]/20 focus:border-[#5B1A1A] rounded-xl"
                        required
                      />
                    </div>
                  </form>
                </motion.div>
              </div>

              {/* Order Summary */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white p-6 rounded-2xl shadow-md sticky top-24"
                >
                  <h2 className="text-xl font-semibold text-[#5B1A1A] mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4"
                      >
                        <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-[#5B1A1A]">
                            {item.name}
                          </h4>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-sm text-[#5B1A1A]/70">
                              {item.quantity} × ৳{item.price.toFixed(2)}
                            </p>
                            <p className="font-medium text-[#5B1A1A]">
                              ৳{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
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
                    <Separator className="my-2" />
                    <div className="flex justify-between text-base pt-2">
                      <span className="font-medium text-[#5B1A1A]">Total</span>
                      <span className="font-bold text-[#5B1A1A]">
                        ৳{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6 bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 rounded-xl py-6"
                    onClick={() => setStep(2)}
                    disabled={
                      !email ||
                      !name ||
                      !address ||
                      !phone ||
                      cartItems.length === 0
                    }
                  >
                    Continue to Payment
                  </Button>
                </motion.div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-2xl shadow-md"
              >
                <h2 className="text-xl font-semibold text-[#5B1A1A] mb-6">
                  Payment Method
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="border border-[#5B1A1A]/20 rounded-xl p-4 bg-[#F5DDEB]/10">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cash"
                        name="payment"
                        className="h-4 w-4 text-[#5B1A1A] border-[#5B1A1A]/20 focus:ring-[#5B1A1A]/20"
                        defaultChecked
                      />
                      <label
                        htmlFor="cash"
                        className="ml-2 text-[#5B1A1A] font-medium"
                      >
                        Cash on Delivery
                      </label>
                    </div>
                    <p className="text-sm text-[#5B1A1A]/70 mt-2 ml-6">
                      Pay with cash upon delivery of your order.
                    </p>
                  </div>
                </div>

                <div className="border border-[#5B1A1A]/20 rounded-xl p-4 mb-6 bg-[#F5DDEB]/10">
                  <div className="flex items-start">
                    <Truck className="h-5 w-5 text-[#5B1A1A] mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-medium text-[#5B1A1A]">
                        Delivery Information
                      </h3>
                      <p className="text-sm text-[#5B1A1A]/70 mt-1">{name}</p>
                      <p className="text-sm text-[#5B1A1A]/70">{address}</p>
                      <p className="text-sm text-[#5B1A1A]/70">{phone}</p>
                      <p className="text-sm text-[#5B1A1A]/70">{email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5B1A1A]/70">Subtotal</span>
                    <span className="font-medium">৳{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5B1A1A]/70">Shipping</span>
                    <span className="font-medium">৳{shipping.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-base pt-2">
                    <span className="font-medium text-[#5B1A1A]">Total</span>
                    <span className="font-bold text-[#5B1A1A]">
                      ৳{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-[#5B1A1A] text-[#5B1A1A] hover:bg-[#5B1A1A]/10 rounded-xl"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 rounded-xl py-6"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-2xl shadow-md text-center"
              >
                <div className="w-20 h-20 bg-[#F5DDEB] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-[#5B1A1A]" />
                </div>

                <h2 className="text-2xl font-bold text-[#5B1A1A] mb-4">
                  Order Confirmed!
                </h2>

                <p className="text-[#5B1A1A]/70 mb-6">
                  Thank you for your order. We've received your order and will
                  begin processing it right away.
                </p>

                <div className="bg-[#F5DDEB]/20 p-4 rounded-xl mb-6">
                  <p className="text-sm text-[#5B1A1A]/70 mb-1">
                    Your Order ID
                  </p>
                  <p className="text-lg font-semibold text-[#5B1A1A]">
                    {sessionStorage.getItem("latestOrderId")}
                  </p>
                  <p className="text-xs text-[#5B1A1A]/70 mt-2">
                    Please save this ID for tracking your order
                  </p>
                </div>

                <p className="text-[#5B1A1A]/70 mb-8">
                  A confirmation email has been sent to{" "}
                  <span className="font-medium">{email}</span>
                </p>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button
                    className="bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 rounded-xl py-6 flex-1"
                    onClick={goToTracking}
                  >
                    Track Order
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#5B1A1A] text-[#5B1A1A] hover:bg-[#5B1A1A]/10 rounded-xl flex-1"
                    onClick={() => navigate("/")}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
