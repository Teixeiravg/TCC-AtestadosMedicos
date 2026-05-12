import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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

        {/* Estrutura obrigatória do VLibras */}
        <div vw="" className="enabled">
          <div vw-access-button="" className="active"></div>
          <div vw-plugin-wrapper="">
            <div className="vw-plugin-top-wrapper"></div>
          </div>
        </div>

        {children}

        {/* Plugin VLibras — carrega após a página estar interativa */}
        <Script
          src="https://vlibras.gov.br/app/vlibras-plugin.js"
          strategy="afterInteractive"
          onLoad={() => {
            new window.VLibras.Widget('https://vlibras.gov.br/app');
          }}
        />

      </body>
    </html>
  );
}
