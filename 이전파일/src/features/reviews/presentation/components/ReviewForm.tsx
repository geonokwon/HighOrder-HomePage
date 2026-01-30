"use client";

/**
 * Review Form Component
 * 후기 작성 폼 컴포넌트 - Clean Architecture 적용
 */

import React, { useState } from 'react';
import { CreateReviewData, Review, REVIEW_CATEGORIES } from '../../domain/entities/Review';
import { ImageUploadPreview } from './ImageUploadPreview';
import { ReviewApiService } from '../../infrastructure/services/ReviewApiService';

// UI components
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Textarea } from '../../../../shared/components/ui/textarea';
import { Label } from '../../../../shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../../shared/components/ui/dialog';

interface ReviewFormProps {
  onSubmit: (review: Review) => void;
  onCancel: () => void;
}

interface ImagePreview {
  id: string;
  file: File;
  url: string;
}

export function ReviewForm({ onSubmit, onCancel }: ReviewFormProps) {
  const [formData, setFormData] = useState<CreateReviewData>({
    userName: '',
    title: '',
    content: '',
    category: '',
    password: '',
    images: []
  });

  const [imagePreviewsState, setImagePreviewsState] = useState<ImagePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 기본 검증
    const newErrors: Record<string, string> = {};
    if (!formData.userName.trim()) newErrors.userName = '이름을 입력해주세요';

    if (!formData.title.trim()) newErrors.title = '제목을 입력해주세요';
    if (!formData.content.trim()) newErrors.content = '내용을 입력해주세요';
    if (!formData.category) newErrors.category = '카테고리를 선택해주세요';
    if (!formData.password.trim()) newErrors.password = '삭제용 비밀번호를 입력해주세요';
    if (formData.password.trim() && formData.password.length < 4) newErrors.password = '비밀번호는 4자 이상이어야 합니다';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // 이미지 파일들을 formData에 포함
      const reviewData = {
        ...formData,
        images: imagePreviewsState.map(img => img.file)
      };

      // 실제 API 호출
      const createdReview = await ReviewApiService.createReview(reviewData);
      
      // 성공 시 폼 리셋
      setFormData({
        userName: '',
        title: '',
        content: '',
        category: '',
        password: '',
        images: []
      });
      
      // 이미지 미리보기 정리
      imagePreviewsState.forEach(img => URL.revokeObjectURL(img.url));
      setImagePreviewsState([]);
      
      // 성공 후 부모 컴포넌트에 알림
      onSubmit(createdReview);
      
    } catch (error) {
      setErrors({ general: '후기 작성 중 오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleImagesChange = (images: ImagePreview[]) => {
    setImagePreviewsState(images);
    // formData도 업데이트
    setFormData(prev => ({ 
      ...prev, 
      images: images.map(img => img.file) 
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white custom-scrollbar" aria-describedby="review-form-description">
        <DialogHeader>
          <DialogTitle>후기 작성</DialogTitle>
          <DialogDescription id="review-form-description">
            고객님의 소중한 후기를 작성해주세요. 모든 항목은 필수 입력사항입니다.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg">
          {/* User Name */}
          <div className="space-y-2">
            <Label htmlFor="userName">상호 *</Label>
            <Input
              id="userName"
              value={formData.userName}
              onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
              placeholder="상호를 입력해주세요"
              className={errors.userName ? 'border-red-500' : ''}
            />
            {errors.userName && (
              <p className="text-sm text-red-500">{errors.userName}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>카테고리 *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="카테고리를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {REVIEW_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">삭제용 비밀번호 *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="후기 삭제 시 사용할 비밀번호 (4자 이상)"
              className={errors.password ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
            <p className="text-xs text-gray-500">
              후기 삭제 시 필요한 비밀번호입니다. 잊지 마세요!
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="후기 제목을 입력해주세요"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">내용 *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="자세한 후기 내용을 작성해주세요"
              rows={4}
              className={errors.content ? 'border-red-500' : ''}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>이미지 첨부 (선택사항)</Label>
            <ImageUploadPreview
              images={imagePreviewsState}
              onImagesChange={handleImagesChange}
              maxImages={4}
              maxFileSize={5 * 1024 * 1024}
            />
            {errors.images && (
              <p className="text-sm text-red-500">{errors.images}</p>
            )}
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '등록 중...' : '후기 등록'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
