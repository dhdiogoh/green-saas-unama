import type React from "react"
import Script from "next/script"

export default function PontosColetaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Adicionar o CSS do Leaflet no head com estilos personalizados */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
      <style>
        {`
          .leaflet-container {
            z-index: 0 !important;
          }
          .leaflet-control-container {
            z-index: 0 !important;
          }
          .leaflet-pane {
            z-index: 0 !important;
          }
          .leaflet-top, .leaflet-bottom {
            z-index: 0 !important;
          }
        `}
      </style>
      {children}
      {/* Adicionar o script do Leaflet */}
      <Script
        src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
        crossOrigin=""
        strategy="lazyOnload"
      />
    </>
  )
}
