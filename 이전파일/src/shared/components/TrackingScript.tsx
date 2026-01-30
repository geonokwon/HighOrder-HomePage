'use client';

import { useEffect } from 'react';
import { trackCurrentVisit } from '@/shared/utils/analytics';

export const TrackingScript: React.FC = () => {
  useEffect(() => {
    // 페이지 로드 시 방문 추적
    trackCurrentVisit().catch(console.error);
  }, []);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
};
