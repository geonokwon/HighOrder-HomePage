"use client";
import React from 'react';

type Banner = { src: string; alt?: string; href?: string };

interface BannerRowProps {
  images?: Banner[];
  className?: string;
  imageHeightClass?: string; // e.g., 'h-28 md:h-36'
}

export const BannerRow: React.FC<BannerRowProps> = ({
  images,
  className,
  imageHeightClass = 'h-28 md:h-36',
}) => {
  const banners: Banner[] = images && images.length > 0 ? images : [
    { src: '/BannerImages/BannerImage_01.png', alt: '하이오더 2달 무료체험', href: 'https://docs.google.com/forms/d/e/1FAIpQLSfM3L5ePr6eXWvQ009MFZsRFktzFEQCENPh4lvbW95Hcj4kJg/viewform' },
    { src: '/BannerImages/BannerImage_02.png', alt: '소상공인 무료자료', href: 'https://www.notion.so/200dffd0949b80ed9791f761aa412650?v=200dffd0949b80b9a7d8000cf77ce6ee' },
  ];

  return (
    <div className={`mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto ${className ?? ''}`}>
      {banners.slice(0, 2).map((b, i) => (
        b.href ? (
          <a
            key={`${b.src}-${i}`}
            href={b.href}
            target={b.href.startsWith('http') ? '_blank' : undefined}
            rel={b.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="block"
          >
            <img
              src={b.src}
              alt={b.alt ?? `배너 ${i + 1}`}
              className={`w-full ${imageHeightClass} object-cover shadow-sm transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:shadow-md`}
            />
          </a>
        ) : (
          <img
            key={`${b.src}-${i}`}
            src={b.src}
            alt={b.alt ?? `배너 ${i + 1}`}
            className={`w-full ${imageHeightClass} object-cover shadow-sm transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:shadow-md`}
          />
        )
      ))}
    </div>
  );
};

export default BannerRow;


