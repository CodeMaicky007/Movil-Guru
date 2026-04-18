import type { Metadata } from "next"
import { CategoryShop } from "@/components/ui/category-shop"
import { SHOP_CATEGORIES } from "@/data/shop-categories"

export const metadata: Metadata = {
  title: "Cargadores y cables · Movil Guru",
  description:
    "Cargadores GaN, MagSafe, power banks y cables reforzados. Potencia real — sin falsas promesas.",
}

export default function CargadoresPage() {
  return <CategoryShop category={SHOP_CATEGORIES.cargadores} />
}
