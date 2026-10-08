import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Wave } from "@/components/Wave";
import { Steps } from "@/components/Steps";
import { Direct } from "@/components/Direct";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Wave />
        <Steps />
        <Direct />
      </main>
      <Footer />
    </>
  );
}
