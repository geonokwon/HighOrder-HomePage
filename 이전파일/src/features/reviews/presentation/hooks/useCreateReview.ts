"use client";

/**
 * Create Review Custom Hook
 * 후기 작성을 위한 커스텀 훅
 */

import { useState, useCallback } from 'react';
import { CreateReviewData, Review } from '../../domain/entities/Review';
import { CreateReviewUseCase } from '../../application/usecases/CreateReview';

interface UseCreateReviewResult {
  // State
  isSubmitting: boolean;
  errors: Record<string, string>;

  // Actions
  createReview: (data: CreateReviewData) => Promise<{ success: boolean; review?: Review }>;
  clearErrors: () => void;
}

interface UseCreateReviewOptions {
  createReviewUseCase: CreateReviewUseCase;
  onSuccess?: (review: Review) => void;
  onError?: (errors: Record<string, string>) => void;
}

export function useCreateReview({
  createReviewUseCase,
  onSuccess,
  onError
}: UseCreateReviewOptions): UseCreateReviewResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 후기 생성
  const createReview = useCallback(async (data: CreateReviewData) => {
    try {
      setIsSubmitting(true);
      setErrors({});

      const result = await createReviewUseCase.execute(data);

      if (result.success && result.review) {
        // 성공 처리
        onSuccess?.(result.review);
        return { success: true, review: result.review };
      } else {
        // 검증 오류 처리
        const errorMap = result.errors || {};
        setErrors(errorMap);
        onError?.(errorMap);
        return { success: false };
      }
    } catch (error) {
      // 시스템 오류 처리
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      const errorMap = { general: errorMessage };
      setErrors(errorMap);
      onError?.(errorMap);
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  }, [createReviewUseCase, onSuccess, onError]);

  // 에러 초기화
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    isSubmitting,
    errors,
    createReview,
    clearErrors
  };
}
