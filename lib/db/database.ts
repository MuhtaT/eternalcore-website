import mysql from 'mysql2/promise';
import { 
  User, 
  DonatePackage, 
  Privilege,
  anticheatDetectionSchema,
  staffActivitySchema,
  staffConnectionSchema,
  serverLogsSchema,
  serverMetricsSchema,
  minecraftAccountsSchema,
  authCodesSchema,
  MinecraftAccount,
  AuthCode
} from './schema';

// Параметры подключения к MySQL
const dbConfig = {
  host: 'eternalcore.ru',
  user: 'u1_SHIZcVd4NZ',
  password: 'f.jvqa^DonRTNW^mXlC+ktR3',
  database: 's1_web_auth',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Пул соединений
let pool: mysql.Pool;

// Инициализация соединения с базой данных
export async function getConnection() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Инициализация таблиц
export async function initDb() {
  const pool = await getConnection();
  
  // Создаем таблицы для привязки аккаунтов Minecraft
  console.log('Инициализация таблиц для аккаунтов Minecraft...');
  
  // Создаем таблицу привязки аккаунтов Minecraft
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${minecraftAccountsSchema.tableName} (
      ${minecraftAccountsSchema.columns}
    )
  `);
  
  // Создаем таблицу для временных кодов авторизации
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${authCodesSchema.tableName} (
      ${authCodesSchema.columns}
    )
  `);
  
  console.log('Таблицы для привязки Minecraft-аккаунтов успешно созданы или уже существуют');
  
  // Создаем таблицу пользователей
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      image VARCHAR(255),
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Проверяем, есть ли колонка role
  const [columns] = await pool.query<mysql.RowDataPacket[]>(`
    SHOW COLUMNS FROM users LIKE 'role'
  `);
  
  // Если колонки role нет, добавляем её
  if (columns.length === 0) {
    await pool.query(`
      ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user'
    `);
    console.log('Added role column to users table');
  }
  
  // Создаем таблицу сессий
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(255) PRIMARY KEY,
      userId INT NOT NULL,
      expires TIMESTAMP NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  
  // Создаем таблицу донат-пакетов
  await pool.query(`
    CREATE TABLE IF NOT EXISTS forsell_packages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      description TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'normal',
      \`group\` VARCHAR(100) NOT NULL,
      features TEXT NOT NULL,
      command VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Создаем таблицу привилегий
  await pool.query(`
    CREATE TABLE IF NOT EXISTS forsell_privileges (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      description TEXT NOT NULL,
      permission VARCHAR(255) NOT NULL,
      command VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NULL DEFAULT NULL,
      icon VARCHAR(50) NULL DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  
  // Проверяем, есть ли колонки price и icon в таблице привилегий
  const [priceColumn] = await pool.query<mysql.RowDataPacket[]>(`
    SHOW COLUMNS FROM forsell_privileges LIKE 'price'
  `);
  
  if (priceColumn.length === 0) {
    await pool.query(`
      ALTER TABLE forsell_privileges ADD COLUMN price DECIMAL(10, 2) NULL DEFAULT NULL
    `);
    console.log('Added price column to forsell_privileges table');
  }
  
  const [iconColumn] = await pool.query<mysql.RowDataPacket[]>(`
    SHOW COLUMNS FROM forsell_privileges LIKE 'icon'
  `);
  
  if (iconColumn.length === 0) {
    await pool.query(`
      ALTER TABLE forsell_privileges ADD COLUMN icon VARCHAR(50) NULL DEFAULT NULL
    `);
    console.log('Added icon column to forsell_privileges table');
  }
  
  return pool;
}

// Методы для работы с пользователями
export async function getUserByEmail(email: string): Promise<User | null> {
  const pool = await getConnection();
  const [rows] = await pool.query<mysql.RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
  return rows.length > 0 ? rows[0] as User : null;
}

export async function getUserById(id: number): Promise<User | null> {
  const pool = await getConnection();
  const [rows] = await pool.query<mysql.RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] as User : null;
}

export async function createUser(user: Omit<User, 'id' | 'created_at' | 'role'>): Promise<User> {
  const pool = await getConnection();
  const [result] = await pool.query<mysql.ResultSetHeader>(
    'INSERT INTO users (name, email, password, image, role) VALUES (?, ?, ?, ?, ?)',
    [user.name, user.email, user.password, user.image || null, 'user']
  );
  
  const createdUser = await getUserById(result.insertId);
  if (!createdUser) {
    throw new Error('Failed to create user');
  }
  
  return createdUser;
}

// Проверка, является ли пользователь администратором
export async function isUserAdmin(userId: number): Promise<boolean> {
  const user = await getUserById(userId);
  return user?.role === 'admin';
}

// Метод для изменения роли пользователя
export async function updateUserRole(userId: number, role: string): Promise<boolean> {
  const pool = await getConnection();
  const [result] = await pool.query<mysql.ResultSetHeader>(
    'UPDATE users SET role = ? WHERE id = ?',
    [role, userId]
  );
  
  return result.affectedRows > 0;
}

// Получение всех пользователей (для админ панели)
export async function getAllUsers(): Promise<User[]> {
  const pool = await getConnection();
  const [rows] = await pool.query<mysql.RowDataPacket[]>('SELECT * FROM users ORDER BY created_at DESC');
  return rows as User[];
}

// Методы для работы с сессиями
export async function createSession(sessionId: string, userId: number, expires: string) {
  const pool = await getConnection();
  await pool.query(
    'INSERT INTO sessions (id, user_id, expires) VALUES (?, ?, ?)',
    [sessionId, userId, expires]
  );
}

export async function getSessionById(sessionId: string) {
  const pool = await getConnection();
  const [rows] = await pool.query<mysql.RowDataPacket[]>('SELECT * FROM sessions WHERE id = ?', [sessionId]);
  return rows.length > 0 ? rows[0] : null;
}

export async function deleteSession(sessionId: string) {
  const pool = await getConnection();
  await pool.query('DELETE FROM sessions WHERE id = ?', [sessionId]);
}

// ============ Функции для работы с донат-пакетами ============

// Получить все донат-пакеты
export async function getAllDonatePackages(): Promise<DonatePackage[]> {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query<any[]>("SELECT * FROM forsell_packages ORDER BY price ASC");
    
    // Логирование для отладки
    console.log(`[DEBUG] getAllDonatePackages получено записей: ${rows.length}`);
    
    return rows.map(row => ({
      ...row,
      features: typeof row.features === 'string' ? row.features : JSON.stringify(row.features)
    }));
  } catch (error) {
    console.error("Ошибка при получении донат-пакетов:", error);
    return [];
  }
}

