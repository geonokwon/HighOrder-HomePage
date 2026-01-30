'use client';

import { AnimatedSection, AnimatedItem } from '@/presentation/components/AnimatedSection';
import { useInView, useMotionValue, animate, motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

interface CounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
  delay?: number;
}

interface TypingAnimationProps {
  text: string;
  speed?: number;
  className?: string;
  colorMap?: { [key: string]: string };
  onComplete?: () => void;
}

const AnimatedCounter: React.FC<CounterProps> = ({ target, suffix = '', duration = 2, className = '', delay = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });

  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  // Update local state whenever motionValue changes
  useEffect(() => {
    const unsub = motionVal.on('change', (v) => setDisplay(Math.floor(v)));
    return () => unsub();
  }, [motionVal]);

  // Trigger animation when element scrolls into view
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        animate(motionVal, target, { duration, ease: 'easeOut' });
      }, 400 + delay * 1000); // 0.4s delay after scroll animation + additional delay
      return () => clearTimeout(timer);
    }
  }, [inView, target, duration, motionVal, delay]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
};

const TypingAnimation: React.FC<TypingAnimationProps> = ({ text, speed = 100, className = '', colorMap = {}, onComplete }: TypingAnimationProps & { onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });

  useEffect(() => {
    if (!inView) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, inView, isComplete, onComplete]);


  const renderTextWithColors = () => {
    const words = displayText.split(' ');
    return words.map((word, index) => {
      const color = colorMap[word] || 'text-gray-700';
      return (
        <span key={index} className={color}>
          {word}
          {index < words.length - 1 && ' '}
        </span>
      );
    });
  };

  return (
    <div ref={ref} className={className}>
      {renderTextWithColors()}
      {currentIndex < text.length && (
        <span className="animate-pulse text-gray-700">|</span>
      )}
    </div>
  );
};

export function ExpertCareSection() {
  const [showGeniOne, setShowGeniOne] = useState(false);

  // 관찰용 ref
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleInView = useInView(titleRef, { once: true, amount: 0.4 });

  // inView 되면 0.8s 뒤 교체 애니메이션 시작
  useEffect(() => {
    if (titleInView) {
      const t = setTimeout(() => setShowGeniOne(true), 800);
      return () => clearTimeout(t);
    }
  }, [titleInView]);

  return (
    <AnimatedSection className="py-20 bg-transparent px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* 새로운 제목 섹션 */}
        <AnimatedItem direction="up" delay={0.1} className="mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-black mb-16 leading-tight">
            <motion.div layout className="flex items-center justify-center gap-3" ref={titleRef}>
              <motion.span layout className="text-gray-700 whitespace-nowrap">왜?</motion.span>

              {/* 가운데 단어 교체 */}
              <AnimatePresence mode="wait">
                {!showGeniOne ? (
                  <motion.span
                    key="kt"
                    className="text-[#FF9000] whitespace-nowrap"
                    layout
                    initial={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  >
                    하이오더
                  </motion.span>
                ) : (
                  <motion.span
                    key="geni"
                    className="text-[#FF9000] whitespace-nowrap"
                    layout
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  >
                    지니원
                  </motion.span>
                )}
              </AnimatePresence>

              <motion.span layout className="text-gray-700 whitespace-nowrap">이어야만 하는가?</motion.span>
            </motion.div>
          </h2>
        </AnimatedItem>

        <AnimatedItem>
          <span className="text-[#FF9000] font-bold text-2xl md:text-3xl mb-6 inline-block">
            올해 누적 대수{' '}
            <AnimatedCounter 
              target={800} 
              suffix="대" 
              className="text-[#FF9000] inline-block text-4xl md:text-5xl font-extrabold" 
              delay={0.3}
            />
          </span>
        </AnimatedItem>

        <AnimatedItem delay={0.7}>
          <div className="flex items-center justify-center gap-4">
            <img src="/ExpertCare/Wing_Left.png" alt="left wing" className="w-14 md:w-24 shrink-0" />
            <p className="text-4xl md:text-5xl font-extrabold text-gray-700 leading-snug">
              지니원은{' '}
              <span className="text-[#FF9000] font-extrabold inline-block text-4xl md:text-5xl">
                <AnimatedCounter 
                  target={15} 
                  suffix="년" 
                  className="text-[#FF9000]" 
                  delay={0.8}
                />
              </span>{' '}
              전문 기사가
              <br className="hidden md:block" /> 케어 해드립니다
            </p>
            <img src="/ExpertCare/Wing_Right.png" alt="right wing" className="w-14 md:w-24 shrink-0" />
          </div>
        </AnimatedItem>
      </div>
    </AnimatedSection>
  );
} 