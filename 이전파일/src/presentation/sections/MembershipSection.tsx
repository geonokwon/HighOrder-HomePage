'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AnimatedSection, AnimatedItem } from '@/presentation/components/AnimatedSection';
import { CountdownTimer } from '@/presentation/components/CountdownTimer';

// 혜택 데이터 - 전체 데이터 저장소
const benefitsData = [
  {
    id: 1,
    title: '하이오더 신규 설치시',
    subtitle: '포스기 세트 50% 할인\n\n(포스기본체, 현금금고, 토스단말기,\n카드리더기, 주방프린트)',
    image: '/MemberShip/MemberShip_Card_Image_1.png',
    backgroundColor: '#FFEED7', // 첫 번째 색상
    subtitleColor: '#FF8400', // 첫 번째 서브타이틀 색상
  },
  {
    id: 2,
    title: '사장님을 위한',
    subtitle: '소상공인 창업 가이드\n\n✓ 무료자료제공\n\n✓ 창업준비부터 매장오픈까지\n전체 프로세스 가이드',
    image: '/MemberShip/MemberShip_Card_Image_2.png',
    backgroundColor: '#FFAF59', // 두 번째 색상
    subtitleColor: '#FF5900', // 두 번째 서브타이틀 색상
  },
  {
    id: 3,
    title: '지니원 특별 선물',
    subtitle: '팡팡!\n비밀 지원금 제공\n추가혜택 & 특별혜택\n\n전화 상담시 안내해드립니다!',
    image: '/MemberShip/MemberShip_Card_Image_3.png',
    backgroundColor: '#1A1A1A', // 검은색 배경
    subtitleColor: '#FF504F', // 빨간색
  },
  {
    id: 4,
    title: '"390만원" 상당의 사은품&혜택',
    subtitle: '144만원 부속품 & 설치비 면제\n100만원 신한은행 지원금\n+) 배터리 1+1 추가제공 (50만원)\n60만원 상당의 블로그 리뷰 20건 제공\n36만원 KT인터넷 결합할인',
    image: '/MemberShip/MemberShip_Card_Image_4.png',
    backgroundColor: '#5865F2', // 보라색 배경
    subtitleColor: '#FFFFFF', // 흰색
  },
  {
    id: 5,
    title: '지니원 디자이너 마케팅 팀, 전폭 지원!',
    subtitle: '지니원 선착순 30명 한정 이벤트\n\n✓ 네이버 플레이스 마케팅 교육 및 컨설팅\n✓ 먹음직스럽게 메뉴 이미지 AI 보정\n✓ 리뷰, 마케팅 배너 제작 등',
    image: '/MemberShip/MemberShip_Card_Image_5.png',
    backgroundColor: '#FF8443', // 주황색 배경
    subtitleColor: '#FFFFFF', // 흰색
  },
  {
    id: 6,
    title: '복잡하고 위험한 전선은 이제 끝!',
    subtitle: '지니원 충전스테이션 제공',
    image: '/MemberShip/MemberShip_Card_Image_6.png',
    backgroundColor: '#202020', // 회색 배경
    subtitleColor: '#CD3D3D', // 요청하신 색상
  },
  {
    id: 7,
    title: '단 한번의 상담으로',
    subtitle: '시간,일정,비용\n한번에 해결하세요!',
    image: '/MemberShip/MemberShip_Card_Image_7.png',
    backgroundColor: '#262626', // 회색 배경
    subtitleColor: '#CD3D3D', // 요청하신 색상
  },
];

// ================================
// 카드 표시 순서 설정
// 예: [3, 1, 5, 2, 4, 6] 로 바꾸면 순서가 바뀜
// 변경 할때 확인 하고 순서 잘 지키면서 변경해야 함!!
// ================================

const BENEFIT_ORDER = [2, 6, 5, 1, 3, 4, 7];

// 설정된 순서대로 카드 정렬
const benefits = BENEFIT_ORDER.map(id => benefitsData.find(benefit => benefit.id === id)).filter((benefit): benefit is typeof benefitsData[0] => benefit !== undefined);

