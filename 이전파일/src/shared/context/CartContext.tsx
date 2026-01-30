'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import type { MenuItem } from '@/data/menu';

export interface CartItem {
  item: MenuItem;
  qty: number;
}

interface CartContextProps {
  items: CartItem[];
  add: (item: MenuItem) => void;
  remove: (id: number) => void;
  decrease: (id: number) => void;
  total: number;
  count: number;
  clear: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (item: MenuItem) => {
    setItems((prev) => {
      const found = prev.find((c) => c.item.id === item.id);
      if (found) return prev.map((c) => (c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { item, qty: 1 }];
    });
  };

  const remove = (id: number) => {
    setItems((prev) => prev.filter((c) => c.item.id !== id));
  };

  const decrease = (id: number) => {
    setItems((prev) =>
      prev
        .map((c) => (c.item.id === id ? { ...c, qty: Math.max(1, c.qty - 1) } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const clear = () => setItems([]);

  const total = items.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  const count = items.reduce((s, c) => s + c.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, decrease, total, count, clear }}>{children}</CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}; 