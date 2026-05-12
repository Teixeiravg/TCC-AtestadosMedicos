'use client';
import Script from 'next/script';

export default function VLibrasWidget() {
  return (
    <>
      <div vw="" className="enabled">
        <div vw-access-button="" className="active"></div>
        <div vw-plugin-wrapper="">
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>

      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
        onLoad={() => {
          new window.VLibras.Widget('https://vlibras.gov.br/app');
        }}
      />
    </>
  );
}
