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
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 파일 확장자 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // 파일 크기 제한 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // 파일명 생성 (중복 방지)
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `popup_${timestamp}.${extension}`;
    
    // 저장 경로 설정
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'popups');
    const filePath = join(uploadDir, fileName);
    
    // 디렉토리 생성 (없으면)
    const { mkdir } = await import('fs/promises');
    await mkdir(uploadDir, { recursive: true });
    
    // 파일 저장
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // URL 반환 (상대 경로 사용)
    const fileUrl = `/uploads/popups/${fileName}`;
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      fileName: fileName 
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

    // 파일 경로 설정
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'popups');
    const filePath = join(uploadDir, fileName);
    
    // 파일 삭제
    await unlink(filePath);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}






