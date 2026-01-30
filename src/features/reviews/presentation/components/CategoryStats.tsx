/**
 * Category Statistics Component
 * 카테고리별 통계를 프로그레스 바로 표시하는 컴포넌트 (통계 표시 전용)
 */

"use client";

import React from 'react';
import { Card, CardContent } from '../../../../shared/components/ui/card';

import { REVIEW_CATEGORIES, Review } from '../../domain/entities/Review';

interface CategoryStatsProps {
  categoryStats: Record<string, number>;
  totalCount: number;
  reviews?: Review[]; // 이미지 첨부 수 계산을 위한 리뷰 데이터
}

export function CategoryStats({ categoryStats, totalCount, reviews = [] }: CategoryStatsProps) {
  // 각 카테고리의 퍼센티지 계산
  const getPercentage = (count: number) => {
    return totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
  };

  // 이미지가 첨부된 리뷰 수 실제 계산
  const reviewsWithImages = reviews.filter(review => review.images && review.images.length > 0).length;

  // 카테고리별 이모지 매핑
  const categoryEmojis: Record<string, string> = {
    '매출이 늘었어요!': '💰',
    '인건비가 절약됐어요': '💵',
    '사후관리가 좋아요': '🛠️',
    '주문 실수가 줄었어요': '✅',
    '고객 응대가 편해졌어요': '😊',
    '디자인이 고급스러워요': '💎'
  };

  const CategoryProgressBar = ({ category }: { category: string }) => {
    const count = categoryStats[category] || 0;
    const percentage = getPercentage(count);
    const emoji = categoryEmojis[category] || '📝';

    return (
      <div 
        className="relative overflow-hidden rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-sm"
      >
        {/* 배경 프로그레스 바 */}
        <div 
          className="absolute inset-0 transition-all duration-700 ease-out bg-gradient-to-r from-cyan-200 to-cyan-300"
          style={{ width: `${percentage}%` }}
        />
        
        {/* 콘텐츠 */}
        <div className="relative p-4 md:p-4 bg-white/80">
          {/* 데스크톱: 한 줄 배치 */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{emoji}</span>
              <span className="text-sm font-medium text-gray-700">
                "{category}"
              </span>
            </div>
            <span className="text-lg font-bold text-cyan-600">
              {count}
            </span>
          </div>
          
          {/* 모바일: 가로 1열 배치 */}
          <div className="md:hidden flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{emoji}</span>
              <span className="text-sm font-medium text-gray-700">
                "{category}"
              </span>
            </div>
            <span className="text-lg font-bold text-cyan-600">
              {count}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 총 후기 수 */}
      <Card className="bg-[#FEFEFE] border-2 border-[#DCDCDC]">
        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
          <div className="text-center space-y-3">
            <div className="text-5xl font-bold text-[#00748B] leading-none">
              {totalCount}
            </div>
            <div className="text-base text-[#169EB5] font-semibold">
              총 후기 수
            </div>
            
            {/* 이미지 첨부 리뷰 수 */}
            <div className="pt-2 border-t border-blue-200">
              <div className="flex items-center justify-center gap-1 text-xs text-[#169EB5]">
                <span>이미지 첨부 리뷰 : </span>
                <span className="font-semibold">{reviewsWithImages}개</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 카테고리별 통계 */}
      <Card className="lg:col-span-3 bg-[#FEFEFE]">
        <CardContent className="p-4">
          {/* 안내 문구 */}
          <div className="mb-3 text-xs text-gray-500 text-center">
            카테고리별 후기 수와 비율을 확인하세요
          </div>
          
          {/* 모든 카테고리를 반응형 그리드로 배치 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {REVIEW_CATEGORIES.map((category) => (
              <CategoryProgressBar key={category} category={category} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}