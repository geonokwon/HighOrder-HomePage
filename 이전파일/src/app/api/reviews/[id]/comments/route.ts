/**
 * Comments API Route
 * 댓글 API 라우트 - 조회 및 생성
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { DatabaseManager } from '../../../../../features/reviews/infrastructure/database/DatabaseManager';
import { SqliteCommentRepository } from '../../../../../features/reviews/infrastructure/repositories/SqliteCommentRepository';
import { CreateCommentUseCase } from '../../../../../features/reviews/application/usecases/CreateComment';
import { GetCommentsUseCase } from '../../../../../features/reviews/application/usecases/GetComments';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

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

// GET: 특정 리뷰의 댓글 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    
    // 의존성 주입 - 함수 내부에서 생성
    const commentRepository = new SqliteCommentRepository();
    const getCommentsUseCase = new GetCommentsUseCase(commentRepository);
    
    const resolvedParams = await params;
    const result = await getCommentsUseCase.execute(resolvedParams.id);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '댓글 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 댓글 생성 (관리자 전용)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    
    // JWT 토큰 검증 - 관리자만 댓글 작성 가능
    const { isValid, username } = verifyToken(request);
    
    if (!isValid) {
      return NextResponse.json(
        { error: '관리자 인증이 필요합니다.' },
        { status: 401 }
      );
    }
    
    const resolvedParams = await params;
    const { content } = await request.json();
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: '댓글 내용을 입력해주세요.' },
        { status: 400 }
      );
    }
    
    // 의존성 주입 - 함수 내부에서 생성
    const commentRepository = new SqliteCommentRepository();
    const createCommentUseCase = new CreateCommentUseCase(commentRepository);
    
    const comment = await createCommentUseCase.execute({
      reviewId: resolvedParams.id,
      authorName: 'KT지니원',
      authorRole: 'admin',
      content
    });
    
    return NextResponse.json({
      success: true,
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '댓글 작성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

