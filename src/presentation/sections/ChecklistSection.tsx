'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/presentation/components/AnimatedSection';

interface ChecklistItem {
    id: number;
    title: string;
    description: string;
}

// 체크리스트 데이터 - 여기서 제목과 설명을 수정하면 됩니다
const checklistData: ChecklistItem[] = [
    {
        id: 1,
        title: '현재 사용하고 있는 포스 프로그램과 연동은 되는지?',
        description: '연동이 안되면 포스기를 추가로 구매해야 하거나,\n테이블오더와는 무관한 PG수수료가 부과 될 수 있습니다.',
    },
    {
        id: 2,
        title: '이용료 외에 PG수수료나 숨겨진 요금이 없는지?',
        description: 'PG수수료 2~5% 발생 시\n100~250만원 발생 (매출 5000만원 기준)',
    },
    {
        id: 3,
        title: '저가 태블릿 기기로 고장이 잦은지?',
        description: '테이블오더 1대만 고장나도 직원들이 고객에게 안내할 사항들이 늘어나며,\n테이블오더의 익숙해진 직원, 외국인 직원이라면 혼란만 늘어납니다.',
    },
    {
        id: 4,
        title: '각종 소송에 휘말려 회사 내부가 혼란스러운지?',
        description: '각종 소송으로 마비되어 회사 이름만 있고 아무것도 안하는 회사들이 있습니다.\n회사가 폐업하면 어떻게 될까요?',
    },
    {
        id: 5,
        title: '공짜와 무료라는 말 뒤에 계약서는 정말 합리적인지?',
        description: '수수료 폭탄 계약, 매출 미달성시 과한 요금 부과',
    },
    {
        id: 6,
        title: '설치하기만 바쁘고 사후관리와 A/S는 잘 되는지?',
        description: 'A/S센터가 몇개나 되는지?\n고장 및 오류를 어떻게 대처하는지?\n테이블오더 뿐만 아니라 모든 기계는 오래 쓰다보면 오류와 고장이 있을 수 밖에 없습니다. 그런데 그 고장 뒤에 사후 관리가 중요합니다.',
    },
];

export const ChecklistSection: React.FC = () => {
    const [openItems, setOpenItems] = useState<Set<number>>(new Set());

    const toggleItem = (id: number) => {
        const newOpenItems = new Set(openItems);
        if (newOpenItems.has(id)) {
            newOpenItems.delete(id);
        } else {
            newOpenItems.add(id);
        }
        setOpenItems(newOpenItems);
    };

    return (
        <AnimatedSection className="w-full py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* 섹션 제목 */}
                <AnimatedItem>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-700 mb-2 leading-tight">
                        테이블오더 설치 전 반드시 체크해야할 6가지!
                    </h2>
                    <p className="text-lg md:text-xl font-bold text-gray-700 leading-relaxed mb-8">
                        테이블오더 설치 전 반드시 체크하셔야 합니다!
                    </p>
                </AnimatedItem>
                
                {/* 체크리스트 드롭다운 */}
                <div className="max-w-4xl mx-auto">
                    <AnimatedContainer className="space-y-3" staggerChildren={0.1} delayChildren={0.3}>
                        {checklistData.map((item, index) => {
                            const isOpen = openItems.has(item.id);
                            return (
                                <AnimatedItem
                                    key={item.id}
                                    delay={0.1 + index * 0.05}
                                    className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:border-gray-300"
                                >
                                    {/* 제목 버튼 */}
                                    <button
                                        onClick={() => toggleItem(item.id)}
                                        className="w-full px-4 py-4 md:px-6 md:py-5 flex items-center justify-between text-left focus:outline-none bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <h3 className="text-base md:text-lg font-bold text-gray-800 pr-4">
                                            {item.title}
                                        </h3>
                                        
                                        {/* 드롭다운 화살표 */}
                                        <div className={`flex-shrink-0 transform transition-transform duration-300 ${
                                            isOpen ? 'rotate-180' : ''
                                        }`}>
                                            <svg 
                                                width="20" 
                                                height="20" 
                                                viewBox="0 0 24 24" 
                                                fill="none" 
                                                className="text-gray-600"
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
                                    
                                    {/* 설명 내용 */}
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            height: isOpen ? 'auto' : 0,
                                            opacity: isOpen ? 1 : 0,
                                        }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden bg-white"
                                    >
                                        <div className="px-4 pb-4 md:px-6 md:pb-5">
                                            <div className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line pt-2">
                                                {item.description}
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatedItem>
                            );
                        })}
                    </AnimatedContainer>
                </div>
            </div>
        </AnimatedSection>
    );
};
