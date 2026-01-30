/**
 * Category Filter Component
 * 카테고리별 후기 필터링 컴포넌트
 */

"use client";

import React from 'react';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { REVIEW_CATEGORIES } from '../../domain/entities/Review';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  categoryStats: Record<string, number>;
  totalCount: number;
}

export function CategoryFilter({ 
  selectedCategory, 
  onCategoryChange, 
  categoryStats,
  totalCount 
}: CategoryFilterProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">카테고리별 필터</h3>
      
      <div className="flex flex-wrap gap-2">
        {/* 전체 보기 버튼 */}
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className={`relative ${
            selectedCategory === null 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          전체
          <Badge 
            variant="secondary" 
            className={`ml-2 ${
              selectedCategory === null 
                ? 'bg-blue-400 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {totalCount}
          </Badge>
        </Button>

        {/* 카테고리별 필터 버튼들 */}
        {REVIEW_CATEGORIES.map((category) => {
          const count = categoryStats[category] || 0;
          const isSelected = selectedCategory === category;
          
          return (
            <Button
              key={category}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category)}
              disabled={count === 0}
              className={`relative ${
                isSelected 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : count === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
              <Badge 
                variant="secondary" 
                className={`ml-2 ${
                  isSelected 
                    ? 'bg-blue-400 text-white' 
                    : count === 0
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-gray-200 text-gray-700'
                }`}
              >
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>


    </div>
  );
}
