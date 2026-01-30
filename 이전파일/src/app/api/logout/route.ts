import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  
  // 쿠키를 여러 방법으로 삭제
  res.cookies.set('token', '', { 
    path: '/', 
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  
  return res;
} 