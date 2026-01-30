/**
 * Get Reviews Use Case
 * 후기 조회 유즈케이스
 */

import { Review } from '../../domain/entities/Review';
import { ReviewRepository } from '../../domain/repositories/ReviewRepository';

export interface ReviewStats {
  totalCount: number;
  categoryStats: Record<string, number>;
}

export class GetReviewsUseCase {
  constructor(private reviewRepository: ReviewRepository) {}

  /**
   * 모든 후기 조회
   */
  async getAllReviews(): Promise<Review[]> {
    try {
      return await this.reviewRepository.findAll();
    } catch (error) {
      console.error('Get all reviews failed:', error);
      throw new Error('후기 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }

  /**
   * 특정 후기 조회
   */
  async getReviewById(id: string): Promise<Review | null> {
    try {
      return await this.reviewRepository.findById(id);
    } catch (error) {
      console.error('Get review by id failed:', error);
      throw new Error('후기를 불러오는 중 오류가 발생했습니다.');
    }
  }

  /**
   * 카테고리별 후기 조회
   */
  async getReviewsByCategory(category: string): Promise<Review[]> {
    try {
      return await this.reviewRepository.findByCategory(category);
    } catch (error) {
      console.error('Get reviews by category failed:', error);
      throw new Error('카테고리별 후기를 불러오는 중 오류가 발생했습니다.');
    }
  }

  /**
   * 후기 통계 조회
   */
  async getReviewStats(): Promise<ReviewStats> {
    try {
      const [reviews, categoryStats] = await Promise.all([
        this.reviewRepository.findAll(),
        this.reviewRepository.getCountByCategory()
      ]);

      const totalCount = reviews.length;

      return {
        totalCount,
        categoryStats
      };
    } catch (error) {
      console.error('Get review stats failed:', error);
      throw new Error('후기 통계를 불러오는 중 오류가 발생했습니다.');
    }
  }



  /**
   * 최신 후기 조회 (제한된 개수)
   */
  async getLatestReviews(limit: number = 10): Promise<Review[]> {
    try {
      const allReviews = await this.reviewRepository.findAll();
      return allReviews.slice(0, limit);
    } catch (error) {
      console.error('Get latest reviews failed:', error);
      throw new Error('최신 후기를 불러오는 중 오류가 발생했습니다.');
    }
  }
}
