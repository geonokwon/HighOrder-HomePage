/**
 * Static File Serving API Route
 * 정적 파일 서빙용 API 라우트
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const filePath = resolvedParams.path.join('/');
    
    // 보안을 위해 경로 검증
    if (filePath.includes('..') || filePath.includes('~')) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // 파일 경로 구성
    const fullPath = join('/app/public/uploads', filePath);
    
    // 파일 존재 확인
    try {
      await fs.access(fullPath);
    } catch {
      return new NextResponse('File not found', { status: 404 });
    }

    // 파일 읽기
    const fileBuffer = await fs.readFile(fullPath);
    
    // MIME 타입 결정
    const ext = filePath.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
    }

    // Buffer를 Uint8Array로 변환하여 응답
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('File serving error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
