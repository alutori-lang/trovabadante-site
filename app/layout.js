import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://trovabadante.eu"),
  title: "TrovaBadante - Trova la Badante Giusta per la Tua Famiglia",
  description: "Cerca badanti verificate in tutta Italia. Conviventi, a ore, notturne. Assistenza anziani sicura e affidabile. Confronta profili, recensioni e prezzi.",
  keywords: "badante, trova badante, assistenza anziani, badante convivente, badante a ore, badante notturna, assistenza domiciliare, colf, assistenza disabili",
  openGraph: {
    title: "TrovaBadante - Assistenza Anziani Sicura e Verificata",
    description: "Trova la badante perfetta per la tua famiglia. Profili verificati, recensioni reali, contatto diretto.",
    url: "https://trovabadante.eu",
    type: "website",
    locale: "it_IT",
    siteName: "TrovaBadante",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
