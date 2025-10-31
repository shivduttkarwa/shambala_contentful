// src/lib/strapi.ts
export const API_URL =
  (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:1337';

export function mediaUrl(input?: any): string | undefined {
  if (!input) return undefined;
  const url =
    typeof input === 'string'
      ? input
      : input?.url ??
        input?.data?.attributes?.url ??
        input?.attributes?.url;
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${API_URL}${url}`;
  return url;
}

export async function fetchHomePage() {
  const url =
    `${API_URL}/api/pages` +
    `?filters[slug][$eq]=home` +
    `&populate[sections][on][sections.hero][populate][backgroundImage][fields][0]=url` +
    `&populate[sections][on][sections.hero][populate][backgroundImage][fields][1]=formats` +
    `&populate[sections][on][sections.hero][populate][circleGallery][populate][image][fields][0]=url` +
    `&populate[sections][on][sections.hero][populate][circleGallery][populate][image][fields][1]=formats` +
    `&populate[sections][on][sections.hero][populate][circleGallery][populate][image][fields][2]=width` +
    `&populate[sections][on][sections.hero][populate][circleGallery][populate][image][fields][3]=height` +
    `&populate[sections][on][sections.hero][populate][cta]=*` +
    `&populate[sections][on][sections.hero][populate][rotatingPhrases]=*`;

  console.log('[Strapi] Fetching URL:', url);
  
  try {
    const res = await fetch(url);
    console.log('[Strapi] Response status:', res.status);
    
    if (!res.ok) {
      const text = await res.text();
      console.error('[Strapi] Error response:', text);
      throw new Error(`Strapi fetch failed: ${res.status}`);
    }
    
    const json = await res.json();
    console.log('[Strapi] Full response:', json);
    
    const page = json?.data?.[0] ?? null;
    console.log('[Strapi] sections raw →', page?.sections);
    
    return page;
  } catch (error) {
    console.error('[Strapi] Fetch error:', error);
    throw error;
  }
}