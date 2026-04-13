import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ateste+",
  description: "Sistema de Gestão de Atestados",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      {/* Removemos a lógica de fontes aqui para não dar erro no SENAI */}
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}