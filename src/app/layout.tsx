import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
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
    <html lang="en">
      <body className={`${inter.className} ${syne.variable}`}>{children}</body>
    </html>
  );
}
