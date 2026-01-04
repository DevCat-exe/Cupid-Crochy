import Layout from "../layout/Layout";
import HeroBanner from "../home/HeroBanner";
import ProductGrid from "../home/ProductGrid";

export default function HomePage() {
  return (
    <Layout transparentHeader={true}>
      <HeroBanner />
      <ProductGrid />
    </Layout>
  );
}
