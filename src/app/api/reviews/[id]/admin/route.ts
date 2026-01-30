/**
 * Admin Review Delete API Route
 * 관리자 전용 후기 삭제 API - JWT 토큰 검증 포함
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { DatabaseManager } from '../../../../../features/reviews/infrastructure/database/DatabaseManager';
import { SqliteReviewRepository } from '../../../../../features/reviews/infrastructure/repositories/SqliteReviewRepository';
import { LocalImageRepository } from '../../../../../features/reviews/infrastructure/repositories/LocalImageRepository';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

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

// JWT 토큰 검증 헬퍼 함수
function verifyToken(request: NextRequest): { isValid: boolean; username?: string } {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return { isValid: false };
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
    return { isValid: true, username: decoded.username };
  } catch (error) {
    return { isValid: false };
  }
}

// DELETE: 관리자 권한으로 후기 삭제 (JWT 토큰 검증)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    
    // JWT 토큰 검증
    const { isValid, username } = verifyToken(request);
    
    if (!isValid) {
      return NextResponse.json(
        { error: '관리자 인증이 필요합니다.' },
        { status: 401 }
      );
    }
    
    const resolvedParams = await params;
    const success = await reviewRepository.delete(resolvedParams.id);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: `관리자 권한으로 후기가 삭제되었습니다. (${username})`
      });
    } else {
      return NextResponse.json(
        { error: '후기를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Admin delete review error:', error);
    return NextResponse.json(
      { error: '후기 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
