'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function NavBar() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const cls = document.body.classList;
    if (pathname.startsWith('/admin')) {
      cls.remove('pt-16');
    } else {
      if (!cls.contains('pt-16')) cls.add('pt-16');
    }
  }, [pathname]);
  if (pathname.startsWith('/admin')) return null;
  return (
    <nav
      className="fixed left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-sm"
      style={{ top: 'var(--banner-height, 0px)' }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/KT_Logo.png" 
            alt="KT" 
            width={42} 
            height={26} 
            className="object-contain"
            style={{ height: '26px', width: 'auto' }}
          />
          <span className="text-xl font-semibold text-gray-800 leading-none">지니원</span>
        </Link>
        <a
          href="tel:1899-6484"
          className="inline-flex items-center gap-2 bg-red-500 text-white rounded-lg px-6 py-2 font-semibold shadow hover:bg-red-600 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
          >
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
              fill="white"
            />
          </svg>
          1899-6484
        </a>
      </div>
    </nav>
  );
} 