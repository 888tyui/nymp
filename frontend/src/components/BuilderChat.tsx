'use client';

import { useStore } from '@/store/useStore';
import { chatApi } from '@/lib/api';
import { useEffect, useRef, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function BuilderChat() {
  const { currentWorkspace, builderMessages, setBuilderMessages, addBuilderMessage } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (!input.trim() || !currentWorkspace || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to UI immediately
    const tempUserMessage = {
      id: Date.now().toString(),
      workspace_id: currentWorkspace.id,
      agent_type: 'builder' as const,
      role: 'user' as const,
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    addBuilderMessage(tempUserMessage);

    try {
      const response = await chatApi.sendMessage(currentWorkspace.id, 'builder', userMessage);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        workspace_id: currentWorkspace.id,
        agent_type: 'builder' as const,
        role: 'assistant' as const,
        content: response.data.message,
        created_at: new Date().toISOString(),
      };
      addBuilderMessage(assistantMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {builderMessages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Start building by asking the AI agent!</p>
            <p className="text-sm mt-2">Try: &ldquo;Create a landing page with a hero section&rdquo;</p>
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
            placeholder="Ask the builder agent..."
            className="flex-1 bg-dark-bg border border-gray-800 rounded-lg px-4 py-2 text-sm resize-none focus:outline-none focus:border-primary"
            rows={2}
            disabled={!currentWorkspace || isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !currentWorkspace || isLoading}
            className="px-4 bg-primary hover:bg-purple-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

