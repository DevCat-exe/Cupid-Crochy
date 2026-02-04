import HeroBanner from "@/components/home/HeroBanner";
import ProductGrid from "@/components/home/ProductGrid";

export default function Home() {
  return (
    <div className="bg-white">
      <HeroBanner />
      <ProductGrid />
    </div>
  );
}
