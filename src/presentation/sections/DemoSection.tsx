'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AnimatedSection, AnimatedItem } from '@/presentation/components/AnimatedSection';
import BottomSheetModal from '@/presentation/components/BottomSheetModal';
import { InteractiveTutorial } from '@/presentation/components';
import { CartProvider } from '@/shared/context/CartContext';
import DemoInner from '@/presentation/demo/components/DemoInner';
import { ActionSection } from '@/presentation/sections/ActionSection';

export const DemoSection: React.FC = () => {
  const [demoOpen, setDemoOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);


  useEffect(() => {
    if (demoOpen) {
      setShouldRender(true);
      setShowTutorial(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 300);
    }
  })

  useEffect(() => {
    if (demoOpen) {
      setShouldRender(true);
      setShowTutorial(true); // 데모 모달이 열리면 먼저 튜토리얼 표시
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 300); // 모달 transition과 맞춤
      return () => clearTimeout(timeout);
    }
  }, [demoOpen]);

  const handleTutorialComplete = () => {
    setShowTutorial(false); // 튜토리얼 종료
  };

  const handleTutorialClose = () => {
    setShowTutorial(false);
    setDemoOpen(false); // 튜토리얼을 닫으면 전체 데모도 닫기
  };

  const handleDemoOpen = () => {
    setDemoOpen(true);
    setShowTutorial(true);
    setShouldRender(true);
  }
  const handleDemoClose = () => {
    setDemoOpen(false);
    setShowTutorial(false);
    setShouldRender(false);
    setShowInquiryModal(false);
  }

  return (
    <AnimatedSection className="w-full py-8 md:py-16 bg-transparent">
      <div className="max-w-5xl mx-auto px-4">
        <AnimatedItem>
          <div 
            onClick={() => setDemoOpen(true)}
            className="relative bg-black border-2 md:border-4 border-orange-300 rounded-2xl md:rounded-3xl p-4 md:p-8 cursor-pointer hover:scale-105 transition-transform duration-300 shadow-2xl"
          >
            {/* 메인 컨텐츠 */}
            <div className="flex flex-row items-center justify-center gap-4 md:gap-8">
              {/* 왼쪽 이미지 영역 */}
              <div className="w-16 h-16 md:w-24 md:h-24 relative flex-shrink-0">
                {/* 여기에 이미지를 추가하세요 */}
                <Image
                  src="/DemoImages/HighOrder_Demo_Image.png"
                  alt="하이오더 데모 이미지"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    console.log('Failed to load HighOrder_Demo_Image.png');
                  }}
                />
              </div>

              
              {/* 중앙 텍스트 영역 */}
              <div className="text-center">
                <h2 className="text-orange-200 text-xl md:text-3xl font-black mb-2 md:mb-4">
                  하이오더 지금바로 <span className="text-2xl md:text-4xl">체험하기</span>
                </h2>
                <p className="text-white text-base md:text-lg font-bold">
                  클릭해서 실제 하이오더를 체험해보세요.
                </p>
              </div>
              
              {/* 오른쪽 아이콘 영역 */}
              <div className="w-6 h-6 md:w-12 md:h-12 relative flex-shrink-0">
                <Image
                  src="/DemoImages/HighOrfer_Demo_Icon.png"
                  alt="하이오더 데모 아이콘"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    console.log('Failed to load HighOrfer_Demo_Icon.png');
                  }}
                />
              </div>
            </div>
            {/* 호버 효과 */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-2xl md:rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </div>
        </AnimatedItem>
      </div>
      <BottomSheetModal open={demoOpen} onClose={() => setDemoOpen(false)} maxWidth="1400px" isDemo={true}>
        {shouldRender && (
          <CartProvider>
            <DemoInner 
              onInquiryClick={() => {
                setDemoOpen(false);
                setShowInquiryModal(true);
              }}
            />
          </CartProvider>
        )}
      </BottomSheetModal>

      {/* 상담신청 모달 */}
      <BottomSheetModal open={showInquiryModal} onClose={() => setShowInquiryModal(false)} maxWidth="600px" padding="p-2" scrollable={false}>
        <ActionSection hideImage={true} hideHeader={true} compactMode={true} />
      </BottomSheetModal>

      {/* 인터랙티브 튜토리얼 */}
      <InteractiveTutorial
        isVisible={showTutorial}
        onComplete={handleTutorialComplete}
        onClose={handleTutorialClose}
      />
    </AnimatedSection>
  );
}; 