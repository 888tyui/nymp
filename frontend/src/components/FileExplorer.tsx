'use client';

import { useStore } from '@/store/useStore';
import { filesApi } from '@/lib/api';
import { File, Folder, Plus, Trash2, FileCode } from 'lucide-react';
import { useState } from 'react';
import Modal from './Modal';
import { useModal } from '@/hooks/useModal';

export default function FileExplorer() {
  const { currentWorkspace, files, activeFile, setFiles, setActiveFile } = useStore();
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const modal = useModal();
  const [fileToDelete, setFileToDelete] = useState<{ id: string; name: string } | null>(null);

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'html':
      case 'css':
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'json':
        return <FileCode size={16} className="text-primary" />;
      default:
        return <File size={16} className="text-gray-400" />;
    }
  };

  const handleCreateFile = async () => {
    if (!newFileName.trim() || !currentWorkspace) return;

    const ext = newFileName.split('.').pop()?.toLowerCase() || 'txt';
    const languageMap: { [key: string]: string } = {
      html: 'html',
      css: 'css',
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      json: 'json',
      md: 'markdown',
    };

    try {
      await filesApi.save(currentWorkspace.id, {
        path: newFileName,
        content: '',
        language: languageMap[ext] || 'plaintext',
      });

      // Reload files
      const response = await filesApi.getAll(currentWorkspace.id);
      setFiles(response.data);
      setShowNewFileDialog(false);
      setNewFileName('');
    } catch (error) {
      console.error('Error creating file:', error);
      modal.showModal({
        title: 'Error',
        message: 'Failed to create file. Please try again.',
        type: 'error',
      });
    }
  };

  const confirmDeleteFile = async () => {
    if (!currentWorkspace || !fileToDelete) return;

    try {
      await filesApi.delete(currentWorkspace.id, fileToDelete.id);
      
      // Reload files
      const response = await filesApi.getAll(currentWorkspace.id);
      setFiles(response.data);
      
      // Clear active file if it was deleted
      if (activeFile?.id === fileToDelete.id) {
        setActiveFile(null);
      }
      
      setFileToDelete(null);
    } catch (error) {
      console.error('Error deleting file:', error);
      modal.showModal({
        title: 'Error',
        message: 'Failed to delete file. Please try again.',
        type: 'error',
      });
    }
  };

  const handleDeleteFile = (file: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!currentWorkspace) return;
    
    setFileToDelete({ id: file.id, name: file.path });
    modal.showModal({
      title: 'Delete File',
      message: `Are you sure you want to delete "${file.path}"? This action cannot be undone.`,
      type: 'warning',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: confirmDeleteFile,
    });
  };

  return (
    <div className="h-full flex flex-col bg-black border-r border-gray-800">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300">Files</h3>
        <button
          onClick={() => setShowNewFileDialog(true)}
          disabled={!currentWorkspace}
          className="text-primary hover:text-purple-400 transition-colors disabled:opacity-50"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {files.length === 0 && (
          <p className="text-sm text-gray-500 text-center mt-4">No files yet</p>
        )}

        {files.map((file) => (
          <div
            key={file.id}
            onClick={() => setActiveFile(file)}
            className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-colors group ${
              activeFile?.id === file.id
                ? 'bg-primary bg-opacity-20 text-primary'
                : 'hover:bg-dark-bg text-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              {getFileIcon(file.path)}
              <span className="text-sm truncate">{file.path}</span>
            </div>
            <button
              onClick={(e) => handleDeleteFile(file, e)}
              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* New File Dialog */}
      {showNewFileDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-dark-bg border border-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-primary mb-4">Create New File</h3>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
              placeholder="filename.html"
              className="w-full bg-black border border-gray-800 rounded px-4 py-2 text-sm focus:outline-none focus:border-primary mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowNewFileDialog(false);
                  setNewFileName('');
                }}
                className="px-4 py-2 bg-dark-bg hover:bg-gray-800 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFile}
                disabled={!newFileName.trim()}
                className="px-4 py-2 bg-primary hover:bg-purple-600 rounded transition-colors disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.hideModal}
        title={modal.config.title}
        message={modal.config.message}
        type={modal.config.type}
        confirmText={modal.config.confirmText}
        cancelText={modal.config.cancelText}
        onConfirm={modal.config.onConfirm}
        showCancel={modal.config.showCancel}
      />
    </div>
  );
}

