"use client";

/**
 * Review Card Component
 * 개별 후기 카드 컴포넌트
 */

import React from 'react';
import { Review } from '../../domain/entities/Review';

// UI components
import { Card, CardContent, CardHeader } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ImageGallery } from './ImageGallery';
import { PasswordDialog } from './PasswordDialog';
import { CommentSection } from './CommentSection';

interface ReviewCardProps {
  review: Review;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

export function ReviewCard({ review, onDelete, isAdmin = false }: ReviewCardProps) {
  const [showPasswordDialog, setShowPasswordDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);



  const formatDate = (date: Date | string) => {
    try {
      // Date 객체가 아닌 경우 변환
      const dateObj = date instanceof Date ? date : new Date(date);
      
      // 유효한 날짜인지 확인
      if (isNaN(dateObj.getTime())) {
        return '날짜 정보 없음';
      }
      
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(dateObj);
    } catch (error) {
      console.error('Date formatting error:', error);
      return '날짜 정보 없음';
    }
  };

  const handleDelete = () => {
    if (isAdmin) {
      // 관리자는 비밀번호 없이 즉시 삭제
      if (window.confirm('관리자 권한으로 이 후기를 삭제하시겠습니까?')) {
        handleAdminDelete();
      }
    } else {
      // 일반 사용자는 비밀번호 확인
      setShowPasswordDialog(true);
    }
  };

  const handleAdminDelete = async () => {
    setIsDeleting(true);
    try {
      // 관리자 전용 삭제 API 호출
      const response = await fetch(`/api/reviews/${review.id}/admin`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        onDelete(review.id);
      } else {
        alert('삭제 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Admin delete failed:', error);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePasswordConfirm = async (password: string) => {
    setIsDeleting(true);
    try {
      // API 호출로 비밀번호 검증 및 삭제
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        onDelete(review.id);
        setShowPasswordDialog(false);
      } else {
        const error = await response.json();
        // 에러를 throw해서 PasswordDialog에서 처리하도록 함
        throw new Error(error.message || '비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      // 에러를 다시 throw해서 PasswordDialog에서 처리
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={review.userAvatar} />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                  {review.userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{review.userName}</span>
                  <Badge variant="secondary" className="text-xs">
                    {review.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className={`${
                isAdmin 
                  ? 'text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100' 
                  : 'text-red-500 hover:text-red-700'
              }`}
              disabled={isDeleting}
            >
              {isDeleting ? '삭제 중...' : isAdmin ? '관리자 삭제' : '삭제'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <h3 className="font-medium mb-2">{review.title}</h3>
          <p className="text-gray-600 mb-4 leading-relaxed whitespace-pre-line">
            {review.content}
          </p>
          
          {/* Images */}
          {review.images.length > 0 && (
            <ImageGallery images={review.images} />
          )}
          
          {/* Comments Section */}
          <CommentSection reviewId={review.id} isAdmin={isAdmin} />
        </CardContent>
      </Card>

      {/* Password Dialog */}
      <PasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onConfirm={handlePasswordConfirm}
        loading={isDeleting}
      />
    </>
  );
}
