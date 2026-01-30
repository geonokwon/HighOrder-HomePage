import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'data', 'youtube-settings.json');

// YouTube Video ID 가져오기
export async function GET() {
    try {
        const fileContents = fs.readFileSync(settingsPath, 'utf8');
        const settings = JSON.parse(fileContents);
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error reading YouTube settings:', error);
        return NextResponse.json(
            { videoId: 'rA0kz_AAWDA' }, // 기본값
            { status: 200 }
        );
    }
}

export async function DELETE() {
    try {
        fs.unlinkSync(settingsPath);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting YouTube Settings:', error);
        return NextResponse.json({ error: ''})
    }
}

// YouTube Video ID 업데이트
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { videoId } = body;

        if (!videoId) {
            return NextResponse.json(
                { error: 'Video ID is required' },
                { status: 400 }
            );
        }

        // YouTube URL에서 Video ID 추출
        let extractedVideoId = videoId.trim();
        
        // 다양한 YouTube URL 형식 지원
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = videoId.match(youtubeRegex);
        
        if (match && match[1]) {
            extractedVideoId = match[1];
        }

        const settings = {
            videoId: extractedVideoId,
            updatedAt: new Date().toISOString(),
        };

        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

        return NextResponse.json({ success: true, settings });
    } catch (error) {
        console.error('Error updating YouTube settings:', error);
        return NextResponse.json(
            { error: 'Failed to update YouTube settings' },
            { status: 500 }
        );
    }
}
