'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import { 
  Webhook, 
  Plus, 
  Trash2, 
  Edit, 
  Copy, 
  ExternalLink,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  lastTriggered?: string;
  lastStatus?: 'success' | 'error' | 'pending';
}

interface WebhookManagerProps {
  className?: string;
}

export const WebhookManager: React.FC<WebhookManagerProps> = ({ className = '' }) => {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: '1',
      name: 'Avito Lead Webhook',
      url: 'https://api.example.com/webhooks/avito',
      events: ['lead.created', 'lead.updated'],
      isActive: true,
      lastTriggered: '2024-12-15T10:30:00Z',
      lastStatus: 'success'
    },
    {
      id: '2',
      name: 'Payment Notification',
      url: 'https://api.example.com/webhooks/payment',
      events: ['payment.success', 'payment.failed'],
      isActive: true,
      lastTriggered: '2024-12-14T15:45:00Z',
      lastStatus: 'success'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    events: [] as string[]
  });

  const availableEvents = [
    'lead.created',
    'lead.updated',
    'lead.deleted',
    'order.created',
    'order.updated',
    'order.completed',
    'payment.success',
    'payment.failed',
    'user.registered',
    'user.updated'
  ];

  const handleAddWebhook = () => {
    if (!formData.name || !formData.url || formData.events.length === 0) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const newWebhook: WebhookConfig = {
      id: Date.now().toString(),
      name: formData.name,
      url: formData.url,
      events: formData.events,
      isActive: true,
      lastTriggered: undefined,
      lastStatus: undefined
    };

    setWebhooks([...webhooks, newWebhook]);
    setFormData({ name: '', url: '', events: [] });
    setShowAddForm(false);
    toast.success('Вебхук успешно добавлен');
  };

  const handleEditWebhook = (webhook: WebhookConfig) => {
    setEditingWebhook(webhook);
    setFormData({
      name: webhook.name,
      url: webhook.url,
      events: webhook.events
    });
    setShowAddForm(true);
  };

  const handleUpdateWebhook = () => {
    if (!editingWebhook) return;

    const updatedWebhooks = webhooks.map(wh => 
      wh.id === editingWebhook.id 
        ? { ...wh, ...formData }
        : wh
    );

    setWebhooks(updatedWebhooks);
    setFormData({ name: '', url: '', events: [] });
    setEditingWebhook(null);
    setShowAddForm(false);
    toast.success('Вебхук успешно обновлен');
  };

  const handleDeleteWebhook = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот вебхук?')) {
      setWebhooks(webhooks.filter(wh => wh.id !== id));
      toast.success('Вебхук успешно удален');
    }
  };

  const handleToggleWebhook = (id: string) => {
    const updatedWebhooks = webhooks.map(wh => 
      wh.id === id ? { ...wh, isActive: !wh.isActive } : wh
    );
    setWebhooks(updatedWebhooks);
    toast.success('Статус вебхука изменен');
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL скопирован в буфер обмена');
  };

  const handleTestWebhook = async (webhook: WebhookConfig) => {
    try {
      setIsLoading(true);
      // Здесь будет вызов API для тестирования вебхука
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация API вызова
      
      // Обновляем статус
      const updatedWebhooks = webhooks.map(wh => 
        wh.id === webhook.id 
          ? { 
              ...wh, 
              lastTriggered: new Date().toISOString(),
              lastStatus: 'success' as const
            }
          : wh
      );
      setWebhooks(updatedWebhooks);
      
      toast.success('Тестовый запрос отправлен успешно');
    } catch (error) {
      toast.error('Ошибка при отправке тестового запроса');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status?: 'success' | 'error' | 'pending') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status?: 'success' | 'error' | 'pending') => {
    switch (status) {
      case 'success':
        return 'Успешно';
      case 'error':
        return 'Ошибка';
      case 'pending':
        return 'В ожидании';
      default:
        return 'Не запускался';
    }
  };

  const getStatusColor = (status?: 'success' | 'error' | 'pending') => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Управление вебхуками</h2>
          <p className="text-gray-600 mt-1">Настройка уведомлений о событиях</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить вебхук
        </Button>
      </div>

      {/* Форма добавления/редактирования */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingWebhook ? 'Редактировать вебхук' : 'Новый вебхук'}
            </CardTitle>
            <CardDescription>
              Настройте параметры вебхука для получения уведомлений
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название вебхука
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Например: Avito Lead Webhook"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL вебхука
                </label>
                <Input
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://your-domain.com/webhook"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  События для отслеживания
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableEvents.map((event) => (
                    <label key={event} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.events.includes(event)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              events: [...formData.events, event]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              events: formData.events.filter(e => e !== event)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{event}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={editingWebhook ? handleUpdateWebhook : handleAddWebhook}
                  disabled={isLoading}
                >
                  {editingWebhook ? 'Обновить' : 'Добавить'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingWebhook(null);
                    setFormData({ name: '', url: '', events: [] });
                  }}
                >
                  Отмена
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Список вебхуков */}
      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Webhook className="h-6 w-6 text-blue-500" />
                  <div>
                    <CardTitle className="text-lg">{webhook.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {webhook.url}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={webhook.isActive ? "default" : "secondary"}
                    className={webhook.isActive ? "bg-green-100 text-green-800" : ""}
                  >
                    {webhook.isActive ? 'Активен' : 'Неактивен'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleWebhook(webhook.id)}
                  >
                    {webhook.isActive ? 'Отключить' : 'Включить'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* События */}
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Отслеживаемые события:</h4>
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="secondary" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Статус */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(webhook.lastStatus)}
                    <span className="text-sm text-gray-600">
                      Последний запуск: {webhook.lastTriggered 
                        ? new Date(webhook.lastTriggered).toLocaleString('ru-RU')
                        : 'Не запускался'
                      }
                    </span>
                    {webhook.lastStatus && (
                      <Badge className={getStatusColor(webhook.lastStatus)}>
                        {getStatusText(webhook.lastStatus)}
                      </Badge>
                    )}
                  </div>

                  {/* Действия */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestWebhook(webhook)}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Тест
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyUrl(webhook.url)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Копировать
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(webhook.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Открыть
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditWebhook(webhook)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Изменить
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteWebhook(webhook.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Удалить
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Пустое состояние */}
      {webhooks.length === 0 && !showAddForm && (
        <Card>
          <CardContent className="text-center py-12">
            <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Вебхуки не настроены</h3>
            <p className="text-gray-600 mb-4">
              Добавьте вебхуки для получения уведомлений о важных событиях
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить первый вебхук
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
