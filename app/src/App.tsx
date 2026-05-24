import { useEffect, useState } from 'react';
import { siteConfig } from './config';
import Hero from './sections/Hero';
import Experience from './sections/Experience';
import Observation from './sections/Observation';
import Archives from './sections/Archives';
import Achievements from './sections/Achievements';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import Preloader from './components/Preloader';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = siteConfig.siteTitle || 'Kishor Kumar | AI Engineer';
    document.documentElement.lang = siteConfig.language || 'en';

    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = siteConfig.siteDescription || '';
  }, []);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <main style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.8s ease' }}>
        <Hero isLoaded={!loading} />
        {/* Anchor for About section links (which transitions in Hero storytelling pin) */}
        <div id="about" />
        <Experience />
        <Observation />
        <Archives />
        <Achievements />
        <Contact />
      </main>
      {!loading && <Footer />}
    </>
  );
}

export default App;
