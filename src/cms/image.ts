// Utilities to build optimized Contentful image URLs from one base asset URL.

type ImgOpts = {
  w?: number;
  h?: number;
  q?: number; // 1–100
  fit?: 'fill' | 'scale' | 'thumb' | 'pad' | 'crop';
  fm?: 'jpg' | 'png' | 'webp' | 'avif';
  bg?: string;
};

export function imgUrl(url: string, opts: ImgOpts = {}): string {
  const u = new URL(url.startsWith('//') ? `https:${url}` : url);
  const p = u.searchParams;
  if (opts.w) p.set('w', String(opts.w));
  if (opts.h) p.set('h', String(opts.h));
  if (opts.q) p.set('q', String(opts.q));
  if (opts.fit) p.set('fit', opts.fit);
  if (opts.fm) p.set('fm', opts.fm);
  if (opts.bg) p.set('bg', opts.bg);
  return u.toString();
}

/** Very small placeholder for blur-up */
export function thumbUrl(url: string): string {
  return imgUrl(url, { w: 40, q: 20, fm: 'jpg' });
}

/** Default tile (good for circular grid boxes) */
export function tileUrl(url: string): string {
  return imgUrl(url, { w: 600, q: 70, fm: 'webp' });
}

/** Large image (for modal/slider) */
export function fullUrl(url: string): string {
  return imgUrl(url, { w: 1600, q: 80, fm: 'webp' });
}

/** Optional srcset if you need responsive <img> */
export function srcSet(url: string, widths: number[] = [320, 480, 768, 1024, 1440]) {
  return widths.map(w => `${imgUrl(url, { w, q: 70, fm: 'webp' })} ${w}w`).join(', ');
}
