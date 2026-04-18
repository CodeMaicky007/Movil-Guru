import type { Metadata } from "next"
import { CategoryShop } from "@/components/ui/category-shop"
import { SHOP_CATEGORIES } from "@/data/shop-categories"

export const metadata: Metadata = {
  title: "Audio y auriculares · Movil Guru",
  description:
    "Auriculares in-ear, over-ear, altavoces portátiles y gaming. Seleccionados por sonido — no por hype.",
}

export default function AudioPage() {
  return <CategoryShop category={SHOP_CATEGORIES.audio} />
}
