import type { Metadata, Viewport } from "next";
import { Backdrop } from "@/components/Backdrop";
import { ScrollFX } from "@/components/ScrollFX";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.meta.url),
  title: site.meta.title,
  description: site.meta.description,
  applicationName: site.meta.author,
  authors: [{ name: site.meta.author }],
  creator: site.meta.author,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.meta.locale,
    url: site.meta.url,
    siteName: site.meta.author,
    title: site.meta.ogTitle,
    description: site.meta.ogDescription,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: site.meta.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.meta.ogTitle,
    description: site.meta.ogDescription,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  // Uguale al fondo della pagina: su iOS la barra si fonde con lo sfondo.
  themeColor: "#04050d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // La navbar cambia da pagina a pagina, quindi vive nelle pagine e non qui.
  return (
    <html lang="it">
      <body>
        <Backdrop />
        {children}
        <ScrollFX />
      </body>
    </html>
  );
}
