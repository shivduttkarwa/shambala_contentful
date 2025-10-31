import React, { useEffect, useState } from 'react';
import './styles/App.css';
import { Header, Footer, Preloader } from './components/Layout';
import {
  HeroSection,
  IconLinksSection,
  HorizontalCarousel,
  MediaComparator,
  StudioSection,
  QualityHomes,
  DreamHomeJourney,
  BlogSection,
} from './components/Home';

import { fetchHomeHero } from '@/cms/queries';
import type { HeroSectionDTO } from '@/cms/types';
import { defaultHeroData } from './data/defaultData';

function App() {
  // -------------------------------
  // ✅ State for Contentful loading
  // -------------------------------
  const [loading, setLoading] = useState(true);
  const [heroProps, setHeroProps] = useState<HeroSectionDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        console.log('⚙️ Fetching Home content from Contentful...');
        const data = await fetchHomeHero('home');
        console.log('✅ Received data:', data);
        setHeroProps(data);
      } catch (err: any) {
        console.error('❌ Error fetching hero data:', err);
        setError(err.message || 'Failed to load Contentful data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // -------------------------------
  // Demo slides (local /public/images/*)
  // -------------------------------
  const publicUrl = import.meta.env.BASE_URL || '/';

  const landscapingSlides = [
    {
      image: `${publicUrl}images/l3.jpg`,
      title: 'Garden Design & Planning',
      subtitle: 'Transform your outdoor space with expert design',
    },
    {
      image: `${publicUrl}images/l1.jpg`,
      title: 'Professional Lawn Care',
      subtitle: 'Maintain a lush, healthy lawn year-round',
    },
    {
      image: `${publicUrl}images/l4.jpg`,
      title: 'Hardscaping Solutions',
      subtitle: 'Patios, walkways, and retaining walls',
    },
  ];

  const maintenanceSlides = [
    {
      image: `${publicUrl}images/hero.jpg`,
      title: 'Tree & Plant Care',
      subtitle: 'Expert pruning and plant health services',
    },
    {
      image: `${publicUrl}images/5.jpg`,
      title: 'Irrigation Systems',
      subtitle: 'Efficient watering solutions for your landscape',
    },
    {
      image: `${publicUrl}images/6.jpg`,
      title: 'Seasonal Maintenance',
      subtitle: 'Year-round care for your outdoor spaces',
    },
  ];

  // -------------------------------
  // Rendering
  // -------------------------------
  return (
    <div className="App">
      {/* ✅ Preloader while fetching */}
      {loading && <Preloader />}
      {error && (
        <div
          style={{
            color: 'red',
            textAlign: 'center',
            padding: '1rem',
            fontWeight: 500,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <Header />
      <main>
        {/* ✅ Hero Section (Contentful → fallback to defaultHeroData) */}
        <HeroSection
          mainTitle={heroProps?.mainTitle ?? defaultHeroData.mainTitle}
          typedTexts={heroProps?.typedTexts ?? defaultHeroData.typedTexts}
          description={heroProps?.description ?? defaultHeroData.description}
          ctaText={heroProps?.ctaText ?? defaultHeroData.ctaText}
          ctaLink={heroProps?.ctaLink ?? defaultHeroData.ctaLink}
          backgroundImage={
            heroProps?.backgroundImage ?? defaultHeroData.backgroundImage
          }
          serviceBoxes={
            heroProps?.serviceBoxes ?? defaultHeroData.serviceBoxes
          }
        />

        {/* Other homepage sections */}
        <MediaComparator
          id="landscaping_services_comparator"
          title="Our Landscaping Services - Scroll to Explore"
          slides={landscapingSlides}
          direction="rtl"
          showComparatorLine={true}
          showOverlayAnimation={true}
        />

        <MediaComparator
          id="maintenance_services_comparator"
          title="Maintenance & Care Services"
          slides={maintenanceSlides}
          direction="ltr"
          showComparatorLine={true}
          showOverlayAnimation={true}
        />

        <IconLinksSection />
        <HorizontalCarousel title="Our Premium Services" />

        <StudioSection />
        <StudioSection />

        <QualityHomes />
        <DreamHomeJourney />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
