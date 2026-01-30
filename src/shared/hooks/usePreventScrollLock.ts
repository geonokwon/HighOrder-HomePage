/**
 * Radix UI 스크롤 잠금 방지 훅
 * 드롭다운이 열릴 때 body 스크롤바가 사라지는 것을 방지합니다.
 */

import { useEffect } from 'react';

export function usePreventScrollLock() {
  useEffect(() => {
    // 더 강력한 스타일 재설정 함수
    const resetBodyStyles = () => {
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
      document.body.style.removeProperty('margin-right');
      document.body.style.removeProperty('border-right');
      document.body.style.setProperty('overflow', 'auto', 'important');
    };

    // MutationObserver로 body 변경 감지
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target === document.body) {
          // 모든 body 변경에 대해 스타일 복원
          requestAnimationFrame(resetBodyStyles);
        }
      });
    });

    // body 요소 관찰
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'data-scroll-locked', 'class']
    });

    // 초기 설정
    resetBodyStyles();

    // 주기적으로 체크 (fallback)
    const interval = setInterval(resetBodyStyles, 100);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);
}
