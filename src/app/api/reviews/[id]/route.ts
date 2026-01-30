/**
 * Individual Review API Route
 * 개별 후기 API 라우트 - 삭제 기능
 */

import { NextRequest, NextResponse } from 'next/server';
import { DatabaseManager } from '../../../../features/reviews/infrastructure/database/DatabaseManager';
import { SqliteReviewRepository } from '../../../../features/reviews/infrastructure/repositories/SqliteReviewRepository';
import { LocalImageRepository } from '../../../../features/reviews/infrastructure/repositories/LocalImageRepository';

// 의존성 주입 설정
const imageRepository = new LocalImageRepository();
const reviewRepository = new SqliteReviewRepository(imageRepository);

// 데이터베이스 초기화
async function initializeDatabase() {
  const db = DatabaseManager.getInstance();
  if (!db.isConnected()) {
    await db.initialize();
  }
}

// DELETE: 비밀번호 검증 후 후기 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json(
        { error: '비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    const resolvedParams = await params;
    const success = await reviewRepository.deleteWithPassword(resolvedParams.id, password);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: '후기가 삭제되었습니다.'
      });
    } else {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않거나 후기를 찾을 수 없습니다.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: '후기 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
