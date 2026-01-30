import { Box, Paper, IconButton, Typography, Button } from '@mui/material';
import MessageBubble from './MessageBubble';
import { useChatStore } from '@/presentation/chatbot/store/chatStore';
import { useRef, useEffect, useState } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReplayIcon from '@mui/icons-material/Replay';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = ({ embedded = false }) => {
  const { messages, setMessages, scenario } = useChatStore();
  const messagesEndRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState([]); // 메시지 id 스택
  const [isMobile, setIsMobile] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false); // 사용자가 상호작용했는지 추적

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    const chatContainer = document.querySelector('[sx*="overflowY: auto"]') || messagesEndRef.current?.parentElement;
    if (chatContainer) {
      chatContainer.scrollTop = 0;
    }
  };

  // 새로운 메시지의 상단까지만 스크롤하는 함수
  const scrollToNewMessage = () => {
    const chatContainer = messagesEndRef.current?.parentElement;
    if (chatContainer && safeMessages.length > 0) {
      // 마지막 메시지 요소 찾기
      const messageElements = chatContainer.querySelectorAll('[data-message]');
      const lastMessageElement = messageElements[messageElements.length - 1];
      
      if (lastMessageElement) {
        // 메시지 상단이 보이도록 스크롤
        lastMessageElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' // 요소의 상단이 보이도록
        });
      }
    }
  };

  useEffect(() => {
    // 모바일에서는 처음에는 맨 위로 스크롤, 상호작용 후에는 자동 스크롤
    if (isMobile && !userInteracted) {
      scrollToTop();
    } else if (!isMobile || userInteracted) {
      scrollToBottom();
    }
  }, [messages, isMobile, userInteracted]);

  useEffect(() => {
    console.log('messages updated:', messages);
  }, [messages]);

  const safeMessages = Array.isArray(messages) ? messages.filter(Boolean) : [];
  const lastOptionMsg = [...safeMessages].reverse().find(m => Array.isArray(m.options) && m.options.length > 0);
  const lastOptionMsgId = lastOptionMsg ? lastOptionMsg.id : '';
  const isLastOptionMsg = lastOptionMsg && safeMessages[safeMessages.length - 1] && lastOptionMsg.id === safeMessages[safeMessages.length - 1].id;

  // 옵션 애니메이션: 옵션이 바뀔 때만 트리거, 최초에는 0에서 1로만
  useEffect(() => {
    if (!lastOptionMsgId) {
      setShowOptions(false);
      return;
    }
    if (!showOptions) {
      setTimeout(() => {
        setShowOptions(true);
        setIsAnimating(false);
      }, 600);
    } else {
      setIsAnimating(true);
      setShowOptions(false);
      const timer = setTimeout(() => {
        setShowOptions(true);
        setIsAnimating(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [lastOptionMsgId]);

  useEffect(() => {
    if (!lastOptionMsgId) return;
    if (safeMessages.length === 1 && isLastOptionMsg) {
      setIsAnimating(true);
      setShowOptions(false);
      const timer = setTimeout(() => {
        setShowOptions(true);
        setIsAnimating(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [safeMessages.length, lastOptionMsgId, isLastOptionMsg]);

  useEffect(() => {
    if (showOptions && messagesEndRef.current && (!isMobile || userInteracted)) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showOptions, isMobile, userInteracted]);

  // 뒤로가기 핸들러 (브라우저)
  const handleBack = () => {
    window.history.back();
  };

  // 옵션 선택 핸들러
  const handleOptionSelect = (msgId, option) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShowOptions(false);
    setUserInteracted(true); // 사용자가 상호작용했음을 표시

    // 현재 messages를 복사
    const currentMessages = [...messages];

    // 히스토리에 현재 노드 id push
    setHistory(prev => [...prev, msgId]);

    // 사용자 메시지 추가
    setMessages([
      ...currentMessages,
      { sender: 'user', text: option.label, msgKey: Date.now() + Math.random() }
    ]);

    // nextMsg 미리 계산
    const nextMsg = scenario.messages.find(m => m.id === option.nextMessageId);

    if (nextMsg) {
      setTimeout(() => {
        setMessages([
          ...currentMessages.filter(m => !m.isTyping),
          { sender: 'user', text: option.label, msgKey: Date.now() + Math.random() },
          { sender: 'bot', isTyping: true, id: `typing-${nextMsg.id}`, msgKey: Date.now() + Math.random() }
        ]);
        setTimeout(() => {
          setMessages([
            ...currentMessages.filter(m => !m.isTyping),
            { sender: 'user', text: option.label, msgKey: Date.now() + Math.random() },
            { ...nextMsg, msgKey: Date.now() + Math.random() }
          ]);
          setTimeout(() => {
            setShowOptions(true);
            setIsAnimating(false);
            // 새로운 메시지 상단까지만 스크롤
            setTimeout(scrollToNewMessage, 200);
          }, 700);
        }, 1000);
      }, 100);
    } else {
      setTimeout(() => {
        setMessages([
          ...currentMessages,
          { sender: 'user', text: option.label, msgKey: Date.now() + Math.random() }
        ]);
        setIsAnimating(false);
      }, 500);
    }
  };

  // 이전 노드로 돌아가기 핸들러
  const handleGoBack = () => {
    if (isAnimating || history.length === 0) return;
    setIsAnimating(true);
    setShowOptions(false);
    setUserInteracted(true); // 사용자가 상호작용했음을 표시

    const prevId = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    
    if (!prevId) {
      setIsAnimating(false);
      setHistory(newHistory);
      return;
    }

    // 이전 노드 메시지 찾기
    const prevMsg = scenario.messages.find(m => m.id === prevId);
    if (prevMsg) {
      // 먼저 히스토리 업데이트
      setHistory(newHistory);
      
      // 그 다음 메시지 업데이트
      setTimeout(() => {
        setMessages([
          ...messages,
          { sender: 'user', text: '이전으로', msgKey: Date.now() + Math.random() },
          { ...prevMsg, msgKey: Date.now() + Math.random() }
        ]);
        setTimeout(() => {
          setShowOptions(true);
          setIsAnimating(false);
        }, 600);
      }, 0);
    } else {
      setHistory(newHistory);
      setIsAnimating(false);
    }
  };

  // 홈으로 돌아가기 핸들러
  const handleGoHome = () => {
    if (isAnimating) return;
    setUserInteracted(true); // 사용자가 상호작용했음을 표시
    
    if (!scenario) return;
    
    // 먼저 히스토리 초기화
    setHistory([]);
    
    // 그 다음 메시지 초기화
    setTimeout(() => {
      const first = scenario.messages.find(m => !m.type || m.type !== 'cardCarouselNode');
      const carousel = scenario.messages.find(m => m.type === 'cardCarouselNode');
      const makeMsg = (msg) => ({ ...msg, msgKey: Date.now() + Math.random() });
      const initial = [];
      if (first) initial.push(makeMsg(first));
      if (carousel) initial.push(makeMsg(carousel));
      setMessages(initial);
      setShowOptions(true);
    }, 0);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: embedded ? '100%' : { xs: '100%', sm: '100vw' },
        height: embedded ? '100%' : { xs: '100%', sm: '100vh' },
        maxWidth: '100vw',
        maxHeight: '100vh',
        borderRadius: embedded ? 0 : 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f5f5f5',
        overflowX: 'hidden',
        position: embedded ? 'relative' : 'fixed',
        top: embedded ? 'auto' : 0,
        left: embedded ? 'auto' : 0,
        right: embedded ? 'auto' : 0,
        bottom: embedded ? 'auto' : 0,
        margin: embedded ? 0 : { xs: '8px', sm: 0 },
        boxSizing: 'border-box',
      }}
    >
      {/* 헤더 */}
      <Box
        sx={{
          width: '100%',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: embedded ? 'center' : 'space-between',
          borderBottom: '1px solid #eee',
          flexShrink: 0,
          background: 'linear-gradient(90deg, #FF5100 0%, #FF6F00 100%)',
          color: '#fff',
          position: 'relative',
          px: embedded ? 0 : 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center', position: 'relative' }}>
          <img
            src="/chatbot/Icon/ChatBot_Icon1.png"
            alt="챗봇 아이콘"
            style={{ height: 32, width: 32, marginRight: 10, display: 'inline-block', verticalAlign: 'middle' }}
          />
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              textAlign: 'center',
              letterSpacing: 1,
              zIndex: 1,
              pointerEvents: 'none',
              color: '#fff',
              display: 'inline-block',
              verticalAlign: 'middle',
            }}
          >
            챗봇 지니어스
          </Typography>
        </Box>
        {!embedded && <Box sx={{ width: 40, height: 40 }} />}
      </Box>

      {/* 채팅 영역 */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        mb: 2, 
        overflowX: 'hidden', 
        px: 2, 
        pt: 2, 
        pb: isMobile ? 2 : 6,
        // 스크롤바 스타일링
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#FFB08B',
          borderRadius: '3px',
          '&:hover': {
            background: '#FF9966',
          },
        },
        // Firefox용 스크롤바
        scrollbarWidth: 'thin',
        scrollbarColor: '#FFB08B transparent',
      }}>
        {safeMessages.map((msg, idx) => (
          <MessageBubble key={msg.msgKey} {...msg} />
        ))}

        {/* 옵션 버튼 영역: '이전으로' 옵션은 절대 포함하지 않음 */}
        <Box
          sx={{
            minHeight: isMobile ? 80 : 120,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
            gap: 1,
            paddingTop: 1,
            marginTop: 1,
            marginBottom: isMobile ? 2 : 4,
            transition: 'min-height 0.2s',
            position: 'relative',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <motion.div
            initial={false}
            animate={{ opacity: showOptions ? 1 : 0, y: showOptions ? 0 : 40 }}
            transition={{
              duration: showOptions ? 0.5 : 0,
              ease: [0.4, 0, 0.2, 1]
            }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              width: '100%',
              maxWidth: '100%',
              justifyContent: 'flex-end',
              pointerEvents: showOptions ? 'auto' : 'none',
            }}
          >
            {lastOptionMsg && lastOptionMsg.options
              .filter(opt => opt.label !== '이전으로')
              .map((opt, idx) => (
                <Button
                  key={opt.label + idx}
                  variant="outlined"
                  size="small"
                  onClick={() => handleOptionSelect(lastOptionMsg.id, opt)}
                  disabled={isAnimating}
                  sx={{
                    borderColor: '#FF8F45',
                    color: '#222',
                    background: '#fff',
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                    fontWeight: 500,
                    fontSize: 14,
                    borderRadius: 5,
                    px: 2,
                    py: 0.5,
                    minWidth: 64,
                    maxWidth: 320,
                    whiteSpace: 'nowrap',
                    wordBreak: 'keep-all',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: '#FF8F45',
                      color: '#222',
                      borderColor: '#FF8F45',
                    },
                  }}
                >
                  {opt.label}
                </Button>
              ))}
          </motion.div>
        </Box>
        <div ref={messagesEndRef} />
      </Box>

      {/* 푸터 */}
      <Box
        sx={{
          width: '100%',
          height: 60,
          borderTop: '1px solid #eee',
          bgcolor: '#FFB08B',
          display: 'flex',
          position: embedded ? 'relative' : 'fixed',
          bottom: embedded ? 'auto' : 0,
          left: embedded ? 'auto' : 0,
          zIndex: embedded ? 'auto' : 1000,
        }}
      >
        {/* 왼쪽 절반 - 이전으로 */}
        <Box
          onClick={handleGoBack}
          sx={{
            flex: 1,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: (isAnimating || history.length === 0) ? 'not-allowed' : 'pointer',
            color: history.length === 0 ? '#ccc' : '#666',
            fontWeight: 500,
            fontSize: 14,
            gap: 1,
            '&:hover': {
              background: (isAnimating || history.length === 0) ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
            },
            '&:active': {
              background: (isAnimating || history.length === 0) ? 'transparent' : 'rgba(0, 0, 0, 0.2)',
            },
            transition: 'background 0.2s',
            pointerEvents: (isAnimating || history.length === 0) ? 'none' : 'auto',
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          이전으로
        </Box>
        
        {/* 오른쪽 절반 - 처음으로 */}
        <Box
          onClick={handleGoHome}
          sx={{
            flex: 1,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: (isAnimating || history.length === 0) ? 'not-allowed' : 'pointer',
            color: history.length === 0 ? '#ccc' : '#666',
            fontWeight: 500,
            fontSize: 14,
            gap: 1,
            bgcolor: '#FFE9D9',
            '&:hover': {
              background: (isAnimating || history.length === 0) ? '#FFE9D9' : 'rgba(0, 0, 0, 0.1)',
            },
            '&:active': {
              background: (isAnimating || history.length === 0) ? '#FFE9D9' : 'rgba(0, 0, 0, 0.2)',
            },
            transition: 'background 0.2s',
            pointerEvents: (isAnimating || history.length === 0) ? 'none' : 'auto',
          }}
        >
          <ReplayIcon sx={{ fontSize: 16 }} />
          처음으로
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatBot;