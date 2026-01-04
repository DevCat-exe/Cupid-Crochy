"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  Trash2, 
  Loader2,
  X,
  Check,
  Tag,
  Calendar,
  Percent,
  CircleDollarSign,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Coupon {
  _id: string;
  code: string;
  type: "percent" | "amount";
  value: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  createdAt: string;
}

export default function CouponManagementClient({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    type: "percent" as const,
    value: 0,
    expiryDate: "",
    usageLimit: 0
  });

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save coupon");
      }
      
      const savedCoupon = await res.json();
      setCoupons([savedCoupon, ...coupons]);
      setIsModalOpen(false);
      setFormData({ code: "", type: "percent", value: 0, expiryDate: "", usageLimit: 0 });
    } catch (err: any) {
      alert(err.message);
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
    } catch (err) {
      alert("Error deleting coupon");
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
                  {coupon.type === "percent" ? <Percent className="h-6 w-6 text-brand-maroon" /> : <CircleDollarSign className="h-6 w-6 text-brand-maroon" />}
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
                    {coupon.type === "percent" ? `${coupon.value}% OFF` : `৳${coupon.value} OFF`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-brand-maroon/40 tracking-widest flex items-center">
                      <Calendar className="h-3 w-3 mr-1" /> Expiry
                    </p>
                    <p className="text-sm font-bold text-brand-maroon">{new Date(coupon.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-brand-maroon/40 tracking-widest flex items-center">
                      <Tag className="h-3 w-3 mr-1" /> Usage
                    </p>
                    <p className="text-sm font-bold text-brand-maroon">{coupon.usedCount} / {coupon.usageLimit}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="pt-2">
                  <div className="h-2 bg-brand-pink/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                      className="h-full bg-brand-maroon"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-maroon/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-brand-maroon/5 flex justify-between items-center bg-brand-pink/10">
                <h3 className="text-2xl font-bold text-brand-maroon">New Campaign</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 rounded-2xl hover:bg-white text-brand-maroon/40 hover:text-brand-maroon transition-all shadow-sm"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold appearance-none"
                    >
                      <option value="percent">Percentage %</option>
                      <option value="amount">Fixed Amount ৳</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Value</label>
                    <input
                      required
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                      placeholder="10"
                      className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Expiry Date</label>
                    <input
                      required
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Usage Limit</label>
                    <input
                      required
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                      placeholder="100"
                      className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold"
                    />
                  </div>
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
