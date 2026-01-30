"use client";

/**
 * Review Stats Component
 * 후기 통계 컴포넌트
 */

import React from 'react';
import { ReviewStats } from '../../application/usecases/GetReviews';

// UI components
import { Card, CardContent } from '../../../../shared/components/ui/card';

interface ReviewStatsProps {
  stats: ReviewStats;
}

export function ReviewStatsComponent({ stats }: ReviewStatsProps) {
  // 카테고리별 통계에서 상위 카테고리 계산
  const topCategories = Object.entries(stats.categoryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold mb-1" style={{ color: '#00748B' }}>{stats.totalCount}</div>
          <div className="text-sm" style={{ color: '#00748B' }}>총 후기 수</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold mb-1">
            {Object.keys(stats.categoryStats).length}
          </div>
          <div className="text-sm text-gray-600">등록된 카테고리 수</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold mb-1">
            {topCategories[0] ? topCategories[0][1] : 0}
          </div>
          <div className="text-sm text-gray-600">
            {topCategories[0] ? `"${topCategories[0][0]}" 후기` : '인기 후기'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
