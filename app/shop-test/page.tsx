import { notFound } from "next/navigation";
import ShopTestCheckout from "@/components/shop/ShopTestCheckout";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "NAVII checkout test",
  robots: { index: false, follow: false },
};
export default function ShopTestPage() {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.SHOP_TEST_UI_ENABLED !== "1"
  )
    notFound();
  return <ShopTestCheckout />;
}
