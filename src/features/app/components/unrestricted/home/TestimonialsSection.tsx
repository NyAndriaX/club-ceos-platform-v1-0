import React, { useEffect, useRef } from 'react';
import 'keen-slider/keen-slider.min.css';
import KeenSlider from 'keen-slider';
import { Button } from 'primereact/button';
import { CardTestimonial } from './CardTestimonial';

type KeenSliderInstance = {
  prev: () => void;
  next: () => void;
  destroy: () => void;
};

export const TestimonialsSection: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const keenSliderRef = useRef<KeenSliderInstance | null>(null);

  const keenSliderPrevious = () => {
    keenSliderRef.current?.prev();
  };

  const keenSliderNext = () => {
    keenSliderRef.current?.next();
  };

  useEffect(() => {
    if (sliderRef.current) {
      keenSliderRef.current = new KeenSlider(sliderRef.current, {
        loop: true,
        slides: {
          origin: 'center',
          perView: 1.25,
          spacing: 16,
        },
        breakpoints: {
          '(min-width: 1024px)': {
            slides: {
              origin: 'auto',
              perView: 1.5,
              spacing: 32,
            },
          },
        },
      }) as KeenSliderInstance;

      return () => {
        keenSliderRef.current?.destroy();
      };
    }
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 lg:py-8 w-full">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-center lg:gap-16">
        <div className="max-w-xl text-center sm:text-left rtl:text-right">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900">
            Témoignages de nos membres
          </h2>
          <p className="mt-4 text-gray-500">
            Malt, ce sont ceux qui l&apos;utilisent le plus qui en parlent le
            mieux :
          </p>

          <div className="hidden lg:mt-8 lg:flex lg:gap-4">
            <Button
              size="small"
              onClick={keenSliderPrevious}
              aria-label="Previous slide"
              className="p-button-rounded p-button-outlined p-button-text text-fuchsia-500 border-fuchsia-500 hover:bg-fuchsia-500 hover:text-white"
              icon="pi pi-angle-left"
            />
            <Button
              size="small"
              onClick={keenSliderNext}
              aria-label="Next slide"
              className="p-button-rounded p-button-outlined p-button-text text-fuchsia-500 border-fuchsia-500 hover:bg-fuchsia-500 hover:text-white"
              icon="pi pi-angle-right"
            />
          </div>
        </div>

        <div className="-mx-4 lg:col-span-2 lg:mx-0">
          <div ref={sliderRef} className="keen-slider">
            <div className="keen-slider__slide">
              <CardTestimonial />
            </div>
            <div className="keen-slider__slide">
              <CardTestimonial />
            </div>
            <div className="keen-slider__slide">
              <CardTestimonial />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
