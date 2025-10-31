import React, { useEffect, useRef, useState } from 'react';

type LazyImageProps = {
  /** Final full-quality image URL */
  src: string;
  /** Required for accessibility */
  alt: string;

  /** Tiny placeholder (e.g., Contentful thumbUrl) */
  placeholder?: string;

  /** Width/height strongly recommended to prevent CLS */
  width?: number;
  height?: number;

  /** Optional responsive sources */
  srcSet?: string;
  sizes?: string;

  /** How the image should fit its box (default: 'cover') */
  objectFit?: React.CSSProperties['objectFit'];

  /** Extra classes for the outer wrapper and images */
  className?: string;
  imgClassName?: string;

  /** Optional inline style on wrapper */
  style?: React.CSSProperties;

  /** Called when the full image has loaded */
  onLoad?: (ev: React.SyntheticEvent<HTMLImageElement, Event>) => void;

  /** If you want to disable IntersectionObserver and load immediately */
  eager?: boolean;

  /** If you render in a scrollable container, pass its element for the observer root */
  rootMargin?: string; // e.g., '200px'
};

export default function LazyImage({
  src,
  alt,
  placeholder,
  width,
  height,
  srcSet,
  sizes,
  objectFit = 'cover',
  className,
  imgClassName,
  style,
  onLoad,
  eager = false,
  rootMargin = '300px',
}: LazyImageProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState<boolean>(eager);
  const [loaded, setLoaded] = useState<boolean>(false);

  // Observe visibility
  useEffect(() => {
    if (eager || inView) return;

    const node = wrapRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      // Fallback: no IO support – load immediately
      setInView(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        });
      },
      { root: null, rootMargin, threshold: 0.01 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [eager, inView, rootMargin]);

  // Fire external onLoad after we’ve marked as loaded
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setLoaded(true);
    onLoad?.(e);
  };

  // Maintain aspect-ratio box to prevent layout shift
  const aspectStyle: React.CSSProperties | undefined =
    width && height
      ? {
          aspectRatio: `${width} / ${height}`,
        }
      : undefined;

  return (
    <div
      ref={wrapRef}
      className={`lazy-wrap ${className ?? ''}`}
      style={{ position: 'relative', overflow: 'hidden', ...aspectStyle, ...style }}
    >
      {/* 1) Placeholder layer (small, blurred) */}
      {placeholder && (
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          className={`lazy-img lazy-img--blur ${imgClassName ?? ''} ${
            loaded ? 'lazy-img--hidden' : ''
          }`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit,
          }}
          decoding="async"
          loading="eager"
        />
      )}

      {/* 2) Real image (only created when inView) */}
      {inView && (
        <img
          src={src}
          alt={alt}
          className={`lazy-img ${imgClassName ?? ''} ${loaded ? 'lazy-img--loaded' : ''}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit,
            // start slightly transparent to crossfade with blur layer
            opacity: loaded ? 1 : 0,
            transition: 'opacity 350ms ease',
          }}
          width={width}
          height={height}
          srcSet={srcSet}
          sizes={sizes}
          decoding="async"
          loading={eager ? 'eager' : 'lazy'}
          onLoad={handleLoad}
        />
      )}

      {/* 3) <noscript> fallback for no-JS crawlers */}
      <noscript>
        <img
          src={src}
          alt={alt}
          className={`lazy-img noscript ${imgClassName ?? ''}`}
          style={{ width: '100%', height: '100%', objectFit }}
          width={width}
          height={height}
        />
      </noscript>
    </div>
  );
}
