"use client";
import { BookingWizard } from "@/components/booking-wizard";

export default function ReparacionPlacaPage() {
  return (
    <BookingWizard
      categoryId="placa"
      heroTitle1="PLACA"
      heroTitle2="BASE"
      heroTag="Movil Guru · Placa Base"
      heroBadges={[
        { text: "Diagnóstico gratis", primary: true },
        { text: "Microsoldadura · Reballing · ICs" },
        { text: "2–6 horas" },
      ]}
      stepTitle="Solicitar diagnóstico y reparación de placa"
    />
  );
}
