"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface BottomFixedButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  hide?: boolean;
  id?: string;
}

const BottomFixedButton: React.FC<BottomFixedButtonProps> = ({ onClick, children, style, hide, id }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // 클라이언트 준비 전에는 렌더링하지 않음
  if (!isClient) {
    return null;
  }
  
  const buttonStyle = {
    ...style,
    backgroundColor: 'transparent',
    width: isMobile ? 'min(280px, 75vw)' : 'min(295px, 85vw)',
    height: 53,
    borderRadius: 9999,
    border: '3px solid transparent',
    background: 'linear-gradient(90deg, #2B2A2A, #515151) padding-box, linear-gradient(90deg, #FFFFFF, #FF8400) border-box',
    backgroundOrigin: 'padding-box, border-box',
    backgroundClip: 'padding-box, border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 'clamp(14px, 4vw, 16px)',
    color: '#FFFFFF',
    padding: '0 16px',
    outline: 'none',
    WebkitAppearance: 'none' as const,
    MozAppearance: 'none' as const,
    appearance: 'none' as const,
    gap: 1,
    maxWidth: isMobile ? 'calc(100vw - 90px)' : 'calc(100vw - 120px)',
    position: 'fixed' as const,
    bottom: '24px',
    left: isMobile ? '10px' : '50%',
    right: 'auto',
    transform: isMobile ? 'none' : undefined,
    zIndex: 50,
    margin: 0,
  };

  if (isMobile) {
    // 모바일: 일반 button 태그 사용 (애니메이션 없음)
    return (
      <button
        id={id}
        onClick={onClick}
        className="shadow-lg transition-opacity duration-300"
        style={{
          ...buttonStyle,
          opacity: hide ? 0 : 1,
          pointerEvents: hide ? 'none' : 'auto',
        }}
        data-mobile="true"
      >
        <img
          src="/BottomFixed/BottomFixed_Icon.png"
          alt="문의 아이콘"
          width={26}
          height={26}
          style={{ marginRight: 2 }}
          className="inline-block align-middle"
        />
        {children}
      </button>
    );
  }

  // 데스크탑: motion.button 사용 (애니메이션 있음)
  return (
    <motion.button
      id={id}
      onClick={onClick}
      className="shadow-lg"
      data-mobile="false"
      style={{
        ...buttonStyle,
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      transformTemplate={(_, gen) => `translateX(-50%) ${gen}`}
      initial={{ y: 0, scale: 1 }}
      animate={{
        y: hide ? 120 : (hovered ? -12 : 0),
        scale: hovered ? 1.08 : 1,
        opacity: hide ? 0 : 1,
        transition: { type: "spring", stiffness: 400, damping: 30 }
      }}
    >
      <img
        src="/BottomFixed/BottomFixed_Icon.png"
        alt="문의 아이콘"
        width={26}
        height={26}
        style={{ marginRight: 4 }}
        className="inline-block align-middle"
      />
      {children}
    </motion.button>
  );
};

export default BottomFixedButton; 