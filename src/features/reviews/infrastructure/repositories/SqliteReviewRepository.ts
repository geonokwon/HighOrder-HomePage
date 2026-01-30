/**
 * SQLite Review Repository Implementation
 * SQLite 기반 후기 리포지토리 구현체
 */

import { Review, CreateReviewData, UpdateReviewData, ReviewImage } from '../../domain/entities/Review';
import { ReviewRepository } from '../../domain/repositories/ReviewRepository';
import { DatabaseManager, DatabaseRow } from '../database/DatabaseManager';
import { ImageRepository } from '../../domain/repositories/ImageRepository';
import { hashPassword, verifyPassword } from '../utils/passwordUtils';
import { CommentRepository } from '../../domain/repositories/CommentRepository';

export class SqliteReviewRepository implements ReviewRepository {
  private db: DatabaseManager;
  private imageRepository: ImageRepository;

  constructor(imageRepository: ImageRepository) {
    this.db = DatabaseManager.getInstance();
    this.imageRepository = imageRepository;
  }

  async findAll(): Promise<Review[]> {
    const rows = this.db.all(`
      SELECT * FROM reviews
      WHERE is_deleted = FALSE
      ORDER BY created_at DESC
    `);

    const reviews = await Promise.all(
      rows.map(async (row) => await this.mapToEntity(row))
    );

    return reviews;
  }

  async findById(id: string): Promise<Review | null> {
    const row = this.db.get(`
      SELECT * FROM reviews
      WHERE id = ? AND is_deleted = FALSE
    `, [id]);

    if (!row) return null;

    return await this.mapToEntity(row);
  }

  async findByCategory(category: string): Promise<Review[]> {
    const rows = this.db.all(`
      SELECT * FROM reviews
      WHERE category = ? AND is_deleted = FALSE
      ORDER BY created_at DESC
    `, [category]);

    const reviews = await Promise.all(
      rows.map(async (row) => await this.mapToEntity(row))
    );

    return reviews;
  }

