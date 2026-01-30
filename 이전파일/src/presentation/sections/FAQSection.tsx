'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/presentation/components/AnimatedSection';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "설치 시 어떻게 진행 되나요?",
    answer: "1. 컨설턴트가 매장에 방문하여 설치 가능 유/무, 매장 환경에 따른 컨설팅, 설치 신청서를 작성합니다.\n" +
    "2. 점주님과 협의를 통해 사전 점검 1회, 본설치 1회 2회에 걸쳐 설치되며, 1회에 1~2시간 정도 소요됩니다.\n" +
    "3. 전국 152개 KT직영센터 중 가까운 센터의 엔지니어 분들이 방문해서 설치해드립니다."
  },
  {
    question: "메뉴판 수정 및 변경은 어떻게 하나요?",
    answer: "1. 모든 테이블오더는 포스기와 연동 방식 입니다. 포스기에서 메뉴 추가/이름/가격 변경 시 자동 반영 됩니다.\n" +
    "2. 메뉴 이미지 수정, 상품 품절, 숨김 처리 등 다양한 환경 설정은 4가지 방식으로 즉각 수정 가능합니다.\n" +
    "\t2-1. 포스기 및 컴퓨터 '하이오더 매니저' 프로그램 설치, PC에서 직접 수정 가능\n" +
    "\t2-2. 스마트폰 '하이오더 매니저' 앱 설치, 어플리케이션에서 직접 수정 가능\n" +
    "\t2-3. 하이오더 전담센터 '1588-3282' 통화 (오전 9:00 ~ 익일 오전 2:00 까지 운영)\n" +
    "\t2-4. 카카오톡 '하이오더 전담센터' 채팅방에 수정 사항 전달 시, 전담센터에서 확인 후 반영"
  },
  {
    question: "A/S는 어떻게 진행되나요?",
    answer: "1. 소프트웨어 및 프로그램 문제 발생 시, 전담센터에서 원격으로 즉각 진행.\n" +
    "2. 하드웨어 문제 발생 및 방문 필요 시, 전국 152개소 KT직영센터 중 가까운 센터의 엔지니어 분들이 방문합니다.\n" +
    "3. 오후 3시 이전 문의 시, 당일 방문. 오후 3시 이후 문의 시 익일 방문. 24시간 방문을 원칙으로 합니다."
  },
  {
    question: "무상 A/S 기간은 어떻게 되나요?",
    answer: "1. KT하이오더는 약정과 관계없이 3년 무상 A/S가 진행되며, 매장에서 발생한 사고로 인한 파손 및 고장은 무상 A/S에서 제외됩니다.\n" +
    "2. 보조배터리의 경우 1년 무상 A/S가 진행됩니다."
  },
  {
    question: "배터리 지속시간은 얼마나 되나요?",
    answer: "1. 보조배터리는 20,000mAh 대용량 배터리가 지원됩니다.\n" +
    "2. 지속시간은 18시간 안내 드리나, 매장 환경에 따라 태블릿 밝기가 달라져 지속 시간이 달라집니다.\n" +
    "3. 배터리 특성상, 시간이 지남에 따라 배터리 성능이 감소함을 유의해 주시기 바랍니다."
  },
  {
    question: "PG수수료 및 추가 비용이 있나요?",
    answer: "1. 기기값과 월 이용료 외에 부가 비용은 일체 없습니다.\n" +
    "2. 최근 이슈 된 PG수수료, 포스기 강제 과금 없습니다."
  },
  {
    question: "위약금은 어떻게 되나요?",
    answer: "1. 신청 시 약정 기간(일시불, 2년, 3년)에 따라 다르며, 해지 신청으로 부터 계약 된 약정 기간까지의 서비스 이용료 50%를 부담하게 됩니다."
  }
];

export const FAQSection: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set()); // 모든 아이템 기본 닫힘

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };


  return (
    <AnimatedSection className="w-full py-8 bg-transparent">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* 섹션 제목 */}
        <AnimatedItem>
          <h2 className="text-3xl md:text-4xl font-black text-gray-700 mb-8 leading-tight">
            자주 묻는 질문
          </h2>
        </AnimatedItem>
        
        {/* FAQ 아코디언 */}
        <AnimatedContainer className="space-y-2" staggerChildren={0.15} delayChildren={0.5}>
          {faqData.map((faq, index) => {
            const isOpen = openItems.has(index);
            return (
              <AnimatedItem
                key={index}
                delay={0.2 + index * 0.1}
                className={`rounded-[30px] transition-all duration-300 overflow-hidden ${
                  isOpen ? 'bg-[#eeeeee]' : 'bg-[#f5f5f5]'
                }`}
              >
                {/* 질문 헤더 */}
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-5 py-3 md:py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center">
                    {/* Q 아이콘 */}
                    <div className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-[#ff8a3d] rounded-full flex items-center justify-center mr-3 md:mr-4">
                      <span className="text-white text-[18px] md:text-[22px] font-bold">Q</span>
                    </div>
          
                    {/* 질문 텍스트 */}
                    <h3 className="text-[18px] md:text-[24px] text-[#404040] font-medium md:font-bold">
                      {faq.question}
                    </h3>
                  </div>
              
                  {/* 드롭다운 화살표 */}
                  <div className={`transform transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}>
                    <svg 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className="text-[#404040]"
                    >
                      <path 
                        d="M6 9L12 15L18 9" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
                
                {/* 답변 내용 */}
                <div className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[800px] md:max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}>
                  <div className="px-5 pb-3 md:pb-4">
                    <div className="ml-[44px] md:ml-[54px]">
                      <div className="text-base md:text-lg font-medium md:font-bold text-[#404040] leading-relaxed whitespace-pre-line p-2 md:p-3 max-h-[600px] md:max-h-none overflow-y-auto">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedItem>
            );
          })}
        </AnimatedContainer>
        
        {/* 추가 문의 안내 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            delay: 1.5,
            ease: [0.25, 0.8, 0.5, 1]
          }}
          className="mt-8 text-center"
        >
          <a href="tel:1899-6484" className="inline-block">
            <div className="bg-orange-100 rounded-xl p-4 hover:bg-orange-200 transition-colors duration-200 cursor-pointer">
              <p className="text-lg font-bold text-gray-700">
                더 궁금한 점이 있으시다면? 
                <span className="text-orange-600 ml-2">
                  📞 1899-6484
                </span>
              </p>
            </div>
          </a>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}; 