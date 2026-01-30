'use client';
import { useState } from 'react';
import Image from 'next/image';
import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/presentation/components/AnimatedSection';

const tableVariants = [
  {
    key: 'post_vertical',
    label: '후불 세로형',
    img: '/TableOrder/TableOrder_Card1_Image1.png',
    desc: '세로형 디스플레이로\n좁은 공간에서도 효율적!',
  },
  {
    key: 'post_desk',
    label: '후불 탁상형',
    img: '/TableOrder/TableOrder_Card1_Image1.png',
    desc: '탁상에 바로 설치하는\n컴팩트 키오스크',
  },
  {
    key: 'pre_vertical',
    label: '선불 세로형',
    img: '/TableOrder/TableOrder_Card1_Image1.png',
    desc: '탁상에 바로 설치하는\n컴팩트 키오스크',
  },
  {
    key: 'pre_desk',
    label: '선불 탁상형',
    img: '/TableOrder/TableOrder_Card1_Image1.png',
    desc: '탁상에 바로 설치하는\n컴팩트 키오스크',
  },
];

const qrVariants = [
  {
    key: 'black',
    label: '블랙',
    img: '/TableOrder/TableOrder_Card1_Image1.png',
    desc: '야외 테이블에도\n스티커 붙이면 끝!',
  },
  {
    key: 'white',
    label: '화이트',
    img: '/TableOrder/TableOrder_Card1_Image1.png',
    desc: '긴 테이블\n부착용 화이트 디자인',
  },
];

function VariantCard({ title, variants, dark = false }: { title: string; variants: any[]; dark?: boolean }) {
  const [active, setActive] = useState(variants[0]);
  return (
    <div className="flex flex-col">
      <div className="flex-1 flex flex-col items-start">
        <h3 className={`text-xl font-bold mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <div className="flex flex-wrap gap-3 mb-6">
          {variants.map((v) => (
            <button
              key={v.key}
              onClick={() => setActive(v)}
              className={
                v.key === active.key
                  ? 'text-[#ff6d1d] font-semibold border-b-2 border-[#ff6d1d] pb-1'
                  : `${dark ? 'text-gray-300' : 'text-gray-500'} hover:text-gray-700`
              }
            >
              {v.label}
            </button>
          ))}
        </div>
        <p className={`whitespace-pre-line leading-relaxed min-h-[3rem] ${dark ? 'text-gray-200' : 'text-gray-700'}`}>
          {active.desc}
        </p>
      </div>
      <div
        className={`w-full h-[220px] md:h-[300px] rounded-xl overflow-hidden relative mt-6 ${
          dark ? 'bg-gray-800' : 'bg-gray-100'
        }`}
      >
        <Image src={active.img} alt={active.label} fill className="object-cover" />
      </div>
    </div>
  );
}

export function TableOrderSection() {
  return (
    <AnimatedSection className="py-24 bg-white px-4">
      <div className="max-w-6xl mx-auto">
        <AnimatedItem>
          <h2 className="text-3xl md:text-4xl font-black text-gray-700 leading-tight mb-10">
            "복잡한 매장도, 넓은 매장도 상황에 맞게 유연하게"
          </h2>
        </AnimatedItem>
        <AnimatedContainer className="grid md:grid-cols-2 gap-12" staggerChildren={0.3}>
          <AnimatedItem>
            <VariantCard title="테이블오더" variants={tableVariants} />
          </AnimatedItem>
          <AnimatedItem>
            <VariantCard title="색상" variants={qrVariants} />
          </AnimatedItem>
        </AnimatedContainer>
      </div>
    </AnimatedSection>
  );
} 