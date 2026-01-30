/**
 * Review Image Upload API Route
 * 후기 이미지 업로드 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    const reviewId = formData.get('reviewId') as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedPaths: string[] = [];
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'reviews', reviewId);

    // 디렉토리 생성
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // 디렉토리가 이미 존재하는 경우 무시
    }

    for (const file of files) {
      if (file.size === 0) continue;

      // 파일 검증
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}` }, 
          { status: 400 }
        );
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        return NextResponse.json(
          { error: `File too large: ${file.name}` }, 
          { status: 400 }
        );
      }

      // 고유한 파일명 생성
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = join(uploadDir, fileName);
      const webPath = `/uploads/reviews/${reviewId}/${fileName}`;

      // 파일 저장
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      uploadedPaths.push(webPath);
    }

    return NextResponse.json({ 
      success: true, 
      paths: uploadedPaths 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' }, 
      { status: 500 }
    );
  }
}
