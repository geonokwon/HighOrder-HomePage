/**
 * Review API Service
 * 후기 API 서비스 - 클라이언트와 서버 간 통신
 */

import { Review, CreateReviewData } from '../../domain/entities/Review';
import { ReviewStats } from '../../application/usecases/GetReviews';

export class ReviewApiService {
  
  /**
   * 모든 후기 조회
   */
  static async getAllReviews(): Promise<{ reviews: Review[]; stats: ReviewStats }> {
    const response = await fetch('/api/reviews');
    
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    
    const result = await response.json();
    return result.data;
  }

  /**
   * 새 후기 생성
   */
  static async createReview(data: CreateReviewData): Promise<Review> {
    const formData = new FormData();
    
    formData.append('userName', data.userName);

    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('category', data.category);
    formData.append('password', data.password);
    
    // 이미지 파일들 추가
    if (data.images) {
      data.images.forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await fetch('/api/reviews', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create review');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * 이미지 업로드 (별도 엔드포인트 사용 시)
   */
  static async uploadImages(files: File[], reviewId: string): Promise<string[]> {
    const formData = new FormData();
    
    formData.append('reviewId', reviewId);
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await fetch('/api/reviews/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload images');
    }

    const result = await response.json();
    return result.paths;
  }
}
