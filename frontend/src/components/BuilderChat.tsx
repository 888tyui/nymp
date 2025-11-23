'use client';

import { useStore } from '@/store/useStore';
import { chatApi, filesApi } from '@/lib/api';
import { useEffect, useRef, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import Modal from './Modal';
import { useModal } from '@/hooks/useModal';

export default function BuilderChat() {
  const { currentWorkspace, builderMessages, setBuilderMessages, addBuilderMessage, walletAddress, setFiles, files } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modal = useModal();

  useEffect(() => {
    if (currentWorkspace) {
      loadChatHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspace]);

  useEffect(() => {
    scrollToBottom();
  }, [builderMessages]);

  const loadChatHistory = async () => {
    if (!currentWorkspace) return;

    try {
      const response = await chatApi.getHistory(currentWorkspace.id, 'builder');
      setBuilderMessages(response.data);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // Generate UUID for temp workspace if no workspace exists
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
      const workspaceId = currentWorkspace?.id || generateUUID();
      
      // Add user message to UI immediately
      const tempUserMessage = {
        id: Date.now().toString(),
        workspace_id: workspaceId,
        agent_type: 'builder' as const,
        role: 'user' as const,
        content: userMessage,
        created_at: new Date().toISOString(),
      };
      addBuilderMessage(tempUserMessage);

      const response = await chatApi.sendMessage(workspaceId, 'builder', userMessage, walletAddress);
      
      let displayMessage = response.data.message;
      let generatedFiles: any[] = [];

      // Try to parse JSON response
      try {
        const jsonMatch = response.data.message.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.message && parsed.files) {
            displayMessage = parsed.message;
            generatedFiles = parsed.files;
            
            // Auto-create files if workspace exists
            if (currentWorkspace) {
              for (const file of parsed.files) {
                try {
                  await filesApi.save(currentWorkspace.id, {
                    path: file.path,
                    content: file.content,
                    language: file.language
                  });
                } catch (fileError) {
                  console.error('Error saving file:', fileError);
                }
              }
              
              // Reload files with a slight delay to ensure DB update
              setTimeout(async () => {
                try {
                  const filesResponse = await filesApi.getAll(currentWorkspace.id);
                  setFiles(filesResponse.data);
                } catch (e) {
                  console.error('Error reloading files:', e);
                }
              }, 500);
              
              displayMessage += '\n\n✅ Files created successfully! Check the live preview.';
            }
          }
        }
      } catch (parseError) {
        console.log('Not JSON format, using as plain message');
      }
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        workspace_id: workspaceId,
        agent_type: 'builder' as const,
        role: 'assistant' as const,
        content: displayMessage,
        created_at: new Date().toISOString(),
      };
      addBuilderMessage(assistantMessage);

      // If workspace was auto-created, reload workspace list
      if (response.data.autoCreatedWorkspace) {
        // Reload workspaces and files
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      modal.showModal({
        title: 'Error',
        message: 'Failed to send message. Please check your connection and try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-primary">Builder Agent</h2>
        <p className="text-xs text-gray-400 mt-1">AI assistant to help you build</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ overflowY: 'scroll', maxHeight: '100%' }}>
        {builderMessages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Start building your Monad Web3 app!</p>
            <p className="text-sm mt-2">Try: &ldquo;Create a wallet dashboard with MON balance&rdquo;</p>
          </div>
        )}

        {builderMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-dark-bg text-gray-200 border border-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-dark-bg text-gray-200 border border-gray-800 rounded-lg p-3">
              <Loader2 size={16} className="animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={walletAddress ? "Ask the builder agent..." : "Connect wallet to start building..."}
            className="flex-1 bg-dark-bg border border-gray-800 rounded-lg px-4 py-2 text-sm resize-none focus:outline-none focus:border-primary"
            rows={2}
            disabled={!walletAddress || isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !walletAddress || isLoading}
            className="px-4 bg-primary hover:bg-purple-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.hideModal}
        title={modal.config.title}
        message={modal.config.message}
        type={modal.config.type}
      />
    </div>
  );
}