// Получить донат-пакет по ID
export async function getDonatePackageById(id: number): Promise<DonatePackage | null> {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query<any[]>("SELECT * FROM forsell_packages WHERE id = ?", [id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return {
      ...rows[0],
      features: typeof rows[0].features === 'string' ? rows[0].features : JSON.stringify(rows[0].features)
    };
  } catch (error) {
    console.error(`Ошибка при получении донат-пакета с ID ${id}:`, error);
    return null;
  }
}

// Создать новый донат-пакет
export async function createDonatePackage(
  packageData: Omit<DonatePackage, 'id' | 'created_at' | 'updated_at'>
): Promise<DonatePackage> {
  try {
    const pool = await getConnection();
    
    // Убедимся, что features - это строка JSON
    let featuresJson = packageData.features;
    if (typeof packageData.features !== 'string') {
      featuresJson = JSON.stringify(packageData.features);
    }
    
    // Логирование для отладки
    console.log(`[DEBUG] Создание донат-пакета:`, {
      name: packageData.name,
      price: packageData.price,
      features: featuresJson
    });
    
    const [result] = await pool.query(
      `INSERT INTO forsell_packages (name, price, description, status, \`group\`, features, command) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        packageData.name,
        packageData.price,
        packageData.description,
        packageData.status || 'normal',
        packageData.group,
        featuresJson,
        packageData.command
      ]
    );
    
    const insertId = (result as any).insertId;
    console.log(`[DEBUG] Создан донат-пакет с ID: ${insertId}`);
    
    const createdPackage = await getDonatePackageById(insertId);
    if (!createdPackage) {
      throw new Error('Не удалось получить созданный донат-пакет');
    }
    
    return createdPackage;
  } catch (error) {
    console.error("Ошибка при создании донат-пакета:", error);
    throw error;
  }
}

// Обновить донат-пакет
export async function updateDonatePackage(
  id: number,
  packageData: Partial<Omit<DonatePackage, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
  try {
    const pool = await getConnection();
    
    const updateFields = [];
    const updateValues = [];
    
    if (packageData.name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(packageData.name);
    }
    
    if (packageData.price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(packageData.price);
    }
    
    if (packageData.description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(packageData.description);
    }
    
    if (packageData.status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(packageData.status);
    }
    
    if (packageData.group !== undefined) {
      updateFields.push('`group` = ?');
      updateValues.push(packageData.group);
    }
    
    if (packageData.features !== undefined) {
      updateFields.push('features = ?');
      // Убедимся, что features - это строка JSON
      const featuresJson = typeof packageData.features === 'string' 
        ? packageData.features 
        : JSON.stringify(packageData.features);
      updateValues.push(featuresJson);
    }
    
    if (packageData.command !== undefined) {
      updateFields.push('command = ?');
      updateValues.push(packageData.command);
    }
    
    // Если нет полей для обновления, возвращаем false
    if (updateFields.length === 0) {
      return false;
    }
    
    // Логирование для отладки
    console.log(`[DEBUG] Обновление донат-пакета ID ${id}:`, {
      fields: updateFields,
      values: updateValues
    });
    
    const [result] = await pool.query(
      `UPDATE forsell_packages SET ${updateFields.join(', ')} WHERE id = ?`,
      [...updateValues, id]
    );
    
    const success = (result as any).affectedRows > 0;
    console.log(`[DEBUG] Результат обновления донат-пакета: ${success ? 'успех' : 'неудача'}`);
    
    return success;
  } catch (error) {
    console.error(`Ошибка при обновлении донат-пакета с ID ${id}:`, error);
    return false;
  }
}

// Удалить донат-пакет
export async function deleteDonatePackage(id: number): Promise<boolean> {
  try {
    const pool = await getConnection();
    const [result] = await pool.query('DELETE FROM forsell_packages WHERE id = ?', [id]);
    
    const success = (result as any).affectedRows > 0;
    console.log(`[DEBUG] Результат удаления донат-пакета ID ${id}: ${success ? 'успех' : 'неудача'}`);
    
    return success;
  } catch (error) {
    console.error(`Ошибка при удалении донат-пакета с ID ${id}:`, error);
    return false;
  }
}

// ============ Функции для работы с привилегиями ============

// Получить все привилегии
export async function getAllPrivileges(): Promise<Privilege[]> {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query<any[]>("SELECT * FROM forsell_privileges ORDER BY name ASC");
    
    // Логирование для отладки
    console.log(`[DEBUG] getAllPrivileges получено записей: ${rows.length}`);
    
    return rows;
  } catch (error) {
    console.error("Ошибка при получении привилегий:", error);
    return [];
  }
}

// Получить привилегию по ID
export async function getPrivilegeById(id: number): Promise<Privilege | null> {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query<any[]>("SELECT * FROM forsell_privileges WHERE id = ?", [id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0];
  } catch (error) {
    console.error(`Ошибка при получении привилегии с ID ${id}:`, error);
    return null;
  }
}

// Создать новую привилегию
export async function createPrivilege(
  privilegeData: Omit<Privilege, 'id' | 'created_at' | 'updated_at'>
): Promise<Privilege> {
  try {
    const pool = await getConnection();
    
    // Логирование для отладки
    console.log(`[DEBUG] Создание привилегии:`, {
      name: privilegeData.name,
      type: privilegeData.type,
      permission: privilegeData.permission,
      price: privilegeData.price,
      icon: privilegeData.icon
    });
    
    const [result] = await pool.query(
      `INSERT INTO forsell_privileges (name, type, description, permission, command, price, icon) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        privilegeData.name,
        privilegeData.type,
        privilegeData.description,
        privilegeData.permission,
        privilegeData.command,
        privilegeData.price || null,
        privilegeData.icon || null
      ]
    );
    
    const insertId = (result as any).insertId;
    console.log(`[DEBUG] Создана привилегия с ID: ${insertId}`);
    
    const createdPrivilege = await getPrivilegeById(insertId);
    if (!createdPrivilege) {
      throw new Error('Не удалось получить созданную привилегию');
    }
    
    return createdPrivilege;
  } catch (error) {
    console.error("Ошибка при создании привилегии:", error);
    throw error;
  }
}

