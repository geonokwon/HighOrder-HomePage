'use client';
import Image from 'next/image';
import { MenuItem } from '@/data/menu';
import { useCart } from '@/shared/context/CartContext';
import { useRef } from 'react';
import { animate } from 'framer-motion';

function flyToCart(srcEl: HTMLElement) {
  const target = document.getElementById('order-btn');
  if (!target) return;
  const start = srcEl.getBoundingClientRect();
  const end = target.getBoundingClientRect();
  
  const clone = srcEl.cloneNode(true) as HTMLElement;
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${start.left}px`,
    top: `${start.top}px`,
    width: `${start.width}px`,
    height: `${start.height}px`,
    zIndex: 9999,
    pointerEvents: 'none',
    opacity: '1',
  });
  document.body.appendChild(clone);

  const deltaX = end.left + end.width / 2 - (start.left + start.width / 2);
  const deltaY = end.top + end.height / 2 - (start.top + start.height / 2);

  const move = animate(
    clone,
    { x: deltaX, y: deltaY },
    {
      duration: 0.5,
      ease: [0.25, 0.8, 0.2, 1],
    }
  );

  const shrink = animate(
    clone,
    { scale: 0.25 },
    {
      duration: 0.25,
      ease: [0.25, 0.8, 0.2, 1],
    }
  );

  Promise.all([
    (move as any).finished as Promise<void>,
    (shrink as any).finished as Promise<void>,
  ]).then(() => {
    animate(
      clone,
      { opacity: 0 },
      {
        duration: 0.5,
        ease: 'easeOut',
        onComplete: () => clone.remove(),
      }
    );
  });
}

export function MenuItemCard({ item, ...props }: { item: MenuItem } & React.HTMLAttributes<HTMLDivElement>) {
  const { add } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl shadow hover:shadow-md transition p-3 flex flex-col items-start cursor-pointer"
      onClick={() => {
        add(item);
        if (cardRef.current) flyToCart(cardRef.current);
      }}
      {...props}
    >
      <Image src={item.image} alt={item.name} width={200} height={140} className="object-cover rounded-md" />
      <h4 className="mt-3 font-medium text-gray-800 text-left w-full">{item.name}</h4>
      <p className="text-[#ff6d1d] font-semibold text-left w-full">{item.price.toLocaleString()}원</p>
    </div>
  );
} 