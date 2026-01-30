import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const statsPath = path.join(process.cwd(), 'data', 'pdf-download-stats.json');

interface DownloadRecord {
  timestamp: number;
  userAgent: string;
  ip: string;
}

interface DownloadStats {
  totalDownloads: number;
  downloads: DownloadRecord[];
}

// PDF 다운로드 통계 가져오기
export async function GET() {
  try {
    if (!fs.existsSync(statsPath)) {
      const initialData: DownloadStats = {
        totalDownloads: 0,
        downloads: [],
      };
      fs.writeFileSync(statsPath, JSON.stringify(initialData, null, 2));
    }

    const fileContents = fs.readFileSync(statsPath, 'utf8');
    const stats: DownloadStats = JSON.parse(fileContents);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error reading PDF download stats:', error);
    return NextResponse.json(
      { totalDownloads: 0, downloads: [] },
      { status: 200 }
    );
  }
}

// PDF 다운로드 카운트 증가
export async function POST(request: NextRequest) {
  try {
    // 통계 파일 읽기
    let stats: DownloadStats;
    if (!fs.existsSync(statsPath)) {
      stats = {
        totalDownloads: 0,
        downloads: [],
      };
    } else {
      const fileContents = fs.readFileSync(statsPath, 'utf8');
      stats = JSON.parse(fileContents);
    }

    // 다운로드 정보 수집
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';

    const downloadRecord: DownloadRecord = {
      timestamp: Date.now(),
      userAgent,
      ip,
    };

    // 통계 업데이트
    stats.totalDownloads += 1;
    stats.downloads.unshift(downloadRecord); // 최신 순으로 추가

    // 최근 1000개만 유지 (성능 최적화)
    if (stats.downloads.length > 1000) {
      stats.downloads = stats.downloads.slice(0, 1000);
    }

    // 파일에 저장
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));

    return NextResponse.json({ 
      success: true, 
      totalDownloads: stats.totalDownloads 
    });
  } catch (error) {
    console.error('Error updating PDF download stats:', error);
    return NextResponse.json(
      { error: 'Failed to update download stats' },
      { status: 500 }
    );
  }
}

// 통계 초기화
export async function DELETE() {
  try {
    const initialData: DownloadStats = {
      totalDownloads: 0,
      downloads: [],
    };
    fs.writeFileSync(statsPath, JSON.stringify(initialData, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resetting PDF download stats:', error);
    return NextResponse.json(
      { error: 'Failed to reset download stats' },
      { status: 500 }
    );
  }
}
