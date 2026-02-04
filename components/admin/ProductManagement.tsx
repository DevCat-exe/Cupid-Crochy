"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  Loader2,
  X,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/providers/ToastProvider";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  isNewProduct?: boolean;
  isSoldOut?: boolean;
  description: string;
}

export default function ProductManagementClient({ initialProducts, currentUserRole }: { initialProducts: Product[]; currentUserRole: string }) {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const isAdmin = currentUserRole === "admin";
  const { } = useToast();


  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    category: "Totes",
    stock: 0,
    description: "",
    image: "",
    isNewProduct: false,
    isSoldOut: false
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      category: "Totes",
      stock: 0,
      description: "",
      image: "",
      isNewProduct: false,
      isSoldOut: false
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description,
      image: product.images[0],
      isNewProduct: product.isNewProduct || false,
      isSoldOut: product.isSoldOut || false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";
      
      const payload = {
        ...formData,
        images: [formData.image], // Simplification for now
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save product");
      
      const savedProduct = await res.json();
      
      if (editingProduct) {
        setProducts(products.map(p => p._id === editingProduct._id ? savedProduct : p));
      } else {
        setProducts([savedProduct, ...products]);
      }
      
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative group max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-maroon/40 group-focus-within:text-brand-maroon transition-colors" />
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-brand-maroon/10 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-medium shadow-sm"
          />
        </div>

        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          disabled={!isAdmin}
          className={cn(
            "font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-brand-maroon/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-2",
            isAdmin ? "bg-brand-maroon text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          )}
        >
          <Plus className="h-5 w-5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-[2.5rem] border border-brand-maroon/5 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-brand-pink/20 text-brand-maroon text-xs font-bold uppercase tracking-widest">
              <th className="px-8 py-6">Product</th>
              <th className="px-8 py-6">Category</th>
              <th className="px-8 py-6">Price</th>
              <th className="px-8 py-6">Stock</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-maroon/5">
            {filteredProducts.map((product) => (
              <tr key={product._id} className="hover:bg-brand-pink/5 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 rounded-xl overflow-hidden bg-brand-pink/20 shrink-0 shadow-md relative">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div className="flex flex-col">
                       <span className="font-bold text-brand-maroon text-sm leading-tight">{product.name}</span>
                       <span className="text-[10px] text-brand-maroon/40 font-bold uppercase tracking-wider mt-1 flex items-center">
                         <a 
                           href={`/product/${product._id}`} 
                           target="_blank"
                           rel="noopener noreferrer"
                           className="hover:underline flex items-center gap-1"
                         >
                           <ExternalLink className="h-2 w-2 mr-1" />
                           ID: {product._id.toString().slice(-6)}
                         </a>
                       </span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="bg-brand-pink/30 text-brand-maroon px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {product.category}
                  </span>
                </td>
                <td className="px-8 py-5 font-bold text-brand-maroon">৳{product.price}</td>
                <td className="px-8 py-5">
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      "h-2 w-2 rounded-full",
                      product.stock > 5 ? "bg-green-500" : product.stock > 0 ? "bg-orange-500" : "bg-red-500"
                    )} />
                    <span className="text-sm font-bold text-brand-maroon">{product.stock} pcs</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex gap-2">
                    {product.isNewProduct && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-tighter">New</span>
                    )}
                    {product.isSoldOut && (
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-tighter">Sold Out</span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      disabled={!isAdmin}
                      className={cn(
                        "p-2.5 rounded-xl hover:shadow-sm transition-all shadow-sm",
                        isAdmin ? "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={!isAdmin}
                      className={cn(
                        "p-2.5 rounded-xl hover:shadow-sm transition-all shadow-sm",
                        isAdmin ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
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
              className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-brand-maroon/5 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-brand-maroon">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                  <p className="text-sm text-brand-maroon/40 font-medium">Define your handcrafted creation</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 rounded-2xl hover:bg-brand-pink/20 text-brand-maroon/40 hover:text-brand-maroon transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Product Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Vintage Floral Tote"
                      className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-medium"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Price (৳)</label>
                    <input
                      required
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="2500"
                      className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-medium"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-medium appearance-none"
                    >
                      <option value="Totes">Totes</option>
                      <option value="Crossbody">Crossbody</option>
                      <option value="Buckets">Buckets</option>
                      <option value="Shoulder">Shoulder</option>
                      <option value="Clutches">Clutches</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Stock Quantity</label>
                    <input
                      required
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      placeholder="10"
                      className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-medium"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-xs font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Image URL</label>
                    <input
                      required
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-medium"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-xs font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Description</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Tell the story of this bag..."
                      className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-medium resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-6 pt-4 border-t border-brand-maroon/5">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className={cn(
                      "h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all",
                      formData.isNewProduct ? "bg-brand-maroon border-brand-maroon shadow-md shadow-brand-maroon/20" : "border-brand-maroon/20"
                    )}>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={formData.isNewProduct}
                        onChange={(e) => setFormData({ ...formData, isNewProduct: e.target.checked })}
                      />
                      {formData.isNewProduct && <Check className="h-4 w-4 text-white stroke-[3px]" />}
                    </div>
                    <span className="text-sm font-bold text-brand-maroon">Mark as New Arrival</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className={cn(
                      "h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all",
                      formData.isSoldOut ? "bg-red-500 border-red-500 shadow-md shadow-red-500/20" : "border-brand-maroon/20"
                    )}>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={formData.isSoldOut}
                        onChange={(e) => setFormData({ ...formData, isSoldOut: e.target.checked })}
                      />
                      {formData.isSoldOut && <Check className="h-4 w-4 text-white stroke-[3px]" />}
                    </div>
                    <span className="text-sm font-bold text-brand-maroon">Sold Out</span>
                  </label>
                </div>

                <div className="pt-8">
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-brand-maroon text-white font-bold py-5 rounded-3xl shadow-xl hover:shadow-brand-maroon/20 hover:bg-brand-maroon/90 transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : editingProduct ? "Update Product" : "Launch Product"}
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
