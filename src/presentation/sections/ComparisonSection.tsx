import { AnimatedSection, AnimatedItem } from '@/presentation/components/AnimatedSection';
import React from 'react';

// 비교 항목
const features = [
    'PG 수수료',
    '자사인터넷 연동',
    '결제누락 특허',
    '어플 사용여부',
    'A/S센터 개소',
    'A/S 방문시간',
    '무상 A/S',
    '월 사용료',
];

// 각 항목별 데이터
const comparisonData = {
    'PG 수수료': { 'A사': 'O', 'B사': 'X', 'KT하이오더': 'X' },
    '자사인터넷 연동': { 'A사': 'X', 'B사': 'X', 'KT하이오더': 'O' },
    '결제누락 특허': { 'A사': 'X', 'B사': 'X', 'KT하이오더': 'O' },
    '어플 사용여부': { 'A사': 'X', 'B사': 'O', 'KT하이오더': 'O' },
    'A/S센터 개소': { 'A사': '1개', 'B사': '3개', 'KT하이오더': '152개' },
    'A/S 방문시간': { 'A사': '7일', 'B사': '5일', 'KT하이오더': '24시간' },
    '무상 A/S': { 'A사': '1년', 'B사': '1년', 'KT하이오더': '3년' },
    '월 사용료': { 'A사': '13,000', 'B사': '18,000', 'KT하이오더': '20,000' },
};


// 경쟁사(열) 정의
const competitors = [
    { name: 'A사', color: 'gray', border: 'border-2 border-gray-300', headerBg: 'bg-gray-400' },
    { name: 'B사', color: 'gray', border: 'border-2 border-gray-300', headerBg: 'bg-gray-400' },
    { name: 'KT하이오더', color: 'orange', border: 'border-4 border-orange-500', headerBg: 'bg-orange-500' },
];

export function ComparisonSection() {
    return (
        <AnimatedSection className="w-full py-20 bg-transparent px-4">
            <div className="max-w-7xl mx-auto w-full">
                <AnimatedItem direction="up" delay={0.1}>
                    {/* 모바일: 컴팩트한 테이블 형태 */}
                    <div className="block lg:hidden">
                        <div className="rounded-lg overflow-hidden border-2 border-gray-300 bg-white shadow-lg">
                            {/* 헤더 */}
                            <div className="flex">
                                <div className="bg-gray-500 text-white font-bold text-sm py-3 px-2 flex items-center justify-center flex-1 border-r border-white">
                                    테이블오더 비교
                                </div>
                                <div className="bg-gray-400 text-white font-bold text-sm py-3 px-2 flex items-center justify-center w-16 border-r border-white">
                                    A사
                                </div>
                                <div className="bg-gray-400 text-white font-bold text-sm py-3 px-2 flex items-center justify-center w-16 border-r border-white">
                                    B사
                                </div>
                                <div className="bg-orange-500 border-2 border-orange-500 text-white font-bold text-sm py-3 px-2 flex items-center justify-center w-20">
                                    KT<br/>하이오더
                                </div>
                            </div>
                            
                            {/* 데이터 행들 */}
                            {features.map((feature, index) => (
                                <div key={index} className={`flex ${index % 2 ? 'bg-gray-50' : 'bg-white'}`}>
                                    <div className="flex-1 px-2 py-3 text-xs font-medium text-gray-700 flex items-center justify-center border-r border-gray-300">
                                        {feature}
                                    </div>
                                    {/* A사 */}
                                    <div className="w-16 px-1 py-3 text-center text-xs flex items-center justify-center border-r border-gray-300">
                                        {(comparisonData as any)[feature]['A사'] === 'X' ? (
                                            <span className="text-red-500 font-bold text-lg">✕</span>
                                        ) : (comparisonData as any)[feature]['A사'] === 'O' ? (
                                            <span className="text-green-500 font-bold text-lg">○</span>
                                        ) : (
                                            <span className="text-gray-700 leading-tight text-xs">
                                                {(comparisonData as any)[feature]['A사']}
                                            </span>
                                        )}
                                    </div>
                                    {/* B사 */}
                                    <div className="w-16 px-1 py-3 text-center text-xs flex items-center justify-center border-r border-gray-300">
                                        {(comparisonData as any)[feature]['B사'] === 'X' ? (
                                            <span className="text-red-500 font-bold text-lg">✕</span>
                                        ) : (comparisonData as any)[feature]['B사'] === 'O' ? (
                                            <span className="text-green-500 font-bold text-lg">○</span>
                                        ) : (
                                            <span className="text-gray-700 leading-tight text-xs">
                                                {(comparisonData as any)[feature]['B사']}
                                            </span>
                                        )}
                                    </div>
                                    {/* KT하이오더 */}
                                    <div className={`w-20 px-1 py-3 text-center text-xs flex items-center justify-center border-l-2 border-r-2 border-orange-500 ${index === features.length - 1 ? 'border-b-2' : ''}`}>
                                        {(comparisonData as any)[feature]['KT하이오더'] === 'X' ? (
                                            <span className="text-red-500 font-bold text-lg">✕</span>
                                        ) : (comparisonData as any)[feature]['KT하이오더'] === 'O' ? (
                                            <span className="text-green-500 font-bold text-lg">○</span>
                                        ) : (
                                            <div className="text-orange-600 font-bold leading-tight text-xs">
                                                {(comparisonData as any)[feature]['KT하이오더']}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 데스크톱: 테이블 형태 */}
                    <div className="hidden lg:block overflow-x-auto">
                        <div className="flex gap-6 w-full">
                            {/* Left feature column */}
                            <div className="flex flex-col rounded-lg overflow-hidden border-2 border-gray-300 flex-[2_2_0%] min-w-[300px]">
                                {/* Title cell */}
                                <div className="bg-gray-500 text-white text-center font-extrabold text-xl lg:text-2xl h-14 flex items-center justify-center">
                                    테이블오더 비교
                                </div>
                                {features.map((f, i) => (
                                    <div
                                        key={i}
                                        className={`h-12 px-4 text-base lg:text-lg text-gray-700 flex items-center justify-center whitespace-nowrap font-medium ${
                                            i % 2 ? 'bg-[#f5f9ff]' : 'bg-white'
                                        }`}
                                    >
                                        {f}
                                    </div>
                                ))}
                            </div>

                            {/* Competitor columns */}
                            {competitors.map((c) => (
                                <div
                                    key={c.name}
                                    className={`flex flex-col flex-[1_1_0%] min-w-[120px] rounded-lg overflow-hidden border ${c.border}`}
                                >
                                    {/* Header */}
                                    <div
                                        className={`${c.headerBg} text-white text-center font-bold text-lg lg:text-xl h-14 flex items-center justify-center`}
                                    >
                                        {c.name}
                                    </div>
                                    {features.map((feature, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center justify-center h-12 px-2 ${
                                                i % 2 ? 'bg-[#f5f9ff]' : 'bg-white'
                                            }`}
                                        >
                                            <div className="text-center text-sm leading-tight">
                                                {(comparisonData as any)[feature][c.name] === 'X' ? (
                                                    <span className="text-red-500 font-bold text-lg">✕</span>
                                                ) : (comparisonData as any)[feature][c.name] === 'O' ? (
                                                    <span className="text-green-500 font-bold text-lg">○</span>
                                                ) : (
                                                    <span className={`${c.name === 'KT하이오더' ? 'text-orange-600 font-bold' : 'text-gray-700'}`}>
                                                        {(comparisonData as any)[feature][c.name]}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </AnimatedItem>
            </div>
        </AnimatedSection>
    );
}