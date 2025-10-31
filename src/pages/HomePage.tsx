import React, { useEffect, useState } from 'react';
import { fetchHomeHero } from '@/cms/queries';
import type { HeroSectionDTO } from '@/cms/types';
import HeroSection from '@/components/Home/HeroSection';

const HomePage: React.FC = () => {
  const [hero, setHero] = useState<HeroSectionDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        console.log('⚙️ Fetching Home page content from Contentful...');
        const data = await fetchHomeHero('home');
        console.log('✅ Received data:', data);
        setHero(data);
      } catch (err: any) {
        console.error('❌ Error fetching hero data:', err);
        setError(err.message || 'Failed to load Contentful data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!hero) return <div>No content found.</div>;

  return (
    <main>
      <HeroSection
        mainTitle={hero.mainTitle}
        typedTexts={hero.typedTexts}
        description={hero.description}
        ctaText={hero.ctaText}
        ctaLink={hero.ctaLink}
        backgroundImage={hero.backgroundImage}
        serviceBoxes={hero.serviceBoxes}
      />
    </main>
  );
};

export default HomePage;
