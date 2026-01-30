import React, { useEffect, useRef } from 'react';
import type { BoardEntry } from './NotificationBoard';

export function PosPanel({ orders }: { orders: BoardEntry[] }) {
  const orderOnly = orders.filter((o) => o.type === 'order' && (o.stage ?? 1) >=2);
  const totalPerOrder = (o: BoardEntry) => o.items.reduce((s, it) => s + (it.price ?? 0) * it.qty, 0);

  // 주문 목록 컨테이너 ref
  const listRef = useRef<HTMLDivElement>(null);

  // orderOnly.length가 바뀔 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [orderOnly.length]);

  return (
    <div 
      data-pos-panel
      className="w-full md:w-[700px] h-[300px] md:h-[460px] bg-gray-900 rounded-xl shadow-lg p-4 flex flex-col text-xs text-white flex-shrink-0"
    >
      <h3 className="text-sm font-bold mb-2">POS</h3>
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto bg-gray-800 p-2 rounded grid grid-cols-1 md:grid-cols-3 gap-2 auto-rows-min scrollbar-hide"
      >
        {orderOnly.length === 0 && (
                      <p className="text-gray-400 text-center col-span-1 md:col-span-3 mt-20">주문이 없습니다</p>
        )}
        {orderOnly.map((o, idx) => (
          <div key={o.id} className="border border-gray-600 rounded p-2 flex flex-col gap-1 bg-gray-900">
            <div className="flex justify-between text-[10px] mb-1 font-semibold">
              <span>테이블 {idx + 1}</span>
              <span>{new Date(o.created).toLocaleTimeString()}</span>
            </div>
            <ul className="flex-1 list-disc list-inside space-y-0.5 pl-3 overflow-y-auto text-[10px]">
              {o.items.map((it, i) => (
                <li key={i}>
                  {it.name} x {it.qty}
                </li>
              ))}
            </ul>
            <div className="text-right text-[11px] font-bold border-t border-gray-700 pt-1 mt-1">
              {totalPerOrder(o).toLocaleString()}원
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 