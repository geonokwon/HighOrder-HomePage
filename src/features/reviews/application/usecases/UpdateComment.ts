/**
 * Update Comment Use Case
 * 댓글 수정 유스케이스
 */

import { CommentRepository } from '../../domain/repositories/CommentRepository';
import { Comment, UpdateCommentData } from '../../domain/entities/Comment';
import { CommentValidator } from '../../domain/validators/CommentValidator';

export class UpdateComment {
  constructor(private commentRepository: CommentRepository) {}

  async execute(id: string, data: UpdateCommentData): Promise<Comment> {
    // 댓글 존재 확인
    const existingComment = await this.commentRepository.findById(id);
    if (!existingComment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }

    // 삭제된 댓글은 수정 불가
    if (existingComment.isDeleted) {
      throw new Error('삭제된 댓글은 수정할 수 없습니다.');
    }

    // 내용 검증
    if (data.content !== undefined) {
      if (!data.content.trim()) {
        throw new Error('댓글 내용을 입력해주세요.');
      }

      if (data.content.length > 500) {
        throw new Error('댓글은 500자를 초과할 수 없습니다.');
      }

      // 비속어 필터링
      data.content = CommentValidator.filterProfanity(data.content);
    }

    // 댓글 수정
    return await this.commentRepository.update(id, data);
  }
}
