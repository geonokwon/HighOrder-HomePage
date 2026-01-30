'use client';

import React from 'react';
import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/presentation/components/AnimatedSection';

export function ProgressSection() {
  const steps = [
    {
      number: '01',
      title: '무료 전화 상담',
      image: '/Progress/Progress_StepImage_1.png' // 이미지 경로는 실제 프로젝트에 맞게 조정
    },
    {
      number: '02', 
      title: '현장상담\n(현장상담이 필요없는경우 전자계약으로 진행)',
      image: '/Progress/Progress_StepImage_2.png'
    },
    {
      number: '03',
      title: '현장계약&전자계약',
      image: '/Progress/Progress_StepImage_3.png'
    },
    {
      number: '04',
      title: '설치(약0시간 소요)',
      image: '/Progress/Progress_StepImage_4.png'
    }
  ];

  return (
    <AnimatedSection className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* 메인 타이틀 */}
        <AnimatedItem className="text-center mb-12">
          <p className="text-lg md:text-xl font-bold text-gray-700 mb-4">
            사장님들의 시간을 아껴드립니다.
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-700 leading-tight">
            원스톱 상담 & 설치 진행
          </h2>
        </AnimatedItem>

        {/* 프로세스 스텝들 */}
        <div className="relative">
          {/* 모바일/태블릿 레이아웃 */}
          <div className="block xl:hidden">
            {/* 첫 번째 행: 1-2 */}
            <AnimatedContainer className="grid grid-cols-2 gap-4" staggerChildren={0.2}>
              {steps.slice(0, 2).map((step, index) => (
                <AnimatedItem key={index}>
                  <div className="bg-[#d9d9d9] rounded-[10px] p-[12px] h-[280px] md:h-[300px]">
                    {/* 헤더 영역 */}
                    <div className="mb-3">
                      <div className="text-[36px] md:text-[42px] font-bold text-[#aeaeae] leading-[45px]">
                        {step.number}
                      </div>
                      <div className="text-[16px] md:text-[18px] font-bold text-[#4f4f4f] leading-[22px] min-h-[44px] flex items-start whitespace-pre-line">
                        {step.number === '02' ? (
                          <div>
                            <div>현장상담</div>
                            <div className="text-[10px] md:text-[14px] hidden md:block">
                              (현장상담 필요없을 시 전자계약으로 진행)
                            </div>
                          </div>
                        ) : step.number === '04' ? (
                          <div>
                            <div>설치</div>
                            <div className="text-[10px] md:text-[14px] hidden md:block">
                              (약0시간 소요)
                            </div>
                          </div>
                        ) : (
                          step.title
                        )}
                      </div>
        </div>
        
                      {/* 이미지 영역 */}
                      <div className="bg-white rounded-[10px] w-full h-[160px] md:h-[180px] flex items-center justify-center overflow-hidden">
                        <img 
                          src={step.image} 
                          alt={step.title}
                          className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] bg-gray-100 rounded-lg items-center justify-center text-gray-400 hidden">
                          <span className="text-sm">이미지 {step.number}</span>
                        </div>
                      </div>
        </div>
                </AnimatedItem>
              ))}
            </AnimatedContainer>
            
            {/* 1-2와 3-4 사이 화살표 */}
            <AnimatedItem delay={0.4} className="flex justify-center py-2">
              <div className="w-[32px] h-[32px] bg-[#ff9741] rounded-full flex items-center justify-center">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>
            </AnimatedItem>
            
            {/* 두 번째 행: 3-4 */}
            <AnimatedContainer className="grid grid-cols-2 gap-4" staggerChildren={0.2}>
              {steps.slice(2, 4).map((step, index) => (
                <AnimatedItem key={index + 2}>
                  <div className="bg-[#d9d9d9] rounded-[10px] p-[12px] h-[280px] md:h-[300px]">
                    {/* 헤더 영역 */}
                    <div className="mb-3">
                      <div className="text-[36px] md:text-[42px] font-bold text-[#aeaeae] leading-[45px]">
                        {step.number}
                      </div>
                      <div className="text-[16px] md:text-[18px] font-bold text-[#4f4f4f] leading-[22px] min-h-[44px] flex items-start whitespace-pre-line">
                        {step.number === '02' ? (
                          <div>
                            <div>현장상담</div>
                            <div className="text-[12px] md:text-[14px] hidden md:block">
                              (전자계약으로 진행)
                            </div>
                          </div>
                        ) : step.number === '04' ? (
                          <div>
                            <div>설치</div>
                            <div className="text-[12px] md:text-[14px] hidden md:block">
                              (약0시간 소요)
                            </div>
                          </div>
                        ) : (
                          step.title
                        )}
                      </div>
        </div>
        
                      {/* 이미지 영역 */}
                      <div className="bg-white rounded-[10px] w-full h-[160px] md:h-[180px] flex items-center justify-center overflow-hidden">
                        <img 
                          src={step.image} 
                          alt={step.title}
                          className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] bg-gray-100 rounded-lg items-center justify-center text-gray-400 hidden">
                          <span className="text-sm">이미지 {step.number}</span>
                        </div>
                      </div>
        </div>
                </AnimatedItem>
              ))}
            </AnimatedContainer>
          </div>

          {/* 데스크톱 레이아웃 */}
          <div className="hidden xl:block relative">
            {/* 스텝 카드들 */}
            <AnimatedContainer className="grid grid-cols-4 gap-4" staggerChildren={0.15}>
              {steps.map((step, index) => (
                <AnimatedItem key={index}>
                  <div className="bg-[#d9d9d9] rounded-[10px] p-[12px] h-[300px]">
                    {/* 헤더 영역 */}
                    <div className="mb-3">
                      <div className="text-[42px] font-bold text-[#aeaeae] leading-[45px]">
                        {step.number}
                      </div>
                      <div className="text-[18px] font-bold text-[#4f4f4f] leading-[22px] min-h-[44px] flex items-start whitespace-pre-line">
                        {step.number === '02' ? (
                          <div>
                            <div>현장상담</div>
                            <div className="text-[12px] md:text-[14px]">
                              (현장상담이 필요없는경우 전자계약으로 진행)
                            </div>
                          </div>
                        ) : step.number === '04' ? (
                          <div>
                            <div>설치</div>
                            <div className="text-[12px] md:text-[14px]">
                              (약0시간 소요)
                            </div>
                          </div>
                        ) : (
                          step.title
                        )}
                      </div>
                    </div>

                    {/* 이미지 영역 */}
                    <div className="bg-white rounded-[10px] w-full h-[180px] flex items-center justify-center overflow-hidden">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-[160px] h-[160px] object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="w-[160px] h-[160px] bg-gray-100 rounded-lg items-center justify-center text-gray-400 hidden">
                        <span className="text-sm">이미지 {step.number}</span>
                      </div>
                    </div>
                  </div>
                </AnimatedItem>
              ))}
            </AnimatedContainer>

            {/* 가로 화살표들 - 절대 위치로 정확히 배치 */}
            <AnimatedItem delay={0.8} className="absolute top-1/2 -translate-y-1/2 w-full pointer-events-none">
              {/* 1-2 사이 화살표 */}
              <div className="absolute left-[calc(25%-16px)] w-[32px] h-[32px] bg-[#ff9741] rounded-full flex items-center justify-center">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>

              {/* 2-3 사이 화살표 */}
              <div className="absolute left-[calc(50%-16px)] w-[32px] h-[32px] bg-[#ff9741] rounded-full flex items-center justify-center">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
        </div>
        
              {/* 3-4 사이 화살표 */}
              <div className="absolute left-[calc(75%-16px)] w-[32px] h-[32px] bg-[#ff9741] rounded-full flex items-center justify-center">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </AnimatedItem>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
} 