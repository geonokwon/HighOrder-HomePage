import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // URL에서 파일명 가져오기
    const searchParams = request.nextUrl.searchParams;
    const fileName = searchParams.get('file');
    
    if (!fileName) {
      return new NextResponse('File name is required', { status: 400 });
    }

    // 보안을 위해 경로 검증 (경로 탐색 공격 방지)
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      return new NextResponse('Invalid file name', { status: 400 });
    }

    // PDF 파일 확장자 검증
    if (!fileName.toLowerCase().endsWith('.pdf')) {
      return new NextResponse('Only PDF files are allowed', { status: 400 });
    }

    // 파일 경로 구성
    const uploadDir = join(process.cwd(), 'public', 'PDF');
    const filePath = join(uploadDir, fileName);
    
    // 파일 존재 확인
    try {
      await fs.access(filePath);
    } catch {
      return new NextResponse('File not found', { status: 404 });
    }

    // 파일 읽기
    const fileBuffer = await fs.readFile(filePath);
    
    // 응답 생성 (Buffer를 Uint8Array로 변환)
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        'Cache-Control': 'public, max-age=0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    });
  } catch (error) {
    console.error('PDF download error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
