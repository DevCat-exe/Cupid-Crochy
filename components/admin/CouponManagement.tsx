"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Loader2,
  Tag,
  Calendar,
  Percent,
  CircleDollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/providers/ToastProvider";
import { Modal } from "@/components/ui/Modal";

interface Coupon {
  _id: string;
  code: string;
  discount: number;
  discountType: "percentage" | "fixed";
  minOrderAmount: number;
  maxUses: number;
  usageCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export default function CouponManagementClient({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success, error, loading: toastLoading } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage" as const,
    discount: "",
    minOrderAmount: "",
    maxUses: "",
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: ""
  });

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    toastLoading("Creating coupon...");

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          discount: Number(formData.discount),
          minOrderAmount: Number(formData.minOrderAmount),
          maxUses: Number(formData.maxUses),
          validFrom: new Date(formData.validFrom),
          validUntil: new Date(formData.validUntil),
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save coupon");
      }
      
      const savedCoupon = await res.json();
      setCoupons([savedCoupon, ...coupons]);
      setIsModalOpen(false);
      setFormData({
        code: "",
        discountType: "percentage",
        discount: "",
        minOrderAmount: "",
        maxUses: "",
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: ""
      });
      success("Coupon created successfully!");
    } catch (err) {
      error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setCoupons(coupons.filter(c => c._id !== id));
      success("Coupon deleted successfully!");
    } catch (err) {
      error((err as Error).message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative group max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-maroon/40 group-focus-within:text-brand-maroon transition-colors" />
          <input
            type="text"
            placeholder="Search coupon codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-brand-maroon/10 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-medium shadow-sm"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-maroon text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-brand-maroon/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCoupons.map((coupon) => (
            <motion.div
              layout
              key={coupon._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-8 rounded-[2.5rem] border border-brand-maroon/5 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
            >
              {/* Pattern Overlay */}
              <div className="absolute top-0 right-0 p-2 opacity-5">
                <Tag className="h-20 w-20 rotate-12" />
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className="bg-brand-pink/20 p-3 rounded-2xl">
                  {coupon.discountType === "percentage" ? <Percent className="h-6 w-6 text-brand-maroon" /> : <CircleDollarSign className="h-6 w-6 text-brand-maroon" />}
                </div>
                <button 
                  onClick={() => handleDelete(coupon._id)}
                  className="p-2 rounded-xl text-red-300 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-brand-maroon tracking-tight">{coupon.code}</h3>
                  <span className="bg-brand-pink text-brand-maroon px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {coupon.discountType === "percentage" ? `${coupon.discount}% OFF` : `৳${coupon.discount} OFF`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-brand-maroon/40 tracking-widest flex items-center">
                      <Calendar className="h-3 w-3 mr-1" /> Valid Until
                    </p>
                    <p className="text-sm font-bold text-brand-maroon">{new Date(coupon.validUntil).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-brand-maroon/40 tracking-widest flex items-center">
                      <Tag className="h-3 w-3 mr-1" /> Usage
                    </p>
                    <p className="text-sm font-bold text-brand-maroon">{coupon.usageCount} / {coupon.maxUses === 0 ? "Unlimited" : coupon.maxUses}</p>
                  </div>
                </div>

                {coupon.maxUses > 0 && (
                  <div className="pt-2">
                    <div className="h-2 bg-brand-pink/20 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((coupon.usageCount / coupon.maxUses) * 100, 100)}%` }}
                        className="h-full bg-brand-maroon"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="New Coupon"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Coupon Code</label>
            <input
              required
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="WINTER2024"
              className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold text-xl uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as "percentage" | "fixed" })}
                className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold appearance-none"
              >
                <option value="percentage">Percentage %</option>
                <option value="fixed">Fixed Amount ৳</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Value</label>
              <input
                required
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                placeholder="10"
                className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Minimum Order Amount (BDT)</label>
            <input
              required
              type="number"
              value={formData.minOrderAmount}
              onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
              placeholder="500"
              className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Valid From</label>
              <input
                required
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Valid Until</label>
              <input
                required
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Usage Limit (0 for unlimited)</label>
            <input
              required
              type="number"
              value={formData.maxUses}
              onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
              placeholder="100"
              min="0"
              className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold"
            />
          </div>

          <div className="pt-4">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-brand-maroon text-white font-bold py-5 rounded-3xl shadow-xl hover:shadow-brand-maroon/20 hover:bg-brand-maroon/90 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : "Launch Campaign"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
