import { Inter } from "next/font/google";

/**
 * Unico carattere della pagina (§3.1).
 * Pesi 300/400/500: nessun peso ≥ 600 è previsto dalla specifica.
 * La variabile CSS è consumata da `--font-sans` in globals.css.
 */
export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-inter",
});
