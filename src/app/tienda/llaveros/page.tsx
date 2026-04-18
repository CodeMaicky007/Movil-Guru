import type { Metadata } from "next"
import { CategoryShop } from "@/components/ui/category-shop"
import { SHOP_CATEGORIES } from "@/data/shop-categories"

export const metadata: Metadata = {
  title: "Llaveros y accesorios · Movil Guru",
  description:
    "Llaveros de metal, piel artesana y silicona. Cases para AirTag y multi-tool. Artesanía local.",
}

export default function LlaverosPage() {
  return <CategoryShop category={SHOP_CATEGORIES.llaveros} />
}
