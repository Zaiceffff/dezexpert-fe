'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import type { Lead } from '@/lib/api';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,

  MessageSquare
} from 'lucide-react';

interface Reminder {
  id: string;
  leadId: string;
  leadName: string;
  scheduledAt: string;
  message: string;
  status: 'pending' | 'sent' | 'cancelled';
  type: 'sms' | 'email' | 'push';
}

interface ReminderManagerProps {
  className?: string;
}

export const ReminderManager: React.FC<ReminderManagerProps> = ({ className = '' }) => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      leadId: 'lead-1',
      leadName: 'Иван Иванов',
      scheduledAt: '2024-12-16T10:00:00Z',
      message: 'Напоминание о дезинсекции завтра в 10:00',
      status: 'pending',
      type: 'sms'
    },
    {
      id: '2',
      leadId: 'lead-2',
      leadName: 'Мария Петрова',
      scheduledAt: '2024-12-15T14:30:00Z',
      message: 'Подтверждение записи на обработку',
      status: 'sent',
      type: 'email'
    }
  ]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState({
    leadId: '',
    scheduledAt: '',
    message: '',
    type: 'sms' as 'sms' | 'email' | 'push'
  });

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const leadsData = await apiClient.getLeads({ limit: 100 });
      setLeads(leadsData.data);
    } catch (error) {
      toast.error('Ошибка загрузки лидов');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReminder = () => {
    if (!formData.leadId || !formData.scheduledAt || !formData.message) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const selectedLead = leads.find(lead => lead.id === formData.leadId);
    if (!selectedLead) {
      toast.error('Выбранный лид не найден');
      return;
    }

    const newReminder: Reminder = {
      id: Date.now().toString(),
      leadId: formData.leadId,
      leadName: selectedLead.name,
      scheduledAt: formData.scheduledAt,
      message: formData.message,
      status: 'pending',
      type: formData.type
    };

    setReminders([...reminders, newReminder]);
    setFormData({ leadId: '', scheduledAt: '', message: '', type: 'sms' });
    setShowAddForm(false);
    toast.success('Напоминание успешно добавлено');
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setFormData({
      leadId: reminder.leadId,
      scheduledAt: reminder.scheduledAt,
      message: reminder.message,
      type: reminder.type
    });
    setShowAddForm(true);
  };

  const handleUpdateReminder = () => {
    if (!editingReminder) return;

    const selectedLead = leads.find(lead => lead.id === formData.leadId);
    if (!selectedLead) {
      toast.error('Выбранный лид не найден');
      return;
    }

    const updatedReminders = reminders.map(rem => 
      rem.id === editingReminder.id 
        ? { 
            ...rem, 
            leadId: formData.leadId,
            leadName: selectedLead.name,
            scheduledAt: formData.scheduledAt,
            message: formData.message,
            type: formData.type
          }
        : rem
    );

    setReminders(updatedReminders);
    setFormData({ leadId: '', scheduledAt: '', message: '', type: 'sms' });
    setEditingReminder(null);
    setShowAddForm(false);
    toast.success('Напоминание успешно обновлено');
  };

  const handleDeleteReminder = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить это напоминание?')) {
      setReminders(reminders.filter(rem => rem.id !== id));
      toast.success('Напоминание успешно удалено');
    }
  };

  const handleCancelReminder = (id: string) => {
    const updatedReminders = reminders.map(rem => 
      rem.id === id ? { ...rem, status: 'cancelled' as const } : rem
    );
    setReminders(updatedReminders);
    toast.success('Напоминание отменено');
  };

  const getStatusIcon = (status: Reminder['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: Reminder['status']) => {
    switch (status) {
      case 'pending':
        return 'Ожидает';
      case 'sent':
        return 'Отправлено';
      case 'cancelled':
        return 'Отменено';
      default:
        return 'Неизвестно';
    }
  };

  const getStatusColor = (status: Reminder['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'sms':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'email':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'push':
        return <Bell className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeText = (type: Reminder['type']) => {
    switch (type) {
      case 'sms':
        return 'SMS';
      case 'email':
        return 'Email';
      case 'push':
        return 'Push';
      default:
        return 'Неизвестно';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (scheduledAt: string) => {
    return new Date(scheduledAt) < new Date();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Управление напоминаниями</h2>
          <p className="text-gray-600 mt-1">Планирование и управление уведомлениями для клиентов</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить напоминание
        </Button>
      </div>

      {/* Форма добавления/редактирования */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingReminder ? 'Редактировать напоминание' : 'Новое напоминание'}
            </CardTitle>
            <CardDescription>
              Настройте параметры напоминания для клиента
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Клиент
                </label>
                <select
                  value={formData.leadId}
                  onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Выберите клиента</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name} - {lead.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата и время
                </label>
                <Input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип уведомления
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'sms' | 'email' | 'push' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                  <option value="push">Push-уведомление</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Текст сообщения
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Введите текст напоминания..."
                  rows={4}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={editingReminder ? handleUpdateReminder : handleAddReminder}
                  disabled={isLoading}
                >
                  {editingReminder ? 'Обновить' : 'Добавить'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingReminder(null);
                    setFormData({ leadId: '', scheduledAt: '', message: '', type: 'sms' });
                  }}
                >
                  Отмена
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Список напоминаний */}
      <div className="space-y-4">
        {reminders.map((reminder) => (
          <Card key={reminder.id} className={isOverdue(reminder.scheduledAt) ? 'border-red-200 bg-red-50' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-6 w-6 text-blue-500" />
                  <div>
                    <CardTitle className="text-lg">{reminder.leadName}</CardTitle>
                    <CardDescription className="text-sm">
                      {formatDateTime(reminder.scheduledAt)}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(reminder.status)}>
                    {getStatusIcon(reminder.status)}
                    <span className="ml-1">{getStatusText(reminder.status)}</span>
                  </Badge>
                  <Badge variant="secondary">
                    {getTypeIcon(reminder.type)}
                    <span className="ml-1">{getTypeText(reminder.type)}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Сообщение */}
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Сообщение:</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {reminder.message}
                  </p>
                </div>

                {/* Действия */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isOverdue(reminder.scheduledAt) && reminder.status === 'pending' && (
                      <Badge className="bg-red-100 text-red-800">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Просрочено
                      </Badge>
                    )}
                    {reminder.status === 'pending' && (
                      <span className="text-sm text-gray-500">
                        Осталось: {Math.max(0, Math.ceil(
                          (new Date(reminder.scheduledAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                        ))} дней
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {reminder.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditReminder(reminder)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Изменить
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelReminder(reminder.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Отменить
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteReminder(reminder.id)}
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
      {reminders.length === 0 && !showAddForm && (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Напоминания не настроены</h3>
            <p className="text-gray-600 mb-4">
              Добавьте напоминания для автоматических уведомлений клиентов
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить первое напоминание
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
