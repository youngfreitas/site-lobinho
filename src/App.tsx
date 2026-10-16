import { Boat } from './components/Boat';
import { Experience } from './components/Experience';
import { Faq } from './components/Faq';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Pricing } from './components/Pricing';
import { RoteiroSection } from './components/roteiro/RoteiroSection';
import { VideoGallery } from './components/VideoGallery';

export function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <RoteiroSection />
        <Experience />
        <VideoGallery />
        <Boat />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
