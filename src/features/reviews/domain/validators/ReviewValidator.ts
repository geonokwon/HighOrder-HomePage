/**
 * Review Validation Logic
 * 후기 검증 로직 - Domain Layer의 비즈니스 규칙
 */

import { CreateReviewData, UpdateReviewData, REVIEW_CATEGORIES } from '../entities/Review';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class ReviewValidator {
  static validateCreateReview(data: CreateReviewData): ValidationResult {
    const errors: Record<string, string> = {};

    // 필수 필드 검증
    if (!data.userName?.trim()) {
      errors.userName = '작성자명을 입력해주세요';
    } else if (data.userName.length > 100) {
      errors.userName = '작성자명은 100자 이하로 입력해주세요';
    }



    if (!data.title?.trim()) {
      errors.title = '제목을 입력해주세요';
    } else if (data.title.length > 200) {
      errors.title = '제목은 200자 이하로 입력해주세요';
    }

    if (!data.content?.trim()) {
      errors.content = '내용을 입력해주세요';
    } else if (data.content.length > 2000) {
      errors.content = '내용은 2000자 이하로 입력해주세요';
    }

    if (!data.category || !REVIEW_CATEGORIES.includes(data.category as any)) {
      errors.category = '올바른 카테고리를 선택해주세요';
    }

    // 이미지 검증
    if (data.images && data.images.length > 0) {
      if (data.images.length > 4) {
        errors.images = '이미지는 최대 4개까지 업로드할 수 있습니다';
      }

      for (let i = 0; i < data.images.length; i++) {
        const file = data.images[i];
        
        // 파일 크기 검증 (5MB)
        if (file.size > 5 * 1024 * 1024) {
          errors.images = `이미지 파일 크기는 5MB 이하로 제한됩니다 (${file.name})`;
          break;
        }

        // 파일 타입 검증
        if (!file.type.startsWith('image/')) {
          errors.images = `이미지 파일만 업로드할 수 있습니다 (${file.name})`;
          break;
        }

        // 지원되는 이미지 형식 검증
        const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!supportedTypes.includes(file.type)) {
          errors.images = `지원되지 않는 이미지 형식입니다. JPG, PNG, GIF, WebP만 지원됩니다 (${file.name})`;
          break;
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validateUpdateReview(data: UpdateReviewData): ValidationResult {
    const errors: Record<string, string> = {};

    // 선택적 필드 검증


    if (data.title !== undefined) {
      if (!data.title.trim()) {
        errors.title = '제목을 입력해주세요';
      } else if (data.title.length > 200) {
        errors.title = '제목은 200자 이하로 입력해주세요';
      }
    }

    if (data.content !== undefined) {
      if (!data.content.trim()) {
        errors.content = '내용을 입력해주세요';
      } else if (data.content.length > 2000) {
        errors.content = '내용은 2000자 이하로 입력해주세요';
      }
    }

    if (data.category !== undefined && !REVIEW_CATEGORIES.includes(data.category as any)) {
      errors.category = '올바른 카테고리를 선택해주세요';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * 욕설 및 부적절한 내용 필터링
   */
  static validateContent(content: string): ValidationResult {
    const errors: Record<string, string> = {};
    
    // 기본적인 욕설 필터 (실제 프로덕션에서는 더 정교한 필터링 필요)
    const inappropriateWords = ['욕설1', '욕설2']; // 실제 욕설 목록으로 대체
    const containsInappropriate = inappropriateWords.some(word => 
      content.toLowerCase().includes(word.toLowerCase())
    );

    if (containsInappropriate) {
      errors.content = '부적절한 내용이 포함되어 있습니다';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
