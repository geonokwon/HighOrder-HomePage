/**
 * Authentication Context
 * 인증 컨텍스트 - 기존 JWT 시스템과 통합된 관리자 로그인 상태 관리
 */

"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  role: 'admin';
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // JWT 토큰으로 인증 상태 확인
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/check-auth', {
        method: 'GET',
        credentials: 'include', // 쿠키 포함
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.username) {
          setUser({
            username: data.username,
            role: 'admin'
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    }
  };

  // 페이지 로드시 인증 상태 확인
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const isAdmin = user !== null;

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      loading,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
