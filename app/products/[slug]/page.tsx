import type { Metadata } from "next";
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

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const productUrl = `https://naviigps.com/products/${product.slug}`;

  const productImage = `https://naviigps.com${product.image}`;

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} | NAVII GPS INDIA`,
      description: product.shortDescription,
      url: productUrl,
      siteName: "NAVII GPS INDIA",
      type: "website",
      images: [
        {
          url: productImage,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | NAVII GPS INDIA`,
      description: product.shortDescription,
      images: [productImage],
    },
  };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const productUrl = `https://naviigps.com/products/${product.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.name,
        description: product.description,
        image: product.gallery.map((image) => `https://naviigps.com${image}`),
        category: product.category,
        url: productUrl,
        brand: {
          "@type": "Brand",
          name: "NAVII GPS INDIA",
        },
        additionalProperty: product.specifications.map((specification) => ({
          "@type": "PropertyValue",
          name: specification.label,
          value: specification.value,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${productUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://naviigps.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: "https://naviigps.com/products",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: productUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Header />

      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />

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
