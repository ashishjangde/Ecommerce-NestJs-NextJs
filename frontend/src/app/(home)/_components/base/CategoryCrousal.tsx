'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryCarousel() {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [totalSlides, setTotalSlides] = React.useState(0);
    const slides = [
        { id: 1, bgColor: 'bg-blue-600', title: 'Electronics' },
        { id: 2, bgColor: 'bg-purple-600', title: 'Fashion' },
        { id: 3, bgColor: 'bg-green-600', title: 'Home' },
        { id: 4, bgColor: 'bg-red-600', title: 'Sports' },
        { id: 5, bgColor: 'bg-yellow-600', title: 'Books' },
        { id: 6, bgColor: 'bg-pink-600', title: 'Beauty' }
    ];

    // Add this function to calculate the last available index
    const getLastSlideIndex = () => {
        const width = window?.innerWidth || 0;
        let slidesPerView = 1;
        
        if (width >= 1024) slidesPerView = 5;
        else if (width >= 768) slidesPerView = 4;
        else if (width >= 640) slidesPerView = 4;
        else if (width >= 320) slidesPerView = 3;

        return Math.max(0, slides.length - slidesPerView);
    };

    React.useEffect(() => {
        setTotalSlides(getLastSlideIndex());
        const handleResize = () => setTotalSlides(getLastSlideIndex());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="w-full flex justify-center items-center">
            <div className="w-full max-w-7xl">
                <Swiper
                    style={{
                        ['--swiper-navigation-color' as string]: '#2563eb',
                        ['--swiper-pagination-color' as string]: '#2563eb'
                    }}
                    className="!px-4 !py-16"
                    spaceBetween={30}
                    slidesPerView={1}
                    centeredSlides={false}
                    // pagination={{
                    //     clickable: true

                    // }}
                    navigation={{
                        prevEl: '.swiper-button-prev-custom',
                        nextEl: '.swiper-button-next-custom',
                      }}
                    breakpoints={{
                        320: { slidesPerView: 3 },
                        640: { slidesPerView: 4 },
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 5 }
                    }}
                    modules={[Pagination, Navigation]}
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                >
                    {slides.map(slide => (
                        <SwiperSlide 
                            key={slide.id} 
                            className="group h-48 relative"
                        >
                            <div className="w-full h-full flex flex-col items-center">
                                <div
                                    className={cn(
                                        "rounded-full shadow-lg w-20 h-20",
                                        "flex items-center justify-center",
                                        "transition-all duration-500 ease-in-out",
                                        "transform hover:scale-110",
                                        "hover:shadow-xl cursor-pointer",
                                        "before:content-[''] before:absolute before:inset-0",
                                        "before:rounded-full before:opacity-0",
                                        "before:transition-opacity before:duration-500",
                                        "hover:before:opacity-100",
                                        "before:animate-pulse",
                                        slide.bgColor,
                                        `hover:${slide.bgColor}/90`
                                    )}
                                >
                                    {/* Add icons or images here */}
                                </div>
                                <div className="w-20 absolute top-28">
                                    <span 
                                        className={cn(
                                            "font-medium text-gray-700 text-lg",
                                            "transition-all duration-500",
                                            "group-hover:text-blue-600",
                                            "whitespace-nowrap",
                                            "block text-center"
                                        )}
                                    >
                                        {slide.title}
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                    <div className="absolute top-0 left-0 h-full z-10 swiper-button-prev-custom">
                        <button
                            className={cn(
                                "h-full px-4 flex items-center transition-colors duration-200",
                                "hover:bg-gray-100/50",
                                "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
                                activeIndex === 0 && "opacity-40 cursor-not-allowed"
                            )}
                            onClick={(e) => {
                                if (activeIndex === 0) e.preventDefault();
                            }}
                        >
                            <ChevronLeft 
                                size={40} 
                                className={cn(
                                    "text-blue-600 transition-colors duration-200",
                                    activeIndex === 0 ? "text-gray-400" : "hover:text-blue-700"
                                )} 
                            />
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 h-full z-10 swiper-button-next-custom">
                        <button
                            className={cn(
                                "h-full px-4 flex items-center transition-colors duration-200",
                                "hover:bg-gray-100/50",
                                "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
                                activeIndex >= totalSlides && "opacity-40 cursor-not-allowed"
                            )}
                            onClick={(e) => {
                                if (activeIndex >= totalSlides) e.preventDefault();
                            }}
                        >
                            <ChevronRight 
                                size={40} 
                                className={cn(
                                    "text-blue-600 transition-colors duration-200",
                                    activeIndex >= totalSlides ? "text-gray-400" : "hover:text-blue-700"
                                )} 
                            />
                        </button>
                    </div>
                </Swiper>
            </div>
        </div>
    );
}