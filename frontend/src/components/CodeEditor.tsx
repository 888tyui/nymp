'use client';

import { useStore } from '@/store/useStore';
import { filesApi } from '@/lib/api';
import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { Save, Code } from 'lucide-react';

export default function CodeEditor() {
  const { currentWorkspace, activeFile, updateFileContent } = useStore();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setHasUnsavedChanges(false);
  }, [activeFile]);

  const handleEditorChange = (value: string | undefined) => {
    if (!activeFile || value === undefined) return;
    
    updateFileContent(activeFile.id, value);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!activeFile || !currentWorkspace || !hasUnsavedChanges) return;

    setIsSaving(true);
    try {
      await filesApi.save(currentWorkspace.id, {
        path: activeFile.path,
        content: activeFile.content,
        language: activeFile.language,
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFile, hasUnsavedChanges]);

  if (!activeFile) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black text-gray-500">
        <Code size={48} className="mb-4 opacity-50" />
        <p>Select a file to start editing</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">{activeFile.path}</span>
          {hasUnsavedChanges && <span className="text-xs text-yellow-500">●</span>}
        </div>
        <button
          onClick={handleSave}
          disabled={!hasUnsavedChanges || isSaving}
          className="flex items-center space-x-1 text-sm px-3 py-1 bg-primary hover:bg-purple-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={14} />
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </button>
      </div>

      <div className="flex-1">
        <Editor
          height="100%"
          language={activeFile.language}
          value={activeFile.content}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: 'Roboto Mono, monospace',
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}

