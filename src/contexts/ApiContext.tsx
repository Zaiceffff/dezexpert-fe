'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authService, avitoService, ordersService, aiService, statsService } from '../lib/services';
import { User, Order, AvitoListing, AiHistoryItem, GeneralStats, AiStats, LeadsStats, AvitoStats } from '../lib/api-types';

// State interfaces
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AvitoState {
  listings: AvitoListing[];
  aiActiveListings: AvitoListing[];
  tokensStatus: any;
  isLoading: boolean;
  error: string | null;
}

interface OrdersState {
  orders: Order[];
  stats: any;
  isLoading: boolean;
  error: string | null;
}

interface AiState {
  history: AiHistoryItem[];
  isLoading: boolean;
  error: string | null;
}

interface StatsState {
  general: GeneralStats | null;
  ai: AiStats | null;
  leads: LeadsStats | null;
  avito: AvitoStats | null;
  isLoading: boolean;
  error: string | null;
}

interface ApiState {
  auth: AuthState;
  avito: AvitoState;
  orders: OrdersState;
  ai: AiState;
  stats: StatsState;
}

// Action types
type ApiAction =
  | { type: 'AUTH_LOGIN_START' }
  | { type: 'AUTH_LOGIN_SUCCESS'; payload: User }
  | { type: 'AUTH_LOGIN_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_LOAD_USER'; payload: User }
  | { type: 'AVITO_LOAD_LISTINGS_START' }
  | { type: 'AVITO_LOAD_LISTINGS_SUCCESS'; payload: AvitoListing[] }
  | { type: 'AVITO_LOAD_LISTINGS_ERROR'; payload: string }
  | { type: 'AVITO_LOAD_AI_ACTIVE_SUCCESS'; payload: AvitoListing[] }
  | { type: 'AVITO_TOGGLE_AI_SUCCESS'; payload: { id: string; enabled: boolean } }
  | { type: 'ORDERS_LOAD_START' }
  | { type: 'ORDERS_LOAD_SUCCESS'; payload: Order[] }
  | { type: 'ORDERS_LOAD_ERROR'; payload: string }
  | { type: 'ORDERS_CREATE_SUCCESS'; payload: Order }
  | { type: 'AI_LOAD_HISTORY_START' }
  | { type: 'AI_LOAD_HISTORY_SUCCESS'; payload: AiHistoryItem[] }
  | { type: 'AI_LOAD_HISTORY_ERROR'; payload: string }
  | { type: 'AI_SEND_MESSAGE_SUCCESS'; payload: AiHistoryItem }
  | { type: 'STATS_LOAD_START' }
  | { type: 'STATS_LOAD_SUCCESS'; payload: { general: GeneralStats; ai: AiStats; leads: LeadsStats; avito: AvitoStats } }
  | { type: 'STATS_LOAD_ERROR'; payload: string };

// Initial state
const initialState: ApiState = {
  auth: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  avito: {
    listings: [],
    aiActiveListings: [],
    tokensStatus: null,
    isLoading: false,
    error: null,
  },
  orders: {
    orders: [],
    stats: null,
    isLoading: false,
    error: null,
  },
  ai: {
    history: [],
    isLoading: false,
    error: null,
  },
  stats: {
    general: null,
    ai: null,
    leads: null,
    avito: null,
    isLoading: false,
    error: null,
  },
};

