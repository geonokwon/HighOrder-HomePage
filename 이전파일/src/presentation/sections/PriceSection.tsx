'use client';

import React from 'react';
import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/presentation/components/AnimatedSection';

const priceData = [
  { type: '후불형', initialPrice: '월 20,000원', notificationPrice: '월 10,000원' },
  { type: '선불형', initialPrice: '월 22,000원', notificationPrice: '월 10,000원' },
];

// 알림판 인치별 데이터
const notificationSizes = [
  { size: '10인치', price: '월 20,000원' },
  { size: '15인치', price: '월 22,000원' }
];

export function PriceSection() {
  return (
    <AnimatedSection className="py-20 bg-transparent px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <AnimatedItem className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-700 mb-4 leading-tight">
            하이오더 상품별 가격 안내
          </h2>
          <p className="text-lg md:text-xl font-bold text-gray-700">
            1대 당 가격, 부가세 별도
          </p>
        </AnimatedItem>

        {/* Desktop Table (md+) */}
        <AnimatedItem delay={0.3}>
          <div
            className="hidden md:block rounded-3xl p-6 md:p-8 max-w-5xl mx-auto"
            style={{ backgroundColor: '#ffffff', border: '3px solid #ffd089' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 max-w-5xl mx-auto">
              {/* 구분 Column */}
              <div className="flex flex-col">
                <div className="h-16 mb-6"></div> {/* Spacer for header alignment */}
                {/* 후불형 행 */}
                <div className="h-12 flex items-center justify-center mb-6 border-b border-gray-300 pb-6">
                  <span className="text-lg md:text-xl font-bold text-gray-700">
                    후불형
                  </span>
                </div>
                {/* 선불형 행 */}
                <div className="h-12 flex items-center justify-center mb-6">
                  <span className="text-lg md:text-xl font-bold text-gray-700">
                    선불형
                  </span>
                </div>
              </div>

              {/* 1대 가격 Column */}
              <div className="flex flex-col">
                {/* Header */}
                <div 
                  className="h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: '#ffcd7e' }}
                >
                  <span className="text-xl md:text-2xl font-bold text-gray-700">
                    1대 가격
                  </span>
                </div>
                {/* 후불형 행 */}
                <div className="h-12 flex items-center justify-center mb-6 border-b border-gray-300 pb-6">
                  <span className="text-xl md:text-2xl font-bold text-gray-700">
                    월 20,000원
                  </span>
                </div>
                {/* 선불형 행 */}
                <div className="h-12 flex items-center justify-center mb-6">
                  <span className="text-xl md:text-2xl font-bold text-gray-700">
                    월 22,000원
                  </span>
                </div>
              </div>

              {/* 구분 Column (알림판용) */}
              <div className="flex flex-col">
                <div className="h-16 mb-6"></div> {/* Spacer for header alignment */}
                {/* 10인치 행 */}
                <div className="h-12 flex items-center justify-center mb-6 border-b border-gray-300 pb-6">
                  <span className="text-lg md:text-xl font-bold text-gray-700">
                    {notificationSizes[0].size}
                  </span>
                </div>
                {/* 15인치 행 */}
                <div className="h-12 flex items-center justify-center mb-6">
                  <span className="text-lg md:text-xl font-bold text-gray-700">
                    {notificationSizes[1].size}
                  </span>
                </div>
              </div>

              {/* 알림판 Column */}
              <div className="flex flex-col">
                {/* Header */}
                <div 
                  className="h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: '#ff9c45' }}
                >
                  <span className="text-xl md:text-2xl font-bold text-gray-700">
                    알림판
                  </span>
                </div>
                {/* 10인치 행 */}
                <div className="h-12 flex items-center justify-center mb-6 border-b border-gray-300 pb-6">
                  <span className="text-xl md:text-2xl font-bold text-gray-700">
                    {notificationSizes[0].price}
                  </span>
                </div>
                {/* 15인치 행 */}
                <div className="h-12 flex items-center justify-center mb-6">
                  <span className="text-xl md:text-2xl font-bold text-gray-700">
                    {notificationSizes[1].price}
                  </span>
                </div>
              </div>

              {/* KT Discount Column */}
              <div className="flex flex-col justify-center">
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
                    KT인터넷 사용자<br />
                    월 11,000원 할인
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* 모델별 금액 안내 */}
          <div className="hidden md:block max-w-5xl mx-auto text-right mt-4">
            <p className="text-base text-gray-400 font-bold">
              모델별 금액은 동일합니다.
            </p>
          </div>
        </AnimatedItem>

        {/* Mobile Cards (sm) */}
        <AnimatedContainer className="md:hidden space-y-8 mt-8" staggerChildren={0.2}>
          {/* 1대 가격 카드 */}
          <AnimatedItem className="rounded-2xl border border-[#ffd089] p-6 space-y-4 bg-white">
            <h3 className="text-2xl font-extrabold text-[#FF9000] text-center">
              1대 가격
            </h3>

            {priceData.map(({ type, initialPrice }) => (
              <div key={type} className="flex items-center justify-between bg-[#ffcd7e] rounded-xl px-4 py-3">
                <span className="text-lg font-bold text-gray-700">{type}</span>
                <span className="text-lg font-bold text-gray-700">{initialPrice}</span>
              </div>
            ))}
          </AnimatedItem>

          {/* 알림판 카드 */}
          <AnimatedItem className="rounded-2xl border border-[#ffd089] p-6 space-y-4 bg-white">
            <h3 className="text-2xl font-extrabold text-[#FF9000] text-center">
              알림판
            </h3>

            {notificationSizes.map(({ size, price }) => (
              <div key={size} className="flex items-center justify-between bg-[#ff9c45] rounded-xl px-4 py-3">
                <span className="text-lg font-bold text-white">{size}</span>
                <span className="text-lg font-bold text-white">{price}</span>
              </div>
            ))}
          </AnimatedItem>

          {/* KT 할인 안내 */}
          <AnimatedItem className="rounded-xl bg-orange-100 p-6 text-center">
            <p className="text-lg font-bold text-orange-600 leading-relaxed">
              KT인터넷 사용자 월 11,000원 할인
            </p>
          </AnimatedItem>

          {/* 모델별 금액 안내 */}
          <AnimatedItem className="text-center">
            <p className="text-base text-gray-400 font-bold">
              모델별 금액은 동일합니다.
            </p>
          </AnimatedItem>
        </AnimatedContainer>
      </div>
    </AnimatedSection>
  );
} 