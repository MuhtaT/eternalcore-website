// Схема базы данных
export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  image?: string;
  role?: string; // 'user', 'admin'
  created_at: string;
};

export type Session = {
  id: string;
  userId: number;
  expires: string;
}; 

// Схема для таблицы forsell (донат-предложения)
export type DonatePackage = {
  id: number;
  name: string;
  price: number;
  description: string;
  status: string; // 'normal', 'recommended', 'popular', 'maximum'
  group: string;
  features: string; // JSON строка для массива возможностей
  command: string;
  created_at: string;
  updated_at: string;
};

export type Privilege = {
  id: number;
  name: string;
  type: string; // 'permission', 'command', 'feature'
  description: string;
  permission: string;
  command: string;
  price?: number; // Цена за привилегию
  icon?: string; // Имя иконки для отображения
  created_at: string;
  updated_at: string;
}; 