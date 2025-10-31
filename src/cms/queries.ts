import type { Entry } from 'contentful';
import { getEntries } from './contentfulClient';
import {
  PageSkeleton,
  HeroSectionSkeleton,
  ServiceBoxSkeleton,
  assetUrl,
  type HeroSectionDTO,
} from './types';
import { thumbUrl, tileUrl, fullUrl } from './image';

/**
 * Fetch Home page by slug, expand hero + boxes, and map to HeroSectionDTO
 */
export async function fetchHomeHero(slug = 'home'): Promise<HeroSectionDTO | null> {
  const [page]: Entry<PageSkeleton>[] = await getEntries<PageSkeleton>({
    content_type: 'page',
    'fields.slug': slug,
    include: 2, // pulls linked hero, serviceBoxes, assets
    limit: 1,
  });
  console.log('✅ Contentful response:', page);

  if (!page) return null;

  const heroEntry = page.fields.hero as unknown as Entry<HeroSectionSkeleton> | undefined;
  if (!heroEntry) return null;

  const hero = heroEntry.fields;

  // Map ServiceBoxes → optimized URLs derived from a single uploaded image
  const rawBoxes =
    (hero.serviceBoxes as unknown as Entry<ServiceBoxSkeleton>[]) || [];

  const serviceBoxes = rawBoxes
    .map((e) => {
      const f = e.fields;
      const base = assetUrl((f as any).image);
      if (!base) return null;

      return {
        id: f.id,
        index: f.index,
        title: f.title,
        description: f.description || '',
        image: tileUrl(base),         // main circle image
        imageSmall: thumbUrl(base),   // tiny placeholder
        fullImage: fullUrl(base),     // large for modal/slider
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => a.index - b.index) as HeroSectionDTO['serviceBoxes'];

  // helper to unwrap potential object/string confusion
const safeStr = (val: any): string | undefined =>
  typeof val === 'string' ? val : undefined;
const bgBase = hero.backgroundImage ? assetUrl((hero as any).backgroundImage) : undefined;

return {
  mainTitle: Array.isArray(hero.mainTitle)
    ? (hero.mainTitle as string[])
    : undefined,
  typedTexts: Array.isArray(hero.typedTexts)
    ? (hero.typedTexts as string[])
    : undefined,
  description: safeStr(hero.description),
  ctaText: safeStr(hero.ctaText),
  ctaLink: safeStr(hero.ctaLink),
  backgroundImage: bgBase ? tileUrl(bgBase) : undefined,
  serviceBoxes,
};

}
