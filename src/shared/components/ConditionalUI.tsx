'use client';

import { usePathname } from 'next/navigation';
import { ChatbotWidget } from '@/presentation/components/ChatbotWidget';
import InquiryPopup from '@/presentation/components/InquiryPopup';

export const ConditionalUI: React.FC = () => {
  const pathname = usePathname();
  
  // analytics 페이지에서는 UI 요소들을 숨김
  if (pathname.startsWith('/admin/analytics')) {
    return null;
  }
  
  return (
    <>
      <ChatbotWidget />
      <InquiryPopup />
    </>
  );
};
