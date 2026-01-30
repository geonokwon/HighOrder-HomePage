"use client";

/**
 * Comment Section Component
 * 댓글 섹션 컴포넌트
 */

import React, { useState } from 'react';
import { Comment } from '../../domain/entities/Comment';
import { Button } from '../../../../shared/components/ui/button';
import { Textarea } from '../../../../shared/components/ui/textarea';
import { Card } from '../../../../shared/components/ui/card';
import { Badge } from '../../../../shared/components/ui/badge';
import { useComments } from '../hooks/useComments';

interface CommentSectionProps {
  reviewId: string;
  isAdmin?: boolean;
}

export function CommentSection({ reviewId, isAdmin = false }: CommentSectionProps) {
  const { comments, total, loading, error, createComment, deleteComment } = useComments(reviewId);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await createComment(commentText);
      setCommentText('');
    } catch (error) {
      // 에러는 useComments 훅에서 처리됨
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteComment(commentId);
    } catch (error) {
      // 에러는 useComments 훅에서 처리됨
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      
      if (isNaN(dateObj.getTime())) {
        return '날짜 정보 없음';
      }
      
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj);
    } catch (error) {
      console.error('Date formatting error:', error);
      return '날짜 정보 없음';
    }
  };

  return (
    <div className="mt-4 pt-4 border-t">
      {/* 댓글 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">
          댓글 {total > 0 && <span className="text-blue-600">({total})</span>}
        </h4>
      </div>

      {/* 에러 메시지 - 실제 오류 발생 시에만 표시 */}
      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 댓글 작성 폼 (관리자만) */}
      {isAdmin && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="space-y-2">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="관리자 답변을 작성해주세요..."
              className="w-full min-h-[80px] resize-none"
              disabled={isSubmitting}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !commentText.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? '작성 중...' : '댓글 작성'}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* 댓글 목록 */}
      {loading && comments.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">댓글을 불러오는 중...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">아직 댓글이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-3 bg-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {comment.authorRole === 'admin' ? 'KT지니원' : comment.authorName}
                    </span>
                    {comment.authorRole === 'admin' && (
                      <Badge variant="default" className="text-xs bg-blue-600 text-white">
                        관리자
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {comment.content}
                  </p>
                </div>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    삭제
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

