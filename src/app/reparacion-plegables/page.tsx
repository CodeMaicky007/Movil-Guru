"use client";
import { BookingWizard } from "@/components/booking-wizard";

export default function ReparacionPlegablesPage() {
  return (
    <BookingWizard
      categoryId="plegables"
      heroTitle1="PANTALLA"
      heroTitle2="PLEGABLE"
      heroTag="Movil Guru · Dispositivos Plegables"
      heroBadges={[
        { text: "Desde 129€", primary: true },
        { text: "Z Fold · Z Flip · Razr · Pixel Fold" },
        { text: "Técnicos certificados" },
      ]}
      stepTitle="Elige la reparación para tu plegable"
    />
  );
}
