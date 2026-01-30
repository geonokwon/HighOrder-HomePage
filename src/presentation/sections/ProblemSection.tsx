'use client';

import { useId, useRef, useEffect, useState } from 'react';
import { AnimatedSection, AnimatedItem } from '@/presentation/components/AnimatedSection';

export function ProblemSection() {
    const sectionId = useId();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const [videoId, setVideoId] = useState<string>('rA0kz_AAWDA'); // 기본값

    // Video ID 로드
    useEffect(() => {
        const loadVideoId = async () => {
            try {
                const response = await fetch('/api/youtube-settings');
                if (response.ok) {
                    const settings = await response.json();
                    setVideoId(settings.videoId || 'rA0kz_AAWDA');
                }
            } catch (error) {
                console.error('Video ID 로드 오류:', error);
            }
        };
        loadVideoId();
    }, []);

    // Intersection Observer로 섹션 진입 시 자동 재생
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && iframeRef.current) {
                        // 섹션 진입 시 autoplay가 포함된 URL로 변경
                        const currentSrc = iframeRef.current.src;
                        if (!currentSrc.includes('autoplay=1')) {
                            iframeRef.current.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0&modestbranding=1`;
                        }
                    }
                });
            },
            {
                threshold: 0.3, // 30% 이상 보이면 재생
            }
        );

        if (videoContainerRef.current) {
            observer.observe(videoContainerRef.current);
        }

        return () => {
            if (videoContainerRef.current) {
                observer.unobserve(videoContainerRef.current);
            }
        };
    }, [videoId]);

    return (
        <AnimatedSection
          id={sectionId}
          className="w-full py-20 bg-transparent px-4"
        >
            <AnimatedItem>
                <div className="w-full max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-700 leading-tight mb-2">
                        외식업 사장님들을 위한 테이블오더
                    </h2>
                    <p className="text-lg md:text-xl font-bold text-gray-700 mb-8">
                      KT하이오더의 장점과 이용방법을 영상으로 확인하세요!<br />
                      <span className="text-white font-bold bg-[#FF9000] px-3 py-1 rounded-lg shadow-md">KT지니원</span> 대표가 한번에 정리해드립니다.
                    </p>
                </div>
            </AnimatedItem>


            <AnimatedItem delay={0.2}>
                <div 
                    ref={videoContainerRef}
                    className="w-full max-w-5xl mx-auto px-4"
                >
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
                        <iframe
                            ref={iframeRef}
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0&modestbranding=1`}
                            title="KT하이오더 영상"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="eager"
                        />
                    </div>
                </div>
            </AnimatedItem>
        </AnimatedSection>
    );
} 