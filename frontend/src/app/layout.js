import { Inter } from "next/font/google";
import "./globals.css";
import VLibrasWidget from "@/components/VLibrasWidget";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ateste+",
  description: "Sistema de Gestão de Atestados",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="stylesheet" href="https://vlibras.gov.br/app/vlibras-plugin.css" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <VLibrasWidget />
        {children}
      </body>
    </html>
  );
}
