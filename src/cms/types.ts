import type { EntrySkeletonType, EntryFieldTypes } from 'contentful';

/**
 * HeroSection content model (must match Contentful "heroSection" fields)
 */
export interface HeroSectionSkeleton extends EntrySkeletonType {
  contentTypeId: 'heroSection';
  fields: {
    mainTitle: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;     // e.g., ["we","make"]
    typedTexts: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;     // rotating lines
    description?: EntryFieldTypes.Text;
    ctaText?: EntryFieldTypes.Symbol;
    ctaLink?: EntryFieldTypes.Symbol;
    backgroundImage?: EntryFieldTypes.AssetLink;
    serviceBoxes?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ServiceBoxSkeleton>>;
  };
}

/**
 * ServiceBox content model (must match Contentful "serviceBox" fields)
 */
export interface ServiceBoxSkeleton extends EntrySkeletonType {
  contentTypeId: 'serviceBox';
  fields: {
    id: EntryFieldTypes.Integer;                    // 1,2,3...
    index: EntryFieldTypes.Integer;                 // 0,1,2...
    title: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
    image: EntryFieldTypes.AssetLink;               // single source asset
    imageSmall?: EntryFieldTypes.AssetLink;         // (optional) not required if using Images API
    fullImage?: EntryFieldTypes.AssetLink;          // (optional) not required if using Images API
  };
}

/**
 * Page content model (must match Contentful "page" fields)
 */
export interface PageSkeleton extends EntrySkeletonType {
  contentTypeId: 'page';
  fields: {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol; // "home"
    hero?: EntryFieldTypes.EntryLink<HeroSectionSkeleton>;
    // Add seoTitle, seoDescription, sections, etc. later as needed
  };
}

/* ------------------------ runtime helpers ------------------------ */

/** Extract https URL from a Contentful Asset (returns undefined if missing) */
export function assetUrl(asset: any): string | undefined {
  const url: string | undefined = asset?.fields?.file?.url;
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
}

/** Props shape your React Hero component expects (DTO) */
export type HeroSectionDTO = {
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
    image: string;         // optimized tile url
    imageSmall?: string;   // tiny placeholder
    fullImage?: string;    // large for modal/slider
  }>;
};
