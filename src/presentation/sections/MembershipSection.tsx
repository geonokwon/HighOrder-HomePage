'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AnimatedSection, AnimatedItem } from '@/presentation/components/AnimatedSection';
import { CountdownTimer } from '@/presentation/components/CountdownTimer';

// 혜택 데이터 - 데이터만 수정하면 카드 내용이 변경됩니다
// subtitle: PC용 텍스트 (배열)
// mobileSubtitle: 모바일용 텍스트 (배열, 선택사항 - 없으면 subtitle 사용)
// 각 항목은 { text: '텍스트', color: '#색상', fontSize: '크기', fontWeight: '굵기' } 형태입니다
// color를 지정하지 않으면 기본 색상(subtitleColor)이 적용됩니다
// fontSize를 지정하지 않으면 기본 크기가 적용됩니다
// 줄바꿈이 필요하면 { text: '\n' } 형태로 추가하세요
const benefitsData = [
  {
    id: 1,
    subtitle: [
      { text: 'OK포스기 세트' },
      { text: '\n' },
      { text: '구입 시 ' },
      { text: '\n' },
      { text: '54만원 지원', color: '#FF1B1B' },
      { text: '\n' },
      { text: '(혜택 ', fontSize: '20px', fontWeight: '600' },
      { text: '54만원', color: '#FF1B1B', fontSize: '20px', fontWeight: '600' },
      { text: ')', fontSize: '20px', fontWeight: '600' },
    ],
    mobileSubtitle: [
      { text: 'OK포스기 세트 구입시' },
      { text: '\n' },
      { text: '54만원 지원', color: '#FF1B1B' },
      { text: '\n' },
      { text: '(혜택 ', fontSize: '16px', fontWeight: '600' },
      { text: '54만원', color: '#FF1B1B', fontSize: '16px', fontWeight: '600' },
      { text: ')', fontSize: '16px', fontWeight: '600' },
    ],
    image: '/MemberShip/MemberShip_Card_Image_1.png',
    backgroundColor: '#CDE8EE',
    subtitleColor: '#4F5352', // 기본 색상
  },
  {
    id: 2,
    subtitle: [
      { text: '거치대, 배터리,' },
      { text: '\n' },
      { text: '기타 부속품' },
      { text: '\n' },
      { text: '"전액면제"', color: '#FF1B1B' },
      { text: '\n' },
      { text: '(혜택 ', fontSize: '16px', fontWeight: '600' },
      { text: '144만원', color: '#FF1B1B', fontSize: '16px', fontWeight: '600' },
      { text: ')', fontSize: '16px', fontWeight: '600' },
    ],
    mobileSubtitle: [
      { text: '거치대,배터리,기타부속품' },
      { text: '\n' },
      { text: '"전액면제"', color: '#FF1B1B' },
      { text: '\n' },
      { text: '(혜택 ', fontSize: '16px', fontWeight: '600' },
      { text: '144만원', color: '#FF1B1B', fontSize: '16px', fontWeight: '600' },
      { text: ')', fontSize: '16px', fontWeight: '600' },
    ],
    image: '/MemberShip/MemberShip_Card_Image_2.png',
    backgroundColor: '#F2F2EF',
    subtitleColor: '#4F5352',
  },
  {
    id: 3,
    subtitle: [
      { text: '현실감 120%' },
      { text: '\n' },
      { text: 'AI 메뉴사진' },
      { text: '\n' },
      { text: '무상 제공', color: '#FF1B1B' },
      { text: '\n' },
      { text: '(혜택 ', fontSize: '16px', fontWeight: '600' },
      { text: '200만원', color: '#FF1B1B', fontSize: '16px', fontWeight: '600' },
      { text: ')', fontSize: '16px', fontWeight: '600' },
    ],
    mobileSubtitle: [
      { text: '현실감 120%' },
      { text: '\n' },
      { text: 'AI 메뉴사진' },
      { text: '무상 제공', color: '#FF1B1B' },
      { text: '\n' },
      { text: '(혜택 ', fontSize: '16px', fontWeight: '600' },
      { text: '200만원', color: '#FF1B1B', fontSize: '16px', fontWeight: '600' },
      { text: ')', fontSize: '16px', fontWeight: '600' },
    ],
    image: '/MemberShip/MemberShip_Card_Image_3.png',
    backgroundColor: '#CDE8EE',
    subtitleColor: '#4F5352',
  },
  {
    id: 4,
    subtitle: [
      { text: '블로그 체험단 지원' },
      { text: '\n' },
      { text: '디너의여왕 체험단', color: '#FF1B1B' },
      { text: '\n' },
      { text: '20팀 무상지원', color: '#FF1B1B' },
      { text: '\n' },
      { text: '(혜택 ', fontSize: '16px', fontWeight: '600' },
      { text: '60만원', color: '#FF1B1B', fontSize: '16px', fontWeight: '600' },
      { text: ')', fontSize: '16px', fontWeight: '600' },
    ],
    mobileSubtitle: [
      { text: '블로그 체험단 지원' },
      { text: '\n' },
      { text: '디너의여왕 20팀 무상지원', color: '#FF1B1B' },
      { text: '\n' },
      { text: '(혜택 ', fontSize: '16px', fontWeight: '600' },
      { text: '60만원', color: '#FF1B1B', fontSize: '16px', fontWeight: '600' },
      { text: ')', fontSize: '16px', fontWeight: '600' },
    ],
    image: '/MemberShip/MemberShip_Card_Image_4.png',
    backgroundColor: '#F2F2EF',
    subtitleColor: '#4F5352',
  },
  {
    id: 5,
    subtitle: [
      { text: 'KT인터넷 결합 시' },
      { text: '\n' },
      { text: '월 1만원 할인', color: '#FF1B1B' },
      { text: '\n' },
      { text: '(혜택 ', fontSize: '16px', fontWeight: '600' },
      { text: '36만원', color: '#FF1B1B', fontSize: '16px', fontWeight: '600' },
      { text: ')', fontSize: '16px', fontWeight: '600' },
  
    ],
    mobileSubtitle: [
      { text: 'KT인터넷 결합 시' },
      { text: '\n' },
      { text: '월 1만원 할인', color: '#FF1B1B' },
      { text: '\n' },
      { text: '(혜택 ', fontSize: '16px', fontWeight: '600' },
      { text: '36만원', color: '#FF1B1B', fontSize: '16px', fontWeight: '600' },
      { text: ')', fontSize: '16px', fontWeight: '600' },
    ],
    image: '/MemberShip/MemberShip_Card_Image_5.png',
    backgroundColor: '#CDE8EE',
    subtitleColor: '#4F5352',
  },
  {
    id: 6,
    subtitle: [
      { text: '화재방지 특허받은 7in1' },
      { text: '\n' },
      { text: '국산 충전스테이션 제공', color: '#FF1B1B' },
      { text: '\n' },
      { text: '(혜택 ', fontSize: '16px', fontWeight: '600' },
      { text: '20만원', color: '#FF1B1B', fontSize: '16px', fontWeight: '600' },
      { text: ')', fontSize: '16px', fontWeight: '600' },
    ],
    mobileSubtitle: [
      { text: '화재방지 특허받은 7in1' },
      { text: '\n' },
      { text: '국산 충전스테이션 제공', color: '#FF1B1B' },
      { text: '\n' },
      { text: '(혜택 ', fontSize: '16px', fontWeight: '600' },
      { text: '20만원', color: '#FF1B1B', fontSize: '16px', fontWeight: '600' },
      { text: ')', fontSize: '16px', fontWeight: '600' },
    ],
    image: '/MemberShip/MemberShip_Card_Image_6.png',
    backgroundColor: '#F2F2EF',
    subtitleColor: '#4F5352',
  },
  {
    id: 7,
    subtitle: [
      { text: '지니원 1등 ' },
      { text: '추가', color: '#FF1B1B' },
      { text: '\n' },
      { text: '비밀 지원금 제공', color: '#FF1B1B' },
      { text: '\n' },
      { text: '(📞1899-6484)', fontSize: '16px', fontWeight: '600'}
    ],
    mobileSubtitle: [
      { text: '지니원 1등 ' },
      { text: '추가', color: '#FF1B1B' },
      { text: '\n' },
      { text: '비밀 지원금 제공', color: '#FF1B1B' },
      { text: '\n' },
      { text: '(📞1899-6484)', fontSize: '16px', fontWeight: '600'}
    ],
    image: '/MemberShip/MemberShip_Card_Image_7.png',
    backgroundColor: '#CDE8EE',
    subtitleColor: '#4F5352',
  },
  {
    id: 8,
    subtitle: [
      { text: '사장님을 위한 창업 가이드' },
      { text: '\n' },
      { text: '무료자료 제공', color: '#FF1B1B' },
      { text: '\n' },
      { text: '✔ ', fontSize: '16px', fontWeight: '600' },
      { text: '창업준비부터 배장오픈', color: '#FF1B1B', fontSize: '16px', fontWeight: '600'},
      { text: '까지', fontSize: '16px', fontWeight: '600'},
    ],
    mobileSubtitle: [
      { text: '사장님을 위한 창업 가이드',fontSize: '16px' },
      { text: '\n' },
      { text: '무료자료 제공', color: '#FF1B1B' },
      { text: '\n' },
      { text: '(창업준비-매장오픈 가이드)', fontSize: '16px', fontWeight: '600' }
    ],
    image: '/MemberShip/MemberShip_Card_Image_8.png',
    backgroundColor: '#F2F2EF',
    subtitleColor: '#4F5352',
  },
];

