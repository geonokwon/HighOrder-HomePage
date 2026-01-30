'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/presentation/components/AnimatedSection';
import { motion, AnimatePresence } from 'framer-motion';

export const ImageSection: React.FC = () => {
  // 이미지 데이터 (Before/After 쌍)
  const imageData = [
    {
      before: "/ImageSectionImages/HighOrderMenuImage_Before_1.png",
      after: "/ImageSectionImages/HighOrderMenuImage_After_1.png",
      alt: "메뉴 이미지 1"
    },
    {
      before: "/ImageSectionImages/HighOrderMenuImage_Before_2.png", 
      after: "/ImageSectionImages/HighOrderMenuImage_After_2.png",
      alt: "메뉴 이미지 2"
    },
    {
      before: "/ImageSectionImages/HighOrderMenuImage_Before_3.png",
      after: "/ImageSectionImages/HighOrderMenuImage_After_3.png", 
      alt: "메뉴 이미지 3"
    },
    {
      before: "/ImageSectionImages/HighOrderMenuImage_Before_4.png",
      after: "/ImageSectionImages/HighOrderMenuImage_After_4.png",
      alt: "메뉴 이미지 4"
    },
    {
      before: "/ImageSectionImages/HighOrderMenuImage_Before_5.png",
      after: "/ImageSectionImages/HighOrderMenuImage_After_5.png",
      alt: "메뉴 이미지 5"
    },
    {
      before: "/ImageSectionImages/HighOrderMenuImage_Before_6.png",
      after: "/ImageSectionImages/HighOrderMenuImage_After_6.png",
      alt: "메뉴 이미지 6"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // 자동 슬라이드 (5초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [imageData.length]);

  return (
    <AnimatedSection className="w-full py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <AnimatedItem className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-700 leading-tight mb-3">
            사진촬영 비용 100만원?<br />
            <span className="text-[#FF9000]">지니원 디자인팀에서 AI를 활용해 무료 편집/제작 해드립니다!</span>
          </h2>
          <p className="text-lg md:text-xl font-bold text-gray-700">
            기존 이미지를 더 먹음직스럽게 보정하거나, 하이오더 전용으로 새롭게 촬영해 드립니다!<br />
            (사진 촬영 필요시, 사진작가 연결)
          </p>
        </AnimatedItem>

        {/* 이미지 비교 영역 */}
        <div className="flex flex-col md:flex-row justify-center items-center md:gap-12">
          {/* BEFORE */}
          <AnimatedItem direction="left" className="flex flex-col items-center w-full md:w-1/2">
            <div className="w-full max-w-sm md:max-w-none">
              <div className="p-1 text-center -mb-[80px] md:-mb-[120px] relative z-10">
                <p className="text-lg md:text-xl font-bold text-gray-600 px-2 py-1">BEFORE</p>
              </div>
              <div className="aspect-[7/8] relative overflow-hidden">
                {/* 배경 이미지 (고정) */}
                <Image
                  src="/ImageSectionImages/HighOrderMenuImage_Background.png"
                  alt="하이오더 메뉴 배경"
                  fill
                  className="object-contain"
                  style={{ zIndex: 2 }}
                  priority
                />

                {/* 안쪽 이미지 영역 - 배경과 같은 사이즈 */}
                <div className="absolute inset-0" style={{ zIndex: 1 }}>
                  {/* 안쪽 이미지 (변경) - padding으로 위치 지정 */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`before-${currentIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: 0.6,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      className="w-full h-full md:p-[57px_29px_63px_92px]"
                      style={{ 
                        padding: '40px 20px 44px 65px',
                        zIndex: -1 
                      }}
                    >
                      <Image
                        src={imageData[currentIndex].before}
                        alt={`${imageData[currentIndex].alt} Before`}
                        width={423}
                        height={236}
                        className="w-full h-full object-contain"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </AnimatedItem>

          {/* Arrow Icon - 데스크톱에서만 표시 */}
          <AnimatedItem delay={0.3} className="shrink-0 hidden md:flex items-center -my-12 md:my-0">
            <Image
              src="/ImageSectionImages/btn_Right.png"
              alt="Arrow icon"
              width={60}
              height={60}
              className="block"
            />
          </AnimatedItem>

          {/* AFTER */}
          <AnimatedItem direction="right" delay={0.5} className="flex flex-col items-center w-full md:w-1/2">
            <div className="w-full max-w-sm md:max-w-none">
              <div className="p-1 text-center -mb-[80px] md:-mb-[120px] relative z-10">
                <p className="text-lg md:text-xl font-bold text-orange-600 px-2 py-1">AFTER</p>
              </div>
              <div className="aspect-[7/8] relative overflow-hidden">
                {/* 배경 이미지 (고정) */}
                <Image
                  src="/ImageSectionImages/HighOrderMenuImage_Background.png"
                  alt="하이오더 메뉴 배경"
                  fill
                  className="object-contain"
                  style={{ zIndex: 2 }}
                  priority
                />
                
                {/* 안쪽 이미지 영역 - 배경과 같은 사이즈 */}
                <div className="absolute inset-0" style={{ zIndex: 1 }}>
                  {/* 안쪽 이미지 (변경) - padding으로 위치 지정 */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`after-${currentIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: 0.6,
                        ease: [0.4, 0, 0.2, 1],
                        delay: 0.1 // After 이미지가 살짝 늦게 나타나도록
                      }}
                      className="w-full h-full md:p-[57px_29px_63px_92px]"
                      style={{ 
                        padding: '40px 20px 44px 65px',
                        zIndex: -1 
                      }}
                    >
                      <Image
                        src={imageData[currentIndex].after}
                        alt={`${imageData[currentIndex].alt} After`}
                        width={423}
                        height={236}
                        className="w-full h-full object-contain"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </AnimatedItem>
        </div>

        {/* 슬라이드 인디케이터 */}
        <AnimatedItem delay={0.8} className="flex justify-center mt-4 gap-2">
          {imageData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
              }`}
              aria-label={`이미지 ${index + 1}번으로 이동`}
            />
          ))}
        </AnimatedItem>
      </div>
    </AnimatedSection>
  );
}; 