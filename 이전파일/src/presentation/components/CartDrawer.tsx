'use client';
import { useCart } from '@/shared/context/CartContext';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, total, remove, clear, decrease, add } = useCart();

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <Dialog.Panel className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl p-4 flex flex-col">
            <h3 className="text-xl font-bold mb-4">장바구니</h3>
            <div className="flex-1 overflow-y-auto space-y-3">
              {items.map((c) => (
                <div key={c.item.id} className="flex justify-between text-sm items-center border-b pb-1 gap-2">
                  <span className="flex-1">
                    {c.item.name}
                  </span>
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
              {items.length === 0 && <p className="text-gray-500 text-center mt-8">담긴 메뉴가 없습니다</p>}
            </div>
            <div className="mt-4">
              <p className="font-semibold mb-2">총 금액: {total.toLocaleString()}원</p>
              <button
                onClick={() => {
                  alert('결제 완료! (모의)');
                  clear();
                  onClose();
                }}
                className="w-full py-2 bg-[#ff6d1d] text-white rounded-md hover:bg-[#e65a12]"
                disabled={items.length === 0}
              >
                주문하기
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
} 