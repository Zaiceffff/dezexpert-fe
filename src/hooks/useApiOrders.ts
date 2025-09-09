import { useState, useEffect, useCallback } from 'react';
import { ordersService } from '../lib/services';
import { Order, CreateOrderRequest, OrderStats, PaginationParams } from '../lib/api-types';

interface UseOrdersReturn {
  orders: Order[];
  stats: OrderStats | null;
  isLoading: boolean;
  error: string | null;
  loadOrders: (params?: PaginationParams) => Promise<void>;
  createOrder: (orderData: CreateOrderRequest) => Promise<Order | null>;
  getOrderById: (id: string) => Promise<Order | null>;
  getOrdersByStatus: (status: Order['status']) => Promise<Order[]>;
  getOrdersByDateRange: (startDate: string, endDate: string) => Promise<Order[]>;
  searchOrdersByPhone: (phone: string) => Promise<Order[]>;
  searchOrdersByName: (name: string) => Promise<Order[]>;
  getRecentOrders: (limit?: number) => Promise<Order[]>;
  getTodaysOrders: () => Promise<Order[]>;
  getWeeklyOrders: () => Promise<Order[]>;
  getMonthlyOrders: () => Promise<Order[]>;
  getExtendedStats: () => Promise<any>;
  clearError: () => void;
}

export function useApiOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async (params: PaginationParams = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ordersService.getOrders(params);
      setOrders(response.data);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки заявок');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const orderStats = await ordersService.getOrdersStats();
      setStats(orderStats);
    } catch (err: any) {
      console.error('Failed to load orders stats:', err);
    }
  }, []);

  const createOrder = useCallback(async (orderData: CreateOrderRequest): Promise<Order | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const order = await ordersService.createOrder(orderData);
      setOrders(prev => [order, ...prev]);
      
      // Update stats
      if (stats) {
        setStats(prev => prev ? {
          ...prev,
          total: prev.total + 1,
          new: prev.new + 1
        } : null);
      }
      
      return order;
    } catch (err: any) {
      setError(err.message || 'Ошибка создания заявки');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [stats]);

  const getOrderById = useCallback(async (id: string): Promise<Order | null> => {
    try {
      return await ordersService.getOrderById(id);
    } catch (err: any) {
      setError(err.message || 'Ошибка получения заявки');
      return null;
    }
  }, []);

  const getOrdersByStatus = useCallback(async (status: Order['status']): Promise<Order[]> => {
    try {
      return await ordersService.getOrdersByStatus(status);
    } catch (err: any) {
      setError(err.message || 'Ошибка получения заявок по статусу');
      return [];
    }
  }, []);

  const getOrdersByDateRange = useCallback(async (startDate: string, endDate: string): Promise<Order[]> => {
    try {
      return await ordersService.getOrdersByDateRange(startDate, endDate);
    } catch (err: any) {
      setError(err.message || 'Ошибка получения заявок по дате');
      return [];
    }
  }, []);

  const searchOrdersByPhone = useCallback(async (phone: string): Promise<Order[]> => {
    try {
      return await ordersService.searchOrdersByPhone(phone);
    } catch (err: any) {
      setError(err.message || 'Ошибка поиска заявок по телефону');
      return [];
    }
  }, []);

  const searchOrdersByName = useCallback(async (name: string): Promise<Order[]> => {
    try {
      return await ordersService.searchOrdersByName(name);
    } catch (err: any) {
      setError(err.message || 'Ошибка поиска заявок по имени');
      return [];
    }
  }, []);

  const getRecentOrders = useCallback(async (limit: number = 10): Promise<Order[]> => {
    try {
      return await ordersService.getRecentOrders(limit);
    } catch (err: any) {
      setError(err.message || 'Ошибка получения последних заявок');
      return [];
    }
  }, []);

  const getTodaysOrders = useCallback(async (): Promise<Order[]> => {
    try {
      return await ordersService.getTodaysOrders();
    } catch (err: any) {
      setError(err.message || 'Ошибка получения заявок за сегодня');
      return [];
    }
  }, []);

  const getWeeklyOrders = useCallback(async (): Promise<Order[]> => {
    try {
      return await ordersService.getWeeklyOrders();
    } catch (err: any) {
      setError(err.message || 'Ошибка получения заявок за неделю');
      return [];
    }
  }, []);

  const getMonthlyOrders = useCallback(async (): Promise<Order[]> => {
    try {
      return await ordersService.getMonthlyOrders();
    } catch (err: any) {
      setError(err.message || 'Ошибка получения заявок за месяц');
      return [];
    }
  }, []);

  const getExtendedStats = useCallback(async () => {
    try {
      return await ordersService.getExtendedStats();
    } catch (err: any) {
      setError(err.message || 'Ошибка получения расширенной статистики');
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load initial data
  useEffect(() => {
    loadOrders();
    loadStats();
  }, [loadOrders, loadStats]);

  return {
    orders,
    stats,
    isLoading,
    error,
    loadOrders,
    createOrder,
    getOrderById,
    getOrdersByStatus,
    getOrdersByDateRange,
    searchOrdersByPhone,
    searchOrdersByName,
    getRecentOrders,
    getTodaysOrders,
    getWeeklyOrders,
    getMonthlyOrders,
    getExtendedStats,
    clearError,
  };
}
