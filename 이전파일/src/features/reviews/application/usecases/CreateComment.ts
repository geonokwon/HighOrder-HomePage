/**
 * Create Comment Use Case
 * 댓글 생성 유즈케이스
 */

import { Comment, CreateCommentData } from '../../domain/entities/Comment';
import { CommentRepository } from '../../domain/repositories/CommentRepository';
import { CommentValidator } from '../../domain/validators/CommentValidator';

export class CreateCommentUseCase {
  constructor(private commentRepository: CommentRepository) {}

  /**
   * 댓글 생성
   * @param data 댓글 생성 데이터
   * @returns 생성된 댓글
   * @throws 검증 실패 또는 생성 실패 시 에러
   */
  async execute(data: CreateCommentData): Promise<Comment> {
    // 1. 입력 데이터 검증
    const validationErrors = CommentValidator.validateCreateData(data);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    // 2. 욕설 필터링
    if (CommentValidator.filterProfanity(data.content)) {
      throw new Error('부적절한 내용이 포함되어 있습니다.');
    }

    // 3. 댓글 생성
    try {
      const comment = await this.commentRepository.create(data);
      return comment;
    } catch (error) {
      console.error('Failed to create comment:', error);
      throw new Error('댓글 생성 중 오류가 발생했습니다.');
    }
  }
}

