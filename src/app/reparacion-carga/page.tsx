"use client";
import { BookingWizard } from "@/components/booking-wizard";

export default function ReparacionCargaPage() {
  return (
    <BookingWizard
      categoryId="carga"
      heroTitle1="PUERTO"
      heroTitle2="DE CARGA"
      heroTag="Movil Guru · Puerto de Carga"
      heroBadges={[
        { text: "Desde 27€", primary: true },
        { text: "USB-C · Lightning · Micro-USB" },
        { text: "30–45 min" },
      ]}
      stepTitle="Elige el conector para tu modelo"
    />
  );
}
