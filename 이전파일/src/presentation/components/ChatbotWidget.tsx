'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useChatbotUIStore } from '@/presentation/store/chatbotStore';
import { useChatStore } from '@/presentation/chatbot/store/chatStore';
import ChatBot from '@/presentation/chatbot/components/ChatBot/ChatBot';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const GAP = 20; // px
const DESKTOP_W = 380; // px

export const ChatbotWidget = () => {
  const pathname = usePathname();
  // 관리자 영역에서는 숨김
  if (pathname.startsWith('/admin/chatbot')) return null;

  const { open, toggle } = useChatbotUIStore();
  const setScenario = useChatStore((s: any) => s.setScenario);
  const setMessages = useChatStore((s: any) => s.setMessages);
  const [isMobile, setIsMobile] = useState(false);


  //윈도우 감지
  useEffect(() => {
    const checkWindow = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkWindow();
    window.addEventListener('resize', checkWindow);
    return () => window.removeEventListener('resize', checkWindow);
  }, []);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!open) return;
    fetch('/api/scenario')
      .then((res) => res.json())
      .then((data) => {
        const scenario = Array.isArray(data) ? data[0] : data;
        setScenario(scenario);
        const first = scenario.messages.find((m: any) => !m.type || m.type !== 'cardCarouselNode');
        const carousel = scenario.messages.find((m: any) => m.type === 'cardCarouselNode');
        const makeMsg = (msg: any) => ({ ...msg, msgKey: Date.now() + Math.random() });
        const arr: any[] = [];
        if (first) arr.push(makeMsg(first));
        if (carousel) arr.push(makeMsg(carousel));
        setMessages(arr);
      });
  }, [open]);

  return (
    <>

      {/* Toggle Button */}
      <button
        onClick={toggle}
        aria-label="챗봇 열기"
        className="fixed z-50 bottom-6 right-3 w-[53px] h-[53px] focus:outline-none transition-all duration-300 hover:scale-110"
      >
        {open ? (
          // X 아이콘 (닫기 상태)
          <div className="w-full h-full bg-[#FF5701] hover:bg-[#E54D01] rounded-2xl flex items-center justify-center transition-colors duration-200 shadow-lg">
            <XMarkIcon className="w-6 h-6 text-white" />
          </div>
        ) : (
          // 챗봇 아이콘만 (열기 상태)
          <Image
            src="/chatbot/Icon/ChatBot_Icon.png"
            alt="챗봇 아이콘"
            width={53}
            height={53}
            className="w-[53px] h-[53px] object-contain drop-shadow-lg"
          />
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatbot-panel"
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 40 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{
              width: isMobile ? 'calc(100vw - 40px)' : '100%',
              maxWidth: isMobile ? 'calc(100vw - 40px)' : DESKTOP_W,
              height: isMobile ? 'calc(100vh - 220px)' : 700,
            }}
            className="fixed z-50 left-5 bottom-[94px] sm:left-auto sm:right-3 sm:bottom-[114px] rounded-2xl shadow-2xl overflow-hidden bg-white"
          >
            <ChatBot embedded />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 