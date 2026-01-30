import { ReactNode } from 'react';

export function TabletFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[900px] bg-black rounded-3xl p-4 select-none">
      <div className="bg-white rounded-xl overflow-hidden h-[560px] flex flex-col relative">
        {children}
      </div>
    </div>
  );
} 