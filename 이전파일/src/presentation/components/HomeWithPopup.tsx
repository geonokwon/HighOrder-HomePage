'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { EventPopup } from './EventPopup';
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
  // ✅ 클라이언트 렌더링 확인
  const [isMounted, setIsMounted] = useState(false);
  
  const [isEventPopupOpen, setIsEventPopupOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [popups, setPopups] = useState<PopupItem[]>([]);
  const [currentPopupIndex, setCurrentPopupIndex] = useState<number | null>(null);

  // 배너/네비바 높이(px)
  const BANNER_HEIGHT = 32; // 32px
  const NAVBAR_HEIGHT = 64; // 64px

  // ✅ 마운트 확인
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 현재 월의 기간 자동 계산
  const getCurrentMonthPeriod = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    // 해당 월의 첫날
    const firstDay = `${month}.01`;
    
    // 해당 월의 마지막 날 계산
    const lastDay = new Date(year, month, 0).getDate();
    const lastDayFormatted = `${month}.${lastDay}`;
    
    return `${firstDay} ~ ${lastDayFormatted}`;
  };

  // 클라이언트에서 날짜 계산 ( SSR / 빌드 시점 날짜 고정 방지 )
  useEffect(() => {
    if (!isMounted) return; // ✅ 마운트된 후에만 실행
    setCurrentPeriod(getCurrentMonthPeriod());
  }, [isMounted]);

  // 팝업 설정 로드
  useEffect(() => {
    if (!isMounted) return; // ✅ 마운트된 후에만 실행
    
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

  // 최초 진입 시 팝업 오픈 (설정된 팝업들 → 이벤트 팝업 순서)
  useEffect(() => {
    if (!isMounted) return; // ✅ 마운트된 후에만 실행
    
    if (popups.length > 0) {
      // 첫 번째 팝업 표시
      const timer = setTimeout(() => {
        setCurrentPopupIndex(0);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // 설정된 팝업이 없으면 이벤트 팝업 표시
      const timer = setTimeout(() => setIsEventPopupOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [popups.length, isMounted]);

  const handleCloseEventPopup = () => {
    setIsEventPopupOpen(false);
    setShowBanner(true);
  };

  const handleOpenEventPopup = () => {
    setIsEventPopupOpen(true);
    setShowBanner(false);
  };

  const handleCloseCustomPopup = () => {
    if (currentPopupIndex === null) return;
    
    // 현재 팝업 닫기
    setCurrentPopupIndex(null);
    
    // 다음 팝업이 있으면 표시
    if (currentPopupIndex < popups.length - 1) {
      setTimeout(() => {
        setCurrentPopupIndex(currentPopupIndex + 1);
      }, 300);
    } else {
      // 모든 커스텀 팝업이 끝나면 이벤트 팝업 표시
      setTimeout(() => {
        setIsEventPopupOpen(true);
      }, 300);
    }
  };

  // CSS 변수로 배너 높이를 노출해서 NavBar에서 참조할 수 있게 함
  useEffect(() => {
    if (!isMounted) return; // ✅ 마운트된 후에만 실행
    
    const root = document.documentElement;
    root.style.setProperty('--banner-height', showBanner ? `${BANNER_HEIGHT}px` : '0px');

    // body padding-top을 안전하게 설정 (다른 스타일은 건드리지 않음)
    const targetPadding = showBanner ? BANNER_HEIGHT + NAVBAR_HEIGHT : NAVBAR_HEIGHT;
    document.body.style.paddingTop = `${targetPadding}px`;
    
    // 클린업: 컴포넌트 언마운트 시 패딩 복원
    return () => {
      document.body.style.paddingTop = '';
    };
  }, [showBanner, isMounted]);

  // ✅ 서버 렌더링 중에는 children만 반환
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <>
      {showBanner && (
        <div
          className="w-full bg-[#17386B] text-white text-center flex items-center justify-center h-8 text-xs fixed top-0 left-0 z-50 shadow"
          style={{ fontSize: 14, letterSpacing: 0.5 }}
        >
          <span className="mr-2">{currentPeriod} 까지 기간 이벤트</span>
            <button
              className="underline font-bold ml-2 hover:text-blue-300 transition-colors"
              onClick={handleOpenEventPopup}
              style={{ fontSize: 14 }}
            >
              이벤트 보기 &gt;&gt;
            </button>
        </div>
      )}
      {/* 본문 컨텐츠 */}
      {/* <NotiPopup isOpen={isNoticeOpen} onClose={handleCloseNotice} /> */}
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
      {/* 이벤트 팝업 (기본 팝업) */}
      <EventPopup isOpen={isEventPopupOpen} onClose={handleCloseEventPopup} />
      {children}
    </>
  );
}; 