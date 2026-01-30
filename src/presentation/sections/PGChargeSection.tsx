'use client';

import React from 'react';
import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/presentation/components/AnimatedSection';

interface BarRowProps {
  title: string;
  subtitle: string;
  description: string;
  animate?: boolean;
  isKT?: boolean;
}

const BarRow = ({ title, subtitle, description, animate = false, isKT = false }: BarRowProps) => {
  const barColor = isKT ? 'bg-orange-400' : 'bg-gray-400';
  const textColor = isKT ? 'text-orange-500' : 'text-gray-700';

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-4 md:gap-6">
      {/* 텍스트 영역 */}
      <div className="w-full md:w-1/3 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-[#FF9000] leading-tight">
          {title}
        </h3>
        <p className="text-lg md:text-xl font-bold text-gray-600 mt-2">
          {subtitle}
        </p>
      </div>
    
      {/* 바 영역 */}
      <div className="w-full md:w-2/3">
        <div className="relative h-[80px] md:h-[120px] bg-gray-200 rounded-xl overflow-hidden">
          {animate ? (
            <div className={`absolute top-0 left-0 h-full ${barColor} rounded-xl w-0 animate-slide-right`} />
          ) : (
            <div className={`absolute top-0 left-0 h-full ${barColor} rounded-xl w-10`} />
          )}
          {/* 설명 텍스트 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className={`text-lg md:text-2xl font-bold ${textColor}`}>{description}</p>
          </div>
        </div>
      </div>
      
    </div>
);
};

export const PGChargeSection = () => {
  const [startAnim, setStartAnim] = React.useState(false);

  // 섹션이 viewport에 진입했을 때 애니메이션 시작
  const sectionRef = React.useRef<HTMLDivElement | null>(null);

  //색션이 viewport에 진입했을 때 애니메이션 시작 
  React.useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartAnim(true);
          observer.disconnect(); // 한 번만 실행
        }
      },
      {
        root: null,
        threshold: 0.6, // 60% 이상 보이는 시점에 발동 (더 아래에서 시작)
      }
    );

    // 초기 로드 시 애니메이션 시작
    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return (
    <AnimatedSection className="w-full py-20 bg-transparent px-4">
      <div ref={sectionRef} className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <AnimatedItem className="mb-12 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black text-gray-700 mb-4">
            PG 수수료,결제 대행 <span className="text-[#FF9000]">수수료 0원!</span><br />
            기타 수수료 <span className="text-[#FF9000]">Zero!</span>
          </h2>
        </AnimatedItem>
        
        <AnimatedContainer className="space-y-24 relative" staggerChildren={0.3}>
          {/* 타사 테이블오더 (애니메이션) */}
          <AnimatedItem>
            <BarRow
            title="타사 테이블오더"
            subtitle="(매장→PG-VAN→카드사)"
            description="수수료 2%발생 월 100만원 손해!"
            animate={startAnim}
            isKT={false}
          />
          </AnimatedItem>
          
          {/* KT하이오더 (고정) */}
          <AnimatedItem>
            <BarRow
            title="KT하이오더"
            subtitle="(매장→카드사)"
            description="수수료 0원 !!"
            animate={false}
            isKT={true}
          />
          </AnimatedItem>
        </AnimatedContainer>
      </div>
    </AnimatedSection>
  );
}; 