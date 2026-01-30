'use client';

import { create } from 'zustand';

interface ChatbotUIState {
  open: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  toggle: () => void;
}

export const useChatbotUIStore = create<ChatbotUIState>((set) => ({
  open: false,
  openChatbot: () => set({ open: true }),
  closeChatbot: () => set({ open: false }),
  toggle: () => set((s)=>({open:!s.open})),
})); 