// Reducer
function apiReducer(state: ApiState, action: ApiAction): ApiState {
  switch (action.type) {
    case 'AUTH_LOGIN_START':
      return {
        ...state,
        auth: { ...state.auth, isLoading: true, error: null }
      };
    case 'AUTH_LOGIN_SUCCESS':
      return {
        ...state,
        auth: { 
          user: action.payload, 
          isAuthenticated: true, 
          isLoading: false, 
          error: null 
        }
      };
    case 'AUTH_LOGIN_ERROR':
      return {
        ...state,
        auth: { 
          ...state.auth, 
          isLoading: false, 
          error: action.payload 
        }
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        auth: { user: null, isAuthenticated: false, isLoading: false, error: null }
      };
    case 'AUTH_LOAD_USER':
      return {
        ...state,
        auth: { 
          user: action.payload, 
          isAuthenticated: true, 
          isLoading: false, 
          error: null 
        }
      };
    case 'AVITO_LOAD_LISTINGS_START':
      return {
        ...state,
        avito: { ...state.avito, isLoading: true, error: null }
      };
    case 'AVITO_LOAD_LISTINGS_SUCCESS':
      return {
        ...state,
        avito: { 
          ...state.avito, 
          listings: action.payload, 
          isLoading: false, 
          error: null 
        }
      };
    case 'AVITO_LOAD_LISTINGS_ERROR':
      return {
        ...state,
        avito: { 
          ...state.avito, 
          isLoading: false, 
          error: action.payload 
        }
      };
    case 'AVITO_LOAD_AI_ACTIVE_SUCCESS':
      return {
        ...state,
        avito: { 
          ...state.avito, 
          aiActiveListings: action.payload 
        }
      };
    case 'AVITO_TOGGLE_AI_SUCCESS':
      return {
        ...state,
        avito: {
          ...state.avito,
          listings: state.avito.listings.map(listing =>
            listing.id === action.payload.id
              ? { ...listing, aiAssistantIsOn: action.payload.enabled }
              : listing
          ),
          aiActiveListings: action.payload.enabled
            ? [...state.avito.aiActiveListings, state.avito.listings.find(l => l.id === action.payload.id)!]
            : state.avito.aiActiveListings.filter(l => l.id !== action.payload.id)
        }
      };
    case 'ORDERS_LOAD_START':
      return {
        ...state,
        orders: { ...state.orders, isLoading: true, error: null }
      };
    case 'ORDERS_LOAD_SUCCESS':
      return {
        ...state,
        orders: { 
          ...state.orders, 
          orders: action.payload, 
          isLoading: false, 
          error: null 
        }
      };
    case 'ORDERS_LOAD_ERROR':
      return {
        ...state,
        orders: { 
          ...state.orders, 
          isLoading: false, 
          error: action.payload 
        }
      };
    case 'ORDERS_CREATE_SUCCESS':
      return {
        ...state,
        orders: { 
          ...state.orders, 
          orders: [action.payload, ...state.orders.orders] 
        }
      };
    case 'AI_LOAD_HISTORY_START':
      return {
        ...state,
        ai: { ...state.ai, isLoading: true, error: null }
      };
    case 'AI_LOAD_HISTORY_SUCCESS':
      return {
        ...state,
        ai: { 
          ...state.ai, 
          history: action.payload, 
          isLoading: false, 
          error: null 
        }
      };
    case 'AI_LOAD_HISTORY_ERROR':
      return {
        ...state,
        ai: { 
          ...state.ai, 
          isLoading: false, 
          error: action.payload 
        }
      };
    case 'AI_SEND_MESSAGE_SUCCESS':
      return {
        ...state,
        ai: { 
          ...state.ai, 
          history: [action.payload, ...state.ai.history] 
        }
      };
    case 'STATS_LOAD_START':
      return {
        ...state,
        stats: { ...state.stats, isLoading: true, error: null }
      };
    case 'STATS_LOAD_SUCCESS':
      return {
        ...state,
        stats: { 
          ...state.stats, 
          ...action.payload, 
          isLoading: false, 
          error: null 
        }
      };
    case 'STATS_LOAD_ERROR':
      return {
        ...state,
        stats: { 
          ...state.stats, 
          isLoading: false, 
          error: action.payload 
        }
      };
    default:
      return state;
  }
}

// Context
const ApiContext = createContext<{
  state: ApiState;
  dispatch: React.Dispatch<ApiAction>;
} | null>(null);

