import React, { useEffect, useRef } from 'react';
import './MediaComparator.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

interface MediaComparatorProps {
  id: string;
  title?: string;
  slides: Slide[];
  direction?: 'rtl' | 'ltr';
  showComparatorLine?: boolean;
  showOverlayAnimation?: boolean;
}

const MediaComparator: React.FC<MediaComparatorProps> = ({
  id,
  title,
  slides,
  direction = 'rtl',
  showComparatorLine = true,
  showOverlayAnimation = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const swiperWrapperRef = useRef<HTMLDivElement>(null);
  const publicUrl = import.meta.env.BASE_URL;

  const progressRef = useRef({ value: 0 });

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current || !swiperWrapperRef.current) return;

    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    const swiperWrapper = swiperWrapperRef.current;
    const slideElements = Array.from(swiperWrapper.children) as HTMLElement[];
    const numSlides = slideElements.length;

    // Cache slide inner elements
    slideElements.forEach(slide => {
      const slideInner = slide.querySelector('.slide-inner') as HTMLElement;
      const overlay = slide.querySelector('.media-overlay-stack') as HTMLElement;
      (slide as any).slideInner = slideInner;
      (slide as any).overlay = overlay;
    });

    // Calculate wrapper width for scroll distance
    const getWrapperWidth = () => {
      return swiperWrapper.offsetWidth * numSlides;
    };

    // Update slide positions based on progress
    const updateSlidePositions = (progress: number) => {
      progress = Math.max(0, Math.min(1, progress));

      // Reverse progress for LTR direction
      if (direction === 'ltr') {
        progress = 1 - progress;
      }

      // Calculate translation
      const wrapperWidth = swiperWrapper.offsetWidth;
      const maxTranslate = -(wrapperWidth * (numSlides - 1));
      const currentTranslate = maxTranslate * progress;

      // Apply translation
      gsap.set(swiperWrapper, {
        x: currentTranslate
      });

      // Update in-progress state for comparator line
      const inProgress = progress > 0 && progress < 1;
      if (inProgress) {
        swiperWrapper.classList.add('in-progress');
      } else {
        swiperWrapper.classList.remove('in-progress');
      }

      // Update each slide's parallax effect
      const interleaveOffset = 0.5;
      const interleaveOverlayOffset = 0.9;
      
      slideElements.forEach((slide, index) => {
        const slideProgress = progress * (numSlides - 1) - index;
        const clampedProgress = Math.max(-1, Math.min(1, slideProgress));
        
        const slideInner = (slide as any).slideInner;
        const overlay = (slide as any).overlay;

        if (slideInner) {
          const innerTranslate = clampedProgress * wrapperWidth * interleaveOffset;
          gsap.set(slideInner, {
            x: innerTranslate
          });
        }

        if (overlay && showOverlayAnimation) {
          const absProgress = Math.abs(clampedProgress);
          const overlayTranslate = clampedProgress * 100 * interleaveOverlayOffset;
          const opacity = 1 - absProgress;
          
          gsap.set(overlay, {
            x: `${overlayTranslate}%`,
            opacity: opacity
          });
        }
      });
    };

    // Create ScrollTrigger animation
    const animation = gsap.to(progressRef.current, {
      value: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        pin: container,
        pinSpacing: true,
        scrub: 0.25,
        anticipatePin: 1,
        start: 'center center',
        end: () => `+=${getWrapperWidth()}`,
        onUpdate: (self) => {
          updateSlidePositions(self.progress);
        },
        onRefresh: () => {
          updateSlidePositions(progressRef.current.value);
        }
      }
    });

    // Initialize at starting position
    updateSlidePositions(0);

    return () => {
      animation.kill();
    };
  }, [slides, direction, showOverlayAnimation]);

  return (
    <div 
      id={id}
      ref={containerRef}
      className={`media-comparator ${direction === 'rtl' ? 'scrub-rtl' : 'scrub-ltr'}`}
      data-scrub="true"
      data-comparator-line={showComparatorLine ? 'true' : 'false'}
      data-swiper-dir={direction === 'rtl' ? '1' : '-1'}
    >
      {title && (
        <div className="dummy-block">
          <div className="text-container">
            <h2>{title}</h2>
            <h3>Scroll Down<br/>↓</h3>
          </div>
        </div>
      )}
      <div className="container">
        <div className="wrapper wrapper-xl" ref={wrapperRef}>
          <div className="swiper-container">
            <div className="swiper-wrapper" ref={swiperWrapperRef}>
              {slides.map((slide, index) => (
                <div key={index} className="swiper-slide">
                  <div className="slide-inner">
                    <div className="stack-container media-container">
                      {
                        (() => {
                          const raw = slide.image || '';
                          // Leave absolute and leading-root paths unchanged to avoid
                          // interfering with other layout logic that expects '/images/*'.
                          if (/^(https?:)?\/\//i.test(raw) || raw.startsWith('/')) {
                            return (
                              <img
                                className="fit-cover middle-center"
                                src={raw}
                                alt={slide.title}
                                draggable="false"
                              />
                            );
                          }

                          // Otherwise prefix with PUBLIC_URL so relative paths resolve
                          // correctly both in dev and when served under a repo subpath.
                          const imgSrc = `${publicUrl}/${raw.replace(/^\/+/, '')}`;
                          return (
                            <img
                              className="fit-cover middle-center"
                              src={imgSrc}
                              alt={slide.title}
                              draggable="false"
                            />
                          );
                        })()
                      }
                      <div className="media-overlay-stack">
                        <div className="wrapper wrapper-xl">
                          <div className="text-container">
                            <h2>{slide.title}</h2>
                            <p>{slide.subtitle}</p>
                            <button className="cta-button">
                              <span className="text">Learn More</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaComparator;
