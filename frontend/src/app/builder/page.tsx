'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import WorkspaceSelector from '@/components/WorkspaceSelector';
import FileExplorer from '@/components/FileExplorer';
import BuilderChat from '@/components/BuilderChat';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import QuestionAgent from '@/components/QuestionAgent';
import { useStore } from '@/store/useStore';
import { Code, Eye } from 'lucide-react';

export default function BuilderPage() {
  const { rightPanelView, setRightPanelView } = useStore();

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Builder Agent + File Explorer */}
        <div className="w-80 flex flex-col border-r border-gray-800 overflow-hidden">
          <WorkspaceSelector />
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            <div className="h-64 flex-shrink-0 border-b border-gray-800 overflow-hidden">
              <FileExplorer />
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <BuilderChat />
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor / Live Preview */}
        <div className="flex-1 flex flex-col">
          {/* View Toggle */}
          <div className="h-12 bg-black border-b border-gray-800 flex items-center px-4 space-x-2">
            <button
              onClick={() => setRightPanelView('preview')}
              className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                rightPanelView === 'preview'
                  ? 'bg-primary text-white'
                  : 'bg-dark-bg text-gray-400 hover:text-white'
              }`}
            >
              <Eye size={18} />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setRightPanelView('code')}
              className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                rightPanelView === 'code'
                  ? 'bg-primary text-white'
                  : 'bg-dark-bg text-gray-400 hover:text-white'
              }`}
            >
              <Code size={18} />
              <span>Code</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {rightPanelView === 'preview' ? <LivePreview /> : <CodeEditor />}
          </div>
        </div>
      </div>

      {/* Question Agent */}
      <QuestionAgent />
    </div>
  );
}

