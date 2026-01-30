'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { WeekNumberLabel } from 'react-day-picker';
import { PopupItem } from '@/app/api/popup-settings/route';
import { ValidationModeFlags } from 'react-hook-form';

interface BannerSettings {
    enabled: boolean;
    text: string;
    backgroundColor: string;
    textColor: string;
    pdfUrl: string | null;
}

export function EventBanner() {
    const pathname = usePathname();
    const bannerRef = useRef<HTMLDivElement>(null);
    const [settings, setSettings] = useState<BannerSettings>({
        enabled: false,
        text: '',
        backgroundColor: '#FF9000',
        textColor: '#FFFFFF',
        pdfUrl: null,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await fetch('/api/banner-settings');
                if (response.ok) {
                    const data = await response.json();
                    setSettings(data);
                }
            } catch (error) {
                console.error('배너 설정 로드 오류:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSettings();
    }, []);

    // 배너 높이 측정 및 업데이트
    useEffect(() => {
        // 메인 페이지가 아니면 초기화
        if (pathname !== '/') {
            document.documentElement.style.setProperty('--banner-height', '0px');
            document.body.style.paddingTop = '';
            document.body.classList.remove('pt-16');
            return;
        }

        // 스크롤 위치 저장
        const scrollY = window.scrollY;

        // 메인 페이지에서 배너가 비활성화되어 있으면 NavBar 높이만 설정
        if (isLoading || !settings.enabled) {
            document.documentElement.style.setProperty('--banner-height', '0px');
            const navBarHeight = 64;
            document.body.style.paddingTop = `${navBarHeight}px`;
            document.body.classList.remove('pt-16');
            
            // 스크롤 위치 복원
            requestAnimationFrame(() => {
                if (scrollY > 0) {
                    window.scrollTo(0, scrollY);
                }
            });
            return;
        }

        const updateBannerHeight = () => {
            if (!bannerRef.current) return;
            
            // 배너의 실제 높이를 측정
            const bannerHeight = bannerRef.current.offsetHeight;
            if (bannerHeight > 0) {
                // 스크롤 위치 저장
                const currentScrollY = window.scrollY;
                
                document.documentElement.style.setProperty('--banner-height', `${bannerHeight}px`);
                // body의 padding-top 설정 (NavBar 높이 64px + 배너 높이)
                const navBarHeight = 64;
                document.body.style.paddingTop = `${navBarHeight + bannerHeight}px`;
                document.body.classList.remove('pt-16');
                
                // 스크롤 위치 복원 (레이아웃 변경 후)
                requestAnimationFrame(() => {
                    if (currentScrollY > 0) {
                        window.scrollTo(0, currentScrollY);
                    }
                });
            }
        };

        // 배너가 렌더링된 후 높이 측정
        const timeoutId = setTimeout(updateBannerHeight, 0);
        
        // ResizeObserver로 배너 크기 변경 감지
        const resizeObserver = new ResizeObserver(updateBannerHeight);
        
        // 배너 요소 관찰 시작 (약간의 지연 후)
        const observeTimeoutId = setTimeout(() => {
            if (bannerRef.current) {
                resizeObserver.observe(bannerRef.current);
            }
        }, 10);
        
        return () => {
            clearTimeout(timeoutId);
            clearTimeout(observeTimeoutId);
            resizeObserver.disconnect();
        };
    }, [pathname, settings.enabled, isLoading, settings.text, settings.pdfUrl]);

    const handleDownload = async () => {
        if (settings.pdfUrl) {
            try {
                // PDF URL에서 파일명 추출
                const fileName = settings.pdfUrl.split('/').pop();
                if (!fileName) return;

                // 다운로드 통계 추적
                fetch('/api/pdf-download', {
                    method: 'POST',
                }).catch(err => console.error('통계 추적 오류:', err));

                // API를 통해 PDF 다운로드
                const response = await fetch(`/api/banner-pdf-download?file=${encodeURIComponent(fileName)}`);
                
                if (!response.ok) {
                    throw new Error('다운로드 실패');
                }

                // Blob으로 변환
                const blob = await response.blob();
                
                // 다운로드 링크 생성
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // URL 해제
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('PDF 다운로드 오류:', error);
                alert('PDF 다운로드에 실패했습니다.');
            }
        }
    };

    // 메인 페이지에서만 표시
    if (pathname !== '/' || isLoading || !settings.enabled) {
        return null;
    }

    return (
        <div
            ref={bannerRef}
            className="fixed top-0 left-0 w-full z-[60] flex items-center justify-center py-1 px-4"
            style={{
                backgroundColor: settings.backgroundColor,
                color: settings.textColor,
            }}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-center w-full">
                <div className="flex items-center gap-2">
                    <span className="text-sm md:text-base font-medium text-center">
                        {settings.text}
                    </span>
                    {settings.pdfUrl && (
                        <button
                            id="PDF-download-button"
                            onClick={handleDownload}
                            className="flex-shrink-0 px-3 py-1 text-xs md:text-sm font-semibold rounded border-2 transition-colors hover:opacity-80"
                            style={{
                                borderColor: settings.textColor,
                                color: settings.textColor,
                            }}
                        >
                            다운로드
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

