/**
 * Review Repository Interface
 * 후기 리포지토리 인터페이스 - Domain Layer에서 정의하는 추상화
 */

import { Review, CreateReviewData, UpdateReviewData } from '../entities/Review';

export interface ReviewRepository {
  /**
   * 모든 후기 조회
   */
  findAll(): Promise<Review[]>;

  /**
   * ID로 후기 조회
   */
  findById(id: string): Promise<Review | null>;

  /**
   * 카테고리별 후기 조회
   */
  findByCategory(category: string): Promise<Review[]>;

  /**
   * 새 후기 생성
   */
  create(data: CreateReviewData): Promise<Review>;

  /**
   * 후기 수정
   */
  update(id: string, data: UpdateReviewData): Promise<Review | null>;

  /**
   * 후기 삭제 (소프트 삭제)
   */
  delete(id: string): Promise<boolean>;



  /**
   * 카테고리별 후기 개수
   */
  getCountByCategory(): Promise<Record<string, number>>;
}
