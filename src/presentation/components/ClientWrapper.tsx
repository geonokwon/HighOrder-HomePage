'use client';

import BottomFixedButton from './BottomFixedButton';

export default function ClientWrapper() {
  return (
    <BottomFixedButton onClick={() => {
      const actionSection = document.getElementById('action-section');
      if (actionSection) {
        actionSection.scrollIntoView({ behavior: 'smooth' });
      }
    }}>
      문의하기
    </BottomFixedButton>
  );
} 