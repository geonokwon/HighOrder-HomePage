"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import BottomFixedButton from "./BottomFixedButton";
import BottomSheetModal from "./BottomSheetModal";
import { ActionSection } from "@/presentation/sections/ActionSection";

const InquiryPopup: React.FC = () => {
    const pathname = usePathname();
    if (pathname === '/admin/chatbot/editor') return null;
    const [open, setOpen] = useState(false);
    const [hideButton, setHideButton] = useState(false);

    useEffect(() => {
        let observer: IntersectionObserver | null = null;
        let retryTimeout: NodeJS.Timeout | null = null;

        function setupObserver() {
            const ref = document.getElementById('action-section');
            if (!ref) {
                // action-section이 없는 경우 (리뷰 페이지 등) 버튼을 항상 보이게 함
                setHideButton(false);
                return () => {};
            }
            
            // action-section이 있는 경우 기존 IntersectionObserver 사용
            observer = new window.IntersectionObserver(
                ([entry]) => {
                    setHideButton(entry.intersectionRatio > 0.3);
                },
                {
                    root: null,
                    threshold: 0.3,
                }
            );
            observer.observe(ref);
            
            return () => {
                if (observer) observer.disconnect();
            };
        }
        
        const cleanup = setupObserver();
        return cleanup;
    }, [pathname]); // pathname이 변경될 때마다 재실행

    const isCalc = pathname.startsWith('/calc');
    const label = isCalc ? '하이오더 견적 문의하기' : '견적 문의하기';

    return (
        <>
            <BottomFixedButton
                id="inquiry-button"
                onClick={() => setOpen(true)}
                hide={hideButton}
            >
                {label}
            </BottomFixedButton>
            <BottomSheetModal open={open} onClose={() => setOpen(false)} maxWidth="600px" padding="p-2" scrollable={false}>
                <ActionSection hideImage={true} hideHeader={true} compactMode={true} />
            </BottomSheetModal>
        </>
    );
};

export default InquiryPopup; 