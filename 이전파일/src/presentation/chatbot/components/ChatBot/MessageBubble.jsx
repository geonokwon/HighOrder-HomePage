import { Box, Typography, Card, CardMedia, Button, CardContent, CardActions, Avatar } from '@mui/material';
import React, { useRef, useLayoutEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

function extractVideoInfo(text) {
  // [영상] - URL 패턴 추출 (URL은 공백 없이)
  const regex = /\[영상\]\s*-\s*(https?:\/\/\S+)/g;
  const matches = [...text.matchAll(regex)];
  if (!matches.length) return { cleanText: text, videos: [] };
  let cleanText = text;
  const videos = matches.map(m => {
    cleanText = cleanText.replace(m[0], '').trim();
    return m[1];
  });
  return { cleanText, videos };
}

function getYoutubeId(url) {
  // 다양한 YouTube URL 지원
  const yt = url.match(
    /(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/
  );
  return yt ? yt[1] : null;
}

const CARD_WIDTH = 284;
const GAP = 12;

const Carousel = ({ cards }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  return (
    <Box ref={containerRef} sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
      <Swiper
        spaceBetween={GAP}
        slidesPerView="auto"
        grabCursor={true}
        freeMode={false}
        slidesOffsetBefore={16}
        slidesOffsetAfter={containerWidth ? containerWidth - CARD_WIDTH : 0}
        style={{ width: '100%', overflow: 'hidden', padding: '8px 0' }}
      >
        {cards.map((card, idx) => (
          <SwiperSlide
            key={idx}
            style={{
              width: CARD_WIDTH,
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Card sx={{ width: CARD_WIDTH, height: 224, borderRadius: 2, bgcolor: '#fff', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.18)' }}>
              <CardMedia
                component="img"
                image={card.image}
                alt={card.desc || 'card'}
                sx={{ width: '100%', height: 114, objectFit: 'cover', borderRadius: 0 }}
              />
              <CardContent sx={{ p: 2, pb: 0, pl: 2.4, pt: 2 }}>
                <Typography variant="body2" sx={{ textAlign: 'left', mb: 0.2 }}>
                  {card.desc}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 2 }}>
                {card.buttonText && (
                  <Button
                    variant="contained"
                    size="medium"
                    href={card.buttonUrl || '#'}
                    target="_blank"
                    sx={{
                      width: '100%',
                      bgcolor: '#fff',
                      color: '#222',
                      border: '1px solid #d0d0d0',
                      boxShadow: 'none',
                      borderRadius: 2,
                      fontWeight: 600,
                      '&:hover': {
                        border: '1px solid black',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    {card.buttonText}
                  </Button>
                )}
              </CardActions>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

// [텍스트] 대괄호 안만 굵게 표시하는 함수
function parseBoldBrackets(text) {
  const parts = [];
  let lastIndex = 0;
  const regex = /\[([^\]]+)\]/g;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<b key={key++}>{match[1]}</b>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

const MessageBubble = (props) => {
  const { sender, text, type, isTyping, cards } = props;

  if (type === 'cardCarouselNode' && Array.isArray(cards)) {
    return (
      <Box data-message sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Carousel cards={cards} />
        </Box>
      </Box>
    );
  }

  const { cleanText, videos } = extractVideoInfo(text || '');
  return (
    <Box 
      data-message
      sx={{
        display: 'flex',
        flexDirection: sender === 'bot' ? 'row' : 'row-reverse',
        alignItems: 'flex-start',
        mb: 1
      }}>
      {sender === 'bot' && (
        <Avatar src="/chatbot/Icon/ChatBot_Icon1.png" alt="bot" sx={{ backgroundColor: '#FF5701', width: 40, height: 40, mr: 0.5, mt: 0.5, p: 0.8 }} />
      )}
      {isTyping ? (
        <Box sx={{
          bgcolor: '#FFE5C2',
          color: 'black',
          borderRadius: 5,
          p: 1.2,
          px: 2,
          py: 1,
          mx: 0.5,
          my: 1,
          maxWidth: 280,
          minWidth: 20,
          minHeight: 20,
          width: 'fit-content',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <span className="mui-typing-indicator" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <FiberManualRecordIcon className="mui-dot" style={{ fontSize: 12, color: '#888' }} />
            <FiberManualRecordIcon className="mui-dot" style={{ fontSize: 12, color: '#888' }} />
            <FiberManualRecordIcon className="mui-dot" style={{ fontSize: 12, color: '#888' }} />
          </span>
        </Box>
      ) : (
        <Box sx={{
          bgcolor: sender === 'bot' ? '#FFE9D9' : '#DCDCDC',
          color: sender === 'bot' ? 'black' : '#222',
          borderRadius: 5,
          p: 1.2,
          px: 2,
          py: 1,
          mx: 0.5,
          my: 0.8,
          maxWidth: 320,
          minWidth: 20,
          width: 'fit-content',
          wordBreak: 'break-word',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          mr: sender === 'bot' ? 4 : 0,
        }}>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line', textAlign: sender === 'bot' ? 'left' : 'center' }}>{parseBoldBrackets(cleanText)}</Typography>
          {videos.map((url, idx) => {
            const ytId = getYoutubeId(url);
            return (
              <Card key={idx} sx={{ mt: 1, boxShadow: 2, borderRadius: 2, overflow: 'hidden' }}>
                {ytId ? (
                  <Box sx={{ position: 'relative', pt: '56.25%' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}`}
                      title="YouTube video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    />
                  </Box>
                ) : url.match(/\.mp4($|\?)/i) ? (
                  <CardMedia
                    component="video"
                    src={url}
                    controls
                    sx={{ width: '100%', maxHeight: 220, bgcolor: '#000' }}
                  />
                ) : null}
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default MessageBubble;