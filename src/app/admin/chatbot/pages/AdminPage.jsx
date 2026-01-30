import { useEffect, useState, useRef } from 'react';
import { Box, Button, Collapse } from '@mui/material';
import ScenarioFlowEditor from '../components/Admin/ScenarioFlowEditor';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // 버튼 핸들러를 AdminPage에서 직접 관리
  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const scenarioRef = useRef();

  // ScenarioFlowEditor 내부 함수들을 ref로 노출
  const handleSaveScenario = () => {
    if (scenarioRef.current && scenarioRef.current.handleSaveScenario) scenarioRef.current.handleSaveScenario();
  };
  const handleLoadScenario = () => {
    if (scenarioRef.current && scenarioRef.current.handleLoadScenario) scenarioRef.current.handleLoadScenario();
  };
  const handleAddNodeType = (type) => {
    if (scenarioRef.current && scenarioRef.current.handleAddNodeType) scenarioRef.current.handleAddNodeType(type);
    setAddNodeOpen(false);
  };

  useEffect(() => {
    // 로그인 상태 확인
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-auth', {
          credentials: 'include'
        });
        const data = await response.json();
        if (!data.authenticated) {
          navigate('/login');
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };


  if (!isAuthenticated) {
    return null; // 인증 체크 중에는 아무것도 표시하지 않음
  }
  


  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'flex-start', position: 'relative' }}>
        <Button variant="contained" color="primary" onClick={handleSaveScenario}>저장하기</Button>
        <Button variant="contained" onClick={handleLoadScenario}>불러오기</Button>
        <Box sx={{ position: 'relative' }}>
          <Button variant="contained" onClick={() => setAddNodeOpen((prev) => !prev)}>노드 만들기</Button>
          <Collapse in={addNodeOpen} sx={{ position: 'absolute', top: '100%', left: 0, zIndex: 20, minWidth: 280 }}>
            <Box sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 3, p: 2, mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button fullWidth variant="outlined" onClick={() => handleAddNodeType('optionNode')}>텍스트/옵션 노드 추가</Button>
              <Button fullWidth variant="outlined" onClick={() => handleAddNodeType('cardCarouselNode')}>카드형 노드 추가</Button>
              <Button fullWidth variant="outlined" onClick={() => handleAddNodeType('main')}>메인 노드 추가</Button>
            </Box>
          </Collapse>
        </Box>
        <Button variant="outlined" color="secondary" onClick={handleLogout} sx={{ ml: 'auto' }}>
          Logout
        </Button>
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <ScenarioFlowEditor ref={scenarioRef} />
      </Box>
    </Box>
  );
}

export default AdminPage;