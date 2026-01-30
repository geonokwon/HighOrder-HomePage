'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
  onClose: () => void;
}

// 페이지 로드 중에만 유효한 변수 (새로고침되면 초기화)
let hasShownTutorialInThisPageLoad = false;

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ isVisible, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [shouldShow, setShouldShow] = useState(false);
  
  // 튜토리얼 이미지 경로들 (실제 이미지 경로로 수정 필요)
  const tutorialImages = [
    'DemoImages/Tutorial/Tutorial_step_1.png',
    'DemoImages/Tutorial/Tutorial_step_2.png', 
    'DemoImages/Tutorial/Tutorial_step_3.png'
  ];

  // 간단한 페이지 로드 기반 튜토리얼 표시
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 기존 localStorage 청소 (혹시 남아있을 수 있음)
      localStorage.removeItem('hasSeenTutorial');
      
      if (isVisible) {
        // 이 페이지 로드에서 아직 튜토리얼을 보지 않았다면 표시
        if (!hasShownTutorialInThisPageLoad) {
          setShouldShow(true);
          setCurrentStep(0);
          hasShownTutorialInThisPageLoad = true; // 이 페이지 로드에서 봤다고 표시
        } else {
          onComplete();
        }
      }
    }
  }, [isVisible, onComplete]);

  const handleNext = () => {
    if (currentStep < tutorialImages.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 마지막 이미지에서 완료
      setCurrentStep(0); // 다음번을 위해 리셋
      onComplete();
    }
  };

  const handleSkip = () => {
    // 건너뛰기
    setCurrentStep(0); // 다음번을 위해 리셋
    onComplete();
  };

  // 오버레이가 보이지 않거나 이미 봤다면 렌더링하지 않음
  if (!isVisible || !shouldShow) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="tutorial-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed z-[300] bg-white rounded-2xl shadow-2xl flex items-center justify-center"
        style={{ 
          top: '10vh',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(1400px, 90vw)',
          height: '90vh',
          maxHeight: '95vh'
        }}
        onClick={handleNext} // 배경 클릭으로도 다음으로 이동
      >
        <div className="relative w-full h-full flex items-center justify-center p-4">
          {/* 닫기 버튼 */}
          <button
            onClick={() => {
              setCurrentStep(0); // 다음번을 위해 리셋
              onClose();
            }}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-full flex items-center justify-center text-gray-700 text-xl font-bold transition-all shadow-md"
          >
            ×
          </button>

          {/* 건너뛰기 버튼 */}
          <button
            onClick={handleSkip}
            className="absolute top-4 left-4 z-10 px-4 py-2 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg text-gray-700 text-sm font-medium transition-all shadow-md"
          >
            건너뛰기
          </button>

          {/* 튜토리얼 이미지 */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative w-full flex items-center justify-center"
            style={{ height: 'calc(100% - 120px)' }} // 하단 컨트롤 영역 공간 확보
            onClick={(e) => e.stopPropagation()} // 이미지 클릭 시 이벤트 전파 방지
          >
            <img
              src={tutorialImages[currentStep]}
              alt={`튜토리얼 ${currentStep + 1}단계`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={(e) => {
                // 이미지 로드 실패 시 플레이스홀더 표시
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7tlZzsnbTsmrTsp4Ag7ISc7JWE</text></svg>';
              }}
            />
          </motion.div>

          {/* 하단 컨트롤 영역 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4">
            {/* 진행 표시 점들 */}
            <div className="flex gap-2">
              {tutorialImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-4 h-4 rounded-full transition-all border-2 ${
                    index === currentStep 
                      ? 'bg-orange-500 border-orange-600 scale-125 shadow-md' 
                      : 'bg-gray-200 border-gray-300 hover:bg-gray-300 hover:border-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* 다음/완료 버튼 */}
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all shadow-lg"
            >
              {currentStep < tutorialImages.length - 1 ? '다음' : '체험 시작하기'}
            </button>

            {/* 단계 표시 텍스트 */}
            <p className="text-gray-600 text-sm">
              {currentStep + 1} / {tutorialImages.length}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialOverlay; 