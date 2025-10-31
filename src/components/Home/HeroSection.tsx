import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SliderModal from './SliderModal';
import LazyImage from '@/components/LazyImage';

gsap.registerPlugin(ScrollTrigger);

export interface ServiceBox {
  id: number;
  index: number;
  title: string;
  description: string;
  image: string;         // tileUrl(...) from Contentful Images API
  imageSmall?: string;   // thumbUrl(...), tiny placeholder
  fullImage?: string;    // fullUrl(...), used in SliderModal
}

export interface HeroSectionProps {
  mainTitle?: string[];
  typedTexts?: string[];
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  serviceBoxes?: ServiceBox[];
}

const HeroSection: React.FC<HeroSectionProps> = ({
  mainTitle = ['we', 'make'],
  typedTexts = [
    'eco-friendly outdoors',
    'self-sustaining gardens',
    'relaxing spaces',
    'beautiful landscapes',
  ],
  ctaText = 'Get a Free Site Visit',
  ctaLink = '#contact',
  backgroundImage,
  serviceBoxes = [],
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const bookLinkRef = useRef<HTMLAnchorElement>(null);
  const mainGridRef = useRef<HTMLDivElement>(null);

  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Preload full-resolution images for smooth slider experience (if provided)
  useEffect(() => {
    serviceBoxes.forEach((box) => {
      if (box.fullImage) {
        const img = new Image();
        img.src = box.fullImage;
      }
    });
  }, [serviceBoxes]);

  // Animation state refs
  const currentIndexRef = useRef(0);
  const currentBricksRef = useRef<HTMLDivElement[]>([]);
  const brickWallBuiltRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!h1Ref.current || !textRef.current) return;

    // Force scroll to top on mount
    try {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch {
      /* noop */
    }

    const h1Element = h1Ref.current;
    const container = textRef.current;

    // Prepare initial states
    const spans = h1Element.querySelectorAll('.d-flex span');
    gsap.set(spans, { y: '100%' }); // Start below
    gsap.set(container, { y: 0, opacity: 0 }); // Start hidden
    container.textContent = ''; // Start empty

    // Helpers to create/clear bricks
    const createBricks = () => {
      const bricks: HTMLDivElement[] = [];
      const rect = h1Element.getBoundingClientRect();

      const brickHeight = 35;
      const brickWidth = 85;
      const bricksPerRow = Math.ceil(rect.width / brickWidth) + 2;
      const rows = Math.ceil(rect.height / brickHeight) + 1;

      for (let row = 0; row < rows; row++) {
        const isEvenRow = row % 2 === 0;
        const offsetX = isEvenRow ? 0 : -brickWidth / 2;

        for (let col = 0; col < bricksPerRow; col++) {
          const brick = document.createElement('div');
          brick.className = 'brick';
          brick.style.cssText = `
            position: absolute;
            background: rgba(250,248,243,.95);
            border: 0.5px solid rgba(91,124,79,.15);
            box-shadow: inset 0 0 15px rgba(91,124,79,.1);
            box-sizing: border-box;
            z-index: -1;
            width: ${brickWidth}px;
            height: ${brickHeight}px;
            left: ${offsetX + col * brickWidth}px;
            top: ${row * brickHeight}px;
          `;
          h1Element.appendChild(brick);
          bricks.push(brick);
        }
      }
      return bricks;
    };

    const clearOldBricks = () => {
      currentBricksRef.current.forEach((brick) => brick.remove());
      currentBricksRef.current = [];
    };

    // Animate bricks entering + title reveal + typed text
    const animateBricksAssembly = (callback: () => void) => {
      clearOldBricks();

      const bricks = createBricks();
      currentBricksRef.current = bricks;
      const triggerPoint = Math.floor(bricks.length * 0.5);

      bricks.forEach((brick, i) => {
        const fromSide = Math.floor(Math.random() * 4);
        let startX = 0,
          startY = 0;

        switch (fromSide) {
          case 0:
            startX = (Math.random() - 0.5) * 600;
            startY = -1000 - Math.random() * 400;
            break;
          case 1:
            startX = 1000 + Math.random() * 400;
            startY = (Math.random() - 0.5) * 600;
            break;
          case 2:
            startX = (Math.random() - 0.5) * 600;
            startY = 1000 + Math.random() * 400;
            break;
          case 3:
          default:
            startX = -1000 - Math.random() * 400;
            startY = (Math.random() - 0.5) * 600;
            break;
        }

        const startRotation = Math.random() * 720 - 360;

        gsap.set(brick, {
          x: startX,
          y: startY,
          rotation: startRotation,
          opacity: 0,
          scale: 0.5,
        });

        gsap.to(brick, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          delay: i * 0.018,
          ease: 'back.out(1.2)',
          onComplete: () => {
            if (i === triggerPoint) callback();
            if (i === bricks.length - 1) {
              brickWallBuiltRef.current = true;
            }
          },
        });
      });
    };

    const animateTitleReveal = (callback: () => void) => {
      const spans = h1Element.querySelectorAll('.d-flex span');
      gsap.to(spans, {
        duration: 0.8,
        y: '0%',
        stagger: 0.2,
        ease: 'power2.out',
        onComplete: callback,
      });
    };

    const animateTypedTextOnce = () => {
      if (!textRef.current) return;

      const text = typedTexts[currentIndexRef.current] ?? '';
      container.textContent = '';
      container.style.opacity = '1';

      // Create individual letters
      const letters = text.split('').map((char) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        container.appendChild(span);
        return span;
      });

      // Animate letters
      gsap.fromTo(
        letters,
        { opacity: 0, y: 20, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.03,
        }
      );
    };

    const showLine = () => {
      animateBricksAssembly(() => {
        animateTitleReveal(() => {
          animateTypedTextOnce();
        });
      });
    };

    // Fallback timer if animation fails
    const fallbackTimer = setTimeout(() => {
      const spansLocal = h1Element.querySelectorAll('.d-flex span');
      gsap.set(spansLocal, { y: '0%' });
      gsap.set(container, { y: 0, opacity: 1 });
      if (!container.textContent) container.textContent = typedTexts[0] ?? '';
    }, 3000);

    // ScrollTrigger
    ScrollTrigger.create({
      trigger: h1Element,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => {
        clearTimeout(fallbackTimer);
        showLine();
      },
      onLeave: () => {
        gsap.killTweensOf(container);
      },
      onEnterBack: () => {
        gsap.killTweensOf(container);
        const spansLocal = h1Element.querySelectorAll('.d-flex span');
        gsap.killTweensOf(spansLocal);

        container.textContent = '';
        gsap.set(container, { y: 30, opacity: 0, clearProps: 'all' });
        gsap.set(spansLocal, { y: '100%', clearProps: 'transform' });

        brickWallBuiltRef.current = false;
        currentIndexRef.current = 0;

        setTimeout(() => {
          showLine();
        }, 50);
      },
      onLeaveBack: () => {
        gsap.killTweensOf(container);
        const spansLocal = h1Element.querySelectorAll('.d-flex span');
        gsap.killTweensOf(spansLocal);

        container.textContent = '';
        gsap.set(container, { y: 30, opacity: 0, clearProps: 'all' });
        gsap.set(spansLocal, { y: '100%', clearProps: 'transform' });

        clearOldBricks();
      },
    });

    // Initial animation
    showLine();

    // Force show text if bricks didn’t complete quickly
    const strongFallback = setTimeout(() => {
      if (!brickWallBuiltRef.current) {
        const spansLocal = h1Element.querySelectorAll('.d-flex span');
        gsap.set(spansLocal, { y: '0%' });
        gsap.set(container, { y: 0, opacity: 1 });
        if (!container.textContent) container.textContent = typedTexts[0] ?? '';
      }
    }, 2000);

    // Text cycling
    const cycleText = () => {
      if (!textRef.current || isPaused) return;

      const cont = textRef.current;
      const nextIndex = (currentIndexRef.current + 1) % typedTexts.length;
      const nextText = typedTexts[nextIndex] ?? '';

      gsap.to(cont, {
        x: -50,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          cont.textContent = '';

          const letters = nextText.split('').map((char) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateX(50px)';
            cont.appendChild(span);
            return span;
          });

          currentIndexRef.current = nextIndex;

          gsap.set(cont, { x: 50, opacity: 0 });
          gsap.to(cont, {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
              gsap.to(letters, {
                x: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.02,
                ease: 'power2.out',
              });
            },
          });
        },
      });
    };

    const cycleInterval = setInterval(cycleText, 3000);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      clearInterval(cycleInterval);
      clearTimeout(fallbackTimer);
      clearTimeout(strongFallback);
      clearOldBricks();
    };
  }, [typedTexts, isPaused]);

  // Pause ongoing animations if slider is open
  useEffect(() => {
    if (isPaused && textRef.current) {
      gsap.killTweensOf(textRef.current);
    }
  }, [isPaused]);

  // Animate CTA button text into per-char spans (once)
  useEffect(() => {
    if (!bookLinkRef.current) return;
    const linkTextSpan = bookLinkRef.current.querySelector('.linktext');
    if (!linkTextSpan) return;

    const raw = linkTextSpan.textContent || '';
    linkTextSpan.innerHTML = '';
    raw.split('').forEach((char) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char;
      linkTextSpan.appendChild(span);
    });
  }, [ctaText]);

  const handleBoxClick = (index: number) => {
    setSelectedBoxIndex(index);
    setIsSliderOpen(true);
    setIsPaused(true);
  };

  const handleCloseSlider = () => {
    setIsSliderOpen(false);
    setIsPaused(false);
  };

  return (
    <>
      <section
        className="info-section"
        id="home"
        style={
          backgroundImage
            ? { backgroundImage: `url(${backgroundImage})` }
            : undefined
        }
      >
        <div className="left-part">
          <h1 ref={h1Ref}>
            <div className="d-flex-wrapper">
              {mainTitle.map((word, index) => (
                <div key={index} className="d-flex">
                  <span>{word}</span>
                </div>
              ))}
            </div>
            <span className="text changing-text" ref={textRef} />
          </h1>

          <a href={ctaLink} className="book-link" ref={bookLinkRef}>
            <span className="linktext">{ctaText}</span>
            <span className="arrow" />
          </a>
        </div>

        <div className="right-part">
          <div
            className={`main-grid d-flex ${isPaused ? 'paused' : ''}`}
            ref={mainGridRef}
          >
            {(serviceBoxes ?? []).map((box) => (
              <div
                key={box.id}
                className="box"
                data-index={box.index}
                onClick={() => handleBoxClick(box.index)}
                role="button"
                aria-label={box.title}
              >
                <div className="bg-img">
                  <LazyImage
                    src={box.image}
                    placeholder={box.imageSmall}
                    alt={box.title}
                    width={600}
                    height={600}
                    className="circle-tile"
                    imgClassName="img"
                    sizes="(max-width: 768px) 44vw, (max-width: 1200px) 28vw, 18vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SliderModal
        isOpen={isSliderOpen}
        onClose={handleCloseSlider}
        serviceBoxes={serviceBoxes}
        initialSlide={selectedBoxIndex}
      />
    </>
  );
};

export default HeroSection;
