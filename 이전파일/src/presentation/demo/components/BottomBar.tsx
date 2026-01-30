import React from 'react';
import { useCart } from '@/shared/context/CartContext';

export function BottomBar({ onStaff, onOrderList }: { onStaff: () => void; onOrderList: () => void }) {
  const { count } = useCart();
  return (
    <div className="w-full h-14 bg-white/90 backdrop-blur flex items-center justify-between px-2 sm:px-4 gap-2 sm:gap-4 border-t text-sm sticky bottom-0 z-20">
      {/* Left group */}
      <div className="flex items-center gap-1 sm:gap-3">
        <button className="px-2 sm:px-4 h-10 bg-black text-white rounded-full text-xs font-semibold">LANG</button>
        <button
          onClick={onOrderList}
          className="px-2 sm:px-4 h-10 bg-black text-white rounded-full text-xs font-semibold whitespace-nowrap"
        >
          주문내역
        </button>
        <button
          onClick={onStaff}
          className="px-2 sm:px-4 h-10 bg-[#ff6d1d] text-white rounded-full text-xs font-semibold whitespace-nowrap"
        >
          직원 호출
        </button>
      </div>

      {/* 장바구니 */}
      <button
        id="order-btn"
        data-cart
        data-order-button
        onClick={onOrderList}
        className="flex items-center gap-1 px-3 sm:px-5 h-10 bg-[#6736ff] text-white rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0"
      >
        ✓ 장바구니 {count}
      </button>
    </div>
  );
} 