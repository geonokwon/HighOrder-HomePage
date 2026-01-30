"use client";
import React, { useState, useEffect } from 'react';
import BottomSheetModal from '@/presentation/components/BottomSheetModal';
import { InteractiveTutorial } from '@/presentation/components';
import { CartProvider } from '@/shared/context/CartContext';
import DemoInner from '@/presentation/demo/components/DemoInner';
import { ActionSection } from '@/presentation/sections/ActionSection';

export function NavigationSection() {
    const [activeSection, setActiveSection] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [winWidth, setWinWidth] = useState(1200);
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const [showInquiryModal, setShowInquiryModal] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);

    // 창 크기 감지 및 초기 상태 설정
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => setWinWidth(window.innerWidth);
        handleResize();
        window.addEventListener('resize', handleResize);

        // 초기 open 상태
        setIsOpen(window.innerWidth >= 1024);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 데모 모달 렌더링 제어
    useEffect(() => {
        if (showDemoModal) {
            setShouldRender(true);
            setShowTutorial(true); // 데모 모달이 열리면 먼저 튜토리얼 표시
        } else {
            const timeout = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [showDemoModal]);

    const handleTutorialComplete = () => {
        setShowTutorial(false); // 튜토리얼 종료
    };

    const handleTutorialClose = () => {
        setShowTutorial(false);
        setShowDemoModal(false); // 튜토리얼을 닫으면 전체 데모도 닫기
    };

    const toggleNav = () => {
        // 모든 해상도에서 토글, 다만 초기 상태는 데스크톱에서 열려 있음
        setIsOpen((prev) => !prev);
    };

    const closeNav = () => setIsOpen(false);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = sectionId === 'hero-section' ? 0 : 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            // HeroSection 이동 시 활성 상태 초기화, 그 외에는 즉시 활성화
            if (sectionId === 'hero-section') {
                setActiveSection('');
            } else {
                setActiveSection(sectionId);
            }

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    // 스크롤 위치에 따라 활성 섹션 감지
    useEffect(() => {
        const handleScroll = () => {
            const trackedSections = ['feature-section', 'benefit-section', 'review-section'];
            const scrollMiddle = window.scrollY + window.innerHeight / 2;

            let currentActiveSection = '';

            for (const sectionId of trackedSections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const elementTop = rect.top + window.scrollY;
                    const elementBottom = rect.bottom + window.scrollY;

                    if (scrollMiddle >= elementTop && scrollMiddle < elementBottom) {
                        currentActiveSection = sectionId;
                        break;
                    }
                }
            }

            // 첫 섹션 위(= HeroSection 영역)인지 확인
            const firstEl = document.getElementById(trackedSections[0]);
            const heroZone = firstEl ? scrollMiddle < (firstEl.getBoundingClientRect().top + window.scrollY) : false;

            if (heroZone) {
                setActiveSection('');
                return;
            }

            // 섹션에 들어왔을 때만 업데이트, 섹션 사이 구간에서는 이전 상태 유지
            if (currentActiveSection && currentActiveSection !== activeSection) {
                setActiveSection(currentActiveSection);
            }
            // 아무 섹션도 아니고 heroZone도 아니면 유지
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        { id: 'hero-section', label: '맨 위로' },
        { id: 'feature-section', label: '상품상세 설명' },
        { id: 'benefit-section', label: '혜택 보러가기' },
        { id: 'review-section', label: '후기' },
    ];

    // 1) 상단 상수 & 좌표 계산부
    const panelMargin = 4; // px space from left edge
    const panelWidth = 137; // px
    const closedOffsetMobile = panelMargin + 6;   // 2px gap beyond panel margin (reduced from 8px)
    const closedOffsetDesktop = panelMargin + 16; // bigger gap on desktop

    const offsetClosed = winWidth >= 1024 ? closedOffsetDesktop : closedOffsetMobile;
    const offsetOpen = panelMargin + panelWidth; // button flush with panel right
    const buttonLeft = isOpen ? offsetOpen : offsetClosed;

    return (
        <>
            {/* 토글 버튼: 패널 오른쪽에 붙음 */}
            <button
                onClick={toggleNav}
                style={{ left: `${buttonLeft}px` }}
                className={`fixed top-1/2 -translate-y-1/2 z-40 flex items-center justify-center bg-white text-[#FF9000] border border-[#FF9000] shadow-lg transition-all duration-300
                    ${isOpen ? 'w-8 h-20 rounded-l-none rounded-r-full' : 'w-10 h-10 rounded-full'}`}
                aria-label="네비게이션 토글"
            >
                {isOpen ? '‹' : '☰'}
            </button>

            {/* 네비게이션 패널 */}
            <div
                className={`fixed left-2 top-1/2 -translate-y-1/2 z-50 transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="bg-white rounded-lg shadow-lg border border-[#FF9000] p-4 relative">
                    <div className="flex flex-col space-y-4">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    scrollToSection(item.id);
                                    if (winWidth < 1024) closeNav(); // 모바일에서만 자동 닫기
                                }}
                                className={`text-sm font-medium px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
                                    activeSection === item.id
                                        ? 'bg-[#FF9000] text-white shadow-md'
                                        : 'text-gray-600 hover:text-[#FF9000] hover:bg-orange-50 font-semibold'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                        
                        {/* 구분선 */}
                        <div className="border-t border-gray-200 my-2"></div>
                        
                        {/* 체험해보기 버튼 */}
                        <button
                            onClick={() => {
                                setShowDemoModal(true);
                                if (winWidth < 1024) closeNav(); // 모바일에서만 자동 닫기
                            }}
                            className="text-sm font-medium px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap bg-[#FF9000] text-white shadow-md hover:bg-[#FF8000] font-semibold"
                        >
                            체험해보기
                        </button>
                        {/* 각종 계산기 버튼 */}
                        <button 
                            onClick={() => {
                                window.open('/calc', '_blank');
                                if (winWidth < 1024) closeNav(); // 모바일에서만 자동 닫기
                            }}
                            className="text-sm font-medium px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap bg-[#FF9000] text-white shadow-md hover:bg-[#FF8000] font-semibold"
                        >
                            자영업 계산기
                        </button>
                    </div>
                </div>
            </div>

            {/* 데모 모달 - DemoSection과 동일한 방식 */}
            <BottomSheetModal open={showDemoModal} onClose={() => setShowDemoModal(false)} maxWidth="1400px" isDemo={true}>
                {shouldRender && (
                    <CartProvider>
                        <DemoInner 
                            onInquiryClick={() => {
                                setShowDemoModal(false);
                                setShowInquiryModal(true);
                            }}
                        />
                    </CartProvider>
                )}
            </BottomSheetModal>

            {/* 상담신청 모달 */}
            <BottomSheetModal open={showInquiryModal} onClose={() => setShowInquiryModal(false)} maxWidth="600px" padding="p-2" scrollable={false}>
                <ActionSection hideImage={true} hideHeader={true} compactMode={true} />
            </BottomSheetModal>

            {/* 인터랙티브 튜토리얼 */}
            <InteractiveTutorial
                isVisible={showTutorial}
                onComplete={handleTutorialComplete}
                onClose={handleTutorialClose}
            />
        </>
    );
} 