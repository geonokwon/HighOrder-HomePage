'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection, AnimatedItem } from '@/presentation/components/AnimatedSection';

interface ExpandableImageSectionProps {
  imageSrc: string;
  imageAlt?: string;
  title?: string;
  description?: string;
  initialHeight?: string; // 초기 보여줄 높이 (예: "40%", "300px")
  blurIntensity?: number; // 블러 강도 (0-10)
}

export function ExpandableImageSection({
  imageSrc,
  imageAlt = '확장 가능한 이미지',
  title,
  description,
  initialHeight = '40%',
  blurIntensity = 5,
}: ExpandableImageSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isExpanded && imageRef.current) {
      // 이미지가 로드되면 실제 높이를 측정
      const img = imageRef.current;
      if (img.complete) {
        const containerWidth = img.parentElement?.clientWidth || window.innerWidth;
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        const calculatedHeight = containerWidth * aspectRatio;
        setImageHeight(calculatedHeight);
      }
    }
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <AnimatedSection className="w-full py-12 md:py-20 bg-transparent px-4">
      <div className="max-w-3xl mx-auto">
        {/* 제목 및 설명 (선택사항) */}
        {(title || description) && (
          <AnimatedItem className="mb-8 text-center">
            {title && (
              <h2 className="text-2xl md:text-4xl font-black text-gray-700 leading-tight mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg md:text-xl font-bold text-gray-600 leading-relaxed">
                {description}
              </p>
            )}
          </AnimatedItem>
        )}

        {/* 확장 가능한 이미지 컨테이너 */}
        <AnimatedItem className="relative">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl cursor-pointer group">
            {/* 이미지 컨테이너 */}
            <motion.div
              ref={containerRef}
              className="relative w-full"
              animate={{
                height: isExpanded 
                  ? (imageHeight ? imageHeight : 'auto') 
                  : (isMobile ? 250 : 480),
              }}
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
              }}
              style={{
                overflow: 'hidden',
              }}
            >
              {/* 메인 이미지 - 상단 정렬 */}
              <div 
                className="relative w-full"
                style={{ 
                  minHeight: isExpanded ? 'auto' : (isMobile ? '250px' : '300px'),
                }}
              >
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt={imageAlt}
                  className="w-full h-auto object-contain object-top"
                  style={{ 
                    display: 'block',
                    minHeight: isExpanded ? 'auto' : (isMobile ? '250px' : '300px'),
                  }}
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      // 실제 렌더링된 높이를 측정 (비율 고려)
                      const containerWidth = img.parentElement?.clientWidth || window.innerWidth;
                      const aspectRatio = img.naturalHeight / img.naturalWidth;
                      const calculatedHeight = containerWidth * aspectRatio;
                      setImageHeight(calculatedHeight);
                    }}
                />
              </div>

              {/* 블러 오버레이 (축소 상태일 때만 표시) - 더 자연스러운 그라데이션 */}
              <AnimatePresence>
                {!isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                      height: isMobile ? '60%' : '50%',
                      background: `linear-gradient(to top, 
                        rgba(255, 255, 255, 0.95) 0%,
                        rgba(255, 255, 255, 0.85) 20%,
                        rgba(255, 255, 255, 0.6) 40%,
                        rgba(255, 255, 255, 0.3) 60%,
                        rgba(255, 255, 255, 0.1) 80%,
                        transparent 100%
                      )`,
                      backdropFilter: `blur(${blurIntensity * 0.3}px)`,
                      WebkitBackdropFilter: `blur(${blurIntensity * 0.3}px)`,
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* 클릭 유도 버튼/텍스트 (축소 상태일 때만 표시) - 섹션 중앙 정렬 */}
            <AnimatePresence>
              {!isExpanded && (
                <div className="absolute bottom-4 md:bottom-6 left-0 right-0 z-10 flex justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand();
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-1 md:gap-1.5 px-3 md:px-4 py-1.5 md:py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors group-hover:scale-105">
                      <span className="text-xs md:text-sm font-bold text-gray-700 whitespace-nowrap">
                        전체 보기
                      </span>
                      <motion.svg
                        width={isMobile ? "14" : "16"}
                        height={isMobile ? "14" : "16"}
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-gray-600"
                        animate={{
                          y: [0, 5, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* 접기 버튼 (확장 상태일 때만 표시) */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-4 md:top-8 right-4 md:right-8 z-50"
                  onClick={toggleExpand}
                >
                  <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors cursor-pointer">
                    <span className="text-xs md:text-base font-bold text-gray-700 whitespace-nowrap">
                      접기
                    </span>
                    <motion.svg
                      width={isMobile ? "16" : "20"}
                      height={isMobile ? "16" : "20"}
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-gray-600"
                      animate={{
                        rotate: 180,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </AnimatedItem>
      </div>
    </AnimatedSection>
  );
}
