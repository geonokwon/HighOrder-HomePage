import { useEffect } from 'react';
import ChatBot from '../../../../../presentation/chatbot/components/ChatBot/ChatBot';
import { useChatStore } from '../store/chatStore';

const ChatPage = () => {
  const setScenario = useChatStore((s) => s.setScenario);
  const setMessages = useChatStore((s) => s.setMessages);

  useEffect(() => {
    fetch('/api/scenario')
      .then(res => res.json())
      .then(data => {
        const scenario = data[0];
        setScenario(scenario);
        // 첫 질문, 카드 캐러셀 모두 messages에 넣기
        const firstMsg = scenario.messages.find(msg => !msg.type || msg.type !== 'cardCarouselNode');
        const carouselMsg = scenario.messages.find(msg => msg.type === 'cardCarouselNode');
        const initialMessages = [];
        if (firstMsg) initialMessages.push(firstMsg);
        if (carouselMsg) initialMessages.push(carouselMsg);
        setMessages(initialMessages);
      });
  }, []);

  return <ChatBot />;
};

export default ChatPage;