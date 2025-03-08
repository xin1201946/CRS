import { create } from 'zustand';
import { TerminalMessage, TerminalVariables } from './termianlInterface';

interface TerminalState {
  messages: TerminalMessage[];
  context: string;
  variables: TerminalVariables;
  customContext?: React.ReactNode;
  addMessage: (message: TerminalMessage) => void;
  setContext: (context: string) => void;
  setCustomContext: (context: React.ReactNode) => void;
  setVariable: (key: string, value: string) => void;
  getVariable: (key: string) => string | undefined;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  messages: [],
  context: '/react-web-terminal',
  variables: {},
  customContext: undefined,
  addMessage: (message) =>
      set((state) => ({ messages: [...state.messages, message] })),
  setContext: (context) =>
      set({ context }),
  setCustomContext: (context) =>
      set({ customContext: context }),
  setVariable: (key, value) =>
      set((state) => ({
        variables: { ...state.variables, [key]: value }
      })),
  getVariable: (key) => get().variables[key],
}));