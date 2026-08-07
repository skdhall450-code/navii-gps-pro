import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import ProductSection from "@/components/products/ProductSection";

export default function ProductsPage() {
  return (
    <>
      <Header />

      <main>
        <ProductSection />
      </main>

      <Footer />
    </>
  );
}