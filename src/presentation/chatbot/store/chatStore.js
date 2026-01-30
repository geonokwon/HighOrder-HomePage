import { create } from 'zustand';

export const useChatStore = create((set) => ({
  scenario: null,
  currentMessageId: null,
  messages: [],
  options: [],

  setScenario: (scenario) => set({ scenario }),
  setCurrentMessageId: (id) => set({ currentMessageId: id }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setOptions: (opts) => set({ options: opts }),
  resetChat: () => set({ messages: [], options: [], currentMessageId: null }),
  setMessages: (messages) => set({ messages }),
})); 