// Обновить привилегию
export async function updatePrivilege(
  id: number,
  privilegeData: Partial<Omit<Privilege, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
  try {
    const pool = await getConnection();
    
    const updateFields = [];
    const updateValues = [];
    
    if (privilegeData.name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(privilegeData.name);
    }
    
    if (privilegeData.type !== undefined) {
      updateFields.push('type = ?');
      updateValues.push(privilegeData.type);
    }
    
    if (privilegeData.description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(privilegeData.description);
    }
    
    if (privilegeData.permission !== undefined) {
      updateFields.push('permission = ?');
      updateValues.push(privilegeData.permission);
    }
    
    if (privilegeData.command !== undefined) {
      updateFields.push('command = ?');
      updateValues.push(privilegeData.command);
    }
    
    if (privilegeData.price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(privilegeData.price);
    }
    
    if (privilegeData.icon !== undefined) {
      updateFields.push('icon = ?');
      updateValues.push(privilegeData.icon);
    }
    
    // Если нет полей для обновления, возвращаем false
    if (updateFields.length === 0) {
      return false;
    }
    
    // Логирование для отладки
    console.log(`[DEBUG] Обновление привилегии ID ${id}:`, {
      fields: updateFields,
      values: updateValues
    });
    
    const [result] = await pool.query(
      `UPDATE forsell_privileges SET ${updateFields.join(', ')} WHERE id = ?`,
      [...updateValues, id]
    );
    
    const success = (result as any).affectedRows > 0;
    console.log(`[DEBUG] Результат обновления привилегии: ${success ? 'успех' : 'неудача'}`);
    
    return success;
  } catch (error) {
    console.error(`Ошибка при обновлении привилегии с ID ${id}:`, error);
    return false;
  }
}

