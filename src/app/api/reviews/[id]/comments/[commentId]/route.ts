/**
 * Comment Update/Delete API Route
 * 댓글 수정/삭제 API 라우트 (관리자 전용)
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { DatabaseManager } from '../../../../../../features/reviews/infrastructure/database/DatabaseManager';
import { SqliteCommentRepository } from '../../../../../../features/reviews/infrastructure/repositories/SqliteCommentRepository';
import { UpdateComment } from '../../../../../../features/reviews/application/usecases/UpdateComment';
import { DeleteCommentUseCase } from '../../../../../../features/reviews/application/usecases/DeleteComment';

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

// PUT: 댓글 수정 (관리자 전용)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    await initializeDatabase();
    
    // JWT 토큰 검증 - 관리자만 수정 가능
    const { isValid, username } = verifyToken(request);
    
    if (!isValid) {
      return NextResponse.json(
        { error: '관리자 인증이 필요합니다.' },
        { status: 401 }
      );
    }
    
    // 요청 본문 파싱
    const body = await request.json();
    const { content } = body;
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: '댓글 내용을 입력해주세요.' },
        { status: 400 }
      );
    }
    
    // 의존성 주입
    const commentRepository = new SqliteCommentRepository();
    const updateCommentUseCase = new UpdateComment(commentRepository);
    
    const resolvedParams = await params;
    const updatedComment = await updateCommentUseCase.execute(
      resolvedParams.commentId,
      { content }
    );
    
    return NextResponse.json({
      success: true,
      comment: updatedComment,
      message: `댓글이 수정되었습니다. (${username})`
    });
  } catch (error) {
    console.error('Update comment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '댓글 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 댓글 삭제 (관리자 전용)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    await initializeDatabase();
    
    // JWT 토큰 검증 - 관리자만 삭제 가능
    const { isValid, username } = verifyToken(request);
    
    if (!isValid) {
      return NextResponse.json(
        { error: '관리자 인증이 필요합니다.' },
        { status: 401 }
      );
    }
    
    // 의존성 주입 - 함수 내부에서 생성
    const commentRepository = new SqliteCommentRepository();
    const deleteCommentUseCase = new DeleteCommentUseCase(commentRepository);
    
    const resolvedParams = await params;
    await deleteCommentUseCase.execute(resolvedParams.commentId, true);
    
    return NextResponse.json({
      success: true,
      message: `댓글이 삭제되었습니다. (${username})`
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '댓글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}






