import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const SETTINGS_FILE_PATH = join(process.cwd(), 'data', 'popup-settings.json');

export interface PopupItem {
  id: string;
  order: number;
  enabled: boolean;
  imageUrl: string | null;
  buttonUrl?: string | null;
  name?: string;
}

interface PopupSettings {
  popups: PopupItem[];
}

// 기본 설정
const DEFAULT_SETTINGS: PopupSettings = {
  popups: [],
};

// 설정 파일 읽기
async function loadSettings(): Promise<PopupSettings> {
  try {
    const data = await readFile(SETTINGS_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    // 이전 버전 호환성: 단일 팝업 설정을 배열로 변환
    if (parsed.enabled !== undefined || parsed.imageUrl !== undefined) {
      return {
        popups: parsed.imageUrl ? [{
          id: 'popup-1',
          order: 0,
          enabled: parsed.enabled || false,
          imageUrl: parsed.imageUrl || null,
          name: '팝업 1'
        }] : []
      };
    }
    return parsed;
  } catch (error) {
    // 파일이 없으면 기본 설정 반환
    return DEFAULT_SETTINGS;
  }
}

// 설정 파일 저장
async function saveSettings(settings: PopupSettings): Promise<void> {
  try {
    const dataDir = join(process.cwd(), 'data');
    await mkdir(dataDir, { recursive: true });
    await writeFile(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Settings save error:', error);
    throw error;
  }
}

// GET: 설정 조회 (인증 불필요 - 홈페이지에서 접근)
export async function GET(request: NextRequest) {
  try {
    const settings = await loadSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings load error:', error);
    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 }
    );
  }
}

// POST: 설정 업데이트
export async function POST(request: NextRequest) {
  // 인증 확인
  const token = request.cookies.get('token');
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    
    // 전체 팝업 배열 업데이트
    if (body.popups && Array.isArray(body.popups)) {
      // 유효성 검사
      for (const popup of body.popups) {
        if (!popup.id || typeof popup.id !== 'string') {
          return NextResponse.json(
            { error: 'Each popup must have a valid id' },
            { status: 400 }
          );
        }
        if (typeof popup.enabled !== 'boolean') {
          return NextResponse.json(
            { error: 'Each popup must have a valid enabled boolean' },
            { status: 400 }
          );
        }
        if (popup.imageUrl !== null && typeof popup.imageUrl !== 'string') {
          return NextResponse.json(
            { error: 'imageUrl must be a string or null' },
            { status: 400 }
          );
        }
      }

      const settings: PopupSettings = {
        popups: body.popups.map((p: PopupItem) => ({
          ...p,
          order: typeof p.order === 'number' ? p.order : 0,
        })).sort((a: PopupItem, b: PopupItem) => a.order - b.order),
      };

      await saveSettings(settings);
      return NextResponse.json({ success: true, settings });
    }
    
    // 단일 팝업 업데이트 (이전 버전 호환성)
    if (body.enabled !== undefined || body.imageUrl !== undefined) {
      const currentSettings = await loadSettings();
      const existingPopup = currentSettings.popups[0];
      
      const updatedPopup: PopupItem = {
        id: existingPopup?.id || `popup-${Date.now()}`,
        order: existingPopup?.order || 0,
        enabled: body.enabled ?? existingPopup?.enabled ?? false,
        imageUrl: body.imageUrl ?? existingPopup?.imageUrl ?? null,
        name: existingPopup?.name || '팝업 1',
      };

      const settings: PopupSettings = {
        popups: [updatedPopup],
      };

      await saveSettings(settings);
      return NextResponse.json({ success: true, settings });
    }

    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

