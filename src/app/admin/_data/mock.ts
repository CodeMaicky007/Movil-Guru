export type ReservationStatus = 'pendiente' | 'en_curso' | 'completada' | 'cancelada';

export type Reservation = {
  id: string;
  customer: string;
  phone: string;
  email: string;
  device: string;
  service: string;
  date: string;
  price: number;
  status: ReservationStatus;
};

export const reservations: Reservation[] = [
  { id: 'MG-1042', customer: 'Lucía Hernández', phone: '+34 612 445 901', email: 'lucia.h@mail.com', device: 'iPhone 14 Pro', service: 'Pantalla rota', date: '2026-04-12', price: 189, status: 'pendiente' },
  { id: 'MG-1041', customer: 'Marcos Gil', phone: '+34 678 221 334', email: 'mgil@mail.com', device: 'Samsung S23', service: 'Batería', date: '2026-04-12', price: 59, status: 'en_curso' },
  { id: 'MG-1040', customer: 'Paula Ríos', phone: '+34 655 019 882', email: 'paula@mail.com', device: 'iPhone 12', service: 'Puerto de carga', date: '2026-04-11', price: 45, status: 'completada' },
  { id: 'MG-1039', customer: 'Javier Soto', phone: '+34 699 771 450', email: 'jsoto@mail.com', device: 'Pixel 8', service: 'Daño por agua', date: '2026-04-11', price: 120, status: 'en_curso' },
  { id: 'MG-1038', customer: 'Nora Vidal', phone: '+34 633 902 118', email: 'nvidal@mail.com', device: 'Xiaomi 13', service: 'Cámara', date: '2026-04-10', price: 85, status: 'completada' },
  { id: 'MG-1037', customer: 'Iker Montes', phone: '+34 644 112 908', email: 'iker@mail.com', device: 'Samsung Z Flip5', service: 'Plegables', date: '2026-04-10', price: 320, status: 'pendiente' },
  { id: 'MG-1036', customer: 'Aitana López', phone: '+34 611 556 001', email: 'aitana@mail.com', device: 'iPhone 13', service: 'Recuperación de datos', date: '2026-04-09', price: 150, status: 'cancelada' },
  { id: 'MG-1035', customer: 'Diego Ruiz', phone: '+34 688 330 712', email: 'druiz@mail.com', device: 'OnePlus 11', service: 'Placa base', date: '2026-04-09', price: 240, status: 'completada' },
];
