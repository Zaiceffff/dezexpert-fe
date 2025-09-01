'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { X, Phone, Edit } from 'lucide-react';
import type { Lead } from '@/lib/api';

import { getPestText, getObjectText } from '@/lib/translations';

// Функция для перевода уровня заражения
const getInfestationText = (infestation: string) => {
  switch (infestation) {
    case 'low': return 'Низкий';
    case 'medium': return 'Средний';
    case 'high': return 'Высокий';
    default: return infestation;
  }
};

// Функция для перевода предыдущей обработки
const getPreviousTreatmentText = (treatment: boolean) => {
  return treatment ? 'Да' : 'Нет';
};

interface LeadDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export const LeadDetails: React.FC<LeadDetailsProps> = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null;

  const handleCall = () => {
    toast.info('Функция звонка будет доступна в следующей версии');
  };

  const handleEdit = () => {
    toast.info('Редактирование будет доступно в следующей версии');
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Данные о заявке</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Детали заявки */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя клиента:
              </label>
              <p className="text-sm text-gray-900">{lead.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Вредитель:
              </label>
              <p className="text-sm text-gray-900">{getPestText(lead.pestType)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Контакт клиента:
              </label>
              <p className="text-sm text-gray-900">{lead.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Адрес объекта:
              </label>
              <p className="text-sm text-gray-900">{lead.address}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип объекта:
              </label>
              <p className="text-sm text-gray-900">{getObjectText(lead.objectType)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Количество комнат:
              </label>
              <p className="text-sm text-gray-900">{lead.rooms || 'Не указано'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Уровень заражения:
              </label>
              <p className="text-sm text-gray-900">{getInfestationText(lead.infestation)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Предыдущая обработка:
              </label>
              <p className="text-sm text-gray-900">{getPreviousTreatmentText(lead.previousTreatment)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус заявки:
              </label>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  lead.status === 'new' ? 'bg-blue-500' :
                  lead.status === 'in_progress' ? 'bg-yellow-500' :
                  lead.status === 'completed' ? 'bg-green-500' :
                  'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-900">{lead.status || 'Новый'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Желаемая дата:
              </label>
              <p className="text-sm text-gray-900">{new Date(lead.expectedDate).toLocaleDateString('ru-RU')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Примерная цена:
              </label>
              <p className="text-sm text-gray-900">{lead.approxPrice} ₽</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Источник заявки:
              </label>
              <p className="text-sm text-gray-900">{lead.source}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Комментарий клиента:
            </label>
            <p className="text-sm text-gray-900">{lead.clientComment || 'Комментарий отсутствует'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата создания:
              </label>
              <p className="text-sm text-gray-900">{new Date(lead.createdAt).toLocaleString('ru-RU')}</p>
            </div>
          </div>
        </div>

        {/* Изменение статуса */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Изменить статус заявки:
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Статус заявки</option>
            <option value="new">Новый</option>
            <option value="in_progress">В работе</option>
            <option value="completed">Завершен</option>
            <option value="cancelled">Отменен</option>
          </select>
        </div>

        {/* Кнопки действий */}
        <div className="flex space-x-3">
          <Button
            onClick={handleCall}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Phone className="w-4 h-4 mr-2" />
            Позвонить
          </Button>
          <Button
            onClick={handleEdit}
            variant="outline"
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-2" />
            Отредактировать
          </Button>
        </div>
      </div>
    </div>
  );
};
