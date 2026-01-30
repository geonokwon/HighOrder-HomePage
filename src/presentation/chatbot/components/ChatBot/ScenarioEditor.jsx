import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Divider, Select, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import Twemoji from 'react-twemoji';

function ScenarioEditor() {
  const [scenario, setScenario] = useState(null);
  const [selectedMsgIdx, setSelectedMsgIdx] = useState(null);
  const [newMsg, setNewMsg] = useState({ sender: 'bot', text: '', options: [] });
  const [newOpt, setNewOpt] = useState({ label: '', nextMessageId: '' });

  useEffect(() => {
    fetch('/api/scenario')
      .then(res => res.json())
      .then(data => setScenario(data[0]));
  }, []);

  // 메시지 추가
  const addMessage = () => {
    if (!newMsg.text) return;
    setScenario((prev) => ({
      ...prev,
      messages: [...prev.messages, { ...newMsg, id: Date.now().toString(), options: [] }],
    }));
    setNewMsg({ sender: 'bot', text: '', options: [] });
  };

  // 메시지 선택
  const selectMessage = (idx) => setSelectedMsgIdx(idx);

  // 메시지 삭제
  const deleteMessage = (idx) => {
    setScenario((prev) => ({
      ...prev,
      messages: prev.messages.filter((_, i) => i !== idx),
    }));
    setSelectedMsgIdx(null);
  };

  // 옵션 추가
  const addOption = () => {
    if (!newOpt.label || !newOpt.nextMessageId) return;
    setScenario((prev) => {
      const msgs = [...prev.messages];
      msgs[selectedMsgIdx].options.push({ ...newOpt });
      return { ...prev, messages: msgs };
    });
    setNewOpt({ label: '', nextMessageId: '' });
  };

  // 옵션 삭제
  const deleteOption = (optIdx) => {
    setScenario((prev) => {
      const msgs = [...prev.messages];
      msgs[selectedMsgIdx].options.splice(optIdx, 1);
      return { ...prev, messages: msgs };
    });
  };

  // 시나리오 저장 (POST)
  const saveScenario = () => {
    fetch('/api/scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scenario),
    })
      .then((res) => res.json())
      .then((data) => alert('저장 완료!'));
  };

  if (!scenario) return <div>Loading...</div>;

  return (
    <Box sx={{ flex: 1, p: 4, maxWidth: 900, margin: 'auto', bgcolor: '#fff', borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={2}>시나리오 에디터</Typography>
      <Typography variant="subtitle1" mb={3}>시나리오 이름: <b>{scenario.name}</b></Typography>
      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* 메시지 리스트 */}
        <Card sx={{ minWidth: 320, flex: 1 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>메시지 목록</Typography>
            <List>
              {scenario.messages.map((msg, idx) => (
                <ListItem
                  key={msg.id}
                  selected={selectedMsgIdx === idx}
                  onClick={() => selectMessage(idx)}
                  sx={{ cursor: 'pointer', bgcolor: selectedMsgIdx === idx ? '#e3f2fd' : undefined }}
                >
                  {msg.sender === 'bot' ? <SmartToyIcon color="primary" /> : <PersonIcon color="secondary" />}
                  <ListItemText primary={<Twemoji options={{ className: 'twemoji' }}><span>{msg.text}</span></Twemoji>} sx={{ ml: 2 }} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" color="error" onClick={() => deleteMessage(idx)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="메시지 내용"
                value={newMsg.text}
                onChange={e => setNewMsg({ ...newMsg, text: e.target.value })}
                size="small"
                fullWidth
              />
              <Select
                value={newMsg.sender}
                onChange={e => setNewMsg({ ...newMsg, sender: e.target.value })}
                size="small"
                sx={{ minWidth: 80 }}
              >
                <MenuItem value="bot">bot</MenuItem>
                <MenuItem value="user">user</MenuItem>
              </Select>
              <Button variant="contained" onClick={addMessage}>추가</Button>
            </Box>
          </CardContent>
        </Card>
        {/* 메시지 상세/옵션 */}
        <Card sx={{ flex: 2 }}>
          <CardContent>
            {selectedMsgIdx !== null && scenario.messages[selectedMsgIdx] && (
              <>
                <Typography variant="h6" mb={2}>메시지 상세</Typography>
                <Typography variant="body2" mb={1}><b>id:</b> {scenario.messages[selectedMsgIdx].id}</Typography>
                <Typography variant="body2" mb={1}><b>sender:</b> {scenario.messages[selectedMsgIdx].sender}</Typography>
                <Typography variant="body2" mb={2}><b>text:</b> <Twemoji options={{ className: 'twemoji' }}><span>{scenario.messages[selectedMsgIdx].text}</span></Twemoji></Typography>
                <Typography variant="subtitle2" mb={1}>옵션(버튼)</Typography>
                <List>
                  {scenario.messages[selectedMsgIdx].options.map((opt, oidx) => (
                    <ListItem key={oidx} secondaryAction={
                      <IconButton edge="end" color="error" onClick={() => deleteOption(oidx)}>
                        <DeleteIcon />
                      </IconButton>
                    }>
                      <ListItemText primary={`${opt.label} → ${opt.nextMessageId}`} />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <TextField
                    label="옵션 라벨"
                    value={newOpt.label}
                    onChange={e => setNewOpt({ ...newOpt, label: e.target.value })}
                    size="small"
                  />
                  <TextField
                    label="다음 메시지 id"
                    value={newOpt.nextMessageId}
                    onChange={e => setNewOpt({ ...newOpt, nextMessageId: e.target.value })}
                    size="small"
                  />
                  <Button variant="outlined" onClick={addOption}>옵션 추가</Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 4, fontWeight: 'bold' }}
        onClick={saveScenario}
      >
        시나리오 저장
      </Button>
    </Box>
  );
}

export default ScenarioEditor; 