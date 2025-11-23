'use client';

import { useStore } from '@/store/useStore';
import { workspaceApi, filesApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { Plus, FolderOpen, Trash2 } from 'lucide-react';

export default function WorkspaceSelector() {
  const {
    currentWorkspace,
    workspaces,
    walletAddress,
    setCurrentWorkspace,
    setWorkspaces,
    setFiles,
    setBuilderMessages,
    setQuestionMessages,
  } = useStore();

  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  const [showWorkspaceList, setShowWorkspaceList] = useState(false);

  useEffect(() => {
    loadWorkspaces();
  }, [walletAddress]);

  const loadWorkspaces = async () => {
    try {
      const response = await workspaceApi.getAll(walletAddress || undefined);
      setWorkspaces(response.data);
      
      // Auto-select first workspace if none selected
      if (!currentWorkspace && response.data.length > 0) {
        selectWorkspace(response.data[0].id);
      }
    } catch (error) {
      console.error('Error loading workspaces:', error);
    }
  };

  const selectWorkspace = async (workspaceId: string) => {
    try {
      const workspaceResponse = await workspaceApi.getById(workspaceId);
      setCurrentWorkspace(workspaceResponse.data);

      // Load files for the workspace
      const filesResponse = await filesApi.getAll(workspaceId);
      setFiles(filesResponse.data);

      // Clear chat messages (they will be loaded by the chat components)
      setBuilderMessages([]);
      setQuestionMessages([]);

      setShowWorkspaceList(false);
    } catch (error) {
      console.error('Error selecting workspace:', error);
    }
  };

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;

    try {
      const response = await workspaceApi.create({
        name: newWorkspaceName,
        description: newWorkspaceDesc,
        wallet_address: walletAddress || undefined,
      });

      await loadWorkspaces();
      selectWorkspace(response.data.id);
      
      setShowNewWorkspaceDialog(false);
      setNewWorkspaceName('');
      setNewWorkspaceDesc('');
    } catch (error) {
      console.error('Error creating workspace:', error);
      alert('Failed to create workspace');
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this workspace?')) return;

    try {
      await workspaceApi.delete(workspaceId);
      await loadWorkspaces();
      
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(null);
        setFiles([]);
      }
    } catch (error) {
      console.error('Error deleting workspace:', error);
      alert('Failed to delete workspace');
    }
  };

  return (
    <>
      <div className="p-4 border-b border-gray-800 bg-black">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">WORKSPACE</span>
          <button
            onClick={() => setShowNewWorkspaceDialog(true)}
            className="text-primary hover:text-purple-400 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <button
          onClick={() => setShowWorkspaceList(true)}
          className="w-full flex items-center justify-between px-3 py-2 bg-dark-bg hover:bg-gray-800 rounded transition-colors text-left"
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <FolderOpen size={16} className="text-primary flex-shrink-0" />
            <span className="text-sm truncate">
              {currentWorkspace ? currentWorkspace.name : 'Select Workspace'}
            </span>
          </div>
        </button>
      </div>

      {/* Workspace List Modal */}
      {showWorkspaceList && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-dark-bg border border-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold text-primary mb-4">Select Workspace</h3>
            
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {workspaces.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No workspaces yet</p>
              )}
              
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  onClick={() => selectWorkspace(workspace.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded cursor-pointer transition-colors group ${
                    currentWorkspace?.id === workspace.id
                      ? 'bg-primary bg-opacity-20 border border-primary'
                      : 'bg-black hover:bg-gray-900 border border-gray-800'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{workspace.name}</p>
                    {workspace.description && (
                      <p className="text-xs text-gray-400 truncate">{workspace.description}</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleDeleteWorkspace(workspace.id, e)}
                    className="opacity-0 group-hover:opacity-100 ml-2 text-red-400 hover:text-red-300 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowWorkspaceList(false)}
              className="w-full px-4 py-2 bg-primary hover:bg-purple-600 rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* New Workspace Dialog */}
      {showNewWorkspaceDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-dark-bg border border-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-primary mb-4">Create New Workspace</h3>
            
            <input
              type="text"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="Workspace name"
              className="w-full bg-black border border-gray-800 rounded px-4 py-2 text-sm focus:outline-none focus:border-primary mb-3"
              autoFocus
            />
            
            <textarea
              value={newWorkspaceDesc}
              onChange={(e) => setNewWorkspaceDesc(e.target.value)}
              placeholder="Description (optional)"
              className="w-full bg-black border border-gray-800 rounded px-4 py-2 text-sm focus:outline-none focus:border-primary mb-4 resize-none"
              rows={3}
            />
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowNewWorkspaceDialog(false);
                  setNewWorkspaceName('');
                  setNewWorkspaceDesc('');
                }}
                className="px-4 py-2 bg-dark-bg hover:bg-gray-800 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkspace}
                disabled={!newWorkspaceName.trim()}
                className="px-4 py-2 bg-primary hover:bg-purple-600 rounded transition-colors disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

