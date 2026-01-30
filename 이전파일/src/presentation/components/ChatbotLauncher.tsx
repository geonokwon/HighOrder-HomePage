'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';
import { useChatbotUIStore } from '@/presentation/store/chatbotStore';
import Image from 'next/image';

export const ChatbotLauncher = () => {
  const pathname = usePathname();
  const { open, toggle } = useChatbotUIStore();
  if (pathname.startsWith('/admin/chatbot')) return null;

  const handleOpen = () => {
    toggle();
  };

  return (
    <button
      onClick={handleOpen}
      aria-label="챗봇 열기"
      className="fixed bottom-6 right-6 z-50 w-[53px] h-[53px] focus:outline-none transition-all duration-300 hover:scale-110"
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
  );
}; 