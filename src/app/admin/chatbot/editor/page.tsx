'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Collapse } from '@mui/material';
import dynamic from 'next/dynamic';
import { checkCustomRoutes } from 'next/dist/lib/load-custom-routes';

const ScenarioFlowEditor = dynamic(() => import('@/presentation/chatbot/components/ChatBot/ScenarioFlowEditor.jsx'), {
  ssr: false,
});

export default function AdminEditorPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const scenarioRef = useRef<any>();

  const handleSaveScenario = () => {
    scenarioRef.current?.handleSaveScenario?.();
  };
  const handleLoadScenario = () => {
    scenarioRef.current?.handleLoadScenario?.();
  };
  const handleAddNodeType = (type: string) => {
    scenarioRef.current?.handleAddNodeType?.(type);
    setAddNodeOpen(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/check-auth');
        const data = await res.json();
        if (!data.authenticated) {
          router.replace('/admin/chatbot/login');
        } else {
          setIsAuthenticated(true);
        }
      } catch {
        router.replace('/admin/chatbot/login');
      }
    };
    checkAuth();
  }, [router]);
  
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      router.replace('/admin/chatbot/login');
    } catch {}
  };

  if (!isAuthenticated) return null;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'flex-start', position: 'relative' }}>
        <Button variant="contained" color="primary" onClick={handleSaveScenario}>
          저장하기
        </Button>
        <Button variant="contained" onClick={handleLoadScenario}>
          불러오기
        </Button>
        <Box sx={{ position: 'relative' }}>
          <Button variant="contained" onClick={() => setAddNodeOpen((prev) => !prev)}>
            노드 만들기
          </Button>
          <Collapse in={addNodeOpen} sx={{ position: 'absolute', top: '100%', left: 0, zIndex: 20, minWidth: 280 }}>
            <Box sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 3, p: 2, mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button fullWidth variant="outlined" onClick={() => handleAddNodeType('optionNode')}>
                텍스트/옵션 노드 추가
              </Button>
              <Button fullWidth variant="outlined" onClick={() => handleAddNodeType('cardCarouselNode')}>
                카드형 노드 추가
              </Button>
              <Button fullWidth variant="outlined" onClick={() => handleAddNodeType('main')}>
                메인 노드 추가
              </Button>
            </Box>
          </Collapse>
        </Box>
        <Button variant="outlined" color="secondary" onClick={handleLogout} sx={{ ml: 'auto' }}>
          Logout
        </Button>
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {/* @ts-ignore */}
        <ScenarioFlowEditor ref={scenarioRef} />
      </Box>
    </Box>
  );
} 