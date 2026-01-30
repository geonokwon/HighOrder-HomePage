import React, { useEffect, useRef } from 'react';

export interface BoardItem { name: string; qty: number; price?: number; category?: string; }
export interface BoardEntry {
    id: number;
    items: BoardItem[];
    created: number;
    ack?: boolean;
    type?: 'order' | 'staff';
    stage?: number; // 1: alert, 2: pos, 3: kitchen
}

export function NotificationBoard({ orders, onAck }: { orders: BoardEntry[]; onAck: (id: number) => void }) {
    // 표시되는 알림만 필터링
    const visibleOrders = orders.filter(o => !o.ack && (o.stage ?? 1) >= 1);

    // ref 선언
    const listRef = useRef<HTMLDivElement>(null);

    // 알림 개수 바뀔 때마다 스크롤 맨 아래로
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTo({
                top: listRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [visibleOrders.length]);

    return (
        <div className="w-full md:w-[240px] h-[300px] md:h-[460px] bg-black rounded-xl shadow-lg p-4 flex flex-col flex-shrink-0">
            <h3 className="text-sm font-bold text-white mb-2">알림판(홀전용)</h3>
            <div ref={listRef} className="flex-1 overflow-y-auto flex flex-col gap-2 scrollbar-hide">
            {visibleOrders.length === 0 && (
                <p className="text-gray-500 text-center mt-20 text-xs">주문이 없습니다</p>
            )}
            {visibleOrders.map((o, idx) => {
                const highlight = !o.ack;
                return (
                    <div
                        key={o.id}
                        className={`border rounded-md p-2 flex flex-col gap-1 text-xs text-white ${
                        o.ack ? 'border-green-600' : 'border-gray-700'
                        } ${highlight ? 'animate-pulse bg-red-700/40' : 'bg-black'}`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold">#{idx + 1}</span>
                            <button
                                disabled={o.ack}
                                onClick={() => onAck(o.id)}
                                className={`text-[10px] px-1 rounded ${o.ack ? 'bg-green-600' : 'bg-gray-600 hover:bg-green-600'}`}
                            >
                                OK
                            </button>
                        </div>
                        <ul className="list-disc list-inside pl-2 space-y-0.5">
                            {o.items.map((c, i) => (
                                <li key={i} className="marker:text-[#ff6d1d]">
                                    {c.name} x {c.qty}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
            </div>
        </div>
    );
} 