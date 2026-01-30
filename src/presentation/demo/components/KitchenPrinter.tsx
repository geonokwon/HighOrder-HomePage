import React, { useEffect, useRef } from 'react';
import type { BoardEntry, BoardItem } from './NotificationBoard';

export function KitchenPrinter({ orders }: { orders: BoardEntry[] }) {
  // 주방프린터에서 제외할 카테고리들 (여기에 추가/제거 가능)
  const excludedCategories = ['주류', '디저트']; // 예: 주류와 디저트는 주방에서 제외
  
  const isKitchenItem = (it: BoardItem) => !excludedCategories.includes(it.category || '');
  const orderOnly = orders
    .filter((o) => o.type === 'order' && (o.stage ?? 1) >= 3)
    .map((o) => ({ ...o, items: o.items.filter(isKitchenItem) }))
    .filter((o) => o.items.length > 0);

  // 주문 목록 컨테이너 ref
  const listRef = useRef<HTMLDivElement>(null);

  // 주문 개수 바뀔 때마다 스크롤 부드럽게 맨 아래로 이동
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [orderOnly.length]);

  return (
    <div className="w-full md:w-[240px] h-[300px] md:h-[460px] bg-white rounded-xl shadow-lg p-4 flex flex-col text-xs font-mono flex-shrink-0" data-kitchen-printer>
      <h3 className="text-sm font-bold mb-2">주방프린터</h3>
      <div ref={listRef} className="flex-1 overflow-y-auto space-y-4 bg-gray-100 p-2 rounded scrollbar-hide">
        {orderOnly.length === 0 && <p className="text-gray-500 text-center mt-20">대기중</p>}
        {orderOnly.slice().reverse().map((o, revIdx) => {
          const idx = orderOnly.length - revIdx; // for numbering order
          return (
            <div key={o.id} className="border border-dashed border-gray-400 p-2 bg-white">
              <p className="text-center font-bold mb-1">주문 #{idx}</p>
              <ul className="space-y-0.5">
                {o.items.map((it, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{it.name}</span>
                    <span>x {it.qty}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-center">--------------------</p>
            </div>
          );
        })}
      </div>
    </div>
  );
} 