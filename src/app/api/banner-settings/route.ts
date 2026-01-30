import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

interface BannerSettings {
    enabled: boolean;
    text: string;
    backgroundColor: string;
    textColor: string;
    pdfUrl: string | null;
}

// 설정 파일 경로 - 도커 볼륨 마운트 고려
const SETTINGS_FILE_PATH = process.env.NODE_ENV === 'production'
    ? '/app/data/banner-settings.json'  // 도커 환경
    : join(process.cwd(), 'data', 'banner-settings.json'); // 로컬 개발 환경

// 기본 설정
const DEFAULT_SETTINGS: BannerSettings = {
    enabled: false,
    text: '',
    backgroundColor: '#FF9000',
    textColor: '#FFFFFF',
    pdfUrl: null,
};

// 설정 파일 읽기
async function loadSettings(): Promise<BannerSettings> {
    try {
        const data = await readFile(SETTINGS_FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // 파일이 없으면 기본 설정 반환
        return DEFAULT_SETTINGS;
    }
}

// 설정 파일 저장
async function saveSettings(settings: BannerSettings): Promise<void> {
    try {
        const dataDir = process.env.NODE_ENV === 'production'
            ? '/app/data'
            : join(process.cwd(), 'data');
        await mkdir(dataDir, { recursive: true });
        await writeFile(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2));
    } catch (error) {
        console.error('Settings save error:', error);
        throw error;
    }
}

// GET: 설정 조회 (인증 불필요 - 홈페이지에서 접근)
export async function GET() {
    try {
        const settings = await loadSettings();
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings load error:', error);
        return NextResponse.json(DEFAULT_SETTINGS);
    }
}

// POST: 설정 저장 (인증 필요)
export async function POST(request: NextRequest) {
    try {
        // JWT 토큰 검증
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        try {
            jwt.verify(token, JWT_SECRET);
        } catch {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const settings: BannerSettings = await request.json();
        await saveSettings(settings);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Settings save error:', error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}

