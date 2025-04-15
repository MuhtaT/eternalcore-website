'use client';

import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, Zap, Command, Diamond, Crown, Star, Gift, Rocket, Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React from "react";

// Вспомогательные функции для отображения
const getStatusIcon = (status: string): React.ReactNode => {
  switch (status) {
    case 'recommended':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'popular':
      return <Star className="h-5 w-5 text-blue-500" />;
    case 'maximum':
      return <Crown className="h-5 w-5 text-purple-500" />;
    default:
      return <Diamond className="h-5 w-5 text-[#DF2456]" />;
  }
};

const getStatusName = (status: string): string => {
  switch (status) {
    case 'recommended': return 'Рекомендуемый';
    case 'popular': return 'Популярный';
    case 'maximum': return 'Максимальный';
    case 'normal': return 'Стандартный';
    default: return 'Стандартный';
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'recommended': return 'bg-green-500/20 text-green-400';
    case 'popular': return 'bg-blue-500/20 text-blue-400';
    case 'maximum': return 'bg-purple-500/20 text-purple-400';
    case 'normal': return 'bg-gray-500/20 text-gray-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

const getPackageBackgroundColor = (status: string): string => {
  switch (status) {
    case 'recommended': return 'bg-gradient-to-tr from-green-950/50 to-green-900/20';
    case 'popular': return 'bg-gradient-to-tr from-blue-950/50 to-blue-900/20';
    case 'maximum': return 'bg-gradient-to-tr from-purple-950/50 to-purple-900/20';
    case 'normal': return 'bg-gradient-to-tr from-gray-950/50 to-gray-900/20';
    default: return 'bg-gradient-to-tr from-gray-950/50 to-gray-900/20';
  }
};

const getPrivilegeIcon = (type: string, iconName?: string): React.ReactNode => {
  // Если указано название иконки и оно не 'none', используем его
  if (iconName && iconName !== 'none') {
    switch (iconName) {
      case 'shield':
        return <Shield className="h-5 w-5 text-green-500" />;
      case 'command':
        return <Command className="h-5 w-5 text-blue-500" />;
      case 'zap':
        return <Zap className="h-5 w-5 text-purple-500" />;
      case 'gift':
        return <Gift className="h-5 w-5 text-yellow-500" />;
      case 'rocket':
        return <Rocket className="h-5 w-5 text-orange-500" />;
      case 'key':
        return <Key className="h-5 w-5 text-indigo-500" />;
      case 'crown':
        return <Crown className="h-5 w-5 text-amber-500" />;
      case 'star':
        return <Star className="h-5 w-5 text-cyan-500" />;
      default:
        break;
    }
  }
  
  // Если иконка не указана, равна 'none', или не распознана, используем тип
  switch (type) {
    case 'permission':
      return <Shield className="h-5 w-5 text-green-500" />;
    case 'command':
      return <Command className="h-5 w-5 text-blue-500" />;
    case 'feature':
      return <Zap className="h-5 w-5 text-purple-500" />;
    default:
      return <Shield className="h-5 w-5 text-[#DF2456]" />;
  }
};

const getPrivilegeTypeColor = (type: string): string => {
  switch (type) {
    case 'permission': return 'bg-green-500/20 text-green-400';
    case 'command': return 'bg-blue-500/20 text-blue-400';
    case 'feature': return 'bg-purple-500/20 text-purple-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

const getPrivilegeBackgroundColor = (type: string): string => {
  switch (type) {
    case 'permission': return 'bg-gradient-to-tr from-green-950/50 to-green-900/20';
    case 'command': return 'bg-gradient-to-tr from-blue-950/50 to-blue-900/20';
    case 'feature': return 'bg-gradient-to-tr from-purple-950/50 to-purple-900/20';
    default: return 'bg-gradient-to-tr from-gray-950/50 to-gray-900/20';
  }
};

// Функция для получения названия типа привилегии
const getPrivilegeTypeName = (type: string): string => {
  switch (type) {
    case 'permission': return 'Право';
    case 'command': return 'Команда';
    case 'feature': return 'Возможность';
    default: return 'Привилегия';
  }
};

// Компонент для карточки донат-пакета
export function DonatePackageCard({ pkg }: { pkg: any }) {
  // Преобразование строки JSON в массив
  const parseFeatures = (featuresJson: string): string[] => {
    try {
      // Если это уже массив, возвращаем его как есть
      if (Array.isArray(featuresJson)) {
        return featuresJson;
      }
      
      // Если это строка JSON, парсим её
      if (typeof featuresJson === 'string') {
        const parsed = JSON.parse(featuresJson);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      
      // В случае ошибки или неверного формата
      console.error("Неверный формат данных для features:", featuresJson);
      return ["Ошибка при загрузке возможностей"];
    } catch (e) {
      console.error("Ошибка при разборе JSON строки:", featuresJson, e);
      return ["Ошибка при загрузке возможностей"];
    }
  };

  // Получаем массив возможностей из JSON строки
  const features = parseFeatures(pkg.features);
  
  const handleBuyClick = () => {
    // Действие при клике на кнопку покупки
    alert(`Функционал покупки для пакета "${pkg.name}" в разработке`);
  };

  return (
    <div
      className={`relative p-6 rounded-lg border border-white/10 transition-all hover:border-primary/50 ${getPackageBackgroundColor(
        pkg.status
      )}`}
    >
      {pkg.status !== 'normal' && (
        <div className="absolute -top-3 -right-3">
          <Badge variant="outline" className={`px-3 py-1 ${getStatusColor(pkg.status)}`}>
            {getStatusName(pkg.status)}
          </Badge>
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-4">
        {getStatusIcon(pkg.status)}
        <h3 className="text-xl font-bold">{pkg.name}</h3>
      </div>
      
      <div className="text-2xl font-bold mb-4">
        {pkg.price} ₽
      </div>
      
      <p className="text-gray-300 mb-6">{pkg.description}</p>
      
      <div className="mb-6">
        <div className="text-lg font-semibold mb-2">Включает:</div>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <button
        type="button"
        className="w-full bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white py-2 rounded-lg font-medium transition-colors"
        onClick={handleBuyClick}
      >
        Купить
      </button>
    </div>
  );
}

// Компонент для карточки привилегии
export function PrivilegeCard({ priv }: { priv: any }) {
  const handleBuyClick = () => {
    alert(`Функционал покупки для привилегии "${priv.name}" в разработке`);
  };

  // Проверяем, есть ли цена
  const price = priv.price ? Number(priv.price) : null;
  
  // Получаем иконку и фон на основе типа и указанной иконки
  const icon = getPrivilegeIcon(priv.type, priv.icon);
  const backgroundColor = getPrivilegeBackgroundColor(priv.type);
  
  return (
    <div
      className={`relative p-6 rounded-lg border border-white/10 transition-all hover:border-primary/50 ${backgroundColor}`}
    >
      <div className="absolute -top-3 -right-3">
        <Badge variant="outline" className={`px-3 py-1 ${getPrivilegeTypeColor(priv.type)}`}>
          {getPrivilegeTypeName(priv.type)}
        </Badge>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-xl font-bold">{priv.name}</h3>
      </div>
      
      {price !== null && (
        <div className="text-2xl font-bold mb-4">
          {price} ₽
        </div>
      )}
      
      <p className="text-gray-300 mb-6">{priv.description}</p>
      
      <div className="mb-6">
        {priv.permission && (
          <div className="flex items-start gap-2 mb-2">
            <Key className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-lg font-semibold mb-1">Право доступа:</div>
              <code className="text-sm bg-black/30 px-2 py-1 rounded">{priv.permission}</code>
            </div>
          </div>
        )}
      </div>
      
      <button
        type="button"
        className="w-full bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white py-2 rounded-lg font-medium transition-colors"
        onClick={handleBuyClick}
      >
        {price !== null ? "Купить" : "Приобрести"}
      </button>
    </div>
  );
} 