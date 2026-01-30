import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

function verifyAuth(request: NextRequest): boolean {
  const token = request.cookies.get('token')?.value;
  if (!token) return false;
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

const dataPath = path.join(process.cwd(), 'src', 'chatbot', 'data', 'scenario.json');

export async function GET() {
  try {
    const raw = await fs.readFile(dataPath, 'utf8');
    return NextResponse.json(JSON.parse(raw));
  } catch (error) {
    console.error('Scenario read error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    await fs.writeFile(dataPath, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Scenario write error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 