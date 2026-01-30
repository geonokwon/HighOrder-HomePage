'use client';
import { useState } from 'react';
import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/presentation/components/AnimatedSection';

const testimonials = [
    {
        company: '김해 오립스',
        review: 'KT하이오더 설치 후 직원들이 편해졌어요',
        image: '/testimonial-1.jpg',
        gradientFrom: '#ffa600',
        gradientTo: '#f7f7f7',
    },
    {
        company: '경성 맥주',
        review: '프렌차이즈 운영중인데 이미지 촬영해주셔서 편해요',
        image: '/testimonial-2.jpg',
        gradientFrom: '#fe6e21',
        gradientTo: '#f7f7f7',
    },
];

export function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <AnimatedSection 
            className="py-20 px-4"
            style={{ backgroundColor: '#ffdaa1' }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Title */}
                <AnimatedItem className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-700 leading-tight">
                        KT지니원을 선택한<br />
                        사장님들의 찐 후기
            </h2>
                </AnimatedItem>

                {/* Testimonial Cards Container */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <AnimatedItem delay={0.3}>
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
                            style={{ left: '-120px' }}
                        >
                            <div 
                                className="w-24 h-24 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: '#d9d9d9' }}
                            >
                                <svg 
                                    className="w-12 h-12 text-gray-600" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M15 19l-7-7 7-7" 
                                    />
                                </svg>
                            </div>
                        </button>
                    </AnimatedItem>

                    <AnimatedItem delay={0.3}>
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
                            style={{ right: '-120px' }}
                        >
                            <div 
                                className="w-24 h-24 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: '#d9d9d9' }}
                            >
                                <svg 
                                    className="w-12 h-12 text-gray-600" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M9 5l7 7-7 7" 
                                    />
                                </svg>
                            </div>
                        </button>
                    </AnimatedItem>

                    {/* Cards */}
                    <AnimatedContainer className="flex justify-center gap-8" staggerChildren={0.2}>
                        {testimonials.map((testimonial, index) => (
                            <AnimatedItem
                                key={testimonial.company}
                                className="w-96 bg-gray-100 rounded-2xl overflow-hidden"
                            >
                                {/* Image Section with Gradient Background */}
                                <div 
                                    className="h-96 flex items-center justify-center relative"
                                    style={{
                                        background: `radial-gradient(circle, ${testimonial.gradientFrom} 0%, ${testimonial.gradientTo} 100%)`
                                    }}
                                >
                                    {/* Customer Image Placeholder */}
                                    <div className="w-80 h-80 bg-gray-300 rounded-lg flex items-center justify-center">
                                        <svg 
                                            className="w-20 h-20 text-gray-600" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6">
                                    {/* Company Name */}
                                    <h3 
                                        className="text-2xl font-bold mb-4"
                                        style={{ color: '#ff4d00' }}
                                    >
                                        {testimonial.company}
                                    </h3>

                                    {/* Review Text */}
                                    <p className="text-2xl md:text-4xl font-bold text-gray-700 mb-6 leading-tight">
                                        {testimonial.review}
                                    </p>

                                    {/* View More Button */}
                                    <button 
                                        className="px-6 py-2 rounded-full text-sm font-bold text-gray-700"
                                        style={{ backgroundColor: '#d9d9d9' }}
                                    >
                                        보러가기
                                    </button>
                    </div>
                            </AnimatedItem>
                        ))}
                    </AnimatedContainer>
                </div>
            </div>
        </AnimatedSection>
    );
} 