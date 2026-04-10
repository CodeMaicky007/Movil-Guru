"use client";
import { BookingWizard } from "@/components/booking-wizard";

export default function ReparacionAguaPage() {
  return (
    <BookingWizard
      categoryId="agua"
      heroTitle1="DAÑO POR"
      heroTitle2="AGUA"
      heroTag="Movil Guru · Daño por Agua"
      heroBadges={[
        { text: "Diagnóstico gratis", primary: true },
        { text: "Limpieza ultrasónica" },
        { text: "2–4 horas" },
      ]}
      stepTitle="Tratamiento para tu modelo"
    />
  );
}
