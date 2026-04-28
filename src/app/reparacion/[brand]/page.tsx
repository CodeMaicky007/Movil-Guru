import { BookingWizard } from "@/components/booking-wizard";
import { notFound } from "next/navigation";

const brandConfig: Record<string, {
  heroTitle1: string;
  heroTitle2: string;
  heroTag: string;
  heroBadges: { text: string; primary?: boolean }[];
}> = {
  iphone: {
    heroTitle1: "REPARAMOS",
    heroTitle2: "TU iPHONE",
    heroTag: "Movil Guru · Apple iPhone",
    heroBadges: [
      { text: "Garantía de por vida", primary: true },
      { text: "iPhone 4 al 16 Pro Max" },
      { text: "Mismo día" },
    ],
  },
  samsung: {
    heroTitle1: "REPARAMOS",
    heroTitle2: "TU SAMSUNG",
    heroTag: "Movil Guru · Samsung Galaxy",
    heroBadges: [
      { text: "Presupuesto gratis", primary: true },
      { text: "Galaxy S, A, Z Fold y Flip" },
      { text: "Técnicos certificados" },
    ],
  },
  xiaomi: {
    heroTitle1: "REPARAMOS",
    heroTitle2: "TU XIAOMI",
    heroTag: "Movil Guru · Xiaomi",
    heroBadges: [
      { text: "Diagnóstico gratis", primary: true },
      { text: "Xiaomi · Redmi · POCO" },
      { text: "Garantía incluida" },
    ],
  },
  huawei: {
    heroTitle1: "REPARAMOS",
    heroTitle2: "TU HUAWEI",
    heroTag: "Movil Guru · Huawei",
    heroBadges: [
      { text: "Presupuesto gratis", primary: true },
      { text: "P, Mate, Nova, MediaPad" },
      { text: "Mismo día" },
    ],
  },
  pixel: {
    heroTitle1: "REPARAMOS",
    heroTitle2: "TU PIXEL",
    heroTag: "Movil Guru · Google Pixel",
    heroBadges: [
      { text: "Diagnóstico gratis", primary: true },
      { text: "Pixel 6 al 9 Pro Fold" },
      { text: "Garantía incluida" },
    ],
  },
  oneplus: {
    heroTitle1: "REPARAMOS",
    heroTitle2: "TU ONEPLUS",
    heroTag: "Movil Guru · OnePlus",
    heroBadges: [
      { text: "Presupuesto gratis", primary: true },
      { text: "OnePlus 9 al 13 · Nord" },
      { text: "Técnicos certificados" },
    ],
  },
  motorola: {
    heroTitle1: "REPARAMOS",
    heroTitle2: "TU MOTOROLA",
    heroTag: "Movil Guru · Motorola Razr",
    heroBadges: [
      { text: "Diagnóstico gratis", primary: true },
      { text: "Razr 40, 40 Ultra, 50, 50 Ultra" },
      { text: "Plegables incluidos" },
    ],
  },
  lg: {
    heroTitle1: "REPARAMOS",
    heroTitle2: "TU LG",
    heroTag: "Movil Guru · LG",
    heroBadges: [
      { text: "Presupuesto gratis", primary: true },
      { text: "G, V, Q, K series" },
      { text: "Garantía incluida" },
    ],
  },
  sony: {
    heroTitle1: "REPARAMOS",
    heroTitle2: "TU SONY",
    heroTag: "Movil Guru · Sony Xperia",
    heroBadges: [
      { text: "Diagnóstico gratis", primary: true },
      { text: "Xperia 1, 5, 10 series" },
      { text: "Mismo día" },
    ],
  },
  nokia: {
    heroTitle1: "REPARAMOS",
    heroTitle2: "TU NOKIA",
    heroTag: "Movil Guru · Nokia",
    heroBadges: [
      { text: "Presupuesto gratis", primary: true },
      { text: "G, C, X, XR series" },
      { text: "Garantía incluida" },
    ],
  },
  vivo: {
    heroTitle1: "REPARAMOS",
    heroTitle2: "TU VIVO",
    heroTag: "Movil Guru · Vivo",
    heroBadges: [
      { text: "Diagnóstico gratis", primary: true },
      { text: "X, V, Y series" },
      { text: "Mismo día" },
    ],
  },
  htc: {
    heroTitle1: "REPARAMOS",
    heroTitle2: "TU HTC",
    heroTag: "Movil Guru · HTC",
    heroBadges: [
      { text: "Presupuesto gratis", primary: true },
      { text: "U, One, Desire series" },
      { text: "Garantía incluida" },
    ],
  },
  bq: {
    heroTitle1: "REPARAMOS",
    heroTitle2: "TU BQ",
    heroTag: "Movil Guru · BQ Aquaris",
    heroBadges: [
      { text: "Diagnóstico gratis", primary: true },
      { text: "Aquaris X, V, U, M series" },
      { text: "Mismo día" },
    ],
  },
  meizu: {
    heroTitle1: "REPARAMOS",
    heroTitle2: "TU MEIZU",
    heroTag: "Movil Guru · Meizu",
    heroBadges: [
      { text: "Presupuesto gratis", primary: true },
      { text: "Meizu 16–21 · Pro · MX" },
      { text: "Garantía incluida" },
    ],
  },
  asus: {
    heroTitle1: "REPARAMOS",
    heroTitle2: "TU ASUS",
    heroTag: "Movil Guru · Asus ZenFone / ROG",
    heroBadges: [
      { text: "Diagnóstico gratis", primary: true },
      { text: "ROG Phone · ZenFone series" },
      { text: "Técnicos certificados" },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(brandConfig).map((brand) => ({ brand }));
}

export default async function BrandRepairPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const config = brandConfig[brand];
  if (!config) notFound();

  return (
    <BookingWizard
      preselectedBrandId={brand}
      heroTitle1={config.heroTitle1}
      heroTitle2={config.heroTitle2}
      heroTag={config.heroTag}
      heroBadges={config.heroBadges}
    />
  );
}
