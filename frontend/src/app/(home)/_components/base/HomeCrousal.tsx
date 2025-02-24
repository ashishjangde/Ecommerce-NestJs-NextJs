'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function HomeCrousal() {
  // Sample images for demonstration
  const slides = [
    {
      id: 1,
      bgColor: 'bg-blue-600',
      content: 'First Slide with Sample Content',
      image: '/api/placeholder/1200/500'
    },
    {
      id: 2,
      bgColor: 'bg-purple-600',
      content: 'Second Slide with Sample Content',
      image: '/api/placeholder/1200/500'
    },
    {
      id: 3,
      bgColor: 'bg-green-600',
      content: 'Third Slide with Sample Content',
      image: '/api/placeholder/1200/500'
    },
    {
      id: 4,
      bgColor: 'bg-red-600',
      content: 'Fourth Slide with Sample Content',
      image: '/api/placeholder/1200/500'
    },
    {
      id: 5,
      bgColor: 'bg-yellow-600',
      content: 'Fifth Slide with Sample Content',
      image: '/api/placeholder/1200/500'
    }
  ];

  return (
    <div className="w-[calc(100vw-2px)]  h-[350px] relative group">
      <Swiper
        style={{
          ['--swiper-navigation-color' as string]: '#2563eb',
          ['--swiper-pagination-color' as string]: '#2563eb',
        }}
        className="w-[calc(100vw-2px)] h-full"
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={{
          prevEl: '.swiper-button-prev-custom',
          nextEl: '.swiper-button-next-custom',
        }}
        modules={[Autoplay, Pagination, Navigation]}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className={`${slide.bgColor} relative`}>
            <div className="w-[calc(100vw-2px)] h-full flex items-center justify-center relative">
              <img 
                src={slide.image}
                alt={`Slide ${slide.id}`}
                className="w-[calc(100vw-2px)] h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-4xl font-bold text-white">{slide.content}</h2>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div className="absolute top-0 left-0 h-full z-10 swiper-button-prev-custom  transition-opacity duration-300">
          <button className="h-full px-4 bg-white  hover:bg-opacity-75 transition-all duration-300 flex items-center">
            <ChevronLeft size={40} className="text-blue-600" />
          </button>
        </div>
        <div className="absolute top-0 right-0 h-full z-10 swiper-button-next-custom  transition-opacity duration-300">
          <button className="h-full px-4 bg-white hover:bg-opacity-75 transition-all duration-300 flex items-center">
            <ChevronRight size={40} className="text-blue-600" />
          </button>
        </div>
      </Swiper>
    </div>
  );
}