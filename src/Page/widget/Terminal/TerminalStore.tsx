import { create } from 'zustand';
import { TerminalMessage, TerminalVariables } from './termianlInterface';

interface TerminalState {
  messages: TerminalMessage[];
  context: string;
  variables: TerminalVariables;
  customContext?: React.ReactNode;
  echoEnabled: boolean;
  isInitializing: boolean;
  addMessage: (message: TerminalMessage) => void;
  setContext: (context: string) => void;
  setCustomContext: (context: React.ReactNode) => void;
  setVariable: (key: string, value: string) => void;
  getVariable: (key: string) => string | undefined;
  clearMessages: () => void;
  setEchoEnabled: (enabled: boolean) => void;
  setInitializing: (initializing: boolean) => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  messages: [],
  context: '/CCRS_Terminal',
  variables: {},
  customContext: undefined,
  echoEnabled: true,
  isInitializing: false,
  addMessage: (message) => {
    if (!get().echoEnabled && message.class === 'success') {
      return;
    }
    if (get().isInitializing && !message.class) {
      return;
    }
    set((state) => ({ messages: [...state.messages, message] }));
  },
  setContext: (context) =>
      set({ context }),
  setCustomContext: (context) =>
      set({ customContext: context }),
  setVariable: (key, value) =>
      set((state) => ({
        variables: { ...state.variables, [key]: value }
      })),
  getVariable: (key) => get().variables[key],
  clearMessages: () => set({ messages: [] }),
  setEchoEnabled: (enabled) => set({ echoEnabled: enabled }),
  setInitializing: (initializing) => set({ isInitializing: initializing }),
}));