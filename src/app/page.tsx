import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Paths } from "@/components/Paths";
import { How } from "@/components/How";
import { Contact } from "@/components/Contact";

/**
 * La pagina è una sola: si compone di cinque sezioni, nell'ordine in cui la
 * specifica le descrive. Header e footer stanno nel layout.
 */
export default function Page() {
  return (
    <>
      <Hero />
      <About />
      <Paths />
      <How />
      <Contact />
    </>
  );
}
