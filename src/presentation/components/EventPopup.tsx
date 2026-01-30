'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventPopup: React.FC<EventPopupProps> = ({ 
  isOpen, 
  onClose
}) => {
  // 신청 URL - 여기서만 관리
  const buttonUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfM3L5ePr6eXWvQ009MFZsRFktzFEQCENPh4lvbW95Hcj4kJg/viewform?usp=sharing&ouid=117017077532817855027';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const handleButtonClick = () => {
    console.log('Button clicked, URL:', buttonUrl); // 디버깅용
    try {
      // 더 안전한 방법으로 링크 열기
      const link = document.createElement('a');
      link.href = buttonUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 팝업 닫기 (조금 지연)
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      console.error('Error opening link:', error);
      // 폴백: 현재 창에서 열기
      window.location.href = buttonUrl;
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Disable background scroll when popup is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const originalOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow;
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="relative bg-white shadow-2xl overflow-y-auto max-h-full w-full"
            style={{ 
              width: isMobile ? '100%' : 'min(448px, 90vw)',
              maxHeight: 'calc(100vh - 32px)',
              borderRadius: isMobile ? '16px' : '16px',
              maxWidth: isMobile ? '100%' : '448px'
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className={`absolute z-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg ${
                isMobile ? 'top-3 right-3 w-7 h-7' : 'top-4 right-4 w-8 h-8'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                className="text-gray-600"
              >
                <path d="M18 6L6 18M6 6L18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* 메인 이미지 */}
            <div 
              className="w-full cursor-pointer"
              style={{ 
                height: 'auto',
                aspectRatio: isMobile ? 'auto' : '2340/3694',
                minHeight: isMobile ? '300px' : '400px'
              }}
            >
              <img
                src="/Event/Event_PopUp_1.png"
                alt="KT 하이오더 이벤트"
                className={`w-full h-full object-cover ${
                  isMobile ? 'object-top' : 'object-center'
                }`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-bold cursor-pointer">KT 하이오더 이벤트</div>';
                  }
                }}
              />
            </div>
            {/* 하단 버튼 - 커스텀 스타일 */}
            <div className={`w-full flex justify-center items-center py-4 relative z-10 bg-white border-t border-gray-100 ${
              isMobile ? 'px-4' : 'px-6'
            }`}>
              <button
                onClick={handleButtonClick}
                type="button"
                role="button"
                aria-label="2개월 무료 체험 신청하기"
                className={`relative max-w-full bg-[#17386B] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200 group ${
                  isMobile ? 'w-full h-10' : 'w-[340px] h-12'
                }`}
                style={{ minWidth: isMobile ? 'auto' : 260, cursor: 'pointer' }}
              >
                {/* 좌측 원 */}
                <span className={`absolute left-3 bg-white rounded-full ${
                  isMobile ? 'w-4 h-4' : 'w-5 h-5'
                }`} />
                {/* 우측 원 */}
                <span className={`absolute right-3 bg-white rounded-full ${
                  isMobile ? 'w-4 h-4' : 'w-5 h-5'
                }`} />
                {/* 텍스트 */}
                <span className={`text-white font-medium select-none ${
                  isMobile ? 'text-sm px-8' : 'text-base'
                }`}>
                  클릭해서 <span className="font-bold">2개월 무료 체험</span> 신청하기!
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 페이지에서 사용할 수 있는 훅
export const useEventPopup = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 팝업 표시 (1초 후)
    const timer = setTimeout(() => {
      setIsPopupOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return {
    isPopupOpen,
    closePopup
  };
}; 