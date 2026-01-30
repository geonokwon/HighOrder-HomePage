/**
 * Delete Review Use Case
 * 후기 삭제 유즈케이스
 */

import { ReviewRepository } from '../../domain/repositories/ReviewRepository';

export class DeleteReviewUseCase {
  constructor(private reviewRepository: ReviewRepository) {}

  async execute(reviewId: string): Promise<{ success: boolean; message: string }> {
    try {
      // 1. 후기 존재 여부 확인
      const existingReview = await this.reviewRepository.findById(reviewId);
      if (!existingReview) {
        return {
          success: false,
          message: '존재하지 않는 후기입니다.'
        };
      }

      // 2. 후기 삭제 (소프트 삭제)
      const deleteResult = await this.reviewRepository.delete(reviewId);
      
      if (deleteResult) {
        return {
          success: true,
          message: '후기가 성공적으로 삭제되었습니다.'
        };
      } else {
        return {
          success: false,
          message: '후기 삭제 중 오류가 발생했습니다.'
        };
      }
    } catch (error) {
      console.error('Delete review failed:', error);
      return {
        success: false,
        message: '후기 삭제 중 오류가 발생했습니다. 다시 시도해주세요.'
      };
    }
  }

  /**
   * 여러 후기 일괄 삭제
   */
  async executeMultiple(reviewIds: string[]): Promise<{ success: boolean; deletedCount: number; failedCount: number }> {
    let deletedCount = 0;
    let failedCount = 0;

    for (const reviewId of reviewIds) {
      try {
        const result = await this.execute(reviewId);
        if (result.success) {
          deletedCount++;
        } else {
          failedCount++;
        }
      } catch (error) {
        console.error(`Failed to delete review ${reviewId}:`, error);
        failedCount++;
      }
    }

    return {
      success: failedCount === 0,
      deletedCount,
      failedCount
    };
  }
}
