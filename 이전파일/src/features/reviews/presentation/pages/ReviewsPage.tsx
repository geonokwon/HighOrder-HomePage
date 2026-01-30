"use client";

/**
 * Reviews Page
 * 후기 페이지 - 의존성 주입 및 전체 조합
 */

import React, { use, useEffect } from 'react';
import { Review } from '../../domain/entities/Review';
import { ReviewPage } from '../components/ReviewPage';
import { ReviewApiService } from '../../infrastructure/services/ReviewApiService';
import { ReviewStats } from '../../application/usecases/GetReviews';

export function ReviewsPage() {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [stats, setStats] = React.useState<ReviewStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // 데이터 로딩
  const loadReviews = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await ReviewApiService.getAllReviews();
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '후기를 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 초기 데이터 로딩
  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleCreateReview = async (reviewData: any) => {
    try {
      // 실제로는 ReviewForm에서 직접 API를 호출하지만, 
      // 성공 후 목록을 새로고침
      await loadReviews();
    } catch (error) {
      console.error('Failed to refresh after create:', error);
    }
  };

  const handleDeleteReview = (id: string) => {
    // TODO: 실제 삭제 API 구현 필요
    setReviews(prev => prev.filter(review => review.id !== id));
  };

  const handleRefresh = () => {
    loadReviews();
  };

  // 리뷰 페이지에서는 NavBar가 최상단에 오도록 설정
  useEffect(() => {
    // CSS 변수를 0으로 설정해서 NavBar가 최상단에 오도록 함
    document.documentElement.style.setProperty('--banner-height', '0px');
    document.body.style.paddingTop = '64px'; // NavBar 높이만큼
    
    return () => {
      // 클린업: 컴포넌트 언마운트 시 원래대로 복원
      document.documentElement.style.removeProperty('--banner-height');
      document.body.style.paddingTop = '';
    };
  }, []);

  return (
    <ReviewPage
      reviews={reviews}
      stats={stats}
      loading={loading}
      error={error}
      onCreateReview={handleCreateReview}
      onDeleteReview={handleDeleteReview}
      onRefresh={handleRefresh}
    />
  );
}
