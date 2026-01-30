/**
 * Image Gallery Component
 * 이미지 갤러리 팝업 컴포넌트 - 클릭으로 확대 및 네비게이션
 */

"use client";

import React, { useState } from 'react';
import { ReviewImage } from '../../domain/entities/Review';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../../../shared/components/ui/dialog';
import { Button } from '../../../../shared/components/ui/button';
import { VisuallyHidden } from '../../../../shared/components/ui/visually-hidden';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: ReviewImage[];
  className?: string;
}

export function ImageGallery({ images, className = '' }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      {/* 썸네일 이미지들 */}
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative cursor-pointer group overflow-hidden rounded-md border border-gray-200 hover:border-gray-300 transition-colors"
            onClick={() => openGallery(index)}
          >
            <img
              src={image.imagePath}
              alt={image.originalName}
              className="w-24 h-24 object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
            {images.length > 1 && (
              <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                {index + 1}/{images.length}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 이미지 갤러리 팝업 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black border-0" aria-describedby="image-gallery-description">
          <VisuallyHidden>
            <DialogTitle>
              이미지 갤러리 {images.length > 1 ? `(${currentIndex + 1}/${images.length})` : ''}
            </DialogTitle>
            <DialogDescription id="image-gallery-description">
              이미지를 확대하여 보실 수 있습니다. 키보드 화살표 키로 이미지를 탐색할 수 있습니다.
            </DialogDescription>
          </VisuallyHidden>
          <div className="relative w-full h-[80vh] bg-black">
            {/* 닫기 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* 현재 이미지 */}
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={images[currentIndex]?.imagePath}
                alt={images[currentIndex]?.originalName}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* 네비게이션 버튼들 (여러 이미지일 때만 표시) */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>

                {/* 하단 썸네일 네비게이션 */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      className={`w-12 h-12 rounded overflow-hidden border-2 transition-colors ${
                        index === currentIndex ? 'border-white' : 'border-transparent'
                      }`}
                      onClick={() => goToImage(index)}
                    >
                      <img
                        src={image.imagePath}
                        alt={image.originalName}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* 이미지 카운터 */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}

            {/* 이미지 정보 */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-2 rounded text-sm max-w-xs">
              <div className="font-medium">{images[currentIndex]?.originalName}</div>
              <div className="text-xs opacity-75">
                {Math.round((images[currentIndex]?.fileSize || 0) / 1024)} KB
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
