'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CustomPopup } from './CustomPopup';
// import NotiPopup from './NotiPopup';

interface PopupItem {
  id: string;
  order: number;
  enabled: boolean;
  imageUrl: string | null;
  buttonUrl?: string | null;
  name?: string;
  startDate?: string | null;
  endDate?: string | null;
}

interface HomeWithPopupProps {
  children: React.ReactNode;
}

export const HomeWithPopup: React.FC<HomeWithPopupProps> = ({ 
  children
}) => {
  // 클라이언트 렌더링 확인
  const [isMounted, setIsMounted] = useState(false);
  
  const [popups, setPopups] = useState<PopupItem[]>([]);
  const [currentPopupIndex, setCurrentPopupIndex] = useState<number | null>(null);

  // 마운트 확인
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 팝업 설정 로드
  useEffect(() => {
    if (!isMounted) return;
    
    const loadPopupSettings = async () => {
      try {
        const response = await fetch('/api/popup-settings');
        if (response.ok) {
          const settings = await response.json();
          // 활성화되고 이미지가 있는 팝업만 필터링하고 순서대로 정렬
          const enabledPopups = (settings.popups || [])
            .filter((p: PopupItem) => p.enabled && p.imageUrl)
            .sort((a: PopupItem, b: PopupItem) => a.order - b.order);
          setPopups(enabledPopups);
        }
      } catch (error) {
        console.error('팝업 설정 로드 오류:', error);
      }
    };

    loadPopupSettings();
  }, [isMounted]);

  // 최초 진입 시 팝업 오픈
  useEffect(() => {
    if (!isMounted) return;
    
    if (popups.length > 0) {
      // 첫 번째 팝업 표시
      const timer = setTimeout(() => {
        setCurrentPopupIndex(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [popups.length, isMounted]);

  const handleCloseCustomPopup = () => {
    if (currentPopupIndex === null) return;
    
    // 현재 팝업 닫기
    setCurrentPopupIndex(null);
    
    // 다음 팝업이 있으면 표시
    if (currentPopupIndex < popups.length - 1) {
      setTimeout(() => {
        setCurrentPopupIndex(currentPopupIndex + 1);
      }, 300);
    }
  };

  // 서버 렌더링 중에는 children만 반환
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <>
      {/* 설정된 커스텀 팝업들 순서대로 표시 */}
      <AnimatePresence mode="wait">
        {currentPopupIndex !== null && popups[currentPopupIndex] && (
          <CustomPopup 
            key={popups[currentPopupIndex].id}
            isOpen={true} 
            onClose={handleCloseCustomPopup}
            imageUrl={popups[currentPopupIndex].imageUrl!}
          />
        )}
      </AnimatePresence>
      {children}
    </>
  );
};
