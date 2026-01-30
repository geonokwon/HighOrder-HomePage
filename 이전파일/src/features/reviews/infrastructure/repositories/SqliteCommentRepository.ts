/**
 * SQLite Comment Repository Implementation
 * SQLite 댓글 리포지토리 구현
 */

import { Comment, CreateCommentData } from '../../domain/entities/Comment';
import { CommentRepository } from '../../domain/repositories/CommentRepository';
import { DatabaseManager } from '../database/DatabaseManager';

export class SqliteCommentRepository implements CommentRepository {
  private db: DatabaseManager;

  constructor() {
    this.db = DatabaseManager.getInstance();
  }

  /**
   * 특정 리뷰의 모든 댓글 조회
   */
  async findByReviewId(reviewId: string): Promise<Comment[]> {
    const rows = this.db.all(`
      SELECT 
        id,
        review_id as reviewId,
        author_name as authorName,
        author_role as authorRole,
        content,
        created_at as createdAt,
        updated_at as updatedAt,
        is_deleted as isDeleted
      FROM comments
      WHERE review_id = ? AND is_deleted = FALSE
      ORDER BY created_at ASC
    `, [reviewId]);
    
    return rows.map(row => ({
      id: String(row.id),
      reviewId: String(row.reviewId),
      authorName: row.authorName as string,
      authorRole: row.authorRole as 'admin' | 'user',
      content: row.content as string,
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string),
      isDeleted: Boolean(row.isDeleted)
    }));
  }

  /**
   * 댓글 ID로 댓글 조회
   */
  async findById(id: string): Promise<Comment | null> {
    const row = this.db.get(`
      SELECT 
        id,
        review_id as reviewId,
        author_name as authorName,
        author_role as authorRole,
        content,
        created_at as createdAt,
        updated_at as updatedAt,
        is_deleted as isDeleted
      FROM comments
      WHERE id = ? AND is_deleted = FALSE
    `, [id]);
    
    if (!row) {
      return null;
    }

    return {
      id: String(row.id),
      reviewId: String(row.reviewId),
      authorName: row.authorName as string,
      authorRole: row.authorRole as 'admin' | 'user',
      content: row.content as string,
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string),
      isDeleted: Boolean(row.isDeleted)
    };
  }

  /**
   * 댓글 생성
   */
  async create(data: CreateCommentData): Promise<Comment> {
    const result = this.db.run(`
      INSERT INTO comments (review_id, author_name, author_role, content)
      VALUES (?, ?, ?, ?)
    `, [
      data.reviewId,
      data.authorName,
      data.authorRole,
      data.content
    ]);

    const comment = await this.findById(String(result.lastInsertRowid));
    
    if (!comment) {
      throw new Error('댓글 생성에 실패했습니다.');
    }

    return comment;
  }

  /**
   * 댓글 삭제 (소프트 삭제)
   */
  async delete(id: string): Promise<void> {
    const result = this.db.run(`
      UPDATE comments
      SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);

    if (result.changes === 0) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }
  }

  /**
   * 특정 리뷰의 댓글 수 조회
   */
  async countByReviewId(reviewId: string): Promise<number> {
    const row = this.db.get(`
      SELECT COUNT(*) as count
      FROM comments
      WHERE review_id = ? AND is_deleted = FALSE
    `, [reviewId]);
    
    return row?.count as number || 0;
  }
}

