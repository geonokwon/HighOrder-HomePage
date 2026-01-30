/**
 * Comment Domain Entity
 * 댓글 도메인 엔티티
 */

export interface Comment {
  id: string;
  reviewId: string;
  authorName: string;
  authorRole: 'admin' | 'user';
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface CreateCommentData {
  reviewId: string;
  authorName: string;
  authorRole: 'admin' | 'user';
  content: string;
}

export interface UpdateCommentData {
  content?: string;
}






