import type { Metadata } from "next"
import { CategoryShop } from "@/components/ui/category-shop"
import { SHOP_CATEGORIES } from "@/data/shop-categories"

export const metadata: Metadata = {
  title: "Soportes para móvil · Movil Guru",
  description:
    "Soportes magnéticos, ventosas, trípodes y pop rings para coche, escritorio y moto. Testados en ruta.",
}

export default function SoportesPage() {
  return <CategoryShop category={SHOP_CATEGORIES.soportes} />
}
