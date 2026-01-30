'use client';

import React from 'react';
import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/presentation/components/AnimatedSection';

interface ServiceCardProps {
  content: {
    normalText: string;
    highlightText: string;
  };
  imagePath?: string;
  imageAlt?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ content, imagePath, imageAlt }) => (
  <div className="flex flex-col items-center w-full max-w-[500px]">
    {/* 이미지 영역 */}
    <div className="w-[266px] h-[332px] bg-transparent rounded-xl mb-6 flex items-center justify-center overflow-hidden">
      {imagePath ? (
        <img 
          src={imagePath} 
          alt={imageAlt || content.normalText}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-gray-400 text-center">
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-sm">이미지 추가 예정</p>
        </div>
      )}
    </div>
    
    {/* 텍스트 */}
    <div className="h-[180px] flex items-center justify-center">
      <p className="text-2xl md:text-[36px] font-bold text-center leading-tight md:leading-[50px] whitespace-pre-line">
        <span className="text-[#404040]">{content.normalText}</span>
        <span className="text-[#FF8837]">{content.highlightText}</span>
    </p>
    </div>
  </div>
);

export const ASSection: React.FC = () => {
  const serviceCards = [
    {
      content: {
        normalText: "문제 발생 시\nKT는 전국 어디든 빠르게,\n",
        highlightText: "24시간 내 신속 출동"
      },
      imagePath: "/AS/As_Charcter_1.png",
      imageAlt: "신속 출동 서비스"
    },
    {
      content: {
        normalText: "365일 새벽 2시까지\n",
        highlightText: "전담 콜센터 운영!"
      },
      imagePath: "/AS/As_Charcter_2.png", 
      imageAlt: "24시간 콜센터 서비스"
    }
  ];

  return (
    <AnimatedSection className="w-full max-w-7xl mx-auto px-4 py-12 md:py-16">
      {/* 메인 제목 */}
      <AnimatedItem className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-gray-700 leading-tight mb-6 md:mb-8">
          돌고 돌아 KT하이오더!<br />
          테이블오더 좀 써본 분들의 선택!<br />
          A/S 업계 만족도 1위!
        </h2>
          
        {/* 연락처 정보 */}
        <p className="text-lg md:text-xl font-bold text-gray-700 leading-tight tracking-tight">
          KT하이오더 전담센터 : 1899-6484<br />
          (365일 09:00~02:00)
        </p>
      </AnimatedItem>
        
      {/* 서비스 카드들 */}
      <AnimatedContainer className="flex flex-row justify-center items-center gap-4 md:gap-16 mt-12 md:mt-16" staggerChildren={0.3}>
        {serviceCards.map((card, index) => (
          <AnimatedItem key={index} className="flex flex-col items-center w-full max-w-[250px] md:max-w-[500px]">
            {/* 이미지 영역 */}
            <div className="w-[120px] h-[150px] md:w-[266px] md:h-[332px] bg-transparent rounded-xl mb-4 md:mb-6 flex items-center justify-center overflow-hidden">
              {card.imagePath ? (
                <img 
                  src={card.imagePath}
                  alt={card.imageAlt || card.content.normalText}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="text-2xl md:text-4xl mb-1 md:mb-2">🖼️</div>
                  <p className="text-xs md:text-sm">이미지 추가 예정</p>
                </div>
              )}
        </div>
        
            {/* 텍스트 */}
            <div className="h-[120px] md:h-[180px] flex items-center justify-center">
              <p className="text-sm md:text-[36px] font-bold text-center leading-tight md:leading-[50px] whitespace-pre-line">
                <span className="text-[#404040]">{card.content.normalText}</span>
                <span className="text-[#FF8837]">{card.content.highlightText}</span>
            </p>
          </div>
          </AnimatedItem>
        ))}
      </AnimatedContainer>
    </AnimatedSection>
  );
}; 