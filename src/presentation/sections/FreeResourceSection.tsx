'use client';

import React from 'react';
import Image from 'next/image';
import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/presentation/components/AnimatedSection';

export function FreeResourceSection() {
  return (
    <AnimatedSection className="py-8 md:py-12">
      <AnimatedContainer>
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedItem direction="up">
            {/* 메인 컨테이너 */}
            <a 
              href="https://www.notion.so/200dffd0949b80ed9791f761aa412650?v=200dffd0949b80b9a7d8000cf77ce6ee"
              target="_blank"
              className="relative block mx-auto rounded-lg overflow-visible shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group"
              style={{
                background: 'linear-gradient(104.203deg, rgb(205, 232, 238) 0%, rgb(205, 232, 238) 50.481%, rgb(130, 200, 212) 100%)',
                width: '565px',
                height: '143px',
                maxWidth: '100%'
              }}
            >
              {/* 좌측 상단: 무료 제공 배지 */}
              <div className="absolute left-[24px] top-[20px] z-20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <div className="relative w-[55px] h-[55px]">
                  {/* 원형 배경 */}
                  <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(160deg, rgb(236, 176, 62) 0%, rgb(242, 201, 76) 50%, rgb(236, 176, 62) 100%)' }} />
                  {/* 테두리 */}
                  <div className="absolute inset-0 rounded-full border border-[#ECB03E]" />
                  {/* 그림자 효과 */}
                  <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0px 3.6px 3.6px 0px rgba(0, 0, 0, 0.25)' }} />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div style={{ transform: 'rotate(-15deg) translateX(2px)' }}>
                      <p className="text-[18px] font-black leading-[1.1] text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(162.402deg, rgb(189, 125, 101) 10.374%, rgb(157, 76, 41) 97.177%)' }}>
                        무료
                      </p>
                      <p className="text-[18px] font-black leading-[1.1] text-transparent bg-clip-text mt-[-2px]" style={{ backgroundImage: 'linear-gradient(160.681deg, rgb(189, 125, 101) 10.374%, rgb(157, 76, 41) 97.177%)' }}>
                        제공!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 상단: 제목 */}
              <div className="absolute left-[183px] -translate-x-1/2 top-[19px]">
                <h2 className="text-[24px] font-black text-[#4f5352] leading-[27.677px] whitespace-nowrap text-center w-[366px]">
                  성공 창업 준비 A to Z
                </h2>
              </div>

              {/* 중앙: 무료자료 보러가기 버튼 */}
              <div className="absolute left-[48px] top-[54px]">
                <div className="bg-[#0c9cb1] text-white font-black text-[26px] rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#0a8a9d] leading-none w-[274px] h-[38px] flex items-center justify-center">
                  <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to bottom, white 68.572%, #c0bfbf 115.82%)', WebkitTextFillColor: 'transparent' }}>
                    무료자료 보러가기!
                  </span>
                </div>
              </div>

              {/* 하단: 툴팁 */}
              <div className="absolute left-[46px] top-[103px]">
                <div className="flex items-center bg-gradient-to-r from-[#fdfbf5] to-[rgba(255,255,255,0.31)] border border-white rounded-full h-[28px] w-[286px] px-3">
                  {/* 아이콘들 */}
                  <div className="flex items-center">
                    <div className="relative w-[34px] h-[34px]" style={{ transform: 'rotate(-15.37deg)' }}>
                      <Image
                        src="/FreeResource/Icon.png"
                        alt=""
                        fill
                        className="object-cover drop-shadow-[2px_2px_2.7px_rgba(0,0,0,0.25)]"
                      />
                    </div>
                    <div className="relative w-[18px] h-[18px] -ml-2" style={{ transform: 'rotate(15.56deg)' }}>
                      <Image
                        src="/FreeResource/Icon.png"
                        alt=""
                        fill
                        className="object-cover drop-shadow-[2px_2px_2.7px_rgba(0,0,0,0.25)]"
                      />
                    </div>
                  </div>

                  {/* 텍스트 */}
                  <p className="ml-2 leading-none whitespace-nowrap">
                    <span className="font-extrabold text-[#737373] text-[12px]">초보 창업자 들을 위한</span>
                    <span className="text-[12px]">  </span>
                    <span className="font-black text-[#534f4f] text-[14px]">필수 가이드북</span>
                    <span className="text-[14px]"> </span>
                    <span className="font-extrabold text-[#737373] text-[12px]">제공!</span>
                  </p>
                </div>
              </div>

              {/* 우측: 가이드북 이미지들 */}
              <div className="absolute right-[34px] top-[4px] hidden md:block transition-transform duration-300 group-hover:scale-105">
                <div className="relative w-[147px] h-[135px]">
                  <Image
                    src="/FreeResource/Books.png"
                    alt="무료 가이드북"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </a>
          </AnimatedItem>
        </div>
      </AnimatedContainer>
    </AnimatedSection>
  );
}
