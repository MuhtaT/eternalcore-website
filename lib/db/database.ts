import mysql from 'mysql2/promise';
import { User, Session, DonatePackage, Privilege } from './schema';

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

// Инициализация базы данных при импорте модуля
initDb().catch(console.error); 