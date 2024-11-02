import { create } from 'zustand';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Thread {
  id: string;
  title: string;
  messages: Message[];
  systemPrompt: string;
  createdAt: string;
}

interface ChatStore {
  threads: Thread[];
  activeThread: Thread | null;
  systemPrompt: string;
  messages: Message[];
  createThread: () => void;
  deleteThread: (id: string) => void;
  setActiveThread: (id: string) => void;
  updateSystemPrompt: (prompt: string) => void;
  sendMessage: (content: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  threads: [],
  activeThread: null,
  systemPrompt: 'You are a helpful AI assistant.',
  messages: [],

  createThread: () => set((state) => {
    const newThread: Thread = {
      id: Math.random().toString(36).substring(7),
      title: 'New Thread',
      messages: [],
      systemPrompt: state.systemPrompt,
      createdAt: new Date().toISOString(),
    };

    return {
      threads: [newThread, ...state.threads],
      activeThread: newThread,
      messages: [],
    };
  }),

  deleteThread: (id) => set((state) => ({
    threads: state.threads.filter((thread) => thread.id !== id),
    activeThread: state.activeThread?.id === id ? null : state.activeThread,
    messages: state.activeThread?.id === id ? [] : state.messages,
  })),

  setActiveThread: (id) => set((state) => {
    const thread = state.threads.find((t) => t.id === id);
    return thread ? {
      activeThread: thread,
      messages: thread.messages,
      systemPrompt: thread.systemPrompt,
    } : state;
  }),

  updateSystemPrompt: (prompt) => set((state) => {
    if (state.activeThread) {
      return {
        threads: state.threads.map((thread) =>
          thread.id === state.activeThread?.id
            ? { ...thread, systemPrompt: prompt }
            : thread
        ),
        systemPrompt: prompt,
      };
    }
    return { systemPrompt: prompt };
  }),

  sendMessage: (content) => set((state) => {
    const newMessage: Message = { role: 'user', content };
    const updatedMessages = [...state.messages, newMessage];
    
    if (state.activeThread) {
      return {
        messages: updatedMessages,
        threads: state.threads.map((thread) =>
          thread.id === state.activeThread?.id
            ? { ...thread, messages: updatedMessages }
            : thread
        ),
      };
    }
    
    return { messages: updatedMessages };
  }),
}));