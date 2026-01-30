"use client";

/**
 * Review Page Component
 * 후기 페이지 메인 컴포넌트 - Clean Architecture 적용
 */

import React, { useState } from 'react';
import { Review } from '../../domain/entities/Review';
import { ReviewStats } from '../../application/usecases/GetReviews';
import { ReviewForm } from '../components/ReviewForm';
import { ReviewCard } from '../components/ReviewCard';
import { CategoryStats } from '../components/CategoryStats';
import { useAuth } from '../../../../shared/contexts/AuthContext';


// UI components
import { Button } from '../../../../shared/components/ui/button';
import { Card, CardContent } from '../../../../shared/components/ui/card';
import { SimpleSelect, SimpleSelectItem } from '../../../../shared/components/ui/simple-select';
import { REVIEW_CATEGORIES } from '../../domain/entities/Review';

interface ReviewPageProps {
  reviews: Review[];
  stats: ReviewStats | null;
  loading: boolean;
  error: string | null;
  onCreateReview: (review: Review) => void;
  onDeleteReview: (id: string) => void;
  onRefresh: () => void;
}

export function ReviewPage({
  reviews,
  stats,
  loading,
  error,
  onCreateReview,
  onDeleteReview,
  onRefresh
}: ReviewPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { user, isAdmin, checkAuth } = useAuth();

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      // 인증 상태 새로고침
      checkAuth();
      
      // 페이지 새로고침으로 완전히 초기화
      window.location.reload();
    } catch (error) {
      console.error('로그아웃 오류:', error);
      // 에러가 발생해도 페이지 새로고침으로 로그아웃 효과
      window.location.reload();
    }
  };


  const handleAddReview = async (newReview: Review) => {
    // 로컬 상태에 즉시 추가
    setLocalReviews(prev => [newReview, ...prev]);
    
    // 부모 컴포넌트에 알려서 전체 리뷰 리스트 새로고침
    await onCreateReview(newReview);
    
    // 폼 닫기
    setShowForm(false);
  };

  // reviews prop이 변경되면 로컬 상태 업데이트
  React.useEffect(() => {
    setLocalReviews(reviews);
  }, [reviews]);

  // 카테고리별로 필터링된 후기
  const filteredReviews = React.useMemo(() => {
    if (!selectedCategory || selectedCategory === '') {
      return localReviews;
    }
    return localReviews.filter(review => review.category === selectedCategory);
  }, [localReviews, selectedCategory]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredReviews.slice(startIndex, endIndex);
  }, [filteredReviews, currentPage, itemsPerPage]);

  // 카테고리나 리뷰 변경 시 첫 페이지로 이동
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, localReviews]);

  // 카테고리별 통계
  const categoryStats = React.useMemo(() => {
    return localReviews.reduce((acc, review) => {
      acc[review.category] = (acc[review.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [localReviews]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">후기를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center max-w-md">
          <CardContent>
            <div className="text-red-500 mb-4">오류가 발생했습니다</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={onRefresh} variant="outline">
              다시 시도
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 pb-24 isolate">
      {/* Header */}
      <div className="space-y-4">
        {/* 제목 */}
        <div className="text-center lg:text-left">
          <h2 className="text-2xl md:text-4xl font-black leading-tight">
            <span className="text-[#2E3946]">한 달 사용한 고객들의 </span>
            <span className="text-[#008AA7]">리얼 찐 후기</span>
            <span className="text-[#2E3946]"> 만나보세요!</span>
          </h2>
          <p className="text-sm md:text-lg text-gray-500 mt-2">
            (KT지니원은 100% 리얼 후기 약속드립니다)
          </p>
        </div>
        
        {/* 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-end">
          <div className="flex gap-2 justify-center sm:justify-start">
            <Button onClick={onRefresh} variant="outline" className="flex-1 sm:flex-none">
              새로고침
            </Button>
            <Button onClick={() => setShowForm(true)} variant="outline" className="gap-2 flex-1 sm:flex-none">
              <span>+</span>
              후기 작성
            </Button>
          </div>
          
          {/* 관리자 상태 표시 */}
          {isAdmin && (
            <div className="flex flex-col sm:flex-row items-center gap-2 justify-center">
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium flex items-center justify-center">
                👨‍💼 관리자 ({user?.username})
              </span>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 w-full sm:w-auto"
              >
                로그아웃
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Category Statistics */}
      <CategoryStats 
        categoryStats={categoryStats} 
        totalCount={localReviews.length}
        reviews={localReviews}
      />

      {/* Category Filter */}
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-sm font-medium text-gray-700">카테고리 필터:</span>
        <SimpleSelect 
          value={selectedCategory || "all"} 
          onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
          placeholder="카테고리를 선택하세요"
          className="w-full sm:w-80"
        >
          <SimpleSelectItem value="all">
            <div className="flex items-center gap-2">
              <span>📝</span>
              <span>전체 보기</span>
            </div>
          </SimpleSelectItem>
          {REVIEW_CATEGORIES.map((category) => {
            const categoryEmojis: Record<string, string> = {
              '매출이 늘었어요!': '💰',
              '인건비가 절약됐어요': '💵',
              '사후관리가 좋아요': '🛠️',
              '주문 실수가 줄었어요': '✅',
              '고객 응대가 편해졌어요': '😊',
              '디자인이 고급스러워요': '💎'
            };
            const emoji = categoryEmojis[category] || '📝';
            const count = categoryStats[category] || 0;
            return (
              <SimpleSelectItem key={category} value={category}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span>{emoji}</span>
                    <span>"{category}"</span>
                  </div>
                  <span className="text-cyan-600 font-semibold ml-2">
                    ({count})
                  </span>
                </div>
              </SimpleSelectItem>
            );
          })}
        </SimpleSelect>
      </div>



      {/* Reviews List */}
      <div className="space-y-4">
        {localReviews.length === 0 ? (
          <Card className="p-12 text-center">
            <CardContent>
              <div className="text-gray-500 mb-4">
                아직 작성된 후기가 없습니다
              </div>
              <Button onClick={() => setShowForm(true)}>
                첫 번째 후기 작성하기
              </Button>
            </CardContent>
          </Card>
        ) : filteredReviews.length === 0 ? (
          <Card className="p-12 text-center">
            <CardContent>
              <div className="text-gray-500 mb-4">
                선택한 카테고리에 후기가 없습니다
              </div>
              <Button 
                onClick={() => setSelectedCategory(null)}
                variant="outline"
              >
                전체 보기
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* 페이지네이션 정보 */}
            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <span>
                전체 {filteredReviews.length}개 중 {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredReviews.length)}개 표시
              </span>
              <span>
                페이지 {currentPage} / {totalPages}
              </span>
            </div>

            {/* 리뷰 목록 */}
            {paginatedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onDelete={onDeleteReview}
                isAdmin={isAdmin}
              />
            ))}

            {/* 페이지네이션 버튼 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 mb-24">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  첫 페이지
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  이전
                </Button>
                
                {/* 페이지 번호 */}
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // 현재 페이지 주변 3개 페이지만 표시
                      return Math.abs(page - currentPage) <= 2;
                    })
                    .map(page => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={page === currentPage ? "bg-blue-500 text-white" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  다음
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  마지막 페이지
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <ReviewForm
          onSubmit={handleAddReview}
          onCancel={() => setShowForm(false)}
        />
      )}


    </div>
  );
}
