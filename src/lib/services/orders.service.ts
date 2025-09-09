import { apiClient } from '../api-client';
import { API_ENDPOINTS } from '../api-config';
import { 
  Order, 
  CreateOrderRequest, 
  OrderStats,
  PaginationParams,
  PaginatedResponse 
} from '../api-types';

export class OrdersService {
  /**
   * Создание новой заявки
   */
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    return apiClient.post<Order>(API_ENDPOINTS.ORDERS.CREATE, orderData);
  }

  /**
   * Получение заявок пользователя с пагинацией
   */
  async getOrders(params: PaginationParams = {}): Promise<PaginatedResponse<Order>> {
    const { page = 1, limit = 10 } = params;
    return apiClient.get<PaginatedResponse<Order>>(
      API_ENDPOINTS.ORDERS.LIST,
      { params: { page, limit } }
    );
  }

  /**
   * Получение всех заявок пользователя
   */
  async getAllOrders(): Promise<Order[]> {
    const response = await this.getOrders({ page: 1, limit: 1000 });
    return response.data;
  }

  /**
   * Получение заявок по Link ID
   */
  async getOrdersByLink(linkId: string): Promise<Order[]> {
    return apiClient.get<Order[]>(API_ENDPOINTS.ORDERS.BY_LINK(linkId));
  }

  /**
   * Получение конкретной заявки по ID
   */
  async getOrderById(id: string): Promise<Order | null> {
    try {
      return await apiClient.get<Order>(API_ENDPOINTS.ORDERS.BY_ID(id));
    } catch {
      return null;
    }
  }

  /**
   * Получение статистики заявок
   */
  async getOrdersStats(): Promise<OrderStats> {
    return apiClient.get<OrderStats>(API_ENDPOINTS.ORDERS.STATS);
  }

  /**
   * Получение заявок по статусу
   */
  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    try {
      const orders = await this.getAllOrders();
      return orders.filter(order => order.status === status);
    } catch {
      return [];
    }
  }

  /**
   * Получение заявок по дате создания
   */
  async getOrdersByDateRange(startDate: string, endDate: string): Promise<Order[]> {
    try {
      const orders = await this.getAllOrders();
      return orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return orderDate >= start && orderDate <= end;
      });
    } catch {
      return [];
    }
  }

  /**
   * Поиск заявок по телефону
   */
  async searchOrdersByPhone(phoneNumber: string): Promise<Order[]> {
    try {
      const orders = await this.getAllOrders();
      return orders.filter(order => 
        order.phoneNumber.includes(phoneNumber)
      );
    } catch {
      return [];
    }
  }

  /**
   * Поиск заявок по имени
   */
  async searchOrdersByName(name: string): Promise<Order[]> {
    try {
      const orders = await this.getAllOrders();
      return orders.filter(order => 
        order.name.toLowerCase().includes(name.toLowerCase())
      );
    } catch {
      return [];
    }
  }

  /**
   * Получение заявок по услуге
   */
  async getOrdersByService(service: string): Promise<Order[]> {
    try {
      const orders = await this.getAllOrders();
      return orders.filter(order => 
        order.service.toLowerCase().includes(service.toLowerCase())
      );
    } catch {
      return [];
    }
  }

  /**
   * Получение заявок по объекту
   */
  async getOrdersByObject(object: string): Promise<Order[]> {
    try {
      const orders = await this.getAllOrders();
      return orders.filter(order => 
        order.object.toLowerCase().includes(object.toLowerCase())
      );
    } catch {
      return [];
    }
  }

  /**
   * Получение заявок по опыту
   */
  async getOrdersByExperience(experience: string): Promise<Order[]> {
    try {
      const orders = await this.getAllOrders();
      return orders.filter(order => 
        order.experience.toLowerCase().includes(experience.toLowerCase())
      );
    } catch {
      return [];
    }
  }

  /**
   * Получение заявок по адресу
   */
  async getOrdersByAddress(address: string): Promise<Order[]> {
    try {
      const orders = await this.getAllOrders();
      return orders.filter(order => 
        order.address.toLowerCase().includes(address.toLowerCase())
      );
    } catch {
      return [];
    }
  }

  /**
   * Получение заявок по ожидаемой дате
   */
  async getOrdersByExpectedDate(date: string): Promise<Order[]> {
    try {
      const orders = await this.getAllOrders();
      return orders.filter(order => order.expectDate === date);
    } catch {
      return [];
    }
  }

  /**
   * Получение последних заявок
   */
  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    try {
      const orders = await this.getAllOrders();
      return orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    } catch {
      return [];
    }
  }

  /**
   * Получение заявок за сегодня
   */
  async getTodaysOrders(): Promise<Order[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getOrdersByDateRange(today, today);
  }

  /**
   * Получение заявок за неделю
   */
  async getWeeklyOrders(): Promise<Order[]> {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return this.getOrdersByDateRange(
      weekAgo.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );
  }

  /**
   * Получение заявок за месяц
   */
  async getMonthlyOrders(): Promise<Order[]> {
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    return this.getOrdersByDateRange(
      monthAgo.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );
  }

  /**
   * Получение расширенной статистики
   */
  async getExtendedStats(): Promise<{
    basic: OrderStats;
    byService: Record<string, number>;
    byObject: Record<string, number>;
    byExperience: Record<string, number>;
    byDate: Record<string, number>;
    recentActivity: number;
  }> {
    try {
      const [basicStats, orders] = await Promise.all([
        this.getOrdersStats(),
        this.getAllOrders()
      ]);

      const extendedStats = {
        basic: basicStats,
        byService: {} as Record<string, number>,
        byObject: {} as Record<string, number>,
        byExperience: {} as Record<string, number>,
        byDate: {} as Record<string, number>,
        recentActivity: 0,
      };

      // Подсчет статистики
      orders.forEach(order => {
        // По услугам
        extendedStats.byService[order.service] = 
          (extendedStats.byService[order.service] || 0) + 1;
        
        // По объектам
        extendedStats.byObject[order.object] = 
          (extendedStats.byObject[order.object] || 0) + 1;
        
        // По опыту
        extendedStats.byExperience[order.experience] = 
          (extendedStats.byExperience[order.experience] || 0) + 1;
        
        // По датам
        const date = order.createdAt.split('T')[0];
        extendedStats.byDate[date] = (extendedStats.byDate[date] || 0) + 1;
      });

      // Активность за последние 7 дней
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      extendedStats.recentActivity = orders.filter(order => 
        new Date(order.createdAt) >= weekAgo
      ).length;

      return extendedStats;
    } catch {
      return {
        basic: { total: 0, new: 0, inProgress: 0, completed: 0, cancelled: 0 },
        byService: {},
        byObject: {},
        byExperience: {},
        byDate: {},
        recentActivity: 0,
      };
    }
  }
}

// Export singleton instance
export const ordersService = new OrdersService();
export default ordersService;