export const MembershipSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 이전/다음 카드 인덱스 계산 (무한 루프)
  const getPrevIndex = (current: number) => {
    return current === 0 ? benefits.length - 1 : current - 1;
  };

  const getNextIndex = (current: number) => {
    return current === benefits.length - 1 ? 0 : current + 1;
  };

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
      }, 600); // 애니메이션 duration과 동일
      
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
        <AnimatedItem className="mb-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {/* 타이틀 */}
            <div className="text-center md:text-left md:mr-28">
              <h2 className="text-3xl md:text-4xl font-black text-gray-700 leading-tight ">
                KT지니원에서 지금 가입 시<br />
                <span className="text-[#FF9000]">받을 수 있는 혜택!</span>
              </h2>
            </div>
            
            {/* 타이머 */}
            <div className="flex-shrink-0">
              <CountdownTimer duration={24 * 60 * 60} /> {/* 24시간 타이머 */}
            </div>
          </div>
        </AnimatedItem>
        

        {/* 티커 스타일 카드 슬라이더 */}
        <div 
          className="relative pb-6 md:pb-20 h-[360px] md:h-[520px] overflow-visible flex items-center justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* 개별 카드 애니메이션 */}
          {benefits.map((benefit, index) => {
            // 현재 카드의 상대적 위치 계산
            let relativePosition = index - activeIndex;
            // 카드 개수에 따라 무한루프 위치 조정
            const half = Math.floor(benefits.length / 2);
            if (relativePosition > half) relativePosition -= benefits.length;
            if (relativePosition < -half) relativePosition += benefits.length;
            // 보이는 카드만 렌더링 (중앙, 왼쪽, 오른쪽)
            const shouldRender = Math.abs(relativePosition) <= 1;
            
            // 사라지는 카드도 애니메이션 중에는 보여주기
            const wasVisible = Math.abs((index - (activeIndex - direction)) % benefits.length) <= 1;
            if (!shouldRender && !wasVisible) return null;
            
            const isActive = relativePosition === 0;
            const isLeft = relativePosition === -1;
            const isRight = relativePosition === 1;
            const isExiting = !shouldRender && wasVisible; // 사라지는 중인 카드
            
            // 위치 계산 (모바일 고려)
            const getCardPosition = () => {
              if (isActive) return { left: '50%', transform: 'translateX(-50%)', scale: 1 };
              if (isLeft) return { left: '5%', transform: 'translateX(-50%) scale(0.75)', scale: 0.75 };
              if (isRight) return { left: '95%', transform: 'translateX(-50%) scale(0.75)', scale: 0.75 };
              if (isExiting) {
                // 사라지는 카드 위치
                return direction === 1 
                  ? { left: '-25%', transform: 'translateX(-50%) scale(0.75)', scale: 0.75 } // 왼쪽으로 밀려남
                  : { left: '125%', transform: 'translateX(-50%) scale(0.75)', scale: 0.75 }; // 오른쪽으로 밀려남
              }
              return { left: '50%', transform: 'translateX(-50%)', scale: 1 };
            };
            
            return (
              <motion.div
                key={`card-${index}`}
                className={`absolute flex items-center justify-center ${
                  isActive 
                    ? 'w-[320px] h-[300px] sm:w-[500px] sm:h-[350px] md:w-[900px] md:h-[480px] z-20' 
                    : 'w-[280px] h-[260px] sm:w-[450px] sm:h-[320px] md:w-[700px] md:h-[420px] z-10'
                }`}
                animate={{
                  ...getCardPosition(),
                  opacity: isActive ? 1 : isExiting ? 0 : 0.4,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.8, 0.5, 1], // 더 자연스러운 easing
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
                  <div className={`${benefit.id === 4 ? 'w-full md:flex-1' : (benefit.id === 6 || benefit.id === 7) ? 'flex-[0.4] md:flex-1' : 'flex-1'} ${benefit.id === 4 ? 'text-center' : benefit.id === 7 ? 'text-left' : 'text-center md:text-left'} ${benefit.id === 4 ? '' : 'md:pr-4'} flex flex-col justify-center ${benefit.id === 4 ? 'items-center' : ''}`}>
                    {benefit.id === 1 ? (
                      // 첫 번째 카드 특별 스타일링
                      <>
                        <div className={`font-black font-pretendard`}>
                          <div className={`text-gray-700 ${
                            isActive ? 'text-lg sm:text-xl md:text-3xl lg:text-4xl' : 'text-sm sm:text-base md:text-xl lg:text-2xl'
                          }`}>
                            하이오더 <span style={{ color: '#FF8400' }}>신규 설치 시</span>
                          </div>
                          <div className={`text-[#FF8400] ${
                            isActive ? 'text-lg sm:text-xl md:text-3xl lg:text-4xl mt-1 md:mt-4' : 'text-sm sm:text-base md:text-lg lg:text-xl mt-2 md:mt-3'
                          }`}>
                            포스기 세트 50% 할인
                          </div>
                          <div className={`mt-2 font-bold relative ${
                            isActive ? 'text-lg sm:text-xl md:text-3xl lg:text-4xl mt-1 md:mt-4' : 'text-sm sm:text-base md:text-lg lg:text-xl mt-2 md:mt-3'
                          }`}>
                            {/* 아웃라인 레이어 */}
                            <span className="absolute inset-0 text-white" 
                                  style={{ 
                                    textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 0 2px 0 white, 0 -2px 0 white, 2px 0 0 white, -2px 0 0 white'
                                  }}>
                              → 550,000원
                            </span>
                            {/* 그라디언트 레이어 */}
                            <span className="relative bg-gradient-to-r from-[#FF720D] to-[#FF2B00] bg-clip-text text-transparent">
                              → 550,000원
                            </span>
                            <br />
                            <span className="relative bg-gradient-to-r from-[#FF720D] to-[#FF2B00] bg-clip-text text-transparent text-sm tracking-tight md:text-lg md:tracking-normal">
                              (부가세 포함)
                            </span>
                          </div>
                        </div>
                      </>
                        ) : benefit.id === 2 ? (
                       // 두 번째 카드 특별 스타일링
                      <>
                        <div className={`font-black font-pretendard`}>
                          <div className={`${
                            isActive ? 'text-lg sm:text-xl md:text-3xl lg:text-4xl' : 'text-sm sm:text-base md:text-xl lg:text-2xl'
                          } text-gray-700`}>
                            {benefit.title}
                          </div>
                          <div className={`${
                            isActive ? 'text-lg sm:text-xl md:text-3xl lg:text-4xl' : 'text-sm sm:text-base md:text-xl lg:text-2xl'
                          } mt-1 sm:mt-2 md:mt-3 lg:mt-4 text-white`}>
                            <span>소상공인 창업 가이드</span>
                          </div>
                          <div className={`${
                            isActive ? 'text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mt-3 md:mt-4' : 'text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl mt-2 md:mt-3'
                          } flex items-center`}>
                            <span className="mr-2 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-[#FF7300] rounded-md flex items-center justify-center text-white text-sm sm:text-lg font-bold">✓</span>
                            <span><span className="text-gray-700">무료자료</span><span className="text-white">제공</span></span>
                          </div>
                          <div className={`${
                            isActive ? 'text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mt-2' : 'text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl mt-1'
                          } flex items-start`}>
                            <span className="mr-2 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-[#FF7300] rounded-md flex items-center justify-center text-white text-sm sm:text-lg font-bold mt-1">✓</span>
                            <span><span className="text-white">창업준비부터 매장오픈까지</span><br /><span className="text-gray-700">전체 프로세스 가이드</span></span>
                          </div>
                        </div>
                      </>
                      ) : benefit.id === 3 ? (
                       // 세 번째 카드 특별 스타일링
                      <>
                        <div className={`font-black font-pretendard`}>
                          <div className={`${
                            isActive ? 'text-lg sm:text-xl md:text-3xl lg:text-4xl' : 'text-sm sm:text-base md:text-xl lg:text-2xl'
                          } text-white`}>
                            지니원 특별 선물 <span className={`${
                              isActive ? 'text-2xl sm:text-3xl md:text-5xl lg:text-6xl' : 'text-lg sm:text-xl md:text-3xl lg:text-4xl'
                            }`} style={{ color: '#FF504F' }}>팡팡!</span>
                          </div>
                          <div className={`${
                            isActive ? 'text-lg sm:text-xl md:text-2xl lg:text-3xl mt-3 md:mt-4' : 'text-sm sm:text-base md:text-lg lg:text-xl mt-2 md:mt-3'
                          } flex items-center justify-center`}>
                            <span className={`${
                              isActive ? 'px-4 sm:px-8 md:px-16 py-2 sm:py-3 md:py-4 text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl w-52 sm:w-72 md:w-96' : 'px-3 sm:px-6 md:px-12 py-1 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl w-44 sm:w-60 md:w-80'
                            } bg-white rounded-full text-gray-700 font-bold text-center`}>
                              <span style={{ color: '#FF504F' }}>쉿 대박 비밀 지원금</span> 제공
                            </span>
                          </div>
                          <div className={`${
                            isActive ? 'text-lg sm:text-xl md:text-2xl lg:text-3xl mt-3 md:mt-4' : 'text-sm sm:text-base md:text-lg lg:text-xl mt-2 md:mt-3'
                          } flex items-center justify-center`}>
                            <span className={`${
                              isActive ? 'px-4 sm:px-8 md:px-16 py-2 sm:py-3 md:py-4 text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl w-52 sm:w-72 md:w-96' : 'px-3 sm:px-6 md:px-12 py-1 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl w-44 sm:w-60 md:w-80'
                            } bg-white rounded-full font-bold text-center`} style={{ color: '#FF504F' }}>
                              추가혜택 & 특별혜택
                            </span>
                          </div>
                          <div className={`text-white text-center ${
                            isActive ? 'text-base sm:text-lg md:text-xl lg:text-2xl mt-4 md:mt-6' : 'text-xs sm:text-sm md:text-base lg:text-lg mt-3 md:mt-4'
                          }`}>
                            전화 상담시 안내해드립니다!
                          </div>
                        </div>
                      </>
                      ) : benefit.id === 4 ? (
                       // 네 번째 카드 특별 스타일링 (390만원 혜택)
                      <>
                        <div className={`font-black font-pretendard`}>
                          <div className={`${
                          isActive ? 'text-lg sm:text-xl md:text-xl lg:text-2xl' : 'text-base sm:text-lg md:text-lg lg:text-xl'
                        } text-white text-center mb-4 md:mb-6 pt-4 md:pt-6 lg:pt-8`}>
                          <span className={`${
                            isActive ? 'text-2xl sm:text-3xl md:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl md:text-xl lg:text-2xl'
                          } font-black`} style={{ color: '#FFC9A2' }}>"240만원"</span>
                          <span className="text-white"> 상당의 사은품&혜택</span>
                        </div>
                        <div className="space-y-1 md:space-y-2 lg:space-y-3 -mt-2 md:mt-0 mb-2 md:mb-4">
                          {/* 144만원 부속품 & 설치비 면제 */}
                          <div className={`${
                            isActive ? 'px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3' : 'px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3'
                          } bg-black rounded-md flex items-center justify-between min-h-[45px] sm:min-h-[50px] md:min-h-[55px] lg:min-h-[60px]`}>
                            <span className={`${
                              isActive ? 'text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg' : 'text-[11px] sm:text-xs md:text-sm lg:text-base'
                            } text-white font-bold flex-1 pr-2 md:pr-4`}>
                              <span className='text-[#FFC9A2]'>144만원</span> 부속품 & 설치비 면제
                            </span>
                            <div className="w-[55px] h-[35px] sm:w-[65px] sm:h-[40px] md:w-[70px] md:h-[45px] lg:w-[80px] lg:h-[50px] xl:w-[90px] xl:h-[55px] flex items-center justify-center flex-shrink-0">
                              <Image
                                src="/MemberShip/Card4/Card4_Icon_1.png"
                                alt="부속품 아이콘"
                                width={80}
                                height={50}
                                className="object-contain w-full h-full"
                              />
                            </div>
                          </div>
                          {/* 100만원 신한은행 지원금 - 2줄이라 높이 더 주기 */}
                          {/* <div className={`${
                            isActive ? 'px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3' : 'px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3'
                          } bg-black rounded-md flex items-center justify-between min-h-[55px] sm:min-h-[60px] md:min-h-[65px] lg:min-h-[70px]`}>
                            <span className={`${
                              isActive ? 'text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg' : 'text-[11px] sm:text-xs md:text-sm lg:text-base'
                            } text-white font-bold flex-1 pr-2 md:pr-4 leading-tight`}>
                              <span className='text-[#FFC9A2]'>100만원</span> 신한은행 지원금
                              <br />
                              <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-[#FFC9A2] leading-tight">+) 배터리 1+1 추가제공</span>
                            </span>
                            <div className="w-[55px] h-[35px] sm:w-[65px] sm:h-[40px] md:w-[70px] md:h-[45px] lg:w-[80px] lg:h-[50px] xl:w-[90px] xl:h-[55px] flex items-center justify-center flex-shrink-0">
                              <Image
                                src="/MemberShip/Card4/Card4_Icon_2.png"
                                alt="신한은행 아이콘"
                                width={80}
                                height={50}
                                className="object-contain w-full h-full"
                              />
                            </div>
                          </div> */}
                            
                          {/* 60만원 상당의 블로그 리뷰 */}
                          <div className={`${
                            isActive ? 'px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3' : 'px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3'
                          } bg-black rounded-md flex items-center justify-between min-h-[45px] sm:min-h-[50px] md:min-h-[55px] lg:min-h-[60px]`}>
                            <span className={`${
                              isActive ? 'text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg' : 'text-[11px] sm:text-xs md:text-sm lg:text-base'
                            } text-white font-bold flex-1 pr-2 md:pr-4`}>
                              <span className='text-[#FFC9A2]'>60만원 상당</span>의 블로그 리뷰 20건
                            </span>
                            <div className="w-[55px] h-[35px] sm:w-[65px] sm:h-[40px] md:w-[70px] md:h-[45px] lg:w-[80px] lg:h-[50px] xl:w-[90px] xl:h-[55px] flex items-center justify-center flex-shrink-0">
                              <Image
                                src="/MemberShip/Card4/Card4_Icon_3.png"
                                alt="블로그 리뷰 아이콘"
                                width={80}
                                height={50}
                                className="object-contain w-full h-full"
                              />
                            </div>
                          </div>

                          {/* 36만원 KT 인터넷 결합할인 */}
                          <div className={`${
                            isActive ? 'px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3' : 'px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3'
                          } bg-black rounded-md flex items-center justify-between min-h-[45px] sm:min-h-[50px] md:min-h-[55px] lg:min-h-[60px]`}>
                            <span className={`${
                              isActive ? 'text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg' : 'text-[11px] sm:text-xs md:text-sm lg:text-base'
                            } text-white font-bold flex-1 pr-2 md:pr-4`}>
                              <span className='text-[#FFC9A2]'>36만원</span> KT인터넷 결합할인
                            </span>
                            <div className="w-[55px] h-[35px] sm:w-[65px] sm:h-[40px] md:w-[70px] md:h-[45px] lg:w-[80px] lg:h-[50px] xl:w-[90px] xl:h-[55px] flex items-center justify-center flex-shrink-0">
                              <Image
                                src="/MemberShip/Card4/Card4_Icon_4.png"
                                alt="인터넷 결합할인 아이콘"
                                width={80}
                                height={50}
                                className="object-contain w-full h-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                    ) : benefit.id === 5 ? (
                    // 다섯 번째 카드 특별 스타일링 (지니원 이벤트)
                    <>
                        <div className={`font-black font-pretendard`}>
                        <div className={`${
                            isActive ? 'text-sm sm:text-base md:text-lg lg:text-xl' : 'text-xs sm:text-sm md:text-base lg:text-lg'
                          } text-white text-center mb-4 md:mb-6`}>
                            지니원 디자이너 마케팅 팀, 전폭 지원!
                          </div>
                          <div className={`${
                            isActive ? 'text-lg sm:text-xl md:text-2xl lg:text-3xl' : 'text-sm sm:text-base md:text-lg lg:text-xl'
                          } text-center mb-3 md:mb-4`}>
                            <span style={{ color: '#FFEB9A' }}>지니원 선착순</span> <span className={`${
                              isActive ? 'text-2xl sm:text-1xl md:text-2xl lg:text-3xl' : 'text-lg sm:text-xl md:text-2xl lg:text-3xl'
                            } font-black text-white`}>'30명 한정'</span> <span style={{ color: '#FFEB9A' }}>이벤트</span>
                          </div>
                              <div className="space-y-2 md:space-y-3">
                              {/* 네이버 플레이스 마케팅 */}
                              <div className={`${
                                isActive ? 'px-3 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3' : 'px-2 py-1 md:px-3 md:py-1 lg:px-4 lg:py-2'
                              } bg-white rounded-full flex items-center`}>
                                <div className="mr-3 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                                  <Image
                                    src="/MemberShip/Card5/Card5_Check_Icon.png"
                                    alt="체크 아이콘"
                                    width={20}
                                    height={20}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <span className={`${
                                  isActive ? 'text-xs sm:text-sm md:text-base lg:text-lg' : 'text-[10px] sm:text-xs md:text-sm lg:text-base'
                                } font-bold`}>
                                  <span className="text-black">네이버 플레이스 마케팅 교육 및</span> <span style={{ color: '#FF5800' }}>컨설팅</span>
                                </span>
                              </div>
                              
                              {/* 메뉴 이미지 AI 보정 */}
                              <div className={`${
                                isActive ? 'px-3 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3' : 'px-2 py-1 md:px-3 md:py-1 lg:px-4 lg:py-2'
                              } bg-white rounded-full flex items-center`}>
                                <div className="mr-3 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                                  <Image
                                    src="/MemberShip/Card5/Card5_Check_Icon.png"
                                    alt="체크 아이콘"
                                    width={20}
                                    height={20}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <span className={`${
                                  isActive ? 'text-xs sm:text-sm md:text-base lg:text-lg' : 'text-[10px] sm:text-xs md:text-sm lg:text-base'
                                } font-bold`}>
                                  <span className="text-black">먹음직스럽게 메뉴 이미지</span> <span style={{ color: '#FF5800' }}>AI 보정</span>
                                </span>
                              </div>
                              
                              {/* 리뷰, 마케팅 배너 제작 */}
                              <div className={`${
                                isActive ? 'px-3 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3' : 'px-2 py-1 md:px-3 md:py-1 lg:px-4 lg:py-2'
                              } bg-white rounded-full flex items-center`}>
                                <div className="mr-3 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                                  <Image
                                    src="/MemberShip/Card5/Card5_Check_Icon.png"
                                    alt="체크 아이콘"
                                    width={20}
                                    height={20}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <span className={`${
                                  isActive ? 'text-xs sm:text-sm md:text-base lg:text-lg' : 'text-[10px] sm:text-xs md:text-sm lg:text-base'
                                } font-bold text-black`}>
                                  리뷰, 마케팅 배너 제작 등
                                </span>
                              </div>
                            </div>
                        </div>
                      </>
                    ) : benefit.id === 6 ? (
                      // 6번 카드 특별 스타일링 (충전스테이션)
                      <>
                        <div className={`font-bold font-pretendard`}>
                          <div className={`${
                            isActive ? 'text-base sm:text-lg md:text-xl lg:text-2xl' : 'text-sm sm:text-base md:text-lg lg:text-xl'
                          } text-white mb-2 md:mb-4`}>
                            복잡하고 위험한 전선은 이제 끝!
                          </div>
                          <div className={`${
                            isActive ? 'text-lg sm:text-xl md:text-3xl lg:text-4xl' : 'text-sm sm:text-base md:text-xl lg:text-2xl'
                          } font-bold mb-2 md:mb-4`} style={{ color: '#CD3D3D' }}>
                            하이오더 충전스테이션 제공
                          </div>
                          <div className={`${
                            isActive ? 'text-sm sm:text-base md:text-lg lg:text-xl' : 'text-xs sm:text-sm md:text-base lg:text-lg'
                          } text-white mb-1 md:mb-2`}>
                            ☑️  &nbsp;1단 충전스테이션 <span style={{ color: '#CD3D3D' }}>(10만원 상당!)</span>
                          </div>
                          <div className={`${
                            isActive ? 'text-sm sm:text-base md:text-lg lg:text-xl' : 'text-xs sm:text-sm md:text-base lg:text-lg'
                          } text-white mb-1 md:mb-2`}>
                            ☑️  &nbsp;2단 충전스테이션 <span style={{ color: '#CD3D3D' }}>(20만원 상당!)</span>
                          </div>
                        </div>
                      </>
                    ) : benefit.id === 7 ? (
                      // 7번 카드 특별 스타일링 (한번의 상담으로)
                      <>
                        <div className={`font-bold font-pretendard`}>
                          <div className={`${
                            isActive ? 'text-lg sm:text-xl md:text-3xl lg:text-4xl' : 'text-base sm:text-lg md:text-xl lg:text-2xl'
                          } font-bold mb-1 md:mb-4`} style={{ color: '#FCCDBF' }}>
                            단 한번의 상담 <span style={{ color: '#FFF' }}>으로</span>
                          </div>
                          <div className={`${
                            isActive ? 'text-lg sm:text-xl md:text-3xl lg:text-4xl' : 'text-base sm:text-lg md:text-xl lg:text-2xl'
                          } font-bold leading-relaxed mb-1 md:mb-4`} style={{ color: '#FCCDBF' }}>
                            시간,일정,비용
                          </div>
                          <div className={`${
                            isActive ? 'text-lg sm:text-xl md:text-3xl lg:text-4xl' : 'text-base sm:text-lg md:text-xl lg:text-2xl'
                          } font-bold leading-relaxed`} style={{ color: '#FFF' }}>
                            한번에 해결하세요!
                          </div>
                        </div>
                      </>
                    ) : (
                       // 기존 카드들
                      <>
                    <h3 className={`font-black text-gray-700 mb-1 ${
                      isActive ? 'text-lg sm:text-xl md:text-3xl lg:text-4xl mb-2 md:mb-4' : 'text-sm sm:text-base md:text-xl lg:text-2xl mb-1 md:mb-2'
                    }`}>
                      {benefit.title}
                    </h3>
                    <p className={`font-black mb-2 font-pretendard ${
                      isActive ? 'text-base sm:text-lg md:text-xl lg:text-2xl' : 'text-xs sm:text-sm md:text-base lg:text-lg'
                    }`} style={{ color: benefit.subtitleColor || '#FF8400' }}>
                      {benefit.subtitle.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          {index < benefit.subtitle.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </p>
                    </>
                    )}
                  </div>
                  {/* 4번, 5번 카드는 모바일에서 이미지 숨김 */}
                  {benefit.id !== 4 && benefit.id !== 5 && benefit.id !== 6 && benefit.id !== 7 && (
                    <div className="flex-1 flex items-center justify-center mt-2 md:mt-0 overflow-hidden">
                      <div className={`flex items-center justify-center overflow-hidden ${
                        isActive ? 'w-full h-[120px] sm:h-[160px] md:h-72 max-w-[280px] sm:max-w-[400px] md:max-w-[500px]' : 'w-full h-[80px] sm:h-[120px] md:h-60 max-w-[220px] sm:max-w-[320px] md:max-w-[400px]'
                    }`}>
                      <Image
                        src={benefit.image}
                        alt={`${benefit.title} ${benefit.subtitle}`}
                        width={isActive ? 400 : 320}
                        height={isActive ? 320 : 250}
                          className="object-contain w-full h-full"
                      />
                    </div>
                  </div>
                  )}
                  {/* 6번 카드는 모바일에서 더 큰 이미지 영역 */}
                  {benefit.id === 6 && (
                    <div className="flex-[0.6] md:flex-1 flex items-center justify-center mt-2 md:mt-0 overflow-hidden">
                      <div className={`flex items-center justify-center overflow-hidden ${
                        isActive ? 'w-full h-[160px] sm:h-[200px] md:h-[487px] max-w-[320px] sm:max-w-[450px] md:max-w-[528px]' : 'w-full h-[120px] sm:h-[160px] md:h-[487px] max-w-[260px] sm:max-w-[380px] md:max-w-[528px]'
                    }`}>
                      {/* 모바일용 이미지 */}
                      <Image
                        src="/MemberShip/MemberShip_Card_Image_6_1.png"
                        alt={`${benefit.title} ${benefit.subtitle}`}
                        width={isActive ? 450 : 380}
                        height={isActive ? 350 : 300}
                        className="object-contain w-full h-full md:hidden"
                      />
                      {/* 데스크탑용 이미지 */}
                      <Image
                        src={benefit.image}
                        alt={`${benefit.title} ${benefit.subtitle}`}
                        width={isActive ? 450 : 380}
                        height={isActive ? 350 : 300}
                        className="object-contain w-full h-full hidden md:block"
                      />
                    </div>
                  </div>
                  )}
                  {/* 7번 카드는 모바일에서 이미지 영역 조정 */}
                  {benefit.id === 7 && (
                    <div className="flex-[0.6] md:flex-1 flex items-center justify-center mt-2 md:mt-0 overflow-hidden">
                      <div className={`flex items-center justify-center overflow-hidden ${
                        isActive ? 'w-full h-[140px] sm:h-[180px] md:h-72 max-w-[300px] sm:max-w-[420px] md:max-w-[500px]' : 'w-full h-[100px] sm:h-[140px] md:h-60 max-w-[240px] sm:max-w-[350px] md:max-w-[400px]'
                    }`}>
                      <Image
                        src={benefit.image}
                        alt={`${benefit.title} ${benefit.subtitle}`}
                        width={isActive ? 420 : 350}
                        height={isActive ? 300 : 250}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  </div>
                  )}
                  {/* 4번, 5번 카드는 데스크탑에서만 이미지 표시 */}
                  {(benefit.id === 4 || benefit.id === 5) && (
                    <div className="hidden md:flex flex-1 items-center justify-center mt-2 md:mt-0 overflow-hidden">
                      <div className={`flex items-center justify-center overflow-hidden ${
                        isActive ? 'w-full h-[120px] sm:h-[160px] md:h-72 max-w-[280px] sm:max-w-[400px] md:max-w-[500px]' : 'w-full h-[80px] sm:h-[120px] md:h-60 max-w-[220px] sm:max-w-[320px] md:max-w-[400px]'
                      }`}>
                        <Image
                          src={benefit.image}
                          alt={`${benefit.title} ${benefit.subtitle}`}
                          width={isActive ? 400 : 320}
                          height={isActive ? 320 : 250}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 인디케이터 + 네비게이션 버튼 */}
        <div className="flex items-center justify-center gap-4 mt-2 mb-3 md:mt-4 md:mb-8">
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
      </div>
    </AnimatedSection>
  );
}; 