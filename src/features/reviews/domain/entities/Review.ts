/**
 * Review Domain Entity
 * 후기 도메인 엔티티
 */

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  title: string;
  content: string;
  category: string;
  password?: string; // 후기 삭제용 비밀번호 (해시값 저장)
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  images: ReviewImage[];
}

export interface ReviewImage {
  id: string;
  reviewId: string;
  imagePath: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  sortOrder: number;
  createdAt: Date;
}

export interface CreateReviewData {
  userName: string;
  title: string;
  content: string;
  category: string;
  password: string; // 사용자가 입력한 평문 비밀번호
  images?: File[];
}

export interface UpdateReviewData {
  title?: string;
  content?: string;
  category?: string;
}

export type ReviewCategory = '매출이 늘었어요!' | '인건비가 절약됐어요' | '사후관리가 좋아요' | '주문 실수가 줄었어요' | '고객 응대가 편해졌어요' | '디자인이 고급스러워요';

export const REVIEW_CATEGORIES: ReviewCategory[] = [
  '매출이 늘었어요!',
  '인건비가 절약됐어요',
  '사후관리가 좋아요',
  '주문 실수가 줄었어요',
  '고객 응대가 편해졌어요',
  '디자인이 고급스러워요'
];

