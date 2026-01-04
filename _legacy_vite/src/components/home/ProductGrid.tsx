import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Eye, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { getProducts } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSoldOut?: boolean;
}

const getDefaultProducts = (): Product[] => {
  return [
    {
      id: "1",
      name: "Daisy Tote Bag",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
      category: "Tote",
      isNew: true,
    },
    {
      id: "2",
      name: "Summer Crossbody",
      price: 64.99,
      image:
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
      category: "Crossbody",
    },
    {
      id: "3",
      name: "Boho Bucket Bag",
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80",
      category: "Bucket",
      isNew: true,
      isSoldOut: true,
    },
    {
      id: "4",
      name: "Mini Clutch",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
      category: "Clutch",
    },
    {
      id: "5",
      name: "Pastel Shoulder Bag",
      price: 69.99,
      image:
        "https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=800&q=80",
      category: "Shoulder",
    },
    {
      id: "6",
      name: "Floral Handbag",
      price: 94.99,
      image:
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
      category: "Handbag",
    },
  ];
};

const defaultProducts = getDefaultProducts();

interface ProductGridProps {
  products?: Product[];
}

export default function ProductGrid({
  products: initialProducts = defaultProducts,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        // Only show first 6 products on homepage
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(initialProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Don't refresh too often to avoid lag
    const interval = setInterval(fetchProducts, 30000); // refresh every 30 seconds instead of 5

    return () => clearInterval(interval);
  }, [initialProducts]);

  return (
    <section className="py-16 bg-[#F5DDEB]/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#5B1A1A] mb-4">
            Our Latest Creations
          </h2>
          <p className="text-lg text-[#5B1A1A]/70 max-w-2xl mx-auto">
            Discover our newest handcrafted crochet bags, each made with love
            and attention to detail
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse text-[#5B1A1A]">
              Loading products...
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#5B1A1A]/70">
              No products available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link to={`/product/${product.id}`}>
                  <Card className="overflow-hidden rounded-2xl border-none shadow-md hover:shadow-xl transition-shadow duration-300 h-full bg-white">
                    <div className="relative overflow-hidden group">
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500 ${product.isSoldOut ? "opacity-70" : ""}`}
                      />
                      {product.isNew && (
                        <Badge className="absolute top-4 left-4 bg-[#5B1A1A] text-white">
                          New Arrival
                        </Badge>
                      )}
                      {product.isSoldOut && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Badge className="bg-black/70 text-white px-4 py-2 text-lg font-bold">
                            Sold Out
                          </Badge>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10">
                        <Button
                          variant="default"
                          className="rounded-xl bg-white text-[#5B1A1A] hover:bg-[#F5DDEB] transition-colors"
                        >
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-lg text-[#5B1A1A]">
                            {product.name}
                          </h3>
                          <p className="text-sm text-[#5B1A1A]/70">
                            {product.category}
                          </p>
                        </div>
                        <p className="font-bold text-lg">
                          ৳
                          {typeof product.price === "number"
                            ? product.price.toFixed(2)
                            : product.price}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
