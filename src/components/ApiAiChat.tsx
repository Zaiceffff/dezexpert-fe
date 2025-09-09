'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApiAi } from '../hooks/useApiAi';
import { AiMessage } from '../lib/api-types';

export function ApiAiChat() {
  const {
    history,
    isLoading,
    error,
    sendMessage,
    sendMessageWithContext,
    getAvailableModels,
    validateMessage,
    clearError
  } = useApiAi();

  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [context, setContext] = useState('');
  const [useContext, setUseContext] = useState(false);
  const [chatHistory, setChatHistory] = useState<AiMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const availableModels = getAvailableModels();

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    const validation = validateMessage(message);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    // Add user message to chat
    const userMessage: AiMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      let response: string | null;
      
      if (useContext && context.trim()) {
        response = await sendMessageWithContext(message, context, selectedModel);
      } else {
        response = await sendMessage(message, selectedModel);
      }

      if (response) {
        // Add assistant response to chat
        const assistantMessage: AiMessage = { role: 'assistant', content: response };
        setChatHistory(prev => [...prev, assistantMessage]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }

    setMessage('');
  };

  const handleClearChat = () => {
    setChatHistory([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">ИИ Чат</h2>
          <div className="flex items-center space-x-4">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {availableModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            <button
              onClick={handleClearChat}
              className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
            >
              Очистить чат
            </button>
          </div>
        </div>
        
        {/* Context toggle */}
        <div className="mt-2 flex items-center space-x-2">
          <input
            type="checkbox"
            id="useContext"
            checked={useContext}
            onChange={(e) => setUseContext(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="useContext" className="text-sm text-gray-700">
            Использовать контекст
          </label>
        </div>
        
        {useContext && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Контекст
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Введите контекст для ИИ..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              rows={2}
            />
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Начните диалог с ИИ</p>
            <p className="text-sm mt-1">Введите сообщение ниже</p>
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-6 py-2 bg-red-50 border-t border-red-200">
          <div className="flex items-center justify-between">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите сообщение..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
}
