import { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function parseBoldBrackets(text) {
  if (!text) return null;
  const parts = [];
  let lastIndex = 0;
  const regex = /\[([^\]]+)\]/g;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      // 줄바꿈 변환
      const chunk = text.slice(lastIndex, match.index).split('\n');
      chunk.forEach((line, i) => {
        if (i > 0) parts.push(<br key={`br-${key++}`} />);
        if (line) parts.push(line);
      });
    }
    parts.push(<b key={`b-${key++}`}>{match[1]}</b>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    const chunk = text.slice(lastIndex).split('\n');
    chunk.forEach((line, i) => {
      if (i > 0) parts.push(<br key={`br-${key++}`} />);
      if (line) parts.push(line);
    });
  }
  return parts;
}

export default function Main() {
  const [mainText, setMainText] = useState('');
  const navigate = useNavigate();
  const maxWidth = 360;

  useEffect(() => {
    fetch('/api/scenario')
      .then(res => res.json())
      .then(data => {
        const mainNodes = data[0]?.messages?.filter(m => m.type === 'main');
        setMainText(mainNodes && mainNodes.length ? mainNodes[0].text : '');
      });
  }, []);

  const goToChat = () => {
    navigate('/chat');
  };

  return (
    <Box sx={{ height: '100vh', bgcolor: '#F3F3F3', width: '100%', p: 0, m: 0, overflowX: 'hidden', overflowY: 'hidden' }}>
      {/* 상단 회사 정보 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pt: 3, maxWidth: maxWidth, mx: 'auto', px: 1 }}>
        <Avatar src="/logo.png" alt="logo" sx={{ width: 48, height: 48, mr: 1.5 }} />
        <Box>
          <Typography variant="h6" fontWeight={700}>KT 지니원</Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>소상공인/예비창업자 맞춤상담</Typography>
        </Box>
      </Box>
      {/* 중앙 카드 */}
      <Paper elevation={0}
       sx={{
        width: '100%', 
        maxWidth: maxWidth, 
        mx: 'auto', 
        boxSizing: 'border-box', 
        borderRadius: 3, 
        textAlign: 'left', 
        mt: 1, 
        p: 2, 
        minHeight: 120, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        alignItems: 'stretch', 
        gap: 2,
        boxShadow: '0 2px 10px 0 rgba(0,0,0,0.18)'
        }}
         >
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 2 }}>
          <Avatar src="/bot.png" alt="bot" sx={{ width: 40, height: 40, mt: 0.5 }} />
          <Typography variant="body1" sx={{ color: '#444', fontSize: 16, wordBreak: 'keep-all' }}>
            {parseBoldBrackets(mainText)}
          </Typography>
        </Box>
        <Button variant="contained" size="large" sx={{ width: '100%', alignSelf: 'stretch', fontWeight: 700, fontSize: 16, borderRadius: 2, bgcolor: '#222', color: '#fff', '&:hover': { bgcolor: '#111' }, mt: 2, textAlign: 'center' }} onClick={goToChat}>
          상담 시작
        </Button>
      </Paper>
    </Box>
  );
} 