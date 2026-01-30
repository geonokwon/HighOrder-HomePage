/**
 * Create Review Use Case
 * 후기 생성 유즈케이스
 */

import { Review, CreateReviewData } from '../../domain/entities/Review';
import { ReviewRepository } from '../../domain/repositories/ReviewRepository';
import { ReviewValidator, ValidationResult } from '../../domain/validators/ReviewValidator';

export class CreateReviewUseCase {
  constructor(private reviewRepository: ReviewRepository) {}

  async execute(data: CreateReviewData): Promise<{ success: boolean; review?: Review; errors?: Record<string, string> }> {
    try {
      // 1. 입력 데이터 검증
      const validation = ReviewValidator.validateCreateReview(data);
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      // 2. 내용 검증 (욕설 필터링 등)
      const contentValidation = ReviewValidator.validateContent(data.content);
      if (!contentValidation.isValid) {
        return {
          success: false,
          errors: contentValidation.errors
        };
      }

      // 3. 후기 생성
      const review = await this.reviewRepository.create(data);

      return {
        success: true,
        review
      };
    } catch (error) {
      console.error('Create review failed:', error);
      return {
        success: false,
        errors: { general: '후기 작성 중 오류가 발생했습니다. 다시 시도해주세요.' }
      };
    }
  }
}
