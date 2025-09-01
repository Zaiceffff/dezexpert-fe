// Простой event emitter для обновления дашборда в реальном времени
class EventEmitter {
  private listeners: { [key: string]: ((...args: unknown[]) => unknown)[] } = {};

  on(event: string, callback: (...args: unknown[]) => unknown) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: (...args: unknown[]) => unknown) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event: string, data?: unknown) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Ошибка в обработчике события:', error);
      }
    });
  }
}

// Создаем глобальный экземпляр
export const dashboardEvents = new EventEmitter();

// События для обновления дашборда
export const DASHBOARD_EVENTS = {
  ORDER_CREATED: 'order_created',
  ORDER_UPDATED: 'order_updated',
  ORDER_DELETED: 'order_deleted',
  REFRESH_ORDERS: 'refresh_orders'
} as const;
