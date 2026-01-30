'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CustomPopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export const CustomPopup: React.FC<CustomPopupProps> = ({ 
  isOpen, 
  onClose,
  imageUrl
}) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Disable background scroll when popup is open
  React.useEffect(() => {
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

  if (!isOpen) return null;

  return (
    <motion.div
      key={`custom-popup-${imageUrl}`}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
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
            onClick={(e) => e.stopPropagation()}
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
              className="w-full"
              style={{ 
                height: 'auto',
                minHeight: isMobile ? '300px' : '400px'
              }}
            >
              <img
                src={imageUrl}
                alt="커스텀 팝업"
                className={`w-full h-full object-contain ${
                  isMobile ? 'object-top' : 'object-center'
                }`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-bold">이미지를 불러올 수 없습니다</div>';
                  }
                }}
              />
            </div>
          </motion.div>
        </motion.div>
  );
};





