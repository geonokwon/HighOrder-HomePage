/**
 * Comment Repository Interface
 * 댓글 리포지토리 인터페이스
 */

import { Comment, CreateCommentData } from '../entities/Comment';

export interface CommentRepository {
  /**
   * 특정 리뷰의 모든 댓글 조회
   */
  findByReviewId(reviewId: string): Promise<Comment[]>;

  /**
   * 댓글 ID로 댓글 조회
   */
  findById(id: string): Promise<Comment | null>;

  /**
   * 댓글 생성
   */
  create(data: CreateCommentData): Promise<Comment>;

  /**
   * 댓글 삭제 (소프트 삭제)
   */
  delete(id: string): Promise<void>;

  /**
   * 특정 리뷰의 댓글 수 조회
   */
  countByReviewId(reviewId: string): Promise<number>;
}

