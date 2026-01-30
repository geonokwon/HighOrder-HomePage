/**
 * Delete Comment Use Case
 * 댓글 삭제 유즈케이스
 */

import { CommentRepository } from '../../domain/repositories/CommentRepository';

export class DeleteCommentUseCase {
  constructor(private commentRepository: CommentRepository) {}

  /**
   * 댓글 삭제 (소프트 삭제)
   * @param commentId 댓글 ID
   * @param isAdmin 관리자 여부
   * @throws 권한 없음 또는 삭제 실패 시 에러
   */
  async execute(commentId: string, isAdmin: boolean = false): Promise<void> {
    try {
      // 1. 댓글 ID 검증
      if (!commentId || commentId.trim().length === 0) {
        throw new Error('댓글 ID가 필요합니다.');
      }

      // 2. 댓글 존재 여부 확인
      const comment = await this.commentRepository.findById(commentId);
      if (!comment) {
        throw new Error('댓글을 찾을 수 없습니다.');
      }

      // 3. 권한 확인 (관리자만 삭제 가능)
      if (!isAdmin) {
        throw new Error('댓글 삭제 권한이 없습니다.');
      }

      // 4. 댓글 삭제
      await this.commentRepository.delete(commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('댓글 삭제 중 오류가 발생했습니다.');
    }
  }
}

