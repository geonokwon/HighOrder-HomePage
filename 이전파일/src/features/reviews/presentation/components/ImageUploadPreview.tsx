"use client";

/**
 * Image Upload with Preview Component
 * 이미지 업로드 및 미리보기 컴포넌트
 */

import React, { useState } from 'react';
import { Button } from '../../../../shared/components/ui/button';
import { Card } from '../../../../shared/components/ui/card';
import { X, Upload, Plus } from 'lucide-react';

interface ImagePreview {
  id: string;
  file: File;
  url: string;
}

interface ImageUploadPreviewProps {
  images: ImagePreview[];
  onImagesChange: (images: ImagePreview[]) => void;
  maxImages?: number;
  maxFileSize?: number; // bytes
}

export function ImageUploadPreview({ 
  images, 
  onImagesChange, 
  maxImages = 4,
  maxFileSize = 5 * 1024 * 1024 // 5MB
}: ImageUploadPreviewProps) {
  const [dragOver, setDragOver] = useState(false);

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages: ImagePreview[] = [];
    const remainingSlots = maxImages - images.length;
    const filesToProcess = Math.min(files.length, remainingSlots);

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      
      // 파일 크기 검증
      if (file.size > maxFileSize) {
        alert(`파일 크기는 ${maxFileSize / 1024 / 1024}MB 이하여야 합니다: ${file.name}`);
        continue;
      }

      // 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        alert(`이미지 파일만 업로드할 수 있습니다: ${file.name}`);
        continue;
      }

      // 미리보기 URL 생성
      const url = URL.createObjectURL(file);
      newImages.push({
        id: generateId(),
        file,
        url
      });
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove) {
      // 메모리 해제
      URL.revokeObjectURL(imageToRemove.url);
    }
    onImagesChange(images.filter(img => img.id !== id));
  };

  const openFileDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      handleFileSelect(target.files);
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <Card
          className={`
            border-2 border-dashed transition-colors cursor-pointer
            ${dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400'
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 rounded-full bg-gray-100">
                <Upload className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">이미지 업로드</p>
                <p className="text-sm text-gray-500 mt-1">
                  클릭하거나 파일을 드래그해서 업로드하세요
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  최대 {maxImages}개의 이미지 ({maxImages - images.length}개 남음)
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <Card className="overflow-hidden aspect-square">
                <div className="relative w-full h-full">
                  <img
                    src={image.url}
                    alt={`업로드된 이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  {/* Image Number */}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                  {/* File Name */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded max-w-[80px] truncate">
                    {image.file.name}
                  </div>
                </div>
              </Card>
            </div>
          ))}
          
          {/* Add More Button */}
          {images.length < maxImages && (
            <Card 
              className="aspect-square border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer transition-colors"
              onClick={openFileDialog}
            >
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                <Plus className="w-6 h-6" />
                <span className="text-xs">더 추가</span>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Guidelines */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• JPG, PNG, GIF, WebP 형식만 지원됩니다</p>
        <p>• 파일 크기는 {maxFileSize / 1024 / 1024}MB 이하로 제한됩니다</p>
        <p>• 최대 {maxImages}개의 이미지를 업로드할 수 있습니다</p>
      </div>

      {/* Image List (for debugging) */}
      {images.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
          <p className="font-medium mb-2">업로드된 파일:</p>
          {images.map((image, index) => (
            <div key={image.id} className="flex justify-between items-center py-1">
              <span>{index + 1}. {image.file.name}</span>
              <span className="text-gray-500">{(image.file.size / 1024).toFixed(1)}KB</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
