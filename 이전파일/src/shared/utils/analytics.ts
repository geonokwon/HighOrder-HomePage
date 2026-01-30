// URL 파라미터 추적 및 카운팅 유틸리티
interface TrackingData {
  source: string;
  medium?: string;
  campaign?: string;
  timestamp: number;
  userAgent: string;
  referrer: string;
}

// URL 파라미터에서 추적 정보 추출
export const extractTrackingParams = (url: string): Partial<TrackingData> => {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    
    // source 파라미터 우선순위: source > utm_source > direct
    let source = params.get('source') || params.get('utm_source');

    if (!source) {
      // 리퍼러에서 소스 추출 시도
      const referrer = document.referrer;
      if (referrer) {
        if (referrer.includes('naver.com')) source = 'naver';
        else if (referrer.includes('google.com')) source = 'google';
        else if (referrer.includes('facebook.com')) source = 'facebook';
        else if (referrer.includes('instagram.com')) source = 'instagram';
        else if (referrer.includes('kakao.com')) source = 'kakao';
        else source = 'referrer';
      } else {
        source = 'direct';
      }
    }
    
    return {
      source: source,
      medium: params.get('medium') || params.get('utm_medium') || undefined,
    };
  } catch (error) {
    console.error('URL 파라미터 파싱 오류:', error);
    return { source: 'direct' };
  }
};

// 서버에 추적 데이터 저장
export const saveTrackingData = async (data: TrackingData): Promise<void> => {
  try {
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save tracking data');
    }
  } catch (error) {
    console.error('추적 데이터 저장 오류:', error);
  }
};

// 서버에서 통계 데이터 가져오기
export const getTrackingData = async (): Promise<TrackingData[]> => {
  try {
    const response = await fetch('/api/analytics');
    if (!response.ok) {
      throw new Error('Failed to fetch analytics data');
    }
    const data = await response.json();
    return data.recentVisits || [];
  } catch (error) {
    console.error('통계 데이터 로드 오류:', error);
    return [];
  }
};

// 현재 방문 추적
export const trackCurrentVisit = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  const url = window.location.href;
  const urlObj = new URL(url);
  const params = urlObj.searchParams;

  // source 파라미터가 없으면 추적하지 않음
  if (!params.get('source') && !params.get('utm_source')) {
    return;
  }

  const trackingParams = extractTrackingParams(url);
  const referrer = document.referrer || 'direct';
  
  const trackingData: TrackingData = {
    source: trackingParams.source || 'direct',
    medium: trackingParams.medium,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    referrer: referrer,
  };
  
  await saveTrackingData(trackingData);
  
  // 콘솔에 로그 출력 (개발용)
  // console.log('방문 추적:', trackingData);
  // console.log('리퍼러 상세:', {
  //   fullReferrer: document.referrer,
  //   referrerDomain: referrer !== 'direct' ? new URL(referrer).hostname : 'direct',
  //   currentUrl: url,
  //   source: trackingParams.source
  // });

};

// 서버에서 전체 통계 가져오기
export const getAllStats = async () => {
  try {
    const response = await fetch('/api/analytics');
    if (!response.ok) {
      throw new Error('Failed to fetch analytics data');
    }
    return await response.json();
  } catch (error) {
    console.error('통계 데이터 로드 오류:', error);
    return {
      totalVisits: 0,
      sourceStats: {},
      recentVisits: [],
    };
  }
};


