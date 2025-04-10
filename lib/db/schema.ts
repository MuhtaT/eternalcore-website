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

// Таблица для хранения детектов античита
export const anticheatDetectionSchema = {
  tableName: 'anticheat_detections',
  columns: `
    id INT AUTO_INCREMENT PRIMARY KEY,
    player VARCHAR(36) NOT NULL,
    detection_type VARCHAR(100) NOT NULL,
    description TEXT,
    level INT NOT NULL,
    timestamp BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `
};

// Таблица для хранения активности персонала
export const staffActivitySchema = {
  tableName: 'staff_activity',
  columns: `
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_name VARCHAR(36) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    target_player VARCHAR(36),
    duration VARCHAR(50),
    reason TEXT,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `
};

// Таблица для хранения входов/выходов персонала
export const staffConnectionSchema = {
  tableName: 'staff_connections',
  columns: `
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_name VARCHAR(36) NOT NULL,
    action VARCHAR(10) NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `
};

// Таблица для хранения логов сервера
export const serverLogsSchema = {
  tableName: 'server_logs',
  columns: `
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_type VARCHAR(50) NOT NULL,
    player_name VARCHAR(36),
    auth_type VARCHAR(50),
    message TEXT,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `
};

// Таблица для метрик сервера
export const serverMetricsSchema = {
  tableName: 'server_metrics',
  columns: `
    id INT AUTO_INCREMENT PRIMARY KEY,
    online_players INT NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `
}; 