// Удалить привилегию
export async function deletePrivilege(id: number): Promise<boolean> {
  try {
    const pool = await getConnection();
    const [result] = await pool.query('DELETE FROM forsell_privileges WHERE id = ?', [id]);
    
    const success = (result as any).affectedRows > 0;
    console.log(`[DEBUG] Результат удаления привилегии ID ${id}: ${success ? 'успех' : 'неудача'}`);
    
    return success;
  } catch (error) {
    console.error(`Ошибка при удалении привилегии с ID ${id}:`, error);
    return false;
  }
}

// ========== Функции для работы с вебхуками Minecraft ==========

// Сохранение детекта античита
export async function saveAnticheatDetection(data: {
  player: string;
  detection_type: string;
  description: string;
  level: number;
  timestamp: number;
  action: string;
}): Promise<boolean> {
  try {
    const pool = await getConnection();
    await pool.query(
      `INSERT INTO anticheat_detections 
       (player, detection_type, description, level, timestamp, action) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.player,
        data.detection_type,
        data.description,
        data.level,
        data.timestamp,
        data.action
      ]
    );
    return true;
  } catch (error) {
    console.error("Ошибка при сохранении детекта античита:", error);
    return false;
  }
}

// Получение детектов античита
export async function getAnticheatDetections(limit = 100): Promise<any[]> {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM anticheat_detections ORDER BY timestamp DESC LIMIT ?`,
      [limit]
    );
    return rows;
  } catch (error) {
    console.error("Ошибка при получении детектов античита:", error);
    return [];
  }
}

// Сохранение активности персонала
export async function saveStaffActivity(data: {
  staff_name: string;
  action_type: string;
  target_player?: string;
  duration?: string;
  reason?: string;
  timestamp: number;
}): Promise<boolean> {
  try {
    const pool = await getConnection();
    await pool.query(
      `INSERT INTO staff_activity 
       (staff_name, action_type, target_player, duration, reason, timestamp) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.staff_name,
        data.action_type,
        data.target_player || null,
        data.duration || null,
        data.reason || null,
        data.timestamp
      ]
    );
    return true;
  } catch (error) {
    console.error("Ошибка при сохранении активности персонала:", error);
    return false;
  }
}

// Получение активности персонала
export async function getStaffActivity(limit = 100): Promise<any[]> {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM staff_activity ORDER BY timestamp DESC LIMIT ?`,
      [limit]
    );
    return rows;
  } catch (error) {
    console.error("Ошибка при получении активности персонала:", error);
    return [];
  }
}

