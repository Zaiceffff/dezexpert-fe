'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAvito } from '@/hooks/useAvito';

interface AvitoContextType {
  // Все свойства и методы из useAvito
  listings: any[];
  activeListings: any[];
  connectionStatus: any;
  stats: any;
  isLoading: boolean;
  isConnecting: boolean;
  isSyncing: boolean;
  error: string | null;
  getOAuthUrl: () => Promise<any>;
  connectAccount: (code: string, state?: string) => Promise<boolean>;
  syncListings: (force?: boolean) => Promise<boolean>;
  toggleAiAssistant: (listingId: string, enabled: boolean) => Promise<boolean>;
  getActiveListings: () => Promise<boolean>;
  refreshConnectionStatus: () => Promise<void>;
  refreshStats: () => Promise<void>;
  clearError: () => void;
}

const AvitoContext = createContext<AvitoContextType | undefined>(undefined);

interface AvitoProviderProps {
  children: ReactNode;
}

export function AvitoProvider({ children }: AvitoProviderProps) {
  const avitoData = useAvito();

  return (
    <AvitoContext.Provider value={avitoData}>
      {children}
    </AvitoContext.Provider>
  );
}

export function useAvitoContext(): AvitoContextType {
  const context = useContext(AvitoContext);
  if (context === undefined) {
    throw new Error('useAvitoContext must be used within an AvitoProvider');
  }
  return context;
}
