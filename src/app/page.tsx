import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Paths } from "@/components/Paths";
import { How } from "@/components/How";
import { Contact } from "@/components/Contact";

/**
 * La pagina è una sola. "Chi sono" sta dopo "I percorsi" e non prima: chi
 * legge vuole sapere cosa compra, e solo dopo chi glielo vende.
 * Header e footer stanno nel layout.
 */
export default function Page() {
  return (
    <>
      <Hero />
      <Paths />
      <About />
      <How />
      <Contact />
    </>
  );
}