// ================================
// 카드 표시 순서 설정
// 예: [3, 1, 5, 2, 4, 6] 로 바꾸면 순서가 바뀜
// ================================
const BENEFIT_ORDER = [1, 2, 3, 4, 5, 6, 7, 8];
// 설정된 순서대로 카드 정렬
const benefits = BENEFIT_ORDER.map(id => benefitsData.find(benefit => benefit.id === id)).filter((benefit): benefit is typeof benefitsData[0] => benefit !== undefined);

export const MembershipSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 이전/다음 카드 인덱스 계산 (무한 루프)
  const getPrevIndex = (current: number) => {
    return current === 0 ? benefits.length - 1 : current - 1;
  };

  const getNextIndex = (current: number) => {
    return current === benefits.length - 1 ? 0 : current + 1;
  };

  const getPrevIndex1 = (current: number) => {
    return current === 0 ? benefits.length - 1 : current  - 1;
  }
  const getNextndex = (current: number) => {
    return current === benefits.length - 1 ? 0 : current + 1;
  }
  const getPrevIndex2 = (current: number, direction: number) => {
    if (direction === 1) {
      return current === 0 ? benefits.length - 1 : current - direction;
    }
    else {
      return current === benefits.length - 1 ? 0 : current  + 1 
    }
  }

  // 자동 슬라이드
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (!isHovered && !isAnimating) {
      intervalRef.current = setInterval(() => {
        setDirection(1);
        setActiveIndex(prev => getNextIndex(prev));
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, isAnimating, activeIndex]);

  // 애니메이션 상태 관리
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // 이전 슬라이드로 이동
  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(-1);
    setActiveIndex(getPrevIndex(activeIndex));
  };

  // 다음 슬라이드로 이동
  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(1);
    setActiveIndex(getNextIndex(activeIndex));
  };

  // 특정 슬라이드로 이동
  const goToSlide = (index: number) => {
    if (index !== activeIndex) {
      if (isAnimating) return;
      setIsAnimating(true);
      
      // 방향 결정 (더 짧은 경로)
      const current = activeIndex;
      const total = benefits.length;
      const directDistance = Math.abs(index - current);
      const wrapDistance = total - directDistance;
      
      if (directDistance <= wrapDistance) {
        setDirection(index > current ? 1 : -1);
      } else {
        setDirection(index > current ? -1 : 1);
      }
      
      setActiveIndex(index);
    }
  };

  return (
    <AnimatedSection className="w-full pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 overflow-hidden">
        {/* 헤더 + 타이머 양쪽 배치 */}
        <AnimatedItem className="mb-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {/* 타이틀 */}
            <div className="text-center md:text-left md:mr-28">
              <h2 className="text-2xl md:text-4xl font-black text-gray-700 leading-tight">
                KT하이오더 지금 선택하시면<br />
                <span className="text-3xl md:text-4xl text-[#FF1B1B]">514만원+α의 혜택</span>
                을 드립니다!
              </h2>
            </div>
            
            {/* 타이머 */}
            <div className="flex-shrink-0">
              <CountdownTimer duration={24 * 60 * 60} />
            </div>
          </div>
        </AnimatedItem>

        {/* 카드 슬라이더 */}
        <div 
          className="relative h-[360px] md:h-[420px] overflow-visible flex items-center justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* 개별 카드 애니메이션 */}
          {benefits.map((benefit, index) => {
            // 현재 카드의 상대적 위치 계산
            let relativePosition = index - activeIndex;
            const half = Math.floor(benefits.length / 2);
            if (relativePosition > half) relativePosition -= benefits.length;
            if (relativePosition < -half) relativePosition += benefits.length;
            
            const shouldRender = Math.abs(relativePosition) <= 1;
            const wasVisible = Math.abs((index - (activeIndex - direction)) % benefits.length) <= 1;
            if (!shouldRender && !wasVisible) return null;
            
            const isActive = relativePosition === 0;
            const isLeft = relativePosition === -1;
            const isRight = relativePosition === 1;
            const isExiting = !shouldRender && wasVisible;

            // 위치 계산
            const getCardPosition = () => {
              if (isActive) return { left: '50%', transform: 'translateX(-50%)', scale: 1 };
              if (isLeft) return { left: '20%', transform: 'translateX(-50%) scale(0.75)', scale: 0.75 };
              if (isRight) return { left: '80%', transform: 'translateX(-50%) scale(0.75)', scale: 0.75 };
              if (isExiting) {
                return direction === 1 
                  ? { left: '-10%', transform: 'translateX(-50%) scale(0.75)', scale: 0.75 }
                  : { left: '110%', transform: 'translateX(-50%) scale(0.75)', scale: 0.75 };
              }
              return { left: '50%', transform: 'translateX(-50%)', scale: 1 };
            };
            
            return (
              <motion.div
                key={`card-${index}`}
                className={`absolute flex items-center justify-center ${
                  isActive 
                    ? 'w-[280px] h-[260px] sm:w-[500px] sm:h-[350px] md:w-[560px] md:h-[270px] z-20' 
                    : 'w-[240px] h-[220px] sm:w-[450px] sm:h-[320px] md:w-[460px] md:h-[240px] z-10'
                }`}
                animate={{
                  ...getCardPosition(),
                  opacity: isActive ? 1 : isExiting ? 0 : 0.4,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.8, 0.5, 1],
                }}
                onClick={() => {
                  if (!isActive && !isExiting) {
                    if (isLeft) goToPrev();
                    if (isRight) goToNext();
                  }
                }}
              >
                <div 
                  className={`w-full h-full rounded-2xl flex flex-col md:flex-row items-center shadow-lg transition-transform duration-200 overflow-hidden ${
                    !isActive && !isExiting ? 'cursor-pointer hover:scale-105' : ''
                  } ${
                    isActive ? 'p-4 sm:p-6 md:p-8 lg:p-12' : 'p-3 sm:p-4 md:p-6 lg:p-8'
                  }`}
                  style={{ backgroundColor: benefit.backgroundColor }}
                >
                  {/* 텍스트 영역 - 모바일: 위, 웹: 왼쪽 */}
                  <div className="flex-1 flex flex-col justify-center text-center md:text-left md:pr-4">
                    {/* 모바일용 텍스트 */}
                    <div 
                      className={`font-black font-pretendard md:hidden ${
                        isActive 
                          ? 'text-xl sm:text-2xl'
                          : 'text-sm sm:text-base'
                      }`}
                    >
                      {(() => {
                        const subtitleToUse = (benefit as any).mobileSubtitle || benefit.subtitle;
                        return Array.isArray(subtitleToUse) ? (
                          subtitleToUse.map((item: any, itemIndex: number) => {
                            if (typeof item === 'string') {
                              return (
                                <React.Fragment key={itemIndex}>
                                  {item === '\n' ? <br /> : item}
                                </React.Fragment>
                              );
                            }
                            const subtitleItem = item as { text?: string; color?: string; fontSize?: string; fontWeight?: string | number };
                            const text = subtitleItem.text || '';
                            const color = subtitleItem.color || benefit.subtitleColor || '#333333';
                            let fontSize = subtitleItem.fontSize;
                            const fontWeight = subtitleItem.fontWeight;
                            
                            // 비활성 카드일 때 폰트 사이즈를 80%로 줄이기
                            if (fontSize && !isActive) {
                              const fontSizeValue = parseFloat(fontSize);
                              const fontSizeUnit = fontSize.replace(/[0-9.]/g, '');
                              fontSize = `${fontSizeValue * 0.7}${fontSizeUnit}`;
                            }
                            
                            if (text === '\n') {
                              return <br key={itemIndex} />;
                            }
                            
                            return (
                              <span
                                key={itemIndex}
                                style={{
                                  color,
                                  ...(fontSize && { fontSize }),
                                  ...(fontWeight && { fontWeight }),
                                }}
                              >
                                {text}
                              </span>
                            );
                          })
                        ) : null;
                      })()}
                    </div>
                    
                    {/* PC용 텍스트 */}
                    <div 
                      className={`font-black font-pretendard hidden md:block ${
                        isActive 
                          ? 'text-3xl lg:text-2xl' 
                          : 'text-lg lg:text-xl'
                      }`}
                    >
                      {Array.isArray(benefit.subtitle) ? (
                        benefit.subtitle.map((item, itemIndex) => {
                          if (typeof item === 'string') {
                            return (
                              <React.Fragment key={itemIndex}>
                                {item === '\n' ? <br /> : item}
                              </React.Fragment>
                            );
                          }
                          const subtitleItem = item as { text?: string; color?: string; fontSize?: string; fontWeight?: string | number };
                          const text = subtitleItem.text || '';
                          const color = subtitleItem.color || benefit.subtitleColor || '#333333';
                          let fontSize = subtitleItem.fontSize;
                          const fontWeight = subtitleItem.fontWeight;
                          
                          // 비활성 카드일 때 폰트 사이즈를 70%로 줄이기
                          if (fontSize && !isActive) {
                            const fontSizeValue = parseFloat(fontSize);
                            const fontSizeUnit = fontSize.replace(/[0-9.]/g, '');
                            fontSize = `${fontSizeValue * 0.7}${fontSizeUnit}`;
                          }
                          
                          if (text === '\n') {
                            return <br key={itemIndex} />;
                          }
                          
                          return (
                            <span
                              key={itemIndex}
                              style={{
                                color,
                                ...(fontSize && { fontSize }),
                                ...(fontWeight && { fontWeight }),
                              }}
                            >
                              {text}
                            </span>
                          );
                        })
                      ) : null}
                    </div>
                  </div>

                  {/* 이미지 영역 - 모바일: 아래, 웹: 오른쪽 */}
                  <div className="flex-1 flex items-center justify-center mt-2 md:mt-0 overflow-hidden">
                    <div className={`flex items-center justify-center overflow-hidden ${
                      isActive 
                        ? 'w-full h-[100px] sm:h-[140px] md:h-72 max-w-[240px] sm:max-w-[360px] md:max-w-[500px]' 
                        : 'w-full h-[70px] sm:h-[100px] md:h-60 max-w-[200px] sm:max-w-[280px] md:max-w-[400px]'
                    }`}>
                      <Image
                        src={benefit.image}
                        alt={Array.isArray(benefit.subtitle) 
                          ? benefit.subtitle.map(item => typeof item === 'string' ? item : (item as { text?: string }).text || '').join('')
                          : String(benefit.subtitle || '')
                        }
                        width={isActive ? 400 : 320}
                        height={isActive ? 320 : 250}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 인디케이터 + 네비게이션 버튼 */}
        <div className="flex items-center justify-center gap-4 mt-2 mb-3 md:mt-4 md:mb-6">
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
            {benefits.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isAnimating}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex 
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

        {/* 추가 강조 문구 */}
        <AnimatedItem className="mt-8 mb-8">
          <div className="py-8 px-6 md:py-12 md:px-12">
            <div className="text-center space-y-3">
              <h3 className="text-lg md:text-2xl font-black text-gray-800 leading-tight">
                선착순 20명! 메뉴 사진 보정 서비스,<br />
                <span className="text-[#FF1B1B]">지니 스튜디오 3년 무제한 이용권!</span>
              </h3>
              
              <p className="text-base md:text-xl font-bold text-gray-800 pt-2">
                지금 바로 상담 받아보고 보조금 혜택 자세히 알아보세요!<br />
                <span className="text-sm md:text-lg">(타사 테이블오더 사용 중 교체 시 추가 보조금 지급!)</span>
              </p>
              
              <a 
                href="tel:1899-6484"
                className="inline-block pt-4 group"
              >
                <div className="text-2xl md:text-4xl font-black text-gray-800 group-hover:scale-105 transition-transform">
                  <span className="text-[#FF1B1B]">1899-6484</span>
                </div>
                <p className="text-xs md:text-sm text-gray-600 mt-1 font-semibold">
                  (우측 상단 바 클릭 시 전화연결)
                </p>
              </a>
            </div>
          </div>
        </AnimatedItem>
      </div>
    </AnimatedSection>
  );
};
