/**
 * Password Dialog Component
 * 비밀번호 확인 다이얼로그 컴포넌트
 */

"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../shared/components/ui/dialog';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';

interface PasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  title?: string;
  description?: string;
  loading?: boolean;
}

export function PasswordDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "비밀번호 확인",
  description = "후기를 삭제하려면 작성 시 설정한 비밀번호를 입력해주세요.",
  loading = false
}: PasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConfirm();
  };

  const handleConfirm = async () => {
    // 비밀번호가 없으면 클릭해도 아무 동작 안 함
    if (!password.trim()) {
      setError('비밀번호를 입력해주세요.');
      setHasError(true);
      return;
    }

    // 로딩 중이면 중복 클릭 방지
    if (loading) {
      return;
    }

    setError('');
    setHasError(false);
    
    try {
      await onConfirm(password);
      // 성공 시 다이얼로그가 자동으로 닫힘
    } catch (error: any) {
      // 비밀번호 틀렸을 때
      setError('비밀번호가 틀렸습니다.');
      setHasError(true);
      setPassword(''); // 비밀번호 필드 초기화
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    setHasError(false);
    onClose();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (hasError) {
      setHasError(false);
      setError('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && password.trim() && !loading) {
      handleConfirm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="password-dialog-description">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription id="password-dialog-description">{description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              비밀번호
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress}
              placeholder="비밀번호를 입력하세요"
              className={`w-full h-12 text-base transition-all duration-200 ${
                hasError 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              }`}
              disabled={loading}
              autoFocus
            />
            {error && (
              <div className="flex items-center gap-2">
                <span className="text-red-500">⚠️</span>
                <p className="text-sm text-red-500 font-medium animate-pulse">
                  {error}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-4 pt-2">
            {/* 삭제 버튼 */}
            <Button
              onClick={handleConfirm}
              variant="destructive"
              disabled={loading || !password.trim()}
              className="w-full h-12 font-semibold text-base bg-red-500 hover:bg-red-600 active:bg-red-700 text-white border-0 disabled:bg-gray-300 disabled:text-gray-500"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  삭제 중...
                </div>
              ) : (
                '삭제하기'
              )}
            </Button>
            
            {/* 취소 버튼 */}
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="w-full h-12 font-medium text-base bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            >
              취소
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
