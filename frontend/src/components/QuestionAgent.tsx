'use client';

import { useStore } from '@/store/useStore';
import { chatApi } from '@/lib/api';
import { useEffect, useRef, useState } from 'react';
import { Send, X, Loader2, MessageCircle } from 'lucide-react';
import Modal from './Modal';
import { useModal } from '@/hooks/useModal';

export default function QuestionAgent() {
  const {
    currentWorkspace,
    questionMessages,
    setQuestionMessages,
    addQuestionMessage,
    showQuestionAgent,
    setShowQuestionAgent,
  } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modal = useModal();

  useEffect(() => {
    if (currentWorkspace && showQuestionAgent) {
      loadChatHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspace, showQuestionAgent]);

  useEffect(() => {
    scrollToBottom();
  }, [questionMessages]);

  const loadChatHistory = async () => {
    if (!currentWorkspace) return;

    try {
      const response = await chatApi.getHistory(currentWorkspace.id, 'question');
      setQuestionMessages(response.data);
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
      
      const tempUserMessage = {
        id: Date.now().toString(),
        workspace_id: workspaceId,
        agent_type: 'question' as const,
        role: 'user' as const,
        content: userMessage,
        created_at: new Date().toISOString(),
      };
      addQuestionMessage(tempUserMessage);

      const response = await chatApi.sendMessage(workspaceId, 'question', userMessage);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        workspace_id: workspaceId,
        agent_type: 'question' as const,
        role: 'assistant' as const,
        content: response.data.message,
        created_at: new Date().toISOString(),
      };
      addQuestionMessage(assistantMessage);
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Check for specific error types
      if (error.response?.data?.errorType === 'rate_limit') {
        modal.showModal({
          title: 'Rate Limit Exceeded',
          message: 'Too many requests. Please wait a moment and try again.',
          type: 'warning',
        });
      } else {
        modal.showModal({
          title: 'Error',
          message: error.response?.data?.error || 'Failed to send message. Please check your connection and try again.',
          type: 'error',
        });
      }
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

  if (!showQuestionAgent) {
    return (
      <button
        onClick={() => setShowQuestionAgent(true)}
        className="fixed bottom-6 right-6 bg-primary hover:bg-purple-600 text-white rounded-full p-4 shadow-lg transition-all z-40 flex items-center space-x-2"
      >
        <MessageCircle size={24} />
        <span className="pr-2">Need Help?</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-black border border-gray-800 rounded-lg shadow-2xl z-40 flex flex-col animate-slide-up">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-primary">Question Agent</h2>
          <p className="text-xs text-gray-400 mt-1">Get help planning your app</p>
        </div>
        <button
          onClick={() => setShowQuestionAgent(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ overflowY: 'scroll', maxHeight: '100%' }}>
        {questionMessages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Ask me about your Monad Web3 project!</p>
            <p className="text-sm mt-2">I can help you plan DeFi features, NFTs, smart contracts, and more.</p>
          </div>
        )}

        {questionMessages.map((message) => (
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
            placeholder="Ask a question..."
            className="flex-1 bg-dark-bg border border-gray-800 rounded-lg px-4 py-2 text-sm resize-none focus:outline-none focus:border-primary"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
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

