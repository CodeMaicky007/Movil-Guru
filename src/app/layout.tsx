import type { Metadata } from "next";
import { Syne } from "next/font/google";
import ChatWidget from '@/components/chat/ChatWidget';
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Movil Guru",
  description: "A comprehensive website with all components",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${syne.variable} ${syne.className}`} suppressHydrationWarning>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
