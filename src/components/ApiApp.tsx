'use client';

import React, { useState } from 'react';
import { ApiProvider } from '../contexts/ApiContext';
import { ApiLoginForm } from './ApiLoginForm';
import { ApiDashboard } from './ApiDashboard';
import { ApiAvitoManager } from './ApiAvitoManager';
import { ApiOrdersManager } from './ApiOrdersManager';
import { ApiAiChat } from './ApiAiChat';
import { useApiAuth } from '../hooks/useApiAuth';

function AppContent() {
  const { isAuthenticated, logout } = useApiAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'avito' | 'orders' | 'ai'>('dashboard');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <ApiLoginForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">AvitoBot Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={logout}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Дашборд
            </button>
            <button
              onClick={() => setActiveTab('avito')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'avito'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Avito
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Заявки
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ai'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ИИ Чат
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'dashboard' && <ApiDashboard />}
          {activeTab === 'avito' && <ApiAvitoManager />}
          {activeTab === 'orders' && <ApiOrdersManager />}
          {activeTab === 'ai' && <ApiAiChat />}
        </div>
      </main>
    </div>
  );
}

export function ApiApp() {
  return (
    <ApiProvider>
      <AppContent />
    </ApiProvider>
  );
}
