import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  // 인증 확인
  const token = request.cookies.get('token');
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      console.error('No file in formData');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // 1단계: 파일 확장자 검증 (PDF만 허용)
    const lowercaseFileName = file.name.toLowerCase();
    if (!lowercaseFileName.endsWith('.pdf')) {
      console.error('Invalid file extension:', file.name);
      return NextResponse.json({ 
        error: 'Invalid file type. Only PDF files are allowed.',
        receivedType: file.type,
        fileName: file.name
      }, { status: 400 });
    }

    // 2단계: MIME 타입 검증
    const allowedMimeTypes = ['application/pdf'];
    if (file.type && !allowedMimeTypes.includes(file.type)) {
      console.error('Invalid MIME type:', file.type, file.name);
      return NextResponse.json({ 
        error: 'Invalid file type. Only PDF files are allowed.',
        receivedType: file.type,
        fileName: file.name
      }, { status: 400 });
    }

    // 3단계: 파일 내용 검증 (PDF 매직 넘버 확인)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileHeader = buffer.slice(0, 4).toString('utf-8');
    
    // PDF 파일은 %PDF- 로 시작해야 함
    if (!fileHeader.startsWith('%PDF')) {
      console.error('Invalid PDF file header:', fileHeader, file.name);
      return NextResponse.json({ 
        error: 'Invalid file. The file does not appear to be a valid PDF file.',
        fileName: file.name
      }, { status: 400 });
    }

    // 파일 크기 제한 (100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 100MB.' }, { status: 400 });
    }

    // 원본 파일명 사용 (보안을 위해 경로 문자 제거)
    const originalFileName = file.name;
    // 파일명에서 위험한 문자 제거 (경로 탐색 공격 방지)
    const sanitizedFileName = originalFileName
      .replace(/[\/\\]/g, '_')  // 슬래시, 백슬래시 제거
      .replace(/\.\./g, '_')    // 상위 디렉토리 탐색 방지
      .trim();
    
    if (!sanitizedFileName || sanitizedFileName !== originalFileName) {
      console.warn('File name sanitized:', originalFileName, '->', sanitizedFileName);
    }
    
    // 저장 경로 설정 (/public/PDF/)
    const uploadDir = join(process.cwd(), 'public', 'PDF');
    const filePath = join(uploadDir, sanitizedFileName);
    
    // 디렉토리 생성 (없으면)
    const { mkdir } = await import('fs/promises');
    await mkdir(uploadDir, { recursive: true });
    
    // 파일 저장 (이미 bytes와 buffer는 위에서 생성됨)
    await writeFile(filePath, buffer);
    
    // URL 반환 (상대 경로 사용)
    const fileUrl = `/PDF/${sanitizedFileName}`;
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      fileName: sanitizedFileName 
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // 인증 확인
  const token = request.cookies.get('token');
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { fileName } = await request.json();
    
    if (!fileName) {
      return NextResponse.json({ error: 'No filename provided' }, { status: 400 });
    }

    // 파일 경로 설정 (/public/PDF/)
    const uploadDir = join(process.cwd(), 'public', 'PDF');
    const filePath = join(uploadDir, fileName);
    
    // 파일 삭제
    await unlink(filePath);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
