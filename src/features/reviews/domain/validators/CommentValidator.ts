/**
 * Comment Validator
 * 댓글 유효성 검증
 */

import { CreateCommentData } from '../entities/Comment';

export class CommentValidator {
  private static readonly MIN_CONTENT_LENGTH = 1;
  private static readonly MAX_CONTENT_LENGTH = 1000;
  private static readonly MIN_AUTHOR_NAME_LENGTH = 1;
  private static readonly MAX_AUTHOR_NAME_LENGTH = 50;

  /**
   * 댓글 생성 데이터 검증
   */
  static validateCreateData(data: CreateCommentData): string[] {
    const errors: string[] = [];

    // 작성자 이름 검증
    if (!data.authorName || data.authorName.trim().length < this.MIN_AUTHOR_NAME_LENGTH) {
      errors.push('작성자 이름은 필수입니다.');
    }

    if (data.authorName && data.authorName.length > this.MAX_AUTHOR_NAME_LENGTH) {
      errors.push(`작성자 이름은 ${this.MAX_AUTHOR_NAME_LENGTH}자를 초과할 수 없습니다.`);
    }

    // 내용 검증
    if (!data.content || data.content.trim().length < this.MIN_CONTENT_LENGTH) {
      errors.push('댓글 내용은 필수입니다.');
    }

    if (data.content && data.content.length > this.MAX_CONTENT_LENGTH) {
      errors.push(`댓글 내용은 ${this.MAX_CONTENT_LENGTH}자를 초과할 수 없습니다.`);
    }

    // 역할 검증
    if (!data.authorRole || !['admin', 'user'].includes(data.authorRole)) {
      errors.push('유효하지 않은 작성자 역할입니다.');
    }

    // 리뷰 ID 검증
    if (!data.reviewId || data.reviewId.trim().length === 0) {
      errors.push('리뷰 ID는 필수입니다.');
    }

    return errors;
  }

  /**
   * 욕설 필터링 (기본 구현)
   */
  static filterProfanity(content: string): string {
    const profanityWords = ['욕설1', '욕설2', '비속어']; // 실제로는 더 많은 단어 목록 필요
    let filteredContent = content;
    
    profanityWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filteredContent = filteredContent.replace(regex, '***');
    });
    
    return filteredContent;
  }
}






