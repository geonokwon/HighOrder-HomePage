'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatedSection, AnimatedItem } from '@/presentation/components/AnimatedSection';
import { useRouter } from 'next/navigation';

interface Review {
  id: string;
  userName: string;
  title: string;
  content: string;
  category: string;
  rating?: number;
  createdAt: string;
  images: ReviewImage[];
}

interface ReviewImage {
  id: string;
  imagePath: string;
  originalName: string;
}

interface ReviewStats {
  totalCount: number;
  averageRating: number;
  categoryStats: Record<string, number>;
}

const REVIEW_CATEGORIES = [
  '매출이 늘었어요!',
  '인건비가 절약됐어요', 
  '사후관리가 좋아요',
  '주문 실수가 줄었어요',
  '고객 응대가 편해졌어요',
  '디자인이 고급스러워요'
];

export const ReviewPreviewSection: React.FC = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        if (response.ok) {
          const { data } = await response.json();
          // 가장 최신 리뷰를 맨 위에 오도록 정렬 (createdAt 기준 내림차순)
          const sortedReviews = data.reviews.sort((a: Review, b: Review) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setReviews(sortedReviews);
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleViewAllReviews = () => {
    router.push('/reviews');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      '매출이 늘었어요!': '💰',
      '인건비가 절약됐어요': '💵',
      '사후관리가 좋아요': '🛠️',
      '주문 실수가 줄었어요': '✅',
      '고객 응대가 편해졌어요': '😊',
      '디자인이 고급스러워요': '💎'
    };
    return emojiMap[category] || '💬';
  };

  const getPercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  // 이미지가 첨부된 리뷰 수 계산
  const reviewsWithImages = reviews.filter(review => review.images && review.images.length > 0).length;

  if (loading) {
    return (
      <AnimatedSection className="w-full py-12 md:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-200 rounded-xl h-48"></div>
              <div className="lg:col-span-3 bg-gray-200 rounded-xl h-48"></div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection className="w-full py-12 md:py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Title */}
        <AnimatedItem className="text-left mb-8">
          <h2 className="text-3xl md:text-4xl font-black leading-tight">
            <span className="text-[#2E3946]">한 달 사용한 고객들의 </span>
            <span className="text-[#008AA7]">리얼 찐 후기</span>
            <span className="text-[#2E3946]"> 만나보세요!</span>
          </h2>
          <p className="text-lg text-gray-500 mt-2">(KT지니원은 100% 리얼 후기 약속드립니다)</p>
        </AnimatedItem>

        {/* Stats and Category Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Reviews Card */}
          <div className="bg-[#FEFEFE] border-2 border-[#DCDCDC] rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="text-center space-y-3">
              <div className="text-5xl font-bold text-[#00748B] leading-none">
                {stats?.totalCount || 0}
              </div>
              <div className="text-base text-[#169EB5] font-semibold">
                총 후기 수
              </div>
              <div className="pt-2 border-t border-blue-200">
                <div className="flex items-center justify-center gap-1 text-xs text-[#169EB5]">
                  <span>이미지 첨부 리뷰 : </span>
                  <span className="font-semibold">{reviewsWithImages}개</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Progress Bars */}
          <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {REVIEW_CATEGORIES.map((category) => {
                const count = stats?.categoryStats[category] || 0;
                const percentage = getPercentage(count, stats?.totalCount || 0);
                const emoji = getCategoryEmoji(category);
                
                return (
                  <div 
                    key={category}
                    className="relative overflow-hidden rounded-lg border border-gray-200 transition-all duration-300"
                  >
                    {/* 배경 프로그레스 바 */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-cyan-200 to-cyan-300 transition-all duration-700 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                    
                    {/* 콘텐츠 */}
                    <div className="relative p-4 bg-white/80">
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
              })}
            </div>
          </div>
        </div>


        {/* Reviews Grid with Blur Effect */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-xl">
            {/* Review Card - 실제 리뷰가 있으면 최신 리뷰, 없으면 데모 카드 */}
            {reviews.length > 0 ? (
              // 실제 리뷰 카드 (가장 최신)
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                    {reviews[0].userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-800">{reviews[0].userName}</span>
                      <span className="text-sm text-gray-500">{formatDate(reviews[0].createdAt)}</span>
                      <span className="text-red-500 text-sm">삭제</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{reviews[0].title}</h3>
                    <p className="text-gray-600 mb-3">{reviews[0].content}</p>
                    {reviews[0].images.length > 0 ? (
                      <div className="flex gap-2">
                        {reviews[0].images.slice(0, 3).map((image, imgIndex) => (
                          <img
                            key={image.id}
                            src={image.imagePath}
                            alt={`리뷰 이미지 ${imgIndex + 1}`}
                            className="w-20 h-20 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-sm">이미지 없음</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // 데모 카드 (리뷰가 없을 때)
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                    테
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-800">테스트</span>
                      <span className="text-sm text-gray-500">2025년 8월 29일</span>
                      <span className="text-red-500 text-sm">삭제</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">재료가 신선해요</h3>
                    <p className="text-gray-600 mb-3">하이오더</p>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">이미지</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blur Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent backdrop-blur-sm z-10"></div>
            
            {/* View More Button */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <button
                onClick={handleViewAllReviews}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF8C00] to-[#FF6B00] text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span>리뷰 자세히보기</span>
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};