// Provider component
export function ApiProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(apiReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const user = authService.getCurrentUser();
      if (user && authService.isAuthenticated()) {
        dispatch({ type: 'AUTH_LOAD_USER', payload: user });
      }
    };

    initAuth();
  }, []);

  return (
    <ApiContext.Provider value={{ state, dispatch }}>
      {children}
    </ApiContext.Provider>
  );
}

// Hook to use API context
export function useApiContext() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
}

// Individual hooks for each service
export function useAuth() {
  const { state, dispatch } = useApiContext();
  
  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_LOGIN_START' });
    try {
      const response = await authService.login({ email, password });
      dispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: response.user });
      return response;
    } catch (error: any) {
      dispatch({ type: 'AUTH_LOGIN_ERROR', payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  return {
    ...state.auth,
    login,
    logout,
  };
}

export function useAvito() {
  const { state, dispatch } = useApiContext();
  
  const loadListings = async () => {
    dispatch({ type: 'AVITO_LOAD_LISTINGS_START' });
    try {
      const response = await avitoService.getListings();
      dispatch({ type: 'AVITO_LOAD_LISTINGS_SUCCESS', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'AVITO_LOAD_LISTINGS_ERROR', payload: error.message });
    }
  };

  const loadAiActiveListings = async () => {
    try {
      const listings = await avitoService.getAiActiveListings();
      dispatch({ type: 'AVITO_LOAD_AI_ACTIVE_SUCCESS', payload: listings });
    } catch (error) {
      // Handle error silently
    }
  };

  const toggleAiAssistant = async (id: string, enabled: boolean) => {
    try {
      await avitoService.toggleAiAssistant(id, enabled);
      dispatch({ type: 'AVITO_TOGGLE_AI_SUCCESS', payload: { id, enabled } });
    } catch (error) {
      // Handle error
    }
  };

  return {
    ...state.avito,
    loadListings,
    loadAiActiveListings,
    toggleAiAssistant,
  };
}

export function useOrders() {
  const { state, dispatch } = useApiContext();
  
  const loadOrders = async () => {
    dispatch({ type: 'ORDERS_LOAD_START' });
    try {
      const response = await ordersService.getOrders();
      dispatch({ type: 'ORDERS_LOAD_SUCCESS', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'ORDERS_LOAD_ERROR', payload: error.message });
    }
  };

  const createOrder = async (orderData: any) => {
    try {
      const order = await ordersService.createOrder(orderData);
      dispatch({ type: 'ORDERS_CREATE_SUCCESS', payload: order });
      return order;
    } catch (error) {
      throw error;
    }
  };

  return {
    ...state.orders,
    loadOrders,
    createOrder,
  };
}

export function useAi() {
  const { state, dispatch } = useApiContext();
  
  const loadHistory = async () => {
    dispatch({ type: 'AI_LOAD_HISTORY_START' });
    try {
      const history = await aiService.getHistory();
      dispatch({ type: 'AI_LOAD_HISTORY_SUCCESS', payload: history });
    } catch (error: any) {
      dispatch({ type: 'AI_LOAD_HISTORY_ERROR', payload: error.message });
    }
  };

  const sendMessage = async (message: string, model?: string) => {
    try {
      const response = await aiService.sendSimpleMessage(message, model);
      // Create a mock history item for the response
      const historyItem: AiHistoryItem = {
        id: Date.now().toString(),
        messages: [{ role: 'user', content: message }],
        response,
        model: model || 'gpt-3.5-turbo',
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'AI_SEND_MESSAGE_SUCCESS', payload: historyItem });
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    ...state.ai,
    loadHistory,
    sendMessage,
  };
}

export function useStats() {
  const { state, dispatch } = useApiContext();
  
  const loadStats = async () => {
    dispatch({ type: 'STATS_LOAD_START' });
    try {
      const stats = await statsService.getAllStats();
      dispatch({ type: 'STATS_LOAD_SUCCESS', payload: stats });
    } catch (error: any) {
      dispatch({ type: 'STATS_LOAD_ERROR', payload: error.message });
    }
  };

  return {
    ...state.stats,
    loadStats,
  };
}
