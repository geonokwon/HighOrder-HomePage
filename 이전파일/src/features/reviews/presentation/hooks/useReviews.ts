"use client";

/**
 * Reviews Custom Hook
 * 후기 관련 상태 관리 및 로직을 위한 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { Review } from '../../domain/entities/Review';
import { GetReviewsUseCase, ReviewStats } from '../../application/usecases/GetReviews';
import { CreateReviewUseCase } from '../../application/usecases/CreateReview';
import { DeleteReviewUseCase } from '../../application/usecases/DeleteReview';

interface UseReviewsResult {
  // State
  reviews: Review[];
  stats: ReviewStats | null;
  loading: boolean;
  error: string | null;

  // Actions
  refreshReviews: () => Promise<void>;
  getReviewsByCategory: (category: string) => Promise<Review[]>;
  getReviewById: (id: string) => Promise<Review | null>;
  deleteReview: (id: string) => Promise<{ success: boolean; message: string }>;
}

interface UseReviewsOptions {
  getReviewsUseCase: GetReviewsUseCase;
  createReviewUseCase: CreateReviewUseCase;
  deleteReviewUseCase: DeleteReviewUseCase;
}

export function useReviews({
  getReviewsUseCase,
  createReviewUseCase,
  deleteReviewUseCase
}: UseReviewsOptions): UseReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 후기 목록 새로고침
  const refreshReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [reviewsData, statsData] = await Promise.all([
        getReviewsUseCase.getAllReviews(),
        getReviewsUseCase.getReviewStats()
      ]);
      
      setReviews(reviewsData);
      setStats(statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('Failed to refresh reviews:', err);
    } finally {
      setLoading(false);
    }
  }, []); // 의존성 배열을 비워서 무한 루프 방지

  // 카테고리별 후기 조회
  const getReviewsByCategory = useCallback(async (category: string): Promise<Review[]> => {
    try {
      return await getReviewsUseCase.getReviewsByCategory(category);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '카테고리별 후기 조회에 실패했습니다.';
      setError(errorMessage);
      throw err;
    }
  }, []); // 의존성 배열을 비워서 무한 루프 방지

  // 특정 후기 조회
  const getReviewById = useCallback(async (id: string): Promise<Review | null> => {
    try {
      return await getReviewsUseCase.getReviewById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '후기 조회에 실패했습니다.';
      setError(errorMessage);
      throw err;
    }
  }, []); // 의존성 배열을 비워서 무한 루프 방지

  // 후기 삭제
  const deleteReview = useCallback(async (id: string) => {
    try {
      const result = await deleteReviewUseCase.execute(id);
      
      if (result.success) {
        // 성공시 목록에서 제거
        setReviews(prev => prev.filter(review => review.id !== id));
        // 통계 업데이트
        await refreshReviews();
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '후기 삭제에 실패했습니다.';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  }, []); // 의존성 배열을 비워서 무한 루프 방지

  // 초기 데이터 로드
  useEffect(() => {
    refreshReviews();
  }, [refreshReviews]);

  return {
    reviews,
    stats,
    loading,
    error,
    refreshReviews,
    getReviewsByCategory,
    getReviewById,
    deleteReview
  };
}
