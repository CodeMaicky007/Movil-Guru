"use client";
import { BookingWizard } from "@/components/booking-wizard";

export default function RecuperacionDatosPage() {
  return (
    <BookingWizard
      categoryId="recuperacion"
      heroTitle1="RECUPERA"
      heroTitle2="TUS DATOS"
      heroTag="Movil Guru · Recuperación de Datos"
      heroBadges={[
        { text: "Sin datos = sin coste", primary: true },
        { text: "Fotos · WhatsApp · Contactos" },
        { text: "Chip-off disponible" },
      ]}
      stepTitle="Elige el tipo de recuperación"
    />
  );
}
