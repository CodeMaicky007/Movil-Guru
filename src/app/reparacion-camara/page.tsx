"use client";
import { BookingWizard } from "@/components/booking-wizard";

export default function ReparacionCamaraPage() {
  return (
    <BookingWizard
      categoryId="camara"
      heroTitle1="REPARACIÓN"
      heroTitle2="DE CÁMARA"
      heroTag="Movil Guru · Cámara"
      heroBadges={[
        { text: "Desde 34€", primary: true },
        { text: "6 marcas · 50+ modelos" },
        { text: "30–45 min" },
      ]}
      stepTitle="Elige el módulo de cámara"
    />
  );
}
