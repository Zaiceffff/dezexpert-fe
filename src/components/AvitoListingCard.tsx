'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, MapPin, Tag } from 'lucide-react';

export interface AvitoListing {
  id: number;
  title: string;
  price: number;
  status: 'active' | 'old' | 'removed' | 'blocked';
  address: string;
  category: {
    id: number;
    name: string;
  };
  url: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
  aiAssistantIsOn?: boolean;
}

interface AvitoListingCardProps {
  listing: AvitoListing;
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  old: 'bg-yellow-100 text-yellow-800',
  removed: 'bg-red-100 text-red-800',
  blocked: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  active: 'Активно',
  old: 'Архив',
  removed: 'Удалено',
  blocked: 'Заблокировано',
};

export function AvitoListingCard({ listing }: AvitoListingCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {listing.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={statusColors[listing.status]}>
                {statusLabels[listing.status]}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {listing.category.name}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(listing.price)}
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{listing.address}</span>
          </div>
          <div className="text-sm text-gray-500">
            ID: {listing.id}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Открыть на Avito
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
