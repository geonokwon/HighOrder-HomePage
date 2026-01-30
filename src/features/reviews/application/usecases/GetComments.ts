/**
 * Get Comments Use Case
 * 댓글 조회 유즈케이스
 */

import { Comment } from '../../domain/entities/Comment';
import { CommentRepository } from '../../domain/repositories/CommentRepository';

export interface CommentsResult {
  comments: Comment[];
  total: number;
}

export class GetCommentsUseCase {
  constructor(private commentRepository: CommentRepository) {}

  /**
   * 특정 리뷰의 모든 댓글 조회
   * @param reviewId 리뷰 ID
   * @returns 댓글 목록 및 총 개수
   */
  async execute(reviewId: string): Promise<CommentsResult> {
    // 1. 리뷰 ID 검증
    if (!reviewId || reviewId.trim().length === 0) {
      throw new Error('리뷰 ID가 필요합니다.');
    }

    // 2. 댓글 조회 (에러 발생 시 그대로 전달)
    const comments = await this.commentRepository.findByReviewId(reviewId);
    const total = await this.commentRepository.countByReviewId(reviewId);

    return {
      comments,
      total
    };
  }
}






