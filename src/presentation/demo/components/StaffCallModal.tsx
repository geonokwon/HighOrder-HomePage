import React, { Fragment } from 'react';

const requests = [
  '티슈주세요',
  '테이블정리해주세요',
  '물주세요',
  '수저주세요',
  '직원 호출',
];

export interface RequestItem { name: string; qty: number; }

export function StaffCallModal({ open, onClose, onRequest }: { open: boolean; onClose: () => void; onRequest?: (items: RequestItem[]) => void }) {
  const [selected, setSelected] = React.useState<Record<string, number>>({});

  const addItem = (name: string) => {
    setSelected((prev) => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
  };

  const minusItem = (name: string) => {
    setSelected((prev) => {
      const qty = (prev[name] || 1) - 1;
      if (qty <= 0) {
        const { [name]: _omit, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: qty };
    });
  };

  const clearAll = () => setSelected({});

  const handleSubmit = () => {
    if (Object.keys(selected).length === 0) return onClose();
    const itemsArr = Object.entries(selected).map(([k, v]) => ({ name: k, qty: v }));
    onRequest?.(itemsArr);
    clearAll();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-40 bg-black/40 flex items-center justify-center">
      <div className="relative bg-gray-800 text-white rounded-xl p-6 w-[95%] max-w-3xl h-[90%] flex flex-col gap-6 overflow-y-auto animate-scaleIn">
        {/* close */}
        <button
          aria-label="close"
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
        >
          ×
        </button>
        <h2 className="text-lg font-bold">직원 호출</h2>
        <div className="flex flex-col md:flex-row gap-6 flex-1">
          {/* Left - request grid */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {requests.map((r) => (
              <button
                key={r}
                onClick={() => addItem(r)}
                className="min-h-[60px] border border-white/40 hover:bg-gray-700 rounded flex items-center justify-center text-sm text-center px-2"
              >
                {r}
              </button>
            ))}
          </div>
          {/* Right - selected list */}
          <div className="w-full md:w-1/3 bg-gray-700/40 rounded p-4 flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-gray-200 mb-2">요청 항목</h4>
            {Object.keys(selected).length === 0 && (
              <p className="text-xs text-gray-400">왼쪽에서 요청하실 항목을 선택해 주세요.</p>
            )}
            {Object.entries(selected).map(([name, qty]) => (
              <div key={name} className="flex items-center justify-between text-sm">
                <span className="mr-2 flex-1">{name}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => minusItem(name)}
                    className="w-6 h-6 border rounded flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-6 text-center">{qty}</span>
                  <button
                    onClick={() => addItem(name)}
                    className="w-6 h-6 border rounded flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom buttons */}
        <div className="flex justify-end gap-4 text-sm">
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 disabled:opacity-40"
            disabled={Object.keys(selected).length === 0}
          >
            전체 삭제
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#ff6d1d] rounded hover:bg-[#e65a12] disabled:opacity-40"
            disabled={Object.keys(selected).length === 0}
          >
            요청하기
          </button>
        </div>
      </div>
    </div>
  );
} 