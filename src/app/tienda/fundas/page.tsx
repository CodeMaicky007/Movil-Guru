import type { Metadata } from "next"
import { CategoryShop } from "@/components/ui/category-shop"
import { SHOP_CATEGORIES } from "@/data/shop-categories"

export const metadata: Metadata = {
  title: "Fundas · Movil Guru",
  description:
    "Fundas para móvil probadas en taller — clear, libro, rugged, MagSafe, piel y silicona. Protección real con estilo.",
}

export default function FundasPage() {
  return <CategoryShop category={SHOP_CATEGORIES.fundas} />
}
