import type { Metadata } from "next"
import { CategoryShop } from "@/components/ui/category-shop"
import { SHOP_CATEGORIES } from "@/data/shop-categories"

export const metadata: Metadata = {
  title: "Cristales templados · Movil Guru",
  description:
    "Cristales templados 9H, hidrogel y de privacidad. Protección de pantalla certificada para todos los modelos.",
}

export default function CristalesPage() {
  return <CategoryShop category={SHOP_CATEGORIES.cristales} />
}