// Сохранение входа/выхода персонала
export async function saveStaffConnection(data: {
  staff_name: string;
  action: 'join' | 'leave';
  timestamp: number;
}): Promise<boolean> {
  try {
    const pool = await getConnection();
    await pool.query(
      `INSERT INTO staff_connections 
       (staff_name, action, timestamp) 
       VALUES (?, ?, ?)`,
      [
        data.staff_name,
        data.action,
        data.timestamp
      ]
    );
    return true;
  } catch (error) {
    console.error("Ошибка при сохранении входа/выхода персонала:", error);
    return false;
  }
}

// Получение входов/выходов персонала
export async function getStaffConnections(limit = 100): Promise<any[]> {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM staff_connections ORDER BY timestamp DESC LIMIT ?`,
      [limit]
    );
    return rows;
  } catch (error) {
    console.error("Ошибка при получении входов/выходов персонала:", error);
    return [];
  }
}

// Сохранение лога сервера
export async function saveServerLog(data: {
  log_type: string;
  player_name?: string;
  auth_type?: string;
  message?: string;
  timestamp: number;
}): Promise<boolean> {
  try {
    const pool = await getConnection();
    await pool.query(
      `INSERT INTO server_logs 
       (log_type, player_name, auth_type, message, timestamp) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.log_type,
        data.player_name || null,
        data.auth_type || null,
        data.message || null,
        data.timestamp
      ]
    );
    return true;
  } catch (error) {
    console.error("Ошибка при сохранении лога сервера:", error);
    return false;
  }
}

// Получение логов сервера
export async function getServerLogs(logType?: string, limit = 100): Promise<any[]> {
  try {
    const pool = await getConnection();
    let query = `SELECT * FROM server_logs`;
    const params: any[] = [];
    
    if (logType) {
      query += ` WHERE log_type = ?`;
      params.push(logType);
    }
    
    query += ` ORDER BY timestamp DESC LIMIT ?`;
    params.push(limit);
    
    const [rows] = await pool.query<any[]>(query, params);
    return rows;
  } catch (error) {
    console.error("Ошибка при получении логов сервера:", error);
    return [];
  }
}

// Сохранение метрики онлайна
export async function saveServerOnline(data: {
  online_players: number;
  timestamp: number;
}): Promise<boolean> {
  try {
    const pool = await getConnection();
    await pool.query(
      `INSERT INTO server_metrics 
       (online_players, timestamp) 
       VALUES (?, ?)`,
      [
        data.online_players,
        data.timestamp
      ]
    );
    return true;
  } catch (error) {
    console.error("Ошибка при сохранении метрики онлайна:", error);
    return false;
  }
}

