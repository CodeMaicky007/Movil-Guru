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
  description: "Reparación de móviles con garantía de por vida. iPhone, Samsung, Xiaomi y más.",
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          html { background: #ffffff; }
          body { background: #ffffff; color: #0A1F3A; }
          body::before {
            content: "";
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: #0038FF;
            z-index: 2147483647;
            pointer-events: none;
          }
          #mg-loader ~ * { visibility: hidden; }
        `}} />
      </head>
      <body className={`${syne.variable} ${syne.className}`} suppressHydrationWarning>
        {children}
        <ChatWidget />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            function hide() {
              var s = document.createElement('style');
              s.innerHTML = 'body::before{display:none !important} #mg-loader ~ * { visibility: visible !important; }';
              document.head.appendChild(s);
            }
            if (document.readyState === 'complete') hide();
            else window.addEventListener('load', hide);
          })();
        `}} />
      </body>
    </html>
  );
}
