"use client";
import React, { useEffect, useState } from "react";

interface BottomSheetModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  padding?: string;
  transitionDuration?: number;
  scrollable?: boolean;
  isDemo?: boolean;
}

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({ open, onClose, children, maxWidth = "1400px", padding = "p-2", transitionDuration = 300, scrollable = true, isDemo = false }) => {
  const [shouldRender, setShouldRender] = useState(open);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), transitionDuration);
      return () => clearTimeout(timeout);
    }
  }, [open, transitionDuration]);

  useEffect(() => {
    if (shouldRender && open) {
      setIsVisible(false);
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setIsVisible(false);
    }
  }, [shouldRender, open]);

  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end justify-center transition-all ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{ background: open ? "rgba(0,0,0,0.3)" : "transparent" }}
      onClick={onClose}
      {...(isDemo && { 'data-demo-modal': 'true' })}
    >
      <div
        className={`relative w-full bg-white rounded-2xl ${padding} shadow-lg transition-transform duration-300 ${
          open && isVisible ? "mb-4 translate-y-0" : "mb-0 translate-y-full"
        }`}
        style={{
          minHeight: 'auto',
          maxWidth,
          width: '100%',
          maxHeight: '90vh',
          height: 'auto',
          overflow: 'visible',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close (X) button - always visible, outside scroll area */}
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute top-6 right-4 md:right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 z-10"
          style={{ zIndex: 10 }}
        >
          <span className="text-2xl text-gray-500">×</span>
        </button>
        <div 
          className={`w-full h-full ${scrollable ? "overflow-y-auto scrollbar-thin" : "overflow-y-hidden"}`} 
          style={{ maxHeight: '80vh' }}
          {...(isDemo && { 'data-demo-content': 'true' })}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheetModal; 