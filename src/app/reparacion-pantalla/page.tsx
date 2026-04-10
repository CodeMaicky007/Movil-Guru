"use client";
import { BookingWizard } from "@/components/booking-wizard";

export default function ReparacionPantallaPage() {
  return (
    <BookingWizard
      categoryId="pantalla"
      heroTitle1="REPARACIÓN"
      heroTitle2="DE PANTALLA"
      heroTag="Movil Guru · Pantalla"
      heroBadges={[
        { text: "Desde 39€", primary: true },
        { text: "6 marcas · 50+ modelos" },
        { text: "45–60 min" },
      ]}
      stepTitle="Elige la calidad de pantalla"
    />
  );
}
