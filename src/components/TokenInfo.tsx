'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Clock, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface TokenInfoProps {
  className?: string;
}

export function TokenInfo({ className = '' }: TokenInfoProps) {
  const [tokenInfo, setTokenInfo] = useState<{
    isExpired: boolean;
    isExpiringSoon: boolean;
    expirationTime: Date | null;
    timeRemaining: string;
  }>({
    isExpired: false,
    isExpiringSoon: false,
    expirationTime: null,
    timeRemaining: ''
  });

  useEffect(() => {
    const updateTokenInfo = () => {
      const isExpired = apiClient.isTokenExpired();
      const isExpiringSoon = apiClient.isTokenExpiringSoon();
      const expirationTime = apiClient.getTokenExpirationTime();
      
      let timeRemaining = '';
      if (expirationTime) {
        const now = new Date();
        const diff = expirationTime.getTime() - now.getTime();
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          
          if (days > 0) {
            timeRemaining = `${days}д ${hours}ч`;
          } else if (hours > 0) {
            timeRemaining = `${hours}ч ${minutes}м`;
          } else {
            timeRemaining = `${minutes}м`;
          }
        } else {
          timeRemaining = 'Истек';
        }
      }
      
      setTokenInfo({
        isExpired,
        isExpiringSoon,
        expirationTime,
        timeRemaining
      });
    };

    // Обновляем информацию сразу
    updateTokenInfo();
    
    // Обновляем каждую минуту
    const interval = setInterval(updateTokenInfo, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (!apiClient.getToken()) {
    return null;
  }

  const getStatusIcon = () => {
    if (tokenInfo.isExpired) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    } else if (tokenInfo.isExpiringSoon) {
      return <Clock className="w-4 h-4 text-orange-500" />;
    } else {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusText = () => {
    if (tokenInfo.isExpired) {
      return 'Токен истек';
    } else if (tokenInfo.isExpiringSoon) {
      return 'Токен скоро истечет';
    } else {
      return 'Токен действителен';
    }
  };

  const getStatusColor = () => {
    if (tokenInfo.isExpired) {
      return 'text-red-600 bg-red-50 border-red-200';
    } else if (tokenInfo.isExpiringSoon) {
      return 'text-orange-600 bg-orange-50 border-orange-200';
    } else {
      return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor()} ${className}`}>
      <Shield className="w-4 h-4" />
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className="text-sm font-medium">
          {getStatusText()}
        </span>
        {tokenInfo.timeRemaining && (
          <span className="text-xs opacity-75">
            ({tokenInfo.timeRemaining})
          </span>
        )}
      </div>
    </div>
  );
}