// Получение последних метрик онлайна
export async function getServerOnlineMetrics(hoursAgo = 24): Promise<any[]> {
  try {
    const pool = await getConnection();
    const timestamp = Math.floor(Date.now() / 1000) - (hoursAgo * 3600);
    
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM server_metrics 
       WHERE timestamp > ? 
       ORDER BY timestamp ASC`,
      [timestamp]
    );
    return rows;
  } catch (error) {
    console.error("Ошибка при получении метрик онлайна:", error);
    return [];
  }
}

// Функции для работы с привязкой Minecraft-аккаунтов

/**
 * Инициализирует таблицы для привязки аккаунтов Minecraft
 */
export async function initMinecraftTables() {
  const pool = await getConnection();
  
  // Создаем таблицу привязки аккаунтов Minecraft
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${minecraftAccountsSchema.tableName} (
      ${minecraftAccountsSchema.columns}
    )
  `);
  
  // Создаем таблицу для временных кодов авторизации
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${authCodesSchema.tableName} (
      ${authCodesSchema.columns}
    )
  `);
  
  console.log('Minecraft account linking tables initialized');
}

/**
 * Генерирует случайный код авторизации для привязки Minecraft-аккаунта
 */
export async function generateAuthCode(userId: number, minecraftUsername: string): Promise<string> {
  const pool = await getConnection();
  
  // Генерируем 6-значный буквенно-цифровой код
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let authCode = '';
  for (let i = 0; i < 6; i++) {
    authCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  // Устанавливаем срок действия кода - 15 минут
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);
  
  // Удаляем старые коды для этого пользователя
  await pool.query(
    `DELETE FROM ${authCodesSchema.tableName} WHERE user_id = ?`,
    [userId]
  );
  
  // Добавляем новый код в базу данных
  await pool.query(
    `INSERT INTO ${authCodesSchema.tableName} (user_id, minecraft_username, auth_code, expires_at) 
     VALUES (?, ?, ?, ?)`,
    [userId, minecraftUsername, authCode, expiresAt]
  );
  
  return authCode;
}

/**
 * Проверяет код авторизации и привязывает Minecraft-аккаунт к аккаунту на сайте
 */
export async function verifyAndLinkMinecraftAccount(authCode: string, minecraftUsername: string): Promise<boolean> {
  const pool = await getConnection();
  
  // Получаем действительный код
  const [codes] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT * FROM ${authCodesSchema.tableName} 
     WHERE auth_code = ? AND minecraft_username = ? AND expires_at > NOW() AND is_used = FALSE`,
    [authCode, minecraftUsername]
  );
  
  if (codes.length === 0) {
    return false;
  }
  
  const code = codes[0];
  
  // Помечаем код как использованный
  await pool.query(
    `UPDATE ${authCodesSchema.tableName} SET is_used = TRUE WHERE id = ?`,
    [code.id]
  );
  
  // Проверяем, существует ли уже запись для этого Minecraft-аккаунта
  const [existingAccounts] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT * FROM ${minecraftAccountsSchema.tableName} WHERE minecraft_username = ?`,
    [minecraftUsername]
  );
  
  if (existingAccounts.length > 0) {
    // Если аккаунт уже привязан к другому пользователю, обновляем привязку
    await pool.query(
      `UPDATE ${minecraftAccountsSchema.tableName} SET user_id = ? WHERE minecraft_username = ?`,
      [code.user_id, minecraftUsername]
    );
  } else {
    // Создаем новую запись о привязке аккаунта
    await pool.query(
      `INSERT INTO ${minecraftAccountsSchema.tableName} 
      (user_id, minecraft_username) VALUES (?, ?)`,
      [code.user_id, minecraftUsername]
    );
  }
  
  return true;
}

/**
 * Проверяет, привязан ли Minecraft-аккаунт к данному пользователю
 */
export async function getUserMinecraftAccount(userId: number): Promise<MinecraftAccount | null> {
  const pool = await getConnection();
  
  const [accounts] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT * FROM ${minecraftAccountsSchema.tableName} WHERE user_id = ?`,
    [userId]
  );
  
  return accounts.length > 0 ? accounts[0] as MinecraftAccount : null;
}

/**
 * Получает данные пользователя по имени Minecraft-аккаунта
 */
export async function getUserByMinecraftUsername(minecraftUsername: string): Promise<{user: User, minecraftAccount: MinecraftAccount} | null> {
  const pool = await getConnection();
  
  const [accounts] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT ma.*, u.* FROM ${minecraftAccountsSchema.tableName} ma
     JOIN users u ON ma.user_id = u.id
     WHERE ma.minecraft_username = ?`,
    [minecraftUsername]
  );
  
  if (accounts.length === 0) {
    return null;
  }
  
  const row = accounts[0];
  
  return {
    user: {
      id: row.user_id,
      name: row.name,
      email: row.email,
      password: row.password,
      image: row.image,
      role: row.role,
      created_at: row.created_at
    },
    minecraftAccount: {
      id: row.id,
      user_id: row.user_id,
      minecraft_username: row.minecraft_username,
      last_online: row.last_online,
      playtime_minutes: row.playtime_minutes,
      achievements_count: row.achievements_count,
      balance: row.balance,
      privilege: row.privilege,
      total_donated: row.total_donated,
      created_at: row.created_at,
      updated_at: row.updated_at
    }
  };
}

/**
 * Обновляет данные Minecraft-аккаунта
 */
export async function updateMinecraftAccountData(
  minecraftUsername: string, 
  data: Partial<Omit<MinecraftAccount, 'id' | 'user_id' | 'minecraft_username' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
  const pool = await getConnection();
  
  // Формируем динамический запрос на обновление
  const entries = Object.entries(data).filter(([_, value]) => value !== undefined);
  
  if (entries.length === 0) {
    return false;
  }
  
  const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
  const values = entries.map(([_, value]) => value);
  
  // Добавляем имя пользователя в конец массива значений
  values.push(minecraftUsername);
  
  const [result] = await pool.query<mysql.ResultSetHeader>(
    `UPDATE ${minecraftAccountsSchema.tableName} SET ${setClause} WHERE minecraft_username = ?`,
    values
  );
  
  return result.affectedRows > 0;
}

/**
 * Отвязывает Minecraft-аккаунт от аккаунта пользователя
 */
export async function unlinkMinecraftAccount(userId: number): Promise<boolean> {
  const pool = await getConnection();
  
  const [result] = await pool.query<mysql.ResultSetHeader>(
    `DELETE FROM ${minecraftAccountsSchema.tableName} WHERE user_id = ?`,
    [userId]
  );
  
  return result.affectedRows > 0;
}

// Инициализация базы данных при импорте модуля
async function initDatabase() {
  try {
    const pool = await getConnection();

    // Создаем таблицы для привязки аккаунтов Minecraft
    console.log('Инициализация таблиц для аккаунтов Minecraft...');
    
    // Создаем таблицу привязки аккаунтов Minecraft
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${minecraftAccountsSchema.tableName} (
        ${minecraftAccountsSchema.columns}
      )
    `);
    
    // Создаем таблицу для временных кодов авторизации
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${authCodesSchema.tableName} (
        ${authCodesSchema.columns}
      )
    `);
    
    console.log('Таблицы для привязки Minecraft-аккаунтов успешно созданы или уже существуют');

    // Создаем таблицу пользователей
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Проверяем, есть ли колонка role
    const [columns] = await pool.query<mysql.RowDataPacket[]>(`
      SHOW COLUMNS FROM users LIKE 'role'
    `);
    
    // Если колонки role нет, добавляем её
    if (columns.length === 0) {
      await pool.query(`
        ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user'
      `);
      console.log('Added role column to users table');
    }
    
    // Создаем таблицу сессий
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        userId INT NOT NULL,
        expires TIMESTAMP NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Создаем таблицу донат-пакетов
    await pool.query(`
      CREATE TABLE IF NOT EXISTS forsell_packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'normal',
        \`group\` VARCHAR(100) NOT NULL,
        features TEXT NOT NULL,
        command VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Создаем таблицу привилегий
    await pool.query(`
      CREATE TABLE IF NOT EXISTS forsell_privileges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        permission VARCHAR(255) NOT NULL,
        command VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NULL DEFAULT NULL,
        icon VARCHAR(50) NULL DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Проверяем, есть ли колонки price и icon в таблице привилегий
    const [priceColumn] = await pool.query<mysql.RowDataPacket[]>(`
      SHOW COLUMNS FROM forsell_privileges LIKE 'price'
    `);
    
    if (priceColumn.length === 0) {
      await pool.query(`
        ALTER TABLE forsell_privileges ADD COLUMN price DECIMAL(10, 2) NULL DEFAULT NULL
      `);
      console.log('Added price column to forsell_privileges table');
    }
    
    const [iconColumn] = await pool.query<mysql.RowDataPacket[]>(`
      SHOW COLUMNS FROM forsell_privileges LIKE 'icon'
    `);
    
    if (iconColumn.length === 0) {
      await pool.query(`
        ALTER TABLE forsell_privileges ADD COLUMN icon VARCHAR(50) NULL DEFAULT NULL
      `);
      console.log('Added icon column to forsell_privileges table');
    }

    // Создание таблиц для вебхуков от Minecraft сервера
    const webhookTables = [
      anticheatDetectionSchema,
      staffActivitySchema,
      staffConnectionSchema,
      serverLogsSchema,
      serverMetricsSchema
    ];

    for (const table of webhookTables) {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS ${table.tableName} (
          ${table.columns}
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log(`Таблица ${table.tableName} создана или уже существует`);
    }
    
    console.log('Инициализация базы данных завершена успешно');
    return pool;
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
    throw error;
  }
}

initDatabase().catch(error => {
  console.error('Критическая ошибка при инициализации базы данных:', error);
  process.exit(1); // Завершаем процесс в случае критической ошибки
}); 