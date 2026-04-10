"use client";
import { BookingWizard } from "@/components/booking-wizard";

export default function ReparacionBateriaPage() {
  return (
    <BookingWizard
      categoryId="bateria"
      heroTitle1="CAMBIO DE"
      heroTitle2="BATERÍA"
      heroTag="Movil Guru · Batería"
      heroBadges={[
        { text: "Desde 26€", primary: true },
        { text: "6 marcas · 50+ modelos" },
        { text: "20–30 min" },
      ]}
      stepTitle="Elige la batería para tu modelo"
    />
  );
}
