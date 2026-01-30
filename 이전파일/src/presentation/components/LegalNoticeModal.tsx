import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StringToBoolean } from 'class-variance-authority/dist/types';

interface LegalNoticeModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const LegalNoticeModal: React.FC<LegalNoticeModalProps> = ({ open, onClose, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl relative"
          >
            <button
              className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700"
              onClick={onClose}
              aria-label="닫기"
            >
              ×
            </button>
            <div className="max-h-[60vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LegalNoticeModal; 