import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
    return NextResponse.json({ 
      authenticated: true, 
      username: decoded.username 
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
} 