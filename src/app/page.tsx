import { Hero } from "@/components/Hero";
import { Why } from "@/components/Why";
import { About } from "@/components/About";
import { Paths } from "@/components/Paths";
import { How } from "@/components/How";
import { Contact } from "@/components/Contact";

/**
 * La pagina è una sola, e l'ordine è la sua argomentazione: cosa si compra
 * (hero), perché serve (why), quali giornate esistono (paths), chi le conduce
 * (about), come ci si arriva (how), come si scrive (contact).
 *
 * "Chi sono" sta dopo i percorsi e non prima: il curriculum non deve mettersi
 * fra il lettore e l'offerta. Header e footer stanno nel layout.
 */
export default function Page() {
  return (
    <>
      <Hero />
      <Why />
      <Paths />
      <About />
      <How />
      <Contact />
    </>
  );
}
