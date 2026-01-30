"use client";
import { menuItems } from '@/data/menu';
import { useCart } from '@/shared/context/CartContext';
import { NotificationBoard, PosPanel, KitchenPrinter } from '@/presentation/demo/components';
import type { BoardEntry, BoardItem } from '@/presentation/demo/components/NotificationBoard';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomSheetModal from '@/presentation/components/BottomSheetModal';
import { ActionSection } from '@/presentation/sections/ActionSection';
import AdditionalFeaturesDropdown from './AdditionalFeaturesDropdown';
import PromotionVideo from './PromotionVideo';
import EventImage from './EventImage';
import WifiImage from './WifiImage';
import GameContent from './GameContent';

// 테마 타입 정의
type SidebarTheme = 'white' | 'red' | 'dark';

// 신규 UI 데모 컴포넌트
export default function NewUIDemo({ mode = "full", onInquiryClick, onUIModeChange }: { mode?: "full" | "modal"; onInquiryClick?: () => void; onUIModeChange?: (mode: 'current' | 'new') => void }) {
    const [open, setOpen] = useState(false);
    const [callOpen, setCallOpen] = useState(false);
    const [inquiryOpen, setInquiryOpen] = useState(false);
    const [orderConfirmOpen, setOrderConfirmOpen] = useState(false);
    const [additionalFeaturesOpen, setAdditionalFeaturesOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState<'promotion' | 'event' | 'wifi' | 'game' | null>(null);
    const { items, total, remove, clear, decrease, add, count } = useCart();
    const [orders, setOrders] = useState<BoardEntry[]>([]);
    const categories = Array.from(new Set(menuItems.map((m) => m.category)));
    const [activeCategory, setActiveCategory] = useState<string>(categories[0]);
    const [sidebarTheme, setSidebarTheme] = useState<SidebarTheme>('dark');
    
    // 직원호출 요청 항목들 (StaffCallModal.tsx에서 가져옴)
    const staffRequests = [
        '티슈주세요',
        '테이블정리해주세요',
        '물주세요',
        '수저주세요',
        '직원 호출',
    ];
    
    // 선택된 요청 항목들
    const [selectedRequests, setSelectedRequests] = useState<Record<string, number>>({});
    const notificationRef = useRef<HTMLDivElement>(null);
    const posRef = useRef<HTMLDivElement>(null);
    const kitchenRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const cartScrollRef = useRef<HTMLDivElement>(null);

    // 테마별 스타일 정의
    const getThemeStyles = (theme: SidebarTheme) => {
        switch (theme) {
            case 'white':
                return {
                    sidebar: 'bg-gradient-to-b from-white via-[#c7c7c7] to-[#a9a9a9]',
                    header: 'bg-gradient-to-b from-white to-[#c7c7c7]',
                    category: 'bg-gradient-to-b from-[#c7c7c7] to-[#a9a9a9]',
                    text: 'text-black',
                    textSecondary: 'text-black',
                    selectedBg: 'bg-white',
                    selectedText: 'text-[#ff0000]',
                    button: 'bg-[#bcbcbc] text-black hover:bg-[#a9a9a9]',
                    callButton: 'bg-[#636363] text-white hover:bg-[#4a4a4a]'
                };
            case 'red':
                return {
                    sidebar: 'bg-gradient-to-b from-[#ff8080] via-[#ff3a3a] to-[#d63131]',
                    header: 'bg-gradient-to-b from-[#ff8080] to-[#ff3a3a]',
                    category: 'bg-gradient-to-b from-[#ff3a3a] to-[#d63131]',
                    text: 'text-white',
                    textSecondary: 'text-white',
                    selectedBg: 'bg-white',
                    selectedText: 'text-[#2e2e2e]',
                    button: 'bg-[#f83a3a] text-white hover:bg-[#e40000]',
                    callButton: 'bg-[#a91717] text-white hover:bg-[#8a0f0f]'
                };
            case 'dark':
            default:
                return {
                    sidebar: 'bg-gradient-to-b from-[#5f5f5f] via-[#3c3c3c] to-[#353535]',
                    header: 'bg-gradient-to-b from-[#5f5f5f] to-[#3c3c3c]',
                    category: 'bg-gradient-to-b from-[#3c3c3c] to-[#353535]',
                    text: 'text-white',
                    textSecondary: 'text-white',
                    selectedBg: 'bg-white',
                    selectedText: 'text-black',
                    button: 'bg-gray-500 text-white hover:bg-gray-600',
                    callButton: 'bg-gray-700 text-white hover:bg-gray-800'
                };
        }
    };

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 모바일에서 모달 초기 위치 조정
    useEffect(() => {
        if (mode === "modal" && isMobile) {
            const modalContent = document.querySelector('[data-demo-content]') as HTMLElement;
            if (modalContent) {
                setTimeout(() => {
                    modalContent.scrollTo({
                        top: 50,
                        behavior: 'auto'
                    });
                }, 100);
            }
        }
    }, [mode, isMobile]);

    // 스크롤 이동
    const scrollToElement = (ref: React.RefObject<HTMLDivElement>, delay = 0) => {
        setTimeout(() => {
            if (ref.current) {
                ref.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, delay);
    };

    // 카테고리별 메뉴 아이템 그룹화
    const menuByCategory = categories.reduce((acc, category) => {
        acc[category] = menuItems.filter(item => item.category === category);
        return acc;
    }, {} as { [key: string]: typeof menuItems });

    // 카테고리 클릭 시 해당 섹션으로 스크롤 - 체킹 포인트와 일치
    const scrollToCategory = (category: string) => {
        const element = categoryRefs.current[category];
        const scrollContainer = scrollRef.current;
        
        if (element && scrollContainer) {
            const isLastCategory = category === categories[categories.length - 1];
            
            if (isLastCategory) {
                // 마지막 카테고리: 스크롤 끝으로 이동
                scrollContainer.scrollTo({
                    top: scrollContainer.scrollHeight - scrollContainer.clientHeight,
                    behavior: 'smooth'
                });
            } else {
                // 일반 카테고리: 카테고리 상단에서 150px 아래로 스크롤 (체킹 포인트와 일치)
                const elementTop = element.offsetTop;
                const offset = 150; // 체킹 포인트와 동일한 오프셋
                
                scrollContainer.scrollTo({
                    top: Math.max(0, elementTop - offset),
                    behavior: 'smooth'
                });
            }
        }
    };

    // 스크롤 기반 카테고리 변경 - 상단에서 150px 아래 지점을 체킹 포인트로
    useEffect(() => {
        const handleScroll = () => {
            if (!scrollRef.current) return;
            
            const scrollTop = scrollRef.current.scrollTop;
            const containerHeight = scrollRef.current.clientHeight;
            const scrollHeight = scrollRef.current.scrollHeight;
            
            // 체킹 포인트: 화면 상단에서 150px 아래 지점
            const checkPoint = scrollTop + 150;
            
            let currentCategory = categories[0];
            
            // 각 카테고리를 확인하여 현재 보이는 카테고리 찾기
            for (let i = 0; i < categories.length; i++) {
                const category = categories[i];
                const element = categoryRefs.current[category];
                
                if (element) {
                    const elementTop = element.offsetTop;
                    
                    // 마지막 카테고리인 경우: 스크롤이 거의 끝에 도달했을 때
                    if (i === categories.length - 1) {
                        if (scrollTop + containerHeight >= scrollHeight - 50) {
                            currentCategory = category;
                            break;
                        }
                    } else {
                        // 일반 카테고리: 체킹 포인트가 카테고리 상단을 지나갔으면 활성화
                        if (checkPoint >= elementTop) {
                            currentCategory = category;
                        }
                    }
                }
            }
            
            // activeCategory를 직접 참조하지 않고 함수형 업데이트 사용
            setActiveCategory(prev => {
                if (currentCategory !== prev) {
                    return currentCategory;
                }
                return prev;
            });
        };

        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
            return () => scrollElement.removeEventListener('scroll', handleScroll);
        }
    }, [categories]); // activeCategory 의존성 제거

    // 장바구니 아이템이 추가될 때마다 맨 아래로 스크롤
    useEffect(() => {
        if (cartScrollRef.current && items.length > 0) {
            cartScrollRef.current.scrollTo({
                top: cartScrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [items.length]);


    const handleAck = (id: number) => {
        setOrders((prev) => {
            const target = prev.find((o) => o.id === id);
            if (!target) return prev;
            if (target.type === 'staff') {
                return prev.filter((o) => o.id !== id);
            }
            return prev.map((o) => (o.id === id ? { ...o, ack: true } : o));
        });
    };

    // 직원호출 요청 항목 추가/제거 함수들
    const addRequestItem = (name: string) => {
        setSelectedRequests((prev) => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
    };

    const minusRequestItem = (name: string) => {
        setSelectedRequests((prev) => {
            const qty = (prev[name] || 1) - 1;
            if (qty <= 0) {
                const { [name]: _omit, ...rest } = prev;
                return rest;
            }
            return { ...prev, [name]: qty };
        });
    };

    const clearAllRequests = () => setSelectedRequests({});

    // 직원호출 요청 처리
    const handleStaffRequest = () => {
        if (Object.keys(selectedRequests).length === 0) {
            setCallOpen(false);
            return;
        }
        
        // 알림판에 직원호출 요청 추가
        const requestItems: BoardItem[] = Object.entries(selectedRequests).map(([name, qty]) => ({
            name,
            qty,
            price: 0, // 직원호출은 가격 없음
            category: 'staff'
        }));
        
        const newId = Date.now();
        setOrders((prev) => [
            ...prev,
            {
                id: newId,
                items: requestItems,
                created: Date.now(),
                ack: false,
                type: 'staff',
                stage: 1,
            } as BoardEntry,
        ]);
        
        // 알림판으로 스크롤
        setTimeout(() => {
            scrollToElement(notificationRef, 300);
        }, 100);
        
        clearAllRequests();
        setCallOpen(false);
    };

    // 추가기능 관련 함수들
    const handleAdditionalFeaturesClick = () => {
        setAdditionalFeaturesOpen(!additionalFeaturesOpen);
    };

    const handleFeatureSelect = (feature: 'promotion' | 'event' | 'wifi' | 'game') => {
        setActiveFeature(feature);
    };

    const handleFeatureClose = () => {
        setActiveFeature(null);
        // 드롭다운은 열린 상태로 유지 (튜토리얼을 위해)
    };

    return (
        <div className={`relative min-h-screen bg-gray-50 flex flex-col items-center px-4 ${mode === "modal" && isMobile ? "pt-2 pb-40" : "pt-8 pb-20 md:pb-32"}`}>
            {/* UI 선택 버튼 */}
            <div className="mb-6 flex justify-center gap-4">
                <button
                    className="relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700"
                >
                    신규 UI
                    {/* 뱃지 - 오른쪽 상단 */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                </button>
                <button
                    onClick={() => {
                        // 현재 UI로 전환 (부모 컴포넌트의 상태 변경)
                        if (onUIModeChange) {
                            onUIModeChange('current');
                        }
                    }}
                    className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md border border-gray-200"
                >
                    이전 UI
                </button>
            </div>
            
            {/* 테마 선택 버튼 */}
            <div className="flex justify-center gap-3 mb-6" data-theme-selector>
                <button
                    onClick={() => setSidebarTheme('white')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                        sidebarTheme === 'white' 
                            ? 'bg-white text-gray-800 shadow-md border-2 border-gray-300' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-200 to-gray-400"></div>
                    그레이
                </button>
                <button
                    onClick={() => setSidebarTheme('red')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                        sidebarTheme === 'red' 
                            ? 'bg-white text-red-800 shadow-md border-2 border-red-300' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-600"></div>
                    레드
                </button>
                <button
                    onClick={() => setSidebarTheme('dark')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                        sidebarTheme === 'dark' 
                            ? 'bg-white text-gray-800 shadow-md border-2 border-gray-600' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-600 to-gray-800"></div>
                    다크
                </button>
            </div>
            
            {/* 모바일 안내 메시지 */}
            {isMobile && (
                <div className="w-full max-w-4xl mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-blue-700 text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">PC로 확인하시면 보다 정확한 체험이 가능합니다</span>
                    </div>
                </div>
            )}
            
            {/* 신규 UI 태블릿 프레임 */}
            <div className="mx-auto w-full max-w-[900px] bg-black rounded-3xl p-4 select-none relative">
                <div className="bg-white rounded-xl overflow-hidden h-[560px] flex relative" id="tablet-container">
                    {/* 추가기능 콘텐츠 - 전체 테블릿 크기 */}
                    {activeFeature === 'promotion' && (
                        <div className="absolute inset-0 bg-white z-[400]">
                            <PromotionVideo onClose={handleFeatureClose} />
                        </div>
                    )}
                    {activeFeature === 'event' && (
                        <div className="absolute inset-0 bg-white z-[400]">
                            <EventImage onClose={handleFeatureClose} />
                        </div>
                    )}
                    {activeFeature === 'wifi' && (
                        <div className="absolute inset-0 bg-white z-[400]">
                            <WifiImage onClose={handleFeatureClose} />
                        </div>
                    )}
                    {activeFeature === 'game' && (
                        <div className="absolute inset-0 bg-white z-[400]">
                            <GameContent onClose={handleFeatureClose} />
                        </div>
                    )}
                    {/* 좌측 사이드바 - 테마 적용 */}
                    <div className={`w-[150px] ${getThemeStyles(sidebarTheme).sidebar} flex flex-col rounded-r-2xl relative z-10`} style={{boxShadow: '4px 0 8px rgba(0, 0, 0, 0.15)'}}>
                        {/* 상단 로고 영역 */}
                        <div className={`h-[100px] ${getThemeStyles(sidebarTheme).header} flex items-center justify-center relative rounded-tr-2xl`}>
                            <div className="flex items-center gap-1">
                                {/* KT 로고 */}
                                <img 
                                    src={sidebarTheme === 'white' ? "/KT_Logo.png" : "/DemoImages/Kt_Logo_White.png"} 
                                    alt="KT Logo" 
                                    className="w-[16px] h-[14px]"
                                />
                                {/* 하이오더 텍스트 */}
                                <span className={`${getThemeStyles(sidebarTheme).text} text-sm font-bold`}>하이오더</span>
                            </div>
                            {/* 테이블 번호 */}
                            <div className="absolute bottom-2 right-1/2 transform translate-x-1/2">
                                <div className={`w-4 h-4 border-2 ${sidebarTheme === 'white' ? 'border-[#bdbdbd]' : 'border-white'} rounded-full flex items-center justify-center`}>
                                    <span className={`${getThemeStyles(sidebarTheme).text} text-xs font-bold`}>1</span>
                                </div>
                            </div>
                        </div>

                        {/* 중앙 카테고리 목록 */}
                        <div className={`flex-1 ${getThemeStyles(sidebarTheme).category} py-1`}>
                            {categories.map((category, index) => (
                                <button
                                    key={category}
                                    onClick={() => scrollToCategory(category)}
                                    className={`w-full h-[40px] flex items-center justify-start pl-4 text-sm font-bold transition-colors ${
                                        category === activeCategory 
                                            ? `${getThemeStyles(sidebarTheme).selectedBg} ${getThemeStyles(sidebarTheme).selectedText} border-l-4 ${sidebarTheme === 'red' ? 'border-[#e40000]' : 'border-red-500'}` 
                                            : `${getThemeStyles(sidebarTheme).textSecondary} hover:opacity-80`
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* 하단 버튼 영역 */}
                        <div className={`h-[100px] ${getThemeStyles(sidebarTheme).category} p-3 flex flex-col justify-end space-y-2 rounded-br-2xl`}>
                            {/* LANGUAGE 버튼 */}
                            <div className={`flex items-center justify-center ${getThemeStyles(sidebarTheme).text} text-xs font-medium`}>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                                </svg>
                                LANGUAGE
                            </div>
                            
                            {/* 직원호출 버튼 */}
                            <button 
                                onClick={() => setCallOpen(true)}
                                className={`w-full h-[35px] ${getThemeStyles(sidebarTheme).callButton} text-xs font-medium rounded-lg transition-colors`}
                                data-staff-call
                            >
                                직원호출
                            </button>
                        </div>
                    </div>

                    {/* 중앙 메뉴 영역 - Figma 디자인 기반 */}
                    <div className="flex-1 bg-white flex flex-col relative rounded-r-2xl shadow-lg" style={{boxShadow: '4px 0 8px rgba(0, 0, 0, 0.15)'}}>
                        {/* Fixed 추가기능 버튼 - 태블릿 내부 고정 */}
                        <button 
                            id="additional-features-button"
                            onClick={handleAdditionalFeaturesClick}
                            className={`absolute top-4 right-8 z-10 flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs hover:bg-gray-50 transition-colors shadow-sm ${
                                additionalFeaturesOpen 
                                    ? 'border border-[#ff2222] text-[#ff2222]' 
                                    : 'border border-[#bebebe] text-[#b3b3b3]'
                            }`}
                            data-additional-features
                        >
                            추가 기능
                            <svg 
                                className={`w-2 h-2 ${additionalFeaturesOpen ? 'text-[#ff2222]' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* 추가기능 드롭다운 - 테이블 내부에 위치 */}
                        <AdditionalFeaturesDropdown 
                            isOpen={additionalFeaturesOpen}
                            onClose={() => setAdditionalFeaturesOpen(false)}
                            onFeatureSelect={handleFeatureSelect}
                        />


                        {/* 메뉴 그리드 - 스크롤 가능 */}
                        <div className="flex-1 p-6 overflow-y-auto scrollbar-hide" ref={scrollRef} style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                            {categories.map((category, categoryIndex) => (
                                <div key={category} ref={el => { categoryRefs.current[category] = el; }} className={`mb-8 ${categoryIndex === categories.length - 1 ? 'pb-40' : ''}`}>
                                    {/* 카테고리 이름 */}
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{category}</h3>
                                    
                                    {/* 카테고리별 메뉴 그리드 */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {menuByCategory[category].map((item, index) => (
                                            <button
                                                key={item.id}
                                                onClick={() => add(item)}
                                                className="text-left group transition-all duration-300"
                                                data-menu-item
                                            >
                                                {/* 이미지 영역 - 라운드 처리 */}
                                                <div className="relative w-full h-[140px] bg-gray-200 rounded-2xl mb-3 flex items-center justify-center overflow-hidden">
                                                    {item.image ? (
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.name}
                                                            className="w-full h-full object-cover rounded-2xl"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">이미지</span>
                                                    )}
                                                    
                                                    {/* BEST/NEW 배지 - 이미지 왼쪽 하단에 배치 */}
                                                    {index === 0 && (
                                                        <div className="absolute bottom-2 left-2 bg-gradient-to-r from-[#ffd6a0] to-[#ff9d1d] text-white text-xs px-2 py-1 rounded-xl font-medium">
                                                            BEST
                                                        </div>
                                                    )}
                                                    {index === 1 && (
                                                        <div className="absolute bottom-2 left-2 bg-gradient-to-r from-[#ff8080] to-[#ff1d1d] text-white text-xs px-2 py-1 rounded-xl font-medium">
                                                            NEW
                                                        </div>
                                                    )}
                                                </div>

                                                {/* 메뉴 정보 - 배경 없음, 고정 높이 */}
                                                <div className="h-[60px] flex flex-col justify-between">
                                                    {/* 메뉴 이름 */}
                                                    <h3 className="text-sm font-medium text-black">{item.name}</h3>

                                                    {/* 가격 정보 - 모든 카드 동일한 높이 유지 */}
                                                    <div className="space-y-1">
                                                        {item.originalPrice && item.discountPercent ? (
                                                            <>
                                                                <div className="text-xs text-[#6a6a6a] line-through">{item.originalPrice.toLocaleString()}원</div>
                                                                <div className="text-sm font-medium text-black"><span className="text-red-500 font-bold">{item.discountPercent}%</span> {item.price.toLocaleString()}원</div>
                                                            </>
                                                        ) : item.isSpicy ? (
                                                            <>
                                                                <div className="text-sm font-medium text-black">{item.price.toLocaleString()}원</div>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-xs text-[#6a6a6a]">맵기</span>
                                                                    <div className="flex gap-1">
                                                                        <div className="w-2 h-2 bg-[#ff4040] rounded-full"></div>
                                                                        <div className="w-2 h-2 bg-[#d9d9d9] rounded-full"></div>
                                                                        <div className="w-2 h-2 bg-[#d9d9d9] rounded-full"></div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="text-sm font-medium text-black">{item.price.toLocaleString()}원</div>
                                                                <div className="h-[16px]"></div> {/* 빈 공간으로 높이 맞춤 */}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 우측 장바구니 영역 - 메뉴 선택 시에만 나타남 */}
                    {count > 0 && (
                        <div id="cart-container" className={`${isMobile ? 'absolute top-0 right-0 bottom-0 left-8 z-50 bg-white' : 'w-[220px]'} bg-gray-100 flex flex-col`} data-cart-container>
                            {/* 장바구니 헤더 - 컴팩트 버전 */}
                            <div className="h-[60px] flex items-center justify-between px-4" data-cart>
                                <h3 className="text-[20px] font-semibold text-[#2e2e2e]">
                                    장바구니 <span className="text-red-500">{items.length}</span>
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={clear}
                                        className="w-[70px] h-[24px] border border-[#bebebe] rounded-[20px] bg-transparent text-[#b3b3b3] text-[14px] font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        모두삭제
                                    </button>
                                    {/* 모바일에서만 닫기 버튼 표시 */}
                                    {isMobile && (
                                        <button 
                                            onClick={() => clear()}
                                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* 장바구니 아이템들 - 스크롤 가능 */}
                            <div ref={cartScrollRef} className="flex-1 overflow-y-auto p-3 scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {items.map((item, index) => (
                                            <motion.div 
                                                key={item.item.id}
                                                initial={{ x: -100, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: -100, opacity: 0 }}
                                                transition={{ 
                                                    type: "spring", 
                                                    stiffness: 300, 
                                                    damping: 30,
                                                    duration: 0.4
                                                }}
                                                className="space-y-3"
                                            >
                                            {/* 메뉴 아이템 - 2열 레이아웃 */}
                                            <div className="space-y-3">
                                                {/* 1열: 음식명 + 삭제버튼 */}
                                                <div className="flex justify-between items-center">
                                                    <h4 className="text-[16px] font-semibold text-[#2e2e2e] underline decoration-blue-500">
                                                        {item.item.name}
                                                    </h4>
                                                    <button 
                                                        onClick={() => remove(item.item.id)}
                                                        className="w-[50px] h-[20px] border border-[#bebebe] rounded-[10px] bg-transparent text-[#b3b3b3] text-[12px] font-medium hover:bg-gray-50 transition-colors"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                                
                                                {/* 2열: 가격 + 수량 조절 버튼 */}
                                                <div className="flex justify-between items-center">
                                                    <div className="text-[14px] font-medium text-[#4f4f4f]">
                                                        {item.item.price.toLocaleString()}원
                                                    </div>

                                                    {/* 수량 조절 버튼 - 더 작게 */}
                                                    <div className="w-[80px] h-[24px] bg-[#DADADA] rounded-[6px] flex items-center justify-between px-1">
                                                        <button 
                                                            onClick={() => decrease(item.item.id)}
                                                            className="w-[18px] h-[18px] bg-[#C0C0C0] rounded-[4px] flex items-center justify-center text-[#717070] text-[14px] font-medium hover:bg-[#c7c7c7] transition-colors"
                                                            disabled={item.qty === 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-[12px] font-semibold text-black">
                                                            {item.qty}
                                                        </span>
                                                        <button 
                                                            onClick={() => add(item.item)}
                                                            className="w-[18px] h-[18px] bg-white rounded-[4px] flex items-center justify-center text-black text-[14px] font-medium hover:bg-gray-100 transition-colors"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* 구분선 - 마지막 아이템이 아닐 때만 표시 */}
                                            {index < items.length - 1 && (
                                                <div className="border-t border-gray-200"></div>
                                            )}
                                        </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    
                                    {/* 빈 장바구니 메시지 */}
                                    {items.length === 0 && (
                                        <div className="text-center py-8">
                                            <p className="text-[14px] text-[#b3b3b3] font-medium">
                                                장바구니가 비어있습니다
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 장바구니 하단 - 컴팩트 버전 */}
                            <div className="h-[90px] p-4 flex flex-col justify-between">
                                <div className="flex justify-between items-center">
                                    <span className="text-[14px] font-medium text-[#808080]">
                                        총 금액
                                    </span>
                                    <span className="text-[18px] font-bold text-[#1b1b1b]">
                                        {total.toLocaleString()}원
                                    </span>
                                </div>
                                <button 
                                    onClick={() => {
                                        if (items.length === 0) return;
                                        setOrderConfirmOpen(true);
                                    }}
                                    className="w-full h-[44px] bg-red-500 text-white rounded-[8px] text-[16px] font-semibold hover:bg-red-600 transition-colors"
                                    data-order-submit
                                >
                                    주문하기
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 주문 확인 팝업 - 가변 높이 처리 */}
                    {orderConfirmOpen && (
                        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-75">
                            {/* 팝업 컨테이너 - 가변 높이 */}
                            <div className={`relative bg-white rounded-[20px] w-[480px] flex flex-col ${
                                items.length <= 3 ? 'h-auto' : 'h-[400px]'
                            }`}>
                                {/* 팝업 헤더 - 고정 */}
                                <div className="p-6 pb-4">
                                    <h2 className="text-[20px] font-semibold text-black text-center">
                                        주문하실 상품과 결제금액을 확인해 주세요
                                    </h2>
                                </div>
                                
                                {/* 주문 아이템들 - 가변/스크롤 처리 */}
                                <div className={`px-6 ${items.length > 3 ? 'flex-1 overflow-y-auto scrollbar-hide' : ''}`} style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                                    {/* 항상 하나의 회색 박스 안에 여러 줄로 표시 */}
                                    <div className="bg-[#d9d9d9] rounded-[10px] p-4 shadow-sm border border-gray-200">
                                        <div className="space-y-2">
                                            {items.map((item) => (
                                                <div key={item.item.id} className="flex justify-between items-center">
                                                    <span className="text-[18px] font-semibold text-black">
                                                        {item.item.name} x {item.qty}
                                                    </span>
                                                    <span className="text-[16px] font-semibold text-[#4d4d4d]">
                                                        {(item.item.price * item.qty).toLocaleString()}원
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* 팝업 하단 - 고정 */}
                                <div className="p-6 pt-4">
                                    {/* 총 주문 금액 */}
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[16px] font-medium text-[#4d4d4d]">
                                            총 주문 금액
                                        </span>
                                        <span className="text-[20px] font-bold text-[#020202]">
                                            {total.toLocaleString()}원
                                        </span>
                                    </div>
                                    
                                    {/* 버튼 그룹 */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setOrderConfirmOpen(false)}
                                            className="flex-1 h-[50px] bg-[#929292] text-white rounded-[8px] text-[18px] font-semibold hover:bg-[#7a7a7a] transition-colors"
                                        >
                                            취소
                                        </button>
                                        <button
                                            onClick={() => {
                                                // 주문 처리 로직
                                                const orderItems: BoardItem[] = items.map((c) => ({ name: c.item.name, qty: c.qty, price: c.item.price, category: c.item.category }));
                                                const newId = Date.now();
                                                setOrders((prev) => [
                                                    ...prev,
                                                    {
                                                        id: newId,
                                                        items: orderItems,
                                                        created: Date.now(),
                                                        ack: false,
                                                        type: 'order',
                                                        stage: 1,
                                                    } as BoardEntry,
                                                ]);
                                                setTimeout(() => {
                                                    setOrders((prev) => prev.map((o) => (o.id === newId ? { ...o, stage: 2 } : o)));
                                                    scrollToElement(posRef, 200);
                                                }, 1500);
                                                setTimeout(() => {
                                                    setOrders((prev) => prev.map((o) => (o.id === newId ? { ...o, stage: 3 } : o)));
                                                    scrollToElement(kitchenRef, 200);
                                                }, 3000);
                                                clear();
                                                setOrderConfirmOpen(false);
                                                scrollToElement(notificationRef, 300);
                                            }}
                                            className="flex-[1.5] h-[50px] bg-[#df0000] text-white rounded-[8px] text-[18px] font-semibold hover:bg-[#c00000] transition-colors"
                                            data-order-confirm-submit
                                        >
                                            주문하기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 직원호출 팝업 - 테이블 내부에 표시 */}
                    {callOpen && (
                        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-75">
                            {/* 팝업 컨테이너 - 테이블 크기에 맞게 조정 */}
                            <div className={`relative bg-white flex flex-col ${isMobile ? 'w-[400px] h-[450px]' : 'w-[600px] h-[400px]'}`} style={{borderRadius: '15px'}}>
                                {/* 팝업 헤더 */}
                                <div className={`flex items-center justify-between px-6 border-b border-[#b0b0b0] ${isMobile ? 'h-[50px]' : 'h-[60px]'}`}>
                                    <h2 className="text-[20px] font-semibold text-black">
                                        직원호출
                                    </h2>
                                    <button 
                                        onClick={() => {
                                            setCallOpen(false);
                                            setSelectedRequests({});
                                        }}
                                        className="w-[24px] h-[24px] flex items-center justify-center text-[#666] hover:text-black transition-colors"
                                    >
                                        <span className="text-[18px] font-bold">×</span>
                                    </button>
                                </div>
                                
                                {/* 팝업 내용 */}
                                <div className="flex-1 flex">
                                    {/* 왼쪽 영역 - 호출 항목들 */}
                                    <div className={`flex-1 p-4 ${isMobile ? 'overflow-y-auto scrollbar-hide' : ''}`}>
                                        <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
                                            {/* 호출 항목 카드들 - 실제 요청 항목들 사용 */}
                                            {staffRequests.map((request) => (
                                                <button 
                                                    key={request}
                                                    onClick={() => addRequestItem(request)}
                                                    className={`bg-transparent border border-[#a3a3a3] rounded-[6px] flex items-center justify-center hover:bg-gray-50 transition-colors ${isMobile ? 'h-[50px]' : 'h-[60px]'}`}
                                                >
                                                    <span className={`font-medium text-black ${isMobile ? 'text-[12px]' : 'text-[14px]'}`}>
                                                        {request}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* 오른쪽 영역 - 선택된 항목 및 버튼 */}
                                    <div className={`bg-[#dedede] flex flex-col ${isMobile ? 'w-[150px]' : 'w-[200px]'}`} style={{borderBottomRightRadius: '15px'}}>
                                        {/* 상단 - 선택된 항목 */}
                                        <div className="flex-1 p-4">
                                            <div className="h-[50px] flex items-center justify-between">
                                                <span className="text-[16px] font-medium text-[#2e2e2e]">
                                                    호출내용
                                                </span>
                                                <button 
                                                    onClick={clearAllRequests}
                                                    className="w-[60px] h-[24px] border border-[#bebebe] rounded-[12px] bg-transparent text-[#b3b3b3] text-[12px] font-medium hover:bg-gray-50 transition-colors" 
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                            
                                            {/* 선택된 요청 항목들 표시 */}
                                            <div className="space-y-2">
                                                {Object.keys(selectedRequests).length === 0 && (
                                                    <p className="text-[12px] text-[#666] text-center font-medium">
                                                        왼쪽에서 요청하실 항목을 선택해 주세요.
                                                    </p>
                                                )}
                                                {Object.entries(selectedRequests).map(([name, qty]) => (
                                                    <div key={name} className="flex items-center justify-between text-[12px]">
                                                        <span className="flex-1 font-medium">{name}</span>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => minusRequestItem(name)}
                                                                className="w-[20px] h-[20px] border border-[#bebebe] rounded-[4px] flex items-center justify-center text-[10px] font-medium hover:bg-gray-200"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-[20px] text-center font-semibold">{qty}</span>
                                                            <button
                                                                onClick={() => addRequestItem(name)}
                                                                className="w-[20px] h-[20px] border border-[#bebebe] rounded-[4px] flex items-center justify-center text-[10px] font-medium hover:bg-gray-200"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* 하단 - 요청하기 버튼 */}
                                        <div className={`bg-[#eeeeee] flex items-center justify-center p-4 ${isMobile ? 'h-[70px]' : 'h-[80px]'}`} style={{borderBottomRightRadius: '15px'}}>
                                            <button 
                                                onClick={handleStaffRequest}
                                                className="w-full h-[44px] bg-[#ff0000] text-white rounded-[6px] text-[16px] font-semibold hover:bg-[#e00000] transition-colors disabled:opacity-40"
                                                disabled={Object.keys(selectedRequests).length === 0}
                                            >
                                                요청하기
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 하단 액션 섹션들 */}
            <div className={`${isMobile ? 'flex flex-col space-y-6 w-full px-4' : 'flex gap-6 justify-center'} mt-6 w-full max-w-6xl`}>
                <div ref={notificationRef} className={`${isMobile ? 'w-full' : ''}`} data-notification-board>
                    <NotificationBoard orders={orders} onAck={handleAck} />
                </div>
                {mode === "full" && (
                    <div ref={posRef} className={`${isMobile ? 'w-full' : ''}`}>
                        <PosPanel orders={orders} />
                    </div>
                )}
                {mode === "full" && (
                    <div ref={kitchenRef} className={`${isMobile ? 'w-full' : ''}`}>
                        <KitchenPrinter orders={orders} />
                    </div>
                )}
            </div>

            {/* 모달들 */}
            <BottomSheetModal
                open={open}
                onClose={() => setOpen(false)}
            >
                <div className="p-4">
                    <p>신규 UI 데모 모달입니다.</p>
                </div>
            </BottomSheetModal>


            {/* 상담신청 버튼 */}
            <div className="mt-4 md:mt-6 flex justify-center">
                <button
                    onClick={() => {
                        if (onInquiryClick) {
                            onInquiryClick(); // 데모 모달 닫기
                        } else {
                            setInquiryOpen(true); // 일반 모드에서는 바로 상담 모달 열기
                        }
                    }}
                    className="shadow-lg transition-transform will-change-transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl"
                    style={{
                        width: 'min(295px, 85vw)',
                        height: 53,
                        borderRadius: 9999,
                        border: '3px solid transparent',
                        background: 'linear-gradient(90deg, #2B2A2A, #515151) padding-box, linear-gradient(90deg, #FFFFFF, #FF8400) border-box',
                        backgroundOrigin: 'padding-box, border-box',
                        backgroundClip: 'padding-box, border-box',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 'clamp(14px, 4vw, 16px)',
                        color: '#FFFFFF',
                        padding: '0 16px',
                        outline: 'none',
                        gap: 4,
                        marginBottom: isMobile ? 8 : 0,
                    }}
                >
                    <img
                        src="/BottomFixed/BottomFixed_Icon.png"
                        alt="문의 아이콘"
                        width={26}
                        height={26}
                        className="inline-block align-middle"
                    />
                    지금바로 상담신청하기
                </button>
            </div>

            {/* 상담신청 모달 */}
            <BottomSheetModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} maxWidth="600px" padding="p-2" scrollable={false}>
                <ActionSection hideImage={true} hideHeader={true} compactMode={true} />
            </BottomSheetModal>



        </div>
    );
}
