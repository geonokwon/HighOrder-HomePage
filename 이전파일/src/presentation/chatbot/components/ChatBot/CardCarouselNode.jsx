import React, { useRef, useState } from 'react';
import { Box, Button, TextField, IconButton, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function CardCarouselNode({ data, id }) {
  const fileInputRefs = useRef([]);
  const [expanded, setExpanded] = useState(true);

  // 카드 이미지 업로드 (새로운 API 사용)
  const handleImageUpload = async (cardIdx, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await res.json();
      
      if (result.success && result.url) {
        data.onChangeCardImage(id, cardIdx, result.url);
      } else {
        console.error('Upload failed:', result.error);
        alert('이미지 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  // 카드 순서 변경
  const handleMoveCard = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= data.cards.length) return;
    const newCards = [...data.cards];
    const [moved] = newCards.splice(fromIdx, 1);
    newCards.splice(toIdx, 0, moved);
    if (data.onChangeCardsOrder) {
      data.onChangeCardsOrder(id, newCards);
    }
  };

  // 카드 삭제 (이미지도 서버에서 삭제)
  const handleDeleteCard = async (cardIdx) => {
    const card = data.cards[cardIdx];

    // 이미지가 있으면 서버에서 삭제
    if (card.image && card.image.includes('/uploads/cards/')) {
      try {
        const fileName = card.image.split('/').pop();
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileName })
        });
      } catch (error) {
        console.error('Image delete error:', error);
      }
    }
    
    data.onDeleteCard(id, cardIdx);
  };  

  const cardCount = data.cards?.length || 0;

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(e => !e)} sx={{ minWidth: 340, boxShadow: 2, bgcolor: '#fff', borderRadius: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>카드형 노드</Typography>
        <Typography sx={{ ml: 'auto', fontSize: 13, color: '#888' }}>{cardCount}개 카드</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {data.cards.map((card, idx) => (
          <Box key={idx} sx={{ mb: 3, border: '1px solid #eee', borderRadius: 2, p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* 카드 썸네일 (실제 카드 사이즈로) */}
            <Box sx={{ minWidth: 200, minHeight: 120, mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}>
              {card.image ? (
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={card.image}
                    alt="card"
                    style={{ width: 200, height: 120, objectFit: 'cover', borderRadius: 8 }}
                  />
                  <Button 
                    variant="outlined" 
                    component="label" 
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 5, 
                      right: 5, 
                      bgcolor: 'rgba(255,255,255,0.9)',
                      minWidth: 'auto',
                      px: 1
                    }}
                  >
                    변경
                    <input 
                      type="file" 
                      accept="image/*" 
                      hidden 
                      onChange={e => {
                        if (e.target.files[0]) handleImageUpload(idx, e.target.files[0]);
                      }} 
                    />
                  </Button>
                </Box>
              ) : (
                <Button variant="outlined" component="label" size="small">
                  이미지 업로드
                  <input 
                    type="file" 
                    accept="image/*" 
                    hidden 
                    onChange={e => {
                      if (e.target.files[0]) handleImageUpload(idx, e.target.files[0]);
                    }} 
                  />
                </Button>
              )}
            </Box>
            {/* 설명/버튼 텍스트/버튼 URL 입력 */}
            <Box sx={{ flex: 1 }}>
              <TextField
                label="설명"
                value={card.desc}
                onChange={e => data.onChangeCardDesc(id, idx, e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="버튼 텍스트"
                value={card.buttonText}
                onChange={e => data.onChangeCardButtonText(id, idx, e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="버튼 URL"
                value={card.buttonUrl || ''}
                onChange={e => data.onChangeCardButtonUrl(id, idx, e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
            </Box>
            {/* 카드 순서 변경 및 삭제 버튼 */}
            <Box sx={{ ml: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <IconButton size="small" onClick={() => handleMoveCard(idx, idx - 1)} disabled={idx === 0}>
                <ArrowUpwardIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleMoveCard(idx, idx + 1)} disabled={idx === data.cards.length - 1}>
                <ArrowDownwardIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDeleteCard(idx)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Button variant="contained" onClick={() => data.onAddCard(id)}>+ 카드 추가</Button>
      </AccordionDetails>
    </Accordion>
  );
}

export default React.memo(CardCarouselNode); 