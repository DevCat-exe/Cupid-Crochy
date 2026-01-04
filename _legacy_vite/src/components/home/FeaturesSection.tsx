import { motion } from "framer-motion";
import { Heart, Truck, RefreshCw, Shield } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Heart className="h-10 w-10 text-[#5B1A1A]" />,
    title: "Handmade with Love",
    description:
      "Each bag is carefully crafted by hand with attention to every detail.",
  },
  {
    icon: <Truck className="h-10 w-10 text-[#5B1A1A]" />,
    title: "Free Shipping",
    description: "Enjoy free shipping on all orders over $100 within the US.",
  },
  {
    icon: <RefreshCw className="h-10 w-10 text-[#5B1A1A]" />,
    title: "Easy Returns",
    description: "Not satisfied? Return within 30 days for a full refund.",
  },
  {
    icon: <Shield className="h-10 w-10 text-[#5B1A1A]" />,
    title: "Quality Guarantee",
    description:
      "We stand behind our products with a 1-year quality guarantee.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-[#F5DDEB]/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-[#F5DDEB]/30 p-6 rounded-2xl text-center hover:shadow-md transition-shadow duration-300"
            >
              <div className="bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#5B1A1A]">
                {feature.title}
              </h3>
              <p className="text-[#5B1A1A]/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
