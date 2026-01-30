"use client";
import { menuItems } from '@/data/menu';
import { useCart } from '@/shared/context/CartContext';
import { MenuItemCard, TabletFrame, StaffCallModal, CategoryTabs, BottomBar, NotificationBoard, PosPanel, KitchenPrinter } from '@/presentation/demo/components';
import NewUIDemo from './NewUIDemo';
import type { BoardEntry, BoardItem } from '@/presentation/demo/components/NotificationBoard';
import { useState, useRef, useEffect } from 'react';
import BottomSheetModal from '@/presentation/components/BottomSheetModal';
import { ActionSection } from '@/presentation/sections/ActionSection';

export default function DemoInner({ mode = "full", onInquiryClick }: { mode?: "full" | "modal"; onInquiryClick?: () => void }) {
    const [open, setOpen] = useState(false);
    const [callOpen, setCallOpen] = useState(false);
    const [inquiryOpen, setInquiryOpen] = useState(false);
    const { items, total, remove, clear, decrease, add } = useCart();
    const [orders, setOrders] = useState<BoardEntry[]>([]);
    const categories = Array.from(new Set(menuItems.map((m) => m.category)));
    const [cat, setCat] = useState<string>(categories[0]);
    const notificationRef = useRef<HTMLDivElement>(null);
    const posRef = useRef<HTMLDivElement>(null);
    const kitchenRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    type UIMode = 'current' | 'new';
    const [uiMode, setUiMode] = useState<UIMode>('new');

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 모바일에서 모달 초기 위치 조정 (하이오더 하단부분이 보이도록)
    useEffect(() => {
        if (mode === "modal" && isMobile) {
            const modalContent = document.querySelector('[data-demo-content]') as HTMLElement;
            if (modalContent) {
                setTimeout(() => {
                    modalContent.scrollTo({
                        top: 50, // 50px 아래로 시작
                        behavior: 'auto'
                    });
                }, 100); // 모달 애니메이션 완료 후
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

    // 신규 UI 모드인 경우 NewUIDemo 컴포넌트 렌더링
    if ((uiMode as string) === 'new') {
        return <NewUIDemo mode={mode} onInquiryClick={onInquiryClick} onUIModeChange={setUiMode} />;
    }

    return (
        <div className={`relative min-h-screen bg-gray-50 flex flex-col items-center px-4 ${mode === "modal" && isMobile ? "pt-2 pb-40" : "pt-8 pb-20 md:pb-32"}`}>
            {/* UI 선택 버튼 */}
            <div className="mb-6 flex justify-center gap-4">
                <button
                    onClick={() => setUiMode('new')}
                    className="relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md border border-gray-200"
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
                    onClick={() => setUiMode('current')}
                    className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700"
                >
                    이전 UI
                </button>
            </div>
            
            <div className="flex justify-center">
                <TabletFrame>
                    <div className="flex h-full flex-col">
                        <div className="h-10 bg-black rounded-t-xl flex items-center pl-3 pr-2 overflow-hidden">
                            <span className="bg-white text-black w-8 h-8 flex flex-col items-center justify-center text-[10px] font-bold rounded-lg leading-tight select-none outline outline-1 outline-white">
                                <span>하이</span>
                                <span>오더</span>
                            </span>
                        </div>
                        <CategoryTabs categories={categories} active={cat} onChange={setCat} />
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {menuItems.filter((m) => m.category === cat).map((m, index) => (
                                    <MenuItemCard 
                                        key={m.id} 
                                        item={m} 
                                        {...(index === 0 ? { "data-menu-item": "true" } : {})}
                                    />
                                ))}
                            </div>
                        </div>
                        <BottomBar onStaff={() => setCallOpen(true)} onOrderList={() => setOpen(true)} />
                        {open && <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />}
                        <div
                            className={`absolute inset-y-0 right-0 w-64 bg-white shadow-xl transition-transform duration-300 z-30 ${
                                open ? 'translate-x-0' : 'translate-x-full'
                            } flex flex-col`}
                        >
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="text-lg font-bold">주문내역</h3>
                                <button
                                    onClick={clear}
                                    className="text-xs text-gray-500 hover:text-red-600 border px-2 py-1 rounded"
                                    disabled={items.length === 0}
                                >
                                    전체 삭제
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
                                {items.map((c) => (
                                    <div key={c.item.id} className="flex justify-between items-center border-b pb-1 gap-2 text-sm">
                                        <span className="flex-1">{c.item.name}</span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                aria-label="minus"
                                                className="w-6 h-6 flex items-center justify-center border rounded disabled:opacity-40"
                                                disabled={c.qty === 1}
                                                onClick={() => decrease(c.item.id)}
                                            >
                                                -
                                            </button>
                                            <span className="w-6 text-center">{c.qty}</span>
                                            <button
                                                aria-label="plus"
                                                className="w-6 h-6 flex items-center justify-center border rounded"
                                                onClick={() => add(c.item)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button className="text-red-500 ml-2 text-xs" onClick={() => remove(c.item.id)}>
                                            삭제
                                        </button>
                                    </div>
                                ))}
                                {items.length === 0 && (
                                    <p className="text-gray-500 text-center mt-8">담긴 메뉴가 없습니다</p>
                                )}
                            </div>
                            <div className="p-4 border-t text-sm">
                                <p className="font-semibold mb-2">총 금액: {total.toLocaleString()}원</p>
                                <button
                                    onClick={() => {
                                        if (items.length === 0) return;
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
                                        setOpen(false);
                                        scrollToElement(notificationRef, 300);
                                    }}
                                    className="w-full py-2 bg-[#ff6d1d] text-white rounded-md"
                                    disabled={items.length === 0}
                                    data-order-submit
                                >
                                    주문하기  
                                </button>
                            </div>
                        </div>
                    </div>
                    <StaffCallModal
                        open={callOpen}
                        onClose={() => setCallOpen(false)}
                        onRequest={(reqItems) => {
                            setOrders((prev) => [
                                ...prev,
                                {
                                    id: Date.now(),
                                    items: reqItems as BoardItem[],
                                    created: Date.now(),
                                    ack: false,
                                    type: 'staff',
                                    stage: 1,
                                } as BoardEntry,
                            ]);
                            scrollToElement(notificationRef, 300);
                        }}
                    />
                </TabletFrame>
            </div>
            <div className={`${isMobile ? 'flex flex-col space-y-6 w-full px-4' : 'flex gap-6 justify-center'} mt-6 w-full max-w-6xl`}>
                <div ref={notificationRef} className={`${isMobile ? 'w-full' : ''}`} data-notification-board>
                    <NotificationBoard orders={orders} onAck={handleAck} />
                </div>
                {mode === "full" && (
                    <div ref={posRef} className={`${isMobile ? 'w-full' : ''}`} data-pos-panel>
                        <PosPanel orders={orders} />
                    </div>
                )}
                <div ref={kitchenRef} className={`${isMobile ? 'w-full' : ''}`} data-kitchen-printer>
                    <KitchenPrinter orders={orders} />
                </div>
            </div>
            
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