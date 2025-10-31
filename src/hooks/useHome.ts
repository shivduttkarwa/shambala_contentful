// import Contentful equivalents here when ready

// Match your HeroSection props (keep as-is in your component)
export type HeroSectionProps = {
  mainTitle?: string[];
  typedTexts?: string[];
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  serviceBoxes?: Array<{
    id: number;
    index: number;
    title: string;
    description: string;
    image: string;
    imageSmall?: string; // Add thumbnail for lazy loading
    fullImage?: string; // Full resolution for slider
  }>;
};

// Strapi logic removed. Implement Contentful logic here.