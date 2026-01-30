'use client';

import React, { useState } from 'react';
import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/presentation/components/AnimatedSection';

interface PointCardProps {
  title: string;
  options: Array<{
    label: string;
    isActive: boolean;
    image: string;
  description: string;
  }>;
  onOptionClick: (index: number) => void;
  className?: string;
}

const PointCard: React.FC<PointCardProps> = ({
  title,
  options,
  onOptionClick,
  className = ""
}) => {
  const activeOption = options.find(option => option.isActive);

  return (
    <div className={`flex flex-col ${className}`}>
      {/* 카드 배경 */}
      <div className={`${title === '거치대' ? 'bg-transparent' : 'bg-[#D9D9D9]'} rounded-2xl w-full h-[360px] relative mb-3 md:mb-4`}>
        {/* 이미지 영역 - 선택된 옵션에 따른 이미지 표시 */}
        {activeOption && activeOption.image && (
          <img
            src={activeOption.image}
            alt={`${title} ${activeOption.label}`}
            className="w-full h-full object-contain rounded-2xl"
          />
        )}
      </div>
      
      {/* 제목 */}
      <h3 className="text-lg md:text-[28px] font-bold text-gray-600 mb-2 md:mb-3">
        {title}
      </h3>

      {/* 버튼 그룹 */}
      <div className="flex items-start mb-2 md:mb-3">
          {options.map((option, index) => (
          <React.Fragment key={index}>
            <div className="relative flex flex-col">
              <button
                onClick={() => onOptionClick(index)}
                className={`py-2 text-base md:text-[24px] font-bold text-left transition-colors duration-200 ${
                  option.isActive 
                    ? 'text-orange-500' 
                    : 'text-gray-500 font-semibold hover:text-gray-700'
                }`}
              >
                {option.label}
              </button>
              {/* 주황색 밑줄 */}
              {option.isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange-500 rounded-t-sm" />
              )}
            </div>
            {index < options.length - 1 && (
              <div className="w-[2px] bg-gray-500 h-6 md:h-8 mx-2 md:mx-3 mt-2" />
            )}
          </React.Fragment>
          ))}
        </div>
        
      {/* 설명 - 선택된 옵션에 따른 설명 표시 */}
      <p className="text-sm md:text-[20px] font-bold mb-6" style={{ color: '#939393' }}>
        {activeOption?.description || ''}
      
      </p>
    </div>
  );
};

export const PointSection: React.FC = () => {
  const [card1Options, setCard1Options] = useState([
    {
      label: '후불형', 
      isActive: true, 
      image: '/TableOrder/Card1_Image_2.png', 
      description: '추가 주문을 유도하고 싶다면 후불형이 좋습니다.' 
    },
    { 
      label: '선불형', 
      isActive: false, 
      image: '/TableOrder/Card1_Image_1.png', 
      description: '테이블 회전이 중요하다면 선불형이 좋습니다.' 
    }
  ]);
  
  const [card2Options, setCard2Options] = useState([
    { 
      label: '화이트',
      isActive: true, 
      image: '/TableOrder/Card2_Image_1.png',
      description: '깔끔하고 모던한 인테리어에 어울리는 화이트 컬러'
    },
    {
      label: '블랙',
      isActive: false,
      image: '/TableOrder/Card2_Image_2.png', 
      description: '고급스럽고 세련된 분위기를 연출하는 블랙 컬러' 
    }
  ]);
  
  const [card3Options, setCard3Options] = useState([
    {
      label: '스텐드형',
      isActive: true, 
      image: '/TableOrder/Card3_Image_1.png', 
      description: '바닥에 세워두고 사용하는 독립형 스텐드' 
    },
    { 
      label: '아일랜드형',
      isActive: false,
      image: '/TableOrder/Card3_Image_2.png',
      description: '테이블 위에 안정적으로 거치할 수 있는 아일랜드형' 
    },
    { 
      label: '벽걸이',
      isActive: false, 
      image: '/TableOrder/Card3_Image_3.png',
      description: '벽면에 간편하게 부착하여 사용하는 벽걸이형' 
    }
  ]);

  const handleCard1OptionClick = (index: number) => {
    setCard1Options(prev => prev.map((option, i) => ({
      ...option,
      isActive: i === index
    })));
  };

  const handleCard2OptionClick = (index: number) => {
    setCard2Options(prev => prev.map((option, i) => ({
      ...option,
      isActive: i === index
    })));
  };

  const handleCard3OptionClick = (index: number) => {
    setCard3Options(prev => prev.map((option, i) => ({
      ...option,
      isActive: i === index
    })));
  };

  return (
    <AnimatedSection className="w-full max-w-7xl mx-auto px-4 py-10 md:py-16">
      {/* 제목 */}
      <AnimatedItem>
        <h2 className="text-3xl md:text-4xl font-black text-gray-700 mb-8 md:mb-14 leading-tight">
          하이오더 특징
        </h2>
      </AnimatedItem>
        
      {/* 카드 컨테이너 */}
      <div className="relative">
        {/* 상단 카드들 (카드 1, 2) */}
        <AnimatedContainer className="flex flex-col md:flex-row md:justify-center gap-6 md:gap-12 mb-6 md:mb-12" staggerChildren={0.2}>
          <AnimatedItem>
            <PointCard
              title="계산타입"
              options={card1Options}
              onOptionClick={handleCard1OptionClick}
              className="w-full md:w-[540px]"
            />
          </AnimatedItem>
          
          <AnimatedItem>
            <PointCard
              title="색상"
              options={card2Options}
              onOptionClick={handleCard2OptionClick}
              className="w-full md:w-[540px]"
            />
          </AnimatedItem>
        </AnimatedContainer>
        
        {/* 하단 카드 (카드 3) - 중앙 정렬 */}
        <AnimatedItem delay={0.4} className="flex justify-center">
          <PointCard
            title="거치대"
            options={card3Options}
            onOptionClick={handleCard3OptionClick}
            className="w-full md:w-[540px]"
          />
        </AnimatedItem>
      </div>
    </AnimatedSection>
  );
}; 
