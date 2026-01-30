'use client';

import { useId, useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { AnimatedSection, AnimatedItem } from '@/presentation/components/AnimatedSection';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const videos = [
  {
    id: 'rA0kz_AAWDA',
    title: 'Kt 15년 경력, 2만명 개통하며 느낀점',
    thumbnail: '/Problem/Problem_Youtube_Card6.png',
  },
  {
    id: 'Zgyw9XXbAqo',
    title: '타사테이블오더에서 kt하이오더러 넘어오는 사장님들이많은이유',
    thumbnail: '/Problem/Problem_Youtube_Card7.png',
  },
  {
    id: 'aZ9qIgz6_wQ',
    title: '테이블오더설치전 체크사항',
    thumbnail: '/Problem/Problem_Youtube_Card8.png',
  },
  {
    id: 'uITLkiBcNvU',
    title: '사장님들이 찐으로 알려주는 테이블오더 단점 7가지',
    thumbnail: '/Problem/Problem_Youtube_Card3.png',
  },
  {
    id: 'uttyMLwojv8',
    title: '테이블오더 설치할지 말지 고민중이시라면?',
    thumbnail: '/Problem/Problem_Youtube_Card1.png',
  },
];

export function ProblemSection() {
    const sectionId = useId();
    const [active, setActive] = useState(0);
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);
    const [imagesLoaded, setImagesLoaded] = useState<{ [key: string]: boolean }>({});
    const swiperRef = useRef<any>(null);

    // 이미지 프리로딩
    useEffect(() => {
        const preloadImages = async () => {
            // DOM에 link 태그 추가하여 브라우저 캐시 활용
            videos.forEach((video) => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = video.thumbnail;
                document.head.appendChild(link);
            });

            // JavaScript로도 이미지 프리로드
            const promises = videos.map((video) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                      setImagesLoaded(prev => ({ ...prev, [video.id]: true }));
                      resolve();
                    };
                    img.onerror = () => {
                      setImagesLoaded(prev => ({ ...prev, [video.id]: true }));
                      resolve();
                    };
                    // 캐시 정책 설정
                    img.crossOrigin = 'anonymous';
                    img.src = video.thumbnail;
                });
            });
            await Promise.all(promises);
        };
        preloadImages();

        // 컴포넌트 언마운트 시 preload 링크 제거
        // 컴포넌트 언마운트 시 preload 이미지 제거 
        return () => {
            const preloadLinks = document.querySelectorAll('link[rel="preload"][as="image"]');
            preloadLinks.forEach(link => {
              if (videos.some(v => v.thumbnail === link.getAttribute('href'))) {
                document.head.removeChild(link);
              }
            });
        };
    }, []);

    const VideoCard = ({ id, thumbnail }: { id: string; thumbnail: string }) => {
        const isPlaying = playingVideo === id;
        const imageLoaded = imagesLoaded[id];
        
        return (
            <div 
              className="w-full h-full relative rounded-xl overflow-hidden shadow-lg"
              style={{
                transform: 'translateZ(0)', // GPU 가속
                backfaceVisibility: 'hidden', // 깜빡임 방지
                WebkitBackfaceVisibility: 'hidden', // Safari 호환성
                perspective: '1000px', // 3D 렌더링 최적화
              }}
            >
              {!isPlaying && (
                <button
                  className="absolute inset-0 w-full h-full cursor-pointer"
                  onClick={() => setPlayingVideo(id)}
                  style={{
                    transform: 'translateZ(0)', // GPU 가속
                    backfaceVisibility: 'hidden', // 깜빡임 방지
                  }}
                >
                  {/* 로딩 상태 표시 */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="text-gray-400">Loading...</div>
                    </div>
                  )}
                    
                  {/* 실제 이미지 */}
                  <img
                      src={thumbnail}
                      alt="Video thumbnail"
                      className={`absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-opacity duration-300 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        transform: 'translateZ(0)', // GPU 가속
                        backfaceVisibility: 'hidden', // 깜빡임 방지
                        imageRendering: 'crisp-edges', // 이미지 렌더링 최적화
                      }}
                      loading="eager" // 즉시 로딩
                      decoding="sync" // 동기 디코딩
                  />
                  
                  {/* 재생 버튼 오버레이 */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: 'translateZ(0)', // GPU 가속
                      backfaceVisibility: 'hidden', // 깜빡임 방지
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      width="80"
                      height="80"
                      className="text-white opacity-80"
                      style={{
                        transform: 'translateZ(0)', // GPU 가속
                        backfaceVisibility: 'hidden', // 깜빡임 방지
                      }}
                    >
                      <circle cx="24" cy="24" r="22" fill="rgba(0,0,0,0.4)" />
                      <polygon points="20,15 34,24 20,33" fill="white" />
                    </svg>
                  </div>
                </button>
              )}
                {isPlaying && (
                  <div className="w-full h-full relative">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                      title="video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    {/* 영상 닫기 버튼 */}
                    <button
                      className="absolute top-2 right-2 bg-black/80 hover:bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-10 transition-colors duration-200 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayingVideo(null);
                      }}
                      title="영상 닫기"
                    >
                      ✕
                    </button>
                  </div>
                )}
            </div>
        );
    };

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
                <Swiper
                    spaceBetween={16}
                    breakpoints={{
                      640: { spaceBetween: 24 },
                      768: { spaceBetween: 32 },
                    }}
                    slidesPerView={'auto'}
                    grabCursor
                    resistanceRatio={0.6}
                    speed={400}
                    touchRatio={1}
                    touchAngle={45}
                    simulateTouch={true}
                    allowTouchMove={true}
                    cssMode={false}
                    freeMode={false}
                    preventInteractionOnTransition={false}
                    onSwiper={(s) => {
                      swiperRef.current = s;
                    }}
                    onSlideChange={(s) => setActive(s.realIndex)}
                    className="w-full pb-6"
                    style={{
                      paddingLeft: 'max(1rem, calc((100vw - 1152px) / 2))',
                      transform: 'translateZ(0)', // GPU 가속 활성화
                      willChange: 'transform', // 브라우저 최적화 힌트
                    }}
                >
                    {videos.map((v) => (
                      <SwiperSlide
                        key={v.id}
                        className="!w-[280px] md:!w-[620px] aspect-video"
                        style={{ 
                          minWidth: 0, 
                          maxWidth: '100%',
                          transform: 'translateZ(0)', // GPU 가속
                          backfaceVisibility: 'hidden', // 깜빡임 방지
                          willChange: 'transform', // 브라우저 최적화
                        }}
                      >
                        <VideoCard id={v.id} thumbnail={v.thumbnail} />
                      </SwiperSlide>
                    ))}
                </Swiper>
            </AnimatedItem>

        {/* Navigation & Indicator */}
        <AnimatedItem delay={0.4}>
            <div
                          className="w-full flex justify-end mt-6 select-none"
                style={{ paddingRight: 'max(1rem, calc((100vw - 1152px) / 2))' }}
              >
                <div className="flex items-center gap-6">
                  <button
                    aria-label="prev"
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="w-7 h-7 md:w-9 md:h-9 rounded-full shadow flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: '#ff7300',
                      opacity: 0.6
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.6';
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="15"
                      height="15"
                      className="text-white"
                    >
                      <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                    <span className="font-bold text-gray-600 text-base md:text-2xl">
                    {active + 1} | {videos.length}
                  </span>
                  <button
                    aria-label="next"
                    onClick={() => swiperRef.current?.slideNext()}
                    className="w-7 h-7 md:w-9 md:h-9 rounded-full shadow flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: '#ff7300',
                      opacity: 0.6
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.6';
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="15"
                      height="15"
                      className="text-white"
                    >
                      <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
        </AnimatedItem>
        </AnimatedSection>
    );
} 