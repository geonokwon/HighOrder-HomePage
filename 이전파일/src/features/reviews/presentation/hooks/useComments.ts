/**
 * useComments Hook
 * 댓글 관리를 위한 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { Comment } from '../../domain/entities/Comment';

interface UseCommentsResult {
  comments: Comment[];
  total: number;
  loading: boolean;
  error: string | null;
  createComment: (content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  refreshComments: () => Promise<void>;
}

export function useComments(reviewId: string): UseCommentsResult {
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 댓글 목록 조회
  const refreshComments = useCallback(async () => {
    if (!reviewId) return;
    
    try {
      setLoading(true);
      setError(null); // 조회 시작 시 기존 에러 초기화
      
      const response = await fetch(`/api/reviews/${reviewId}/comments`);
      
      if (!response.ok) {
        // 실제 네트워크 오류나 서버 오류만 에러로 처리
        throw new Error('댓글 조회에 실패했습니다.');
      }
      
      const data = await response.json();
      setComments(data.comments || []); // 빈 배열도 정상 처리
      setTotal(data.total || 0);
      // 조회 성공 시 에러 없음 (댓글 0개도 정상)
    } catch (err) {
      // 실제 네트워크 오류나 서버 오류만 에러로 표시
      const errorMessage = err instanceof Error ? err.message : '댓글 조회 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('Failed to fetch comments:', err);
      // 에러 발생 시 빈 배열로 초기화
      setComments([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [reviewId]);

  // 초기 로딩
  useEffect(() => {
    refreshComments();
  }, [refreshComments]);

  // 댓글 생성
  const createComment = useCallback(async (content: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/reviews/${reviewId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '댓글 작성에 실패했습니다.');
      }
      
      await refreshComments();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '댓글 작성 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('Failed to create comment:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [reviewId, refreshComments]);

  // 댓글 삭제
  const deleteComment = useCallback(async (commentId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/reviews/${reviewId}/comments/${commentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '댓글 삭제에 실패했습니다.');
      }
      
      await refreshComments();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '댓글 삭제 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('Failed to delete comment:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [reviewId, refreshComments]);

  return {
    comments,
    total,
    loading,
    error,
    createComment,
    deleteComment,
    refreshComments,
  };
}

