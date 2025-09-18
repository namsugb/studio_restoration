"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface ImageSliderProps {
    SLIDER_IMAGES: string[];
}

export default function ImageSlider({ SLIDER_IMAGES }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // 자동 슬라이드
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === SLIDER_IMAGES.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000); // 4초마다 자동 슬라이드

        return () => clearInterval(interval);
    }, [isAutoPlaying, SLIDER_IMAGES.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
        // 3초 후 자동 플레이 재개
        setTimeout(() => setIsAutoPlaying(true), 3000);
    };

    const goToPrevious = () => {
        setCurrentIndex(currentIndex === 0 ? SLIDER_IMAGES.length - 1 : currentIndex - 1);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 3000);
    };

    const goToNext = () => {
        setCurrentIndex(currentIndex === SLIDER_IMAGES.length - 1 ? 0 : currentIndex + 1);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 3000);
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            {/* 메인 이미지 */}
            <div className="relative h-64 md:h-96 overflow-hidden rounded-2xl shadow-lg">
                <Image
                    src={SLIDER_IMAGES[currentIndex]}
                    alt={`복원 작업 ${currentIndex + 1}`}
                    fill
                    className="object-contain transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                    priority={currentIndex === 0}
                />

                {/* 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* 네비게이션 화살표 */}
                <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* 슬라이드 카운터 */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {currentIndex + 1} / {SLIDER_IMAGES.length}
                </div>
            </div>

            {/* 도트 인디케이터 */}
            <div className="flex justify-center space-x-2 mt-4">
                {SLIDER_IMAGES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentIndex
                            ? "bg-blue-500 scale-110"
                            : "bg-slate-400 hover:bg-slate-300"
                            }`}
                    />
                ))}
            </div>

            {/* 썸네일 */}
            <div className="flex justify-center space-x-2 mt-4 overflow-x-auto pb-2">
                {SLIDER_IMAGES.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`relative w-16 h-12 md:w-20 md:h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${index === currentIndex
                            ? "ring-2 ring-blue-500 scale-105"
                            : "opacity-70 hover:opacity-100"
                            }`}
                    >
                        <Image
                            src={image}
                            alt={`썸네일 ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}