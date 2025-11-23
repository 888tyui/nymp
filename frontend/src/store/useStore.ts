import { create } from 'zustand';

export interface File {
  id: string;
  workspace_id: string;
  path: string;
  content: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  wallet_address?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  workspace_id: string;
  agent_type: 'builder' | 'question';
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

interface Store {
  // Workspace
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;

  // Files
  files: File[];
  activeFile: File | null;
  setFiles: (files: File[]) => void;
  setActiveFile: (file: File | null) => void;
  updateFileContent: (fileId: string, content: string) => void;

  // Chat
  builderMessages: ChatMessage[];
  questionMessages: ChatMessage[];
  setBuilderMessages: (messages: ChatMessage[]) => void;
  setQuestionMessages: (messages: ChatMessage[]) => void;
  addBuilderMessage: (message: ChatMessage) => void;
  addQuestionMessage: (message: ChatMessage) => void;

  // UI
  showQuestionAgent: boolean;
  rightPanelView: 'preview' | 'code';
  setShowQuestionAgent: (show: boolean) => void;
  setRightPanelView: (view: 'preview' | 'code') => void;

  // Web3
  walletAddress: string | null;
  isWalletConnected: boolean;
  setWalletAddress: (address: string | null) => void;
  setIsWalletConnected: (connected: boolean) => void;
}

export const useStore = create<Store>((set) => ({
  // Workspace
  currentWorkspace: null,
  workspaces: [],
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  setWorkspaces: (workspaces) => set({ workspaces }),

  // Files
  files: [],
  activeFile: null,
  setFiles: (files) => set({ files }),
  setActiveFile: (file) => set({ activeFile: file }),
  updateFileContent: (fileId, content) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === fileId ? { ...f, content } : f
      ),
      activeFile:
        state.activeFile?.id === fileId
          ? { ...state.activeFile, content }
          : state.activeFile,
    })),

  // Chat
  builderMessages: [],
  questionMessages: [],
  setBuilderMessages: (messages) => set({ builderMessages: messages }),
  setQuestionMessages: (messages) => set({ questionMessages: messages }),
  addBuilderMessage: (message) =>
    set((state) => ({
      builderMessages: [...state.builderMessages, message],
    })),
  addQuestionMessage: (message) =>
    set((state) => ({
      questionMessages: [...state.questionMessages, message],
    })),

  // UI
  showQuestionAgent: false,
  rightPanelView: 'preview',
  setShowQuestionAgent: (show) => set({ showQuestionAgent: show }),
  setRightPanelView: (view) => set({ rightPanelView: view }),

  // Web3
  walletAddress: null,
  isWalletConnected: false,
  setWalletAddress: (address) => set({ walletAddress: address }),
  setIsWalletConnected: (connected) => set({ isWalletConnected: connected }),
}));


