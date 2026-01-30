'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import DemoInner from '@/presentation/demo/components/DemoInner';
import BottomSheetModal from '@/presentation/components/BottomSheetModal';
import { InteractiveTutorial } from '@/presentation/components';
import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/presentation/components/AnimatedSection';
import { CartProvider } from '@/shared/context/CartContext';
import { ActionSection } from '@/presentation/sections/ActionSection';

export function HeroSection() {
    const [demoOpen, setDemoOpen] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [showInquiryModal, setShowInquiryModal] = useState(false);

    useEffect(() => {
        if (demoOpen) {
            setShowTutorial(true);
        }
    }, [demoOpen]);

    const handleTutorialComplete = () => {
        setShowTutorial(false);
    };

    const handleTutorialClose = () => {
        setShowTutorial(false);
        setDemoOpen(false);
    };
    return (
        <>
            <AnimatedSection
                className="w-full min-h-[80vh] md:min-h-screen flex items-center justify-center px-4 relative pt-8 md:pt-0"
                style={{ backgroundColor: 'transparent' }}
            >
                <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
                    {/* 왼쪽 텍스트 영역 */}
                    <AnimatedContainer className="text-left text-white space-y-6" staggerChildren={0.3}>
                        {/* 메인 타이틀 */}
                        <AnimatedItem className="space-y-4">
                            <h1 className="text-3xl md:text-6xl font-bold leading-tight !text-3xl md:!text-6xl">
                                사장님 성공 파트너,
                            </h1>
                            <div className="flex items-center gap-3">
                                <Image
                                    src="/KT_Logo.png"
                                    alt="KT"
                                    width={60}
                                    height={37}
                                    priority
                                    className="object-contain h-[30px] md:h-[50px] w-auto"
                                />
                                <span className="text-3xl md:text-6xl font-bold !text-3xl md:!text-6xl">하이오더</span>
                            </div>
                        </AnimatedItem>
                        {/* 서브타이틀 */}
                        <AnimatedItem>
                            {/* 서브타이틀 글자 간격 넓혀야 함 leading- */}
                            <p className="text-base md:text-2xl font-medium !text-base md:!text-2xl" style={{ lineHeight: '1.5 !important', display: 'block' }}>
                                전국 KT센터 A/S 망, 24시간 내 출동!<br />
                                결제 수수료?! PG, 기타 수수료 Zero!<br />
                                주문누락, 결제 누락 Zero!
                            </p>
                        </AnimatedItem>
                        {/* 데모 버튼 (데스크탑 전용) */}
                        <AnimatedItem className="pt-4 hidden md:block">
                            <button
                                onClick={() => setDemoOpen(true)}
                                className="group relative text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 text-base md:text-xl"
                                style={{
                                    border: '1px solid transparent',
                                    background: 'linear-gradient(90deg, #2F2D2D, #3E3631) padding-box, linear-gradient(90deg, #FF5900, #FFFFFF) border-box',
                                    backgroundOrigin: 'padding-box, border-box',
                                    backgroundClip: 'padding-box, border-box',
                                }}
                            >
                                <span className="text-base md:text-xl">
                                    하이오더 체험해보기
                                </span>
                                <div className="w-6 h-6 relative">
                                    <Image
                                        src="/DemoImages/HighOrfer_Demo_Icon.png"
                                        alt="하이오더 데모 아이콘"
                                        fill
                                        className="object-contain group-hover:rotate-12 transition-transform duration-300"
                                        onError={(e) => {
                                            console.log('Failed to load HighOrfer_Demo_Icon.png');
                                        }}
                                    />
                                </div>
                                {/* 반짝이는 효과 */}
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full"></div>
                            </button>
                        </AnimatedItem>
                    </AnimatedContainer>
                    {/* 오른쪽 이미지 영역 */}
                    <div className="relative flex flex-col items-center lg:justify-end">
                        {/* 메인 캐릭터 이미지 */}
                        <AnimatedItem delay={0.4} direction="right" className="relative">
                            <Image
                                src="/HeroSection_MainCharacter.png"
                                alt="kt 하이오더 마스코트"
                                width={696}
                                height={486}
                                priority
                                className="max-w-full h-auto"
                            />
                            {/* 매출 UP! 텍스트 */}
                            <AnimatedItem delay={0.8} direction="left" className="absolute top-4 left-8 text-[#FFD372] font-bold text-2xl md:text-3xl transform -rotate-12 select-none">
                                매출 UP !
                            </AnimatedItem>
                            {/* 인건비 DOWN! 텍스트 */}
                            <AnimatedItem delay={1.0} direction="right" className="absolute top-8 right-4 text-[#DAFF96] font-bold text-2xl md:text-3xl transform rotate-12 select-none">
                                인건비 DOWN !
                            </AnimatedItem>
                        </AnimatedItem>
                        {/* 데모 버튼 (모바일 전용) */}
                        <AnimatedItem className="mt-4 block md:hidden w-full flex justify-center">
                            <button
                                onClick={() => setDemoOpen(true)}
                                className="group relative text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 text-base"
                                style={{
                                    border: '3px solid transparent',
                                    background: 'linear-gradient(90deg, #2F2D2D, #3E3631) padding-box, linear-gradient(90deg, #FF5900, #FFFFFF) border-box',
                                    backgroundOrigin: 'padding-box, border-box',
                                    backgroundClip: 'padding-box, border-box',
                                }}
                            >
                                <span className="text-base">
                                    하이오더 체험해보기
                                </span>
                                <div className="w-6 h-6 relative">
                                    <Image
                                        src="/DemoImages/HighOrfer_Demo_Icon.png"
                                        alt="하이오더 데모 아이콘"
                                        fill
                                        className="object-contain group-hover:rotate-12 transition-transform duration-300"
                                        onError={(e) => {
                                            console.log('Failed to load HighOrfer_Demo_Icon.png');
                                        }}
                                    />
                                </div>
                                {/* 반짝이는 효과 */}
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full"></div>
                            </button>
                        </AnimatedItem>
                    </div>
                </div>
                {/* 배경 장식 요소들 */}
                <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-200 rounded-full opacity-30"></div>
                <div className="absolute bottom-32 left-16 w-12 h-12 bg-orange-200 rounded-full opacity-40"></div>
            </AnimatedSection>
            <BottomSheetModal open={demoOpen} onClose={() => setDemoOpen(false)} maxWidth="1400px" isDemo={true}>
                <CartProvider>
                    <DemoInner 
                        onInquiryClick={() => {
                            setDemoOpen(false);
                            setShowInquiryModal(true);
                        }}
                    />
                </CartProvider>
            </BottomSheetModal>

            {/* 상담신청 모달 */}
            <BottomSheetModal open={showInquiryModal} onClose={() => setShowInquiryModal(false)} maxWidth="600px" padding="p-2" scrollable={false}>
                <ActionSection hideImage={true} hideHeader={true} compactMode={true} />
            </BottomSheetModal>
            
            {/* 인터랙티브 튜토리얼 */}
            <InteractiveTutorial
                isVisible={showTutorial}
                onComplete={handleTutorialComplete}
                onClose={handleTutorialClose}
            />
        </>
    );
} 