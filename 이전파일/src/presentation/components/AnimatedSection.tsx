'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  style?: React.CSSProperties;
}

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
}

interface AnimatedItemProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  style?: React.CSSProperties;
}

// 섹션 전체 애니메이션
export const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  className = '',
  delay = 0,
  id,
  style
}) => {
  return (
    <motion.div
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.8, 0.5, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

// 자식 요소들이 순차적으로 나타나는 컨테이너
export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({ 
  children, 
  className = '',
  staggerChildren = 0.1,
  delayChildren = 0.2
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// 개별 아이템 애니메이션
export const AnimatedItem: React.FC<AnimatedItemProps> = ({ 
  children, 
  className = '',
  delay = 0,
  direction = 'up',
  style
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 40, x: 0 };
      case 'down': return { y: -40, x: 0 };
      case 'left': return { x: 40, y: 0 };
      case 'right': return { x: -40, y: 0 };
      default: return { y: 40, x: 0 };
    }
  };

  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { 
          opacity: 0, 
          ...getInitialPosition()
        },
        visible: { 
          opacity: 1, 
          x: 0, 
          y: 0,
          transition: {
            duration: 0.6,
            delay,
            ease: [0.25, 0.8, 0.5, 1]
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}; 