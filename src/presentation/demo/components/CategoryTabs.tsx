import React from 'react';

interface Props {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}

export function CategoryTabs({ categories, active, onChange }: Props) {
  return (
    <div className="w-full overflow-x-auto border-b bg-white/90 backdrop-blur sticky top-0 z-10 scrollbar-hide">
      <div className="flex whitespace-nowrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={
              c === active
                ? 'px-4 py-3 text-[#ff6d1d] font-semibold border-b-2 border-[#ff6d1d]'
                : 'px-4 py-3 text-gray-500 hover:text-gray-700'
            }
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
} 