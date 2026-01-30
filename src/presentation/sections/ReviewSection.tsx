'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection, AnimatedItem } from '@/presentation/components/AnimatedSection';

interface Review {
  id: number;
  name: string; // ex: 홍해루 남해 대표님
  restaurant: string;
  image: string;
  review: string;
  audio: string; // audio file path
  gradientColor: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: '홍해루 남해 대표님',
    restaurant: '홍해루 남해',
    image: '/Review/Review_Image1.png',
    review: '설치 후 주말에 사람 몰릴 때\n너무 편해졌어요',
    audio: '/Review/AudioFile/Review_Audio_1.mp3',
    gradientColor: 'from-orange-400 to-white'
  },
  {
    id: 2,
    name: '가장 맛있는 족발 남양점 대표님',
    restaurant: '맛있는 족발',
    image: '/Review/Review_Image2.png',
    review: '기존 일하던\n직원들이 엄청 편해졌어요',
    audio: '/Review/AudioFile/Review_Audio_2.mp3',
    gradientColor: 'from-blue-400 to-white'
  },
];

export const ReviewSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  // 화면 크기 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cardsPerPage = isMobile ? 1 : 2;
  const totalPages = Math.ceil(reviews.length / cardsPerPage);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating && !isAudioPlaying) {
        setCurrentPage((prev) => (prev + 1) % totalPages);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAnimating, isAudioPlaying, totalPages]);

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentPage((prev) => (prev + 1) % totalPages);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const goToPage = (page: number) => {
    if (isAnimating || page === currentPage) return;
    setIsAnimating(true);
    setCurrentPage(page);
    setTimeout(() => setIsAnimating(false), 700);
  };

  // 현재 페이지의 리뷰 카드들 가져오기
  const getCurrentPageReviews = () => {
    const startIndex = currentPage * cardsPerPage;
    return reviews.slice(startIndex, startIndex + cardsPerPage);
  };

  return (
    <AnimatedSection className="w-full py-12 md:py-20 bg-gradient-to-b from-orange-100 to-orange-50">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Title */}
        <AnimatedItem className="text-left mb-8 md:mb-4">
          <h2 className="text-3xl md:text-4xl font-black text-gray-700 leading-tight">
            초대형 매장, 복잡한 매장도<br />
            <span className="text-[#FF8C00]">완벽 설치 후기!</span>
          </h2>
        </AnimatedItem>

        {/* Review Cards Container */}
        <div className="relative  md:px-16">
          {/* Cards Container */}
          <div className="relative h-[480px] md:h-[550px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                className={`absolute inset-0 flex items-center justify-center gap-8 ${isMobile ? 'px-4' : ''}`}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.8, 0.5, 1] }}
              >
                {getCurrentPageReviews().map((review, index) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    delay={index * 0.1}
                    isMobile={isMobile}
                    alignRight={!isMobile && index % 2 === 1}
                    onAudioStateChange={setIsAudioPlaying}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              aria-label="이전 슬라이드"
              onClick={goToPrev}
              disabled={isAnimating}
              className={`w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                isAnimating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                className="text-[#FF9000]"
              >
                <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {/* 인디케이터 */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  disabled={isAnimating}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentPage 
                      ? 'bg-[#FF9000] scale-125' 
                      : 'bg-white/50 hover:bg-white/70'
                  } ${isAnimating ? 'opacity-50' : ''}`}
                />
              ))}
            </div>
            
            <button
              aria-label="다음 슬라이드"
              onClick={goToNext}
              disabled={isAnimating}
              className={`w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                isAnimating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                className="text-[#FF9000]"
              >
                <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

interface ReviewCardProps {
  review: Review;
  delay?: number;
  isMobile?: boolean;
  alignRight?: boolean;
  onAudioStateChange?: (isPlaying: boolean) => void;
}


const ReviewCard: React.FC<ReviewCardProps> = ({ review, delay = 0, isMobile = false, alignRight = false, onAudioStateChange }) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 녹음 재생 버튼 클릭 시 녹음 재생 상태 변경
  const togglePlay = () => {
    if (!audioRef.current) return;
    const newPlayingState = !playing;
    if (newPlayingState) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setPlaying(newPlayingState);
    onAudioStateChange?.(newPlayingState);
  };

  return (
    <motion.div
      className={`${isMobile ? 'w-[260px]' : 'w-[278px]'} flex flex-col items-center overflow-visible ${
        isMobile 
          ? review.id % 2 === 1 
            ? 'translate-x-8' // 홀수 ID: 오른쪽으로 치우침
            : '-translate-x-8' // 짝수 ID: 왼쪽으로 치우침
          : ''
      }`} 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
    >
      {/* Image */}
      <div className={`${isMobile ? 'h-[420px]' : 'h-[452px]'} w-full rounded-xl overflow-hidden shadow-lg bg-white`}>
        <img
          src={review.image}
          alt={review.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-bold">'+ review.name.charAt(0) +'</div>';
            }
          }}
        />
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.6, ease: 'easeOut' }}
        className={`absolute ${isMobile ? 'bottom-0' : 'bottom-6'} ${
          isMobile 
            ? review.id % 2 === 1 
              ? 'left-4 -translate-x-[30%] w-[250px]' // 홀수: 왼쪽에 배치, 왼쪽으로 돌출
              : 'right-4 translate-x-[30%] w-[250px]' // 짝수: 오른쪽에 배치, 오른쪽으로 돌출
            : alignRight 
              ? 'right-28 translate-x-20 w-[250px]' // 데스크톱 오른쪽: 겹치면서 돌출
              : 'left-28 -translate-x-20 w-[250px]' // 데스크톱 왼쪽: 겹치면서 돌출
        } h-[170px] bg-white/60 border border-[#a2a2a2] rounded-2xl p-4 flex flex-col gap-3 shadow-lg backdrop-blur-sm`}
      >
        <h3 className="text-sm md:text-base font-bold text-orange-600">{review.name}</h3>
        <p className="text-gray-800 text-sm md:text-base font-bold whitespace-pre-line break-keep leading-snug">{review.review}</p>
        <button
          onClick={togglePlay}
          className="mt-1 flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#d9d9d9] hover:bg-[#cfcfcf] rounded-full text-xs md:text-sm font-semibold text-gray-800"
        >
          <img 
            src={playing ? "/Review/Review_StopIcon.png" : "/Review/Review_PlayIcon.png"}
            alt={playing ? '정지' : '재생'} 
            className="w-4 h-4"
          />
          {playing ? '정지' : '녹음듣기'}
        </button>
        <audio ref={audioRef} src={review.audio} onEnded={() => {
          setPlaying(false);
          onAudioStateChange?.(false);
        }} />
      </motion.div>
    </motion.div>
  );
} 