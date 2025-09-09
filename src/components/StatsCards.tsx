'use client';

import { AvitoStats } from '@/hooks/useAvitoStats';
import { 
  Tag, 
  CheckCircle, 
  Bot, 
  AlertTriangle,
  TrendingUp,
  Users,
  MessageSquare,
  BarChart3
} from 'lucide-react';

interface StatsCardsProps {
  stats: AvitoStats | null;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Всего объявлений',
      value: stats?.total || 0,
      color: 'blue',
      icon: Tag,
      description: 'Общее количество объявлений'
    },
    {
      title: 'Активные',
      value: stats?.active || 0,
      color: 'green',
      icon: CheckCircle,
      description: 'Активные объявления'
    },
    {
      title: 'С AI ассистентом',
      value: stats?.withAi || 0,
      color: 'purple',
      icon: Bot,
      description: 'С включенным ИИ-ассистентом'
    },
    {
      title: 'Заблокированные',
      value: stats?.blocked || 0,
      color: 'red',
      icon: AlertTriangle,
      description: 'Заблокированные объявления'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          iconBg: 'bg-blue-500',
          text: 'text-blue-600',
          valueText: 'text-blue-900'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          iconBg: 'bg-green-500',
          text: 'text-green-600',
          valueText: 'text-green-900'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          iconBg: 'bg-purple-500',
          text: 'text-purple-600',
          valueText: 'text-purple-900'
        };
      case 'red':
        return {
          bg: 'bg-red-50',
          iconBg: 'bg-red-500',
          text: 'text-red-600',
          valueText: 'text-red-900'
        };
      default:
        return {
          bg: 'bg-gray-50',
          iconBg: 'bg-gray-500',
          text: 'text-gray-600',
          valueText: 'text-gray-900'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const colors = getColorClasses(card.color);
        
        return (
          <div key={index} className={`${colors.bg} overflow-hidden shadow rounded-lg border border-gray-200`}>
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm font-medium ${colors.text} truncate`}>
                      {card.title}
                    </dt>
                    <dd className={`text-2xl font-bold ${colors.valueText} mt-1`}>
                      {card.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500">{card.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
