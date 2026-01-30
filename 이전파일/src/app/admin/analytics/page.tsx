'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllStats, getTrackingData } from '@/shared/utils/analytics';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  Fade,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

interface TrackingData {
  source: string;
  medium?: string;
  timestamp: number;
  userAgent: string;
  referrer: string;
}

interface Stats {
  totalVisits: number;
  sourceStats: Record<string, number>;
  recentVisits: TrackingData[];
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [rawData, setRawData] = useState<TrackingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [popups, setPopups] = useState<Array<{
    id: string;
    order: number;
    enabled: boolean;
    imageUrl: string | null;
    buttonUrl?: string | null;
    name?: string;
  }>>([]);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [expandedPopups, setExpandedPopups] = useState<Set<string>>(new Set());


  // 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-auth');
        const data = await response.json();
        if (response.ok && data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // 로그인 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // 에러 상태 초기화
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      setIsAuthenticated(true);
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setStats(null);
      setRawData([]);
      // 페이지 새로고침으로 완전히 초기화
      window.location.reload();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  // 팝업 설정 로드
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadPopupSettings = async () => {
      try {
        const response = await fetch('/api/popup-settings');
        if (response.ok) {
          const settings = await response.json();
          // 이전 버전 호환성
          if (settings.popups && Array.isArray(settings.popups)) {
            setPopups(settings.popups.sort((a: any, b: any) => a.order - b.order));
          } else if (settings.enabled !== undefined || settings.imageUrl !== undefined) {
            // 이전 단일 팝업 형식
            setPopups([{
              id: 'popup-1',
              order: 0,
              enabled: settings.enabled || false,
              imageUrl: settings.imageUrl || null,
              name: '팝업 1'
            }]);
          }
        }
      } catch (error) {
        console.error('팝업 설정 로드 오류:', error);
      }
    };

    loadPopupSettings();
  }, [isAuthenticated]);

  // 통계 로드
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadStats = async () => {
      try {
        setLoading(true);
        const allStats = await getAllStats();
        const data = await getTrackingData();
        setStats(allStats as Stats);
        setRawData(data);
      } catch (error) {
        console.error('통계 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [isAuthenticated]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ko-KR');
  };

  // 필터링된 방문 기록
  const filteredVisits = stats?.recentVisits
    .filter(visit => selectedSource === 'all' || visit.source === selectedSource)
    .sort((a, b) => b.timestamp - a.timestamp) || [];

  // 사용 가능한 소스 목록
  const availableSources = stats ? ['all', ...Object.keys(stats.sourceStats)] : ['all'];

  // 개별 기록 삭제
  const handleDeleteRecord = async (filteredIndex: number) => {
    if (!confirm('이 기록을 삭제하시겠습니까?')) return;
    
    if (!stats) {
      alert('통계 데이터를 불러올 수 없습니다.');
      return;
    }
  
    try {
      // 필터링된 데이터에서 삭제할 항목 가져오기
      const visitToDelete = filteredVisits[filteredIndex];
      
      console.log('삭제할 데이터:', visitToDelete);
      
      const response = await fetch(`/api/analytics?action=delete&timestamp=${visitToDelete.timestamp}&source=${visitToDelete.source}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // 통계 다시 로드
        const allStats = await getAllStats();
        const data = await getTrackingData();
        setStats(allStats as Stats);
        setRawData(data);
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 오류:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 전체 데이터 삭제
  const handleClearAllData = async () => {
    if (!confirm('모든 방문 기록을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) return;
    
    try {
      const response = await fetch('/api/analytics?action=clear-all', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // 통계 다시 로드
        const allStats = await getAllStats();
        const data = await getTrackingData();
        setStats(allStats as Stats);
        setRawData(data);
        alert('모든 데이터가 삭제되었습니다.');
      } else {
        alert('전체 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('전체 삭제 오류:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 팝업 추가
  const handleAddPopup = () => {
    const newPopup = {
      id: `popup-${Date.now()}`,
      order: popups.length,
      enabled: false,
      imageUrl: null,
      buttonUrl: null,
      name: `팝업 ${popups.length + 1}`,
    };
    const updatedPopups = [...popups, newPopup];
    setPopups(updatedPopups);
    saveAllPopups(updatedPopups);
  };

  // URL에서 파일명 추출
  const getFileNameFromUrl = (url: string | null): string | null => {
    if (!url) return null;
    // /uploads/popups/popup_1234567890.png 형식에서 파일명 추출
    const match = url.match(/\/uploads\/popups\/(.+)$/);
    return match ? match[1] : null;
  };

  // 파일 삭제
  const deleteImageFile = async (imageUrl: string | null) => {
    if (!imageUrl) return;
    
    const fileName = getFileNameFromUrl(imageUrl);
    if (!fileName) return;

    try {
      const response = await fetch('/api/popup-upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
      });

      if (!response.ok) {
        console.error('파일 삭제 실패:', fileName);
      }
    } catch (error) {
      console.error('파일 삭제 오류:', error);
    }
  };

  // 팝업 삭제
  const handleDeletePopup = async (id: string) => {
    if (!confirm('이 팝업을 삭제하시겠습니까?')) return;
    
    // 삭제할 팝업 찾기
    const popupToDelete = popups.find(p => p.id === id);
    
    // 이미지 파일 삭제
    if (popupToDelete?.imageUrl) {
      await deleteImageFile(popupToDelete.imageUrl);
    }
    
    const updatedPopups = popups
      .filter(p => p.id !== id)
      .map((p, index) => ({ ...p, order: index }));
    setPopups(updatedPopups);
    await saveAllPopups(updatedPopups);
  };

  // 이미지 업로드
  const handleImageUpload = async (popupId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [popupId]: true }));
    try {
      // 기존 이미지가 있으면 삭제
      const existingPopup = popups.find(p => p.id === popupId);
      if (existingPopup?.imageUrl) {
        await deleteImageFile(existingPopup.imageUrl);
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/popup-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('업로드 실패');
      }

      const data = await response.json();
      const updatedPopups = popups.map(p => 
        p.id === popupId ? { ...p, imageUrl: data.url } : p
      );
      setPopups(updatedPopups);
      await saveAllPopups(updatedPopups);
      alert('이미지가 업로드되었습니다.');
    } catch (error) {
      console.error('업로드 오류:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(prev => ({ ...prev, [popupId]: false }));
      // input 초기화
      e.target.value = '';
    }
  };

  // 팝업 설정 저장
  const saveAllPopups = async (popupsToSave: typeof popups) => {
    try {
      const response = await fetch('/api/popup-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ popups: popupsToSave }),
      });

      if (!response.ok) {
        throw new Error('설정 저장 실패');
      }
    } catch (error) {
      console.error('설정 저장 오류:', error);
      alert('설정 저장에 실패했습니다.');
    }
  };

  // 토글 변경
  const handleToggleChange = async (popupId: string, enabled: boolean) => {
    const updatedPopups = popups.map(p => 
      p.id === popupId ? { ...p, enabled } : p
    );
    setPopups(updatedPopups);
    await saveAllPopups(updatedPopups);
  };

  // 이미지 삭제
  const handleImageDelete = async (popupId: string) => {
    if (!confirm('이미지를 삭제하시겠습니까?')) return;

    // 삭제할 이미지 찾기
    const popup = popups.find(p => p.id === popupId);
    
    // 이미지 파일 삭제
    if (popup?.imageUrl) {
      await deleteImageFile(popup.imageUrl);
    }

    const updatedPopups = popups.map(p => 
      p.id === popupId ? { ...p, imageUrl: null, enabled: false } : p
    );
    setPopups(updatedPopups);
    await saveAllPopups(updatedPopups);
    alert('이미지가 삭제되었습니다.');
  };

  // 순서 변경
  const handleOrderChange = async (popupId: string, direction: 'up' | 'down') => {
    const index = popups.findIndex(p => p.id === popupId);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= popups.length) return;

    const updatedPopups = [...popups];
    [updatedPopups[index], updatedPopups[newIndex]] = [
      { ...updatedPopups[newIndex], order: index },
      { ...updatedPopups[index], order: newIndex }
    ];
    
    setPopups(updatedPopups);
    await saveAllPopups(updatedPopups);
  };

  // 이름 변경
  const handleNameChange = async (popupId: string, name: string) => {
    const updatedPopups = popups.map(p => 
      p.id === popupId ? { ...p, name } : p
    );
    setPopups(updatedPopups);
    await saveAllPopups(updatedPopups);
  };

  // 아코디언 토글
  const togglePopup = (popupId: string) => {
    setExpandedPopups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(popupId)) {
        newSet.delete(popupId);
      } else {
        newSet.add(popupId);
      }
      return newSet;
    });
  };

  // 로그인 폼
  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'linear-gradient(135deg, #e0e7ff 0%, #f5f5f5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Fade in>
          <Paper
            elevation={8}
            sx={{
              p: 5,
              width: '100%',
              maxWidth: 380,
              borderRadius: 4,
              backdropFilter: 'blur(8px)',
              background: 'rgba(255,255,255,0.85)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                bgcolor: '#1976d2',
                width: 64,
                height: 64,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
                boxShadow: 2,
              }}
            >
              <LockOutlinedIcon sx={{ color: '#fff', fontSize: 36 }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="#222" gutterBottom>
              Analytics Login
            </Typography>
            {error && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            )}
            <form onSubmit={handleLogin} style={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                margin="normal"
                required
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: 18,
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, #1976d2 0%, #5c6bc0 100%)',
                  boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.12)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #1565c0 0%, #3949ab 100%)',
                    boxShadow: '0 4px 16px 0 rgba(25, 118, 210, 0.18)',
                  },
                }}
              >
                Login
              </Button>
            </form>
          </Paper>
        </Fade>
      </Box>
    );
  }

  if (loading) {
    return <div className="p-8 text-center">로딩 중...</div>;
  }

  if (!stats) {
    return <div className="p-8 text-center">통계 데이터를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">방문 통계</h1>
          <div className="flex gap-2">
            <button
              onClick={() => window.open('/reviews', '_blank')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔍 후기 관리
            </button>
            <button
              onClick={handleClearAllData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              전체 삭제
            </button>
            <button
              onClick={async () => {
                await fetch('/api/logout', { method: 'POST' });
                setIsAuthenticated(false);
                setStats(null);
                setRawData([]);
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* 커스텀 팝업 설정 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">팝업 관리</h2>
            <button
              onClick={handleAddPopup}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              + 팝업 추가
            </button>
          </div>
          
          {popups.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>등록된 팝업이 없습니다. 팝업을 추가해주세요.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {popups.map((popup, index) => {
                const isExpanded = expandedPopups.has(popup.id);
                return (
                  <div key={popup.id} className="border rounded-lg bg-gray-50 overflow-hidden">
                    {/* 헤더 - 항상 표시 */}
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => togglePopup(popup.id)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-sm font-medium text-gray-500">
                          #{index + 1}
                        </span>
                        <input
                          type="text"
                          value={popup.name || `팝업 ${index + 1}`}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleNameChange(popup.id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-1 border border-gray-300 rounded text-sm font-medium flex-1 max-w-xs"
                          placeholder="팝업 이름"
                        />
                        <div className="flex items-center gap-2">
                          {popup.enabled && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              활성화
                            </span>
                          )}
                          {popup.imageUrl && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              이미지 있음
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOrderChange(popup.id, 'up');
                            }}
                            disabled={index === 0}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="위로 이동"
                          >
                            ↑
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOrderChange(popup.id, 'down');
                            }}
                            disabled={index === popups.length - 1}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="아래로 이동"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePopup(popup.id);
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        삭제
                      </button>
                    </div>

                    {/* 상세 설정 - 펼쳐졌을 때만 표시 */}
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-4 border-t border-gray-200 pt-4">
                        {/* 토글 */}
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">
                            팝업 활성화
                          </label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={popup.enabled}
                              onChange={(e) => handleToggleChange(popup.id, e.target.checked)}
                              className="sr-only peer"
                              disabled={!popup.imageUrl}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
                          </label>
                        </div>

                        {/* 이미지 업로드 */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            팝업 이미지
                          </label>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(popup.id, e)}
                                disabled={uploading[popup.id]}
                                className="hidden"
                              />
                              {uploading[popup.id] ? '업로드 중...' : '이미지 업로드'}
                            </label>
                            {popup.imageUrl && (
                              <>
                                <button
                                  onClick={() => handleImageDelete(popup.id)}
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  이미지 삭제
                                </button>
                                <span className="text-sm text-gray-600">
                                  이미지가 설정되었습니다
                                </span>
                              </>
                            )}
                          </div>
                          {popup.imageUrl && (
                            <div className="mt-4 border rounded-lg p-4 bg-white">
                              <img
                                src={popup.imageUrl}
                                alt={`${popup.name} 미리보기`}
                                className="max-w-full h-auto max-h-64 mx-auto rounded"
                              />
                            </div>
                          )}
                          {!popup.imageUrl && (
                            <p className="text-sm text-gray-500">
                              이미지를 업로드하면 토글을 활성화할 수 있습니다.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* 전체 통계 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">전체 통계</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalVisits}</div>
              <div className="text-sm text-gray-600">총 방문 수</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{Object.keys(stats.sourceStats).length}</div>
              <div className="text-sm text-gray-600">유입 소스 수</div>
            </div>
          </div>
        </div>

        {/* 소스별 통계 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">유입 소스별 통계</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">소스</th>
                  <th className="px-4 py-2 text-left">방문 수</th>
                  <th className="px-4 py-2 text-left">비율</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.sourceStats)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .map(([source, count]) => (
                    <tr key={source} className="border-b">
                      <td className="px-4 py-2 font-medium">{source}</td>
                      <td className="px-4 py-2">{count}</td>
                      <td className="px-4 py-2 text-gray-600">
                        {((count / stats.totalVisits) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 최근 방문 기록 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">최근 방문 기록</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">소스 필터:</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableSources.map(source => (
                  <option key={source} value={source}>
                    {source === 'all' ? '전체' : source}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">시간</th>
                  <th className="px-4 py-2 text-left">소스</th>
                  <th className="px-4 py-2 text-left">리퍼러</th>
                  <th className="px-4 py-2 text-left">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.map((visit: TrackingData, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2 text-sm">{formatDate(visit.timestamp)}</td>
                    <td className="px-4 py-2 font-medium">{visit.source}</td>
                    <td className="px-4 py-2 text-sm text-gray-600 max-w-xs truncate">
                      {visit.referrer}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteRecord(index)}
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
