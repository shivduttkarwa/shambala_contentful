import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import { Mousewheel, Keyboard } from 'swiper/modules';
import 'swiper/css';
import LazyImage from '@/components/LazyImage';


interface ServiceBox {
  id: number;
  index: number;
  title: string;
  description: string;
  image: string;
  fullImage?: string;
}

interface SliderModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceBoxes: ServiceBox[];
  initialSlide?: number;
}

const SliderModal: React.FC<SliderModalProps> = ({
  isOpen,
  onClose,
  serviceBoxes,
  initialSlide = 0
}) => {
  const swiperRef = useRef<Swiper | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      // Initialize Swiper after modal is visible
      setTimeout(() => {
        if (!swiperRef.current && containerRef.current) {
          const swiperContainer = containerRef.current.querySelector('.swiper');
          if (swiperContainer) {
            swiperRef.current = new Swiper(swiperContainer as HTMLElement, {
              modules: [Mousewheel, Keyboard],
              grabCursor: true,
              speed: 500,
              effect: 'slide',
              loop: true,
              mousewheel: {
                invert: false,
                sensitivity: 1,
              },
              keyboard: {
                enabled: true,
                onlyInViewport: true,
              },
              direction: 'horizontal',
            });
          }
        }

        // Go to the clicked slide
        if (swiperRef.current) {
          swiperRef.current.slideToLoop(initialSlide);
        }
      }, 100);
    } else {
      document.body.style.overflow = '';
    }

    // Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (!isOpen) {
        document.body.style.overflow = '';
        if (swiperRef.current) {
          swiperRef.current.destroy();
          swiperRef.current = null;
        }
      }
    };
  }, [isOpen, initialSlide, onClose]);

  const getTitleClass = (index: number): string => {
    const classes = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
    return classes[index % classes.length];
  };

  return (
    <div className={`slider-modal ${isOpen ? 'active' : ''}`} ref={containerRef}>
      <button className="slider-close" onClick={onClose}>
        ×
      </button>

      <div className="slider-section">
        <div className="swiper">
          <div className="swiper-wrapper">
            {serviceBoxes.map((box, index) => {
              const title = box.title || `Service ${index + 1}`;
              const description = box.description || '';
              return (
                <div key={box.id} className="swiper-slide">
                  <h2 className={`slider-title ${getTitleClass(index)}`}>
                    {title}
                  </h2>
                  <LazyImage
                    src={box.fullImage || box.image}
                    placeholder={box.image}
                    alt={title}
                    className="slider-image"
                  />
                  <div className="slide-description">{description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderModal;
