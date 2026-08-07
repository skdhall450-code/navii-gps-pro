import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { products } from "@/components/products/data/productsData";

import ProductHero from "@/components/products/details/ProductHero";
import ProductGallery from "@/components/products/details/ProductGallery";
import ProductFeatures from "@/components/products/details/ProductFeatures";
import ProductSpecifications from "@/components/products/details/ProductSpecifications";
import ProductDownloads from "@/components/products/details/ProductDownloads";
import RelatedProducts from "@/components/products/details/RelatedProducts";
import ProductCTA from "@/components/products/details/ProductCTA";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const product = products.find(
    (item) => item.slug === slug
  );

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />

      <main>

        <ProductHero product={product} />

        <ProductGallery product={product} />

        <ProductFeatures product={product} />

        <ProductSpecifications product={product} />

        <ProductDownloads product={product} />

        <RelatedProducts product={product} />

        <ProductCTA product={product} />

      </main>

      <Footer />
    </>
  );
}