import { create } from 'zustand';

import type { Order, CreateOrderRequest } from '@/lib/api';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

import { dashboardEvents, DASHBOARD_EVENTS } from '@/lib/events';

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  totalOrders: number;
  currentPage: number;
  itemsPerPage: number;
  
  // Actions
  fetchOrders: (params?: {
    page?: number;
    pageSize?: number;
    linkId?: string;
    search?: string;
    status?: string;
  }) => Promise<void>;
  
  createOrder: (data: CreateOrderRequest) => Promise<void>;
  
  updateOrder: (id: string, data: {
    service?: string;
    object?: string;
    count?: string;
    experience?: string;
    address?: string;
    name?: string;
    status?: 'New' | 'Inprogress' | 'Done' | 'Denied';
    clientComment?: string;
    dezinsectorComment?: string;
    realPrice?: number;
  }) => Promise<void>;
  
  getOrderById: (id: string) => Order | undefined;
  
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetPagination: () => void;
}

export const useOrders = create<OrdersState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,
  totalOrders: 0,
  currentPage: 1,
  itemsPerPage: 10,

  fetchOrders: async (params = { /* TODO: implement */ }) => {
    try {
      set({ isLoading: true, error: null });
      
      const { page = 1, pageSize = 10, linkId, search, status } = params;
      
      // Вычисляем skipPages для API (API использует skipPages, а не page)
      const skipPages = (page - 1);
      
      // Загружаем заказы с сервера с поддержкой фильтрации
      const result = await apiClient.getOrders({ 
        skipPages, 
        pageSize,
        linkId,
        search,
        status
      });
      
      console.log('Хук useOrders получил результат:', {
        requestedPage: page,
        requestedPageSize: pageSize,
        receivedOrders: result.data?.length || 0,
        totalCount: result.count,
        skipPages,
        linkId,
        search,
        status
      });
      
      // Обновляем состояние
      set({ 
        orders: result.data,
        totalOrders: result.count,
        currentPage: page,
        itemsPerPage: pageSize,
        isLoading: false 
      });
      
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
      
      let errorMessage = 'Не удалось загрузить заказы';
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      toast.error(errorMessage);
    }
  },

  createOrder: async (data: CreateOrderRequest) => {
    try {
      set({ isLoading: true, error: null });
      const newOrder = await apiClient.createOrder(data);
      
      // Обновляем список заказов
      set(state => ({
        orders: [newOrder, ...state.orders],
        totalOrders: state.totalOrders + 1,
        isLoading: false
      }));
      
      // Уведомляем дашборд о создании новой заявки
      dashboardEvents.emit(DASHBOARD_EVENTS.ORDER_CREATED, newOrder);
      
      toast.success('Заказ создан успешно!');
    } catch (error) {
      console.error('Ошибка создания заказа в хуке:', error);
      
      let errorMessage = 'Не удалось создать заказ';
      if (error && typeof error === 'object' && 'message' in error) {
        const message = String(error.message);
        if (message.includes('dezinsector')) {
          errorMessage = 'Ошибка сервиса - попробуйте позже';
        } else if (message.includes('соединения')) {
          errorMessage = 'Нет соединения с сервером';
        } else if (message.includes('обязательные поля')) {
          errorMessage = 'Заполните все обязательные поля';
        } else {
          errorMessage = message;
        }
      }
      
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  updateOrder: async (id: string, data: {
    service?: string;
    object?: string;
    count?: string;
    experience?: string;
    address?: string;
    name?: string;
    status?: 'New' | 'Inprogress' | 'Done' | 'Denied';
    clientComment?: string;
    dezinsectorComment?: string;
    realPrice?: number;
  }) => {
    try {
      set({ isLoading: true, error: null });
      const updatedOrder = await apiClient.updateOrder(id, data);
      
      set(state => ({
        orders: state.orders.map(order => 
          order.id === id ? updatedOrder : order
        ),
        isLoading: false
      }));
      
      // Уведомляем дашборд об обновлении заявки
      dashboardEvents.emit(DASHBOARD_EVENTS.ORDER_UPDATED, updatedOrder);
      
      toast.success('Заказ обновлен успешно!');
    } catch (error) {
      set({ 
        error: 'Ошибка обновления заказа', 
        isLoading: false 
      });
      toast.error('Не удалось обновить заказ');
      throw error;
    }
  },

  getOrderById: (id) => {
    return get().orders.find(order => order.id === id);
  },

  setPage: (page: number) => {
    set({ currentPage: page });
  },

  setPageSize: (pageSize: number) => {
    set({ 
      itemsPerPage: pageSize, 
      currentPage: 1 // Сбрасываем на первую страницу
    });
  },

  resetPagination: () => {
    set({ 
      currentPage: 1, 
      itemsPerPage: 10 
    });
  },
}));

// Хук для использования в компонентах
export const useOrdersState = () => {
  // Убираем useEffect, который вызывал бесконечный цикл
  // fetchOrders будет вызываться только когда это действительно нужно
  return useOrders();
};
