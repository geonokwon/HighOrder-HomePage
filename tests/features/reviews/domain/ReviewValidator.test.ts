/**
 * Review Validator Tests
 * 후기 검증 로직 테스트
 */

import { ReviewValidator } from '../../../../src/features/reviews/domain/validators/ReviewValidator';
import { CreateReviewData } from '../../../../src/features/reviews/domain/entities/Review';

describe('ReviewValidator', () => {
  describe('validateCreateReview', () => {
    const validData: CreateReviewData = {
      userName: '테스트 사용자',
      rating: 5,
      title: '훌륭한 서비스',
      content: '정말 만족스러운 경험이었습니다.',
      category: '서비스'
    };

    it('유효한 데이터일 때 통과해야 한다', () => {
      const result = ReviewValidator.validateCreateReview(validData);
      
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('사용자명이 비어있으면 실패해야 한다', () => {
      const invalidData = { ...validData, userName: '' };
      const result = ReviewValidator.validateCreateReview(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.userName).toBe('작성자명을 입력해주세요');
    });

    it('사용자명이 100자를 초과하면 실패해야 한다', () => {
      const invalidData = { ...validData, userName: 'a'.repeat(101) };
      const result = ReviewValidator.validateCreateReview(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.userName).toBe('작성자명은 100자 이하로 입력해주세요');
    });

    it('평점이 1-5 범위를 벗어나면 실패해야 한다', () => {
      const invalidData1 = { ...validData, rating: 0 };
      const invalidData2 = { ...validData, rating: 6 };
      
      const result1 = ReviewValidator.validateCreateReview(invalidData1);
      const result2 = ReviewValidator.validateCreateReview(invalidData2);
      
      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
      expect(result1.errors.rating).toBe('평점은 1~5점 사이로 선택해주세요');
      expect(result2.errors.rating).toBe('평점은 1~5점 사이로 선택해주세요');
    });

    it('제목이 비어있으면 실패해야 한다', () => {
      const invalidData = { ...validData, title: '' };
      const result = ReviewValidator.validateCreateReview(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('제목을 입력해주세요');
    });

    it('제목이 200자를 초과하면 실패해야 한다', () => {
      const invalidData = { ...validData, title: 'a'.repeat(201) };
      const result = ReviewValidator.validateCreateReview(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('제목은 200자 이하로 입력해주세요');
    });

    it('내용이 비어있으면 실패해야 한다', () => {
      const invalidData = { ...validData, content: '' };
      const result = ReviewValidator.validateCreateReview(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.content).toBe('내용을 입력해주세요');
    });

    it('내용이 2000자를 초과하면 실패해야 한다', () => {
      const invalidData = { ...validData, content: 'a'.repeat(2001) };
      const result = ReviewValidator.validateCreateReview(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.content).toBe('내용은 2000자 이하로 입력해주세요');
    });

    it('올바르지 않은 카테고리이면 실패해야 한다', () => {
      const invalidData = { ...validData, category: '잘못된카테고리' };
      const result = ReviewValidator.validateCreateReview(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.category).toBe('올바른 카테고리를 선택해주세요');
    });
  });

  describe('validateContent', () => {
    it('적절한 내용이면 통과해야 한다', () => {
      const result = ReviewValidator.validateContent('좋은 서비스였습니다.');
      
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    // 실제 욕설 필터링은 프로덕션에서 더 정교하게 구현 필요
    it('부적절한 내용이 있으면 실패해야 한다', () => {
      const result = ReviewValidator.validateContent('욕설1이 포함된 내용');
      
      expect(result.isValid).toBe(false);
      expect(result.errors.content).toBe('부적절한 내용이 포함되어 있습니다');
    });
  });
});