  async create(data: CreateReviewData): Promise<Review> {
    // 이미지 먼저 저장 (트랜잭션 외부에서)
    let imagePaths: string[] = [];
    let reviewId: string = '';

    try {
      // 비밀번호 해시화
      const hashedPassword = hashPassword(data.password);

      // 후기 데이터 삽입
      const result = this.db.run(`
        INSERT INTO reviews (user_name, title, content, category, password)
        VALUES (?, ?, ?, ?, ?)
      `, [data.userName, data.title, data.content, data.category, hashedPassword]);

      reviewId = result.lastInsertRowid.toString();

      // 이미지 저장
      if (data.images && data.images.length > 0) {
        imagePaths = await this.imageRepository.saveImages(data.images, reviewId);
        
        // 이미지 메타데이터 DB에 저장
        for (let i = 0; i < data.images.length; i++) {
          const file = data.images[i];
          const imagePath = imagePaths[i];
          
          this.db.run(`
            INSERT INTO review_images (review_id, image_path, original_name, file_size, mime_type, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [reviewId, imagePath, file.name, file.size, file.type, i]);
        }
      }

      // 생성된 후기 반환
      const createdReview = await this.findById(reviewId);
      if (!createdReview) {
        throw new Error('Failed to create review');
      }

      return createdReview;
    } catch (error) {
      console.error('Create review failed:', error);
      
      // 오류 발생 시 생성된 리뷰 삭제 시도
      if (reviewId) {
        try {
          this.db.run('DELETE FROM reviews WHERE id = ?', [reviewId]);
        } catch (deleteError) {
          console.error('Failed to cleanup review:', deleteError);
        }
      }
      
      throw error;
    }
  }

  async update(id: string, data: UpdateReviewData): Promise<Review | null> {
    const existingReview = await this.findById(id);
    if (!existingReview) return null;

    const updateFields: string[] = [];
    const updateValues: any[] = [];


    if (data.title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(data.title);
    }
    if (data.content !== undefined) {
      updateFields.push('content = ?');
      updateValues.push(data.content);
    }
    if (data.category !== undefined) {
      updateFields.push('category = ?');
      updateValues.push(data.category);
    }

    if (updateFields.length === 0) {
      return existingReview; // 변경사항이 없으면 기존 데이터 반환
    }

    updateValues.push(id);

    this.db.run(`
      UPDATE reviews 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `, updateValues);

    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const existingReview = await this.findById(id);
    if (!existingReview) return false;

    return this.db.transaction(() => {
      // 소프트 삭제
      const result = this.db.run(`
        UPDATE reviews 
        SET is_deleted = TRUE 
        WHERE id = ?
      `, [id]);

      // 관련 이미지 삭제
      this.imageRepository.deleteImagesByReviewId(id);

      return result.changes > 0;
    });
  }

  /**
   * 비밀번호 검증 후 후기 삭제
   */
  async deleteWithPassword(id: string, password: string): Promise<boolean> {
    // 후기 조회
    const review = this.db.get(`
      SELECT password FROM reviews
      WHERE id = ? AND is_deleted = FALSE
    `, [id]);

    if (!review || !review.password) {
      return false;
    }

    // 비밀번호 검증
    if (!verifyPassword(password, review.password)) {
      return false;
    }

    // 검증 성공 시 삭제
    return await this.delete(id);
  }



  async getCountByCategory(): Promise<Record<string, number>> {
    const rows = this.db.all(`
      SELECT category, COUNT(*) as count
      FROM reviews
      WHERE is_deleted = FALSE
      GROUP BY category
    `);

    const result: Record<string, number> = {};
    rows.forEach((row: any) => {
      result[row.category] = row.count;
    });

    return result;
  }

  /**
   * SQLite 날짜 문자열을 JavaScript Date 객체로 안전하게 변환
   */
  private parseDate(dateString: any): Date {
    try {
      if (!dateString) {
        return new Date();
      }
      
      // SQLite datetime('now') 형식: YYYY-MM-DD HH:MM:SS
      // 이를 ISO 형식으로 변환하여 Date 객체 생성
      if (typeof dateString === 'string') {
        // SQLite 형식을 ISO 형식으로 변환 (T 추가, UTC로 처리)
        const isoString = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
        const date = new Date(isoString + (isoString.includes('Z') ? '' : 'Z'));
        
        // 유효한 날짜인지 확인
        if (!isNaN(date.getTime())) {
          return date;
        }
        
        // 직접 파싱 시도
        return new Date(dateString);
      }
      
      return new Date(dateString);
    } catch (error) {
      console.error('Date parsing error:', error, 'Input:', dateString);
      return new Date(); // 실패 시 현재 시간 반환
    }
  }

  /**
   * 데이터베이스 행을 Review 엔티티로 변환
   */
  private async mapToEntity(row: DatabaseRow): Promise<Review> {
    // 후기 이미지 조회
    const imageRows = this.db.all(`
      SELECT * FROM review_images
      WHERE review_id = ?
      ORDER BY sort_order ASC
    `, [row.id]);

    const images: ReviewImage[] = imageRows.map((imageRow: DatabaseRow) => ({
      id: imageRow.id.toString(),
      reviewId: imageRow.review_id.toString(),
      imagePath: this.imageRepository.getImageUrl(imageRow.image_path),
      originalName: imageRow.original_name,
      fileSize: imageRow.file_size,
      mimeType: imageRow.mime_type,
      sortOrder: imageRow.sort_order,
      createdAt: this.parseDate(imageRow.created_at)
    }));

    return {
      id: row.id.toString(),
      userName: row.user_name,
      title: row.title,
      content: row.content,
      category: row.category,
      createdAt: this.parseDate(row.created_at),
      updatedAt: this.parseDate(row.updated_at),
      isDeleted: Boolean(row.is_deleted),
      images
    };
  }
}
