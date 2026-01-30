import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface TrackingData {
  source: string;
  medium?: string;
  timestamp: number;
  userAgent: string;
  referrer: string;
  ip?: string;
}

// 데이터 파일 경로 - 도커 볼륨 마운트 고려
const DATA_FILE_PATH = process.env.NODE_ENV === 'production' 
  ? '/app/data/analytics.json'  // 도커 환경
  : path.join(process.cwd(), 'data', 'analytics.json'); // 로컬 개발 환경

// 데이터 파일 읽기
async function loadTrackingData(): Promise<TrackingData[]> {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // 파일이 없으면 빈 배열 반환
    return [];
  }
}

// 데이터 파일 저장
async function saveTrackingData(data: TrackingData[]): Promise<void> {
  try {
    // data 디렉토리가 없으면 생성
    const dataDir = path.dirname(DATA_FILE_PATH);
    await fs.mkdir(dataDir, { recursive: true });
    
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('데이터 저장 오류:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: TrackingData = await request.json();
    
    // IP 주소 추가
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded ? forwarded.split(',')[0] : realIp || 'unknown';
    data.ip = ip;
    
    // 기존 데이터 로드
    const trackingData = await loadTrackingData();
    
    // 새 데이터 추가
    trackingData.push(data);
    
    // 최근 1000개만 유지
    if (trackingData.length > 1000) {
      trackingData.splice(0, trackingData.length - 1000);
    }
    
    // 파일에 저장
    await saveTrackingData(trackingData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save tracking data' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // 파일에서 데이터 로드
    const trackingData = await loadTrackingData();
    
    // 통계 계산
    const sourceStats: Record<string, number> = {};
    
    trackingData.forEach(item => {
      // 소스별 통계
      sourceStats[item.source] = (sourceStats[item.source] || 0) + 1;
    });
    
    const stats = {
      totalVisits: trackingData.length,
      sourceStats,
      recentVisits: trackingData
        .sort((a, b) => b.timestamp - a.timestamp) // 최신순 정렬
        .slice(0, 10), // 최근 10개
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get analytics data' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'clear-all') {
      // 전체 데이터 삭제
      await saveTrackingData([]);
      return NextResponse.json({ success: true, message: 'All data cleared' });
    } else {
      // 특정 데이터 삭제 (timestamp와 source로 식별)
      const timestamp = searchParams.get('timestamp');
      const source = searchParams.get('source');
      
      if (timestamp && source) {
        const trackingData = await loadTrackingData();
        const deleteIndex = trackingData.findIndex(item => 
          item.timestamp.toString() === timestamp && 
          item.source === source
        );
        
        if (deleteIndex >= 0) {
          trackingData.splice(deleteIndex, 1);
          await saveTrackingData(trackingData);
          return NextResponse.json({ success: true, message: 'Record deleted' });
        } else {
          return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }
      } else {
        return NextResponse.json({ error: 'Missing timestamp or source' }, { status: 400 });
      }
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}
