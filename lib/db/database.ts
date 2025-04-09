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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  
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
  const pool = await getConnection();
  const [rows] = await pool.query<any[]>("SELECT * FROM forsell_packages ORDER BY price ASC");
  
  return rows.map(row => ({
    ...row,
    features: row.features ? JSON.parse(row.features) : []
  }));
}

// Получить донат-пакет по ID
export async function getDonatePackageById(id: number): Promise<DonatePackage | null> {
  const pool = await getConnection();
  const [rows] = await pool.query<any[]>("SELECT * FROM forsell_packages WHERE id = ?", [id]);
  
  if (rows.length === 0) {
    return null;
  }
  
  return {
    ...rows[0],
    features: rows[0].features ? JSON.parse(rows[0].features) : []
  };
}

// Создать новый донат-пакет
export async function createDonatePackage(
  packageData: Omit<DonatePackage, 'id' | 'created_at' | 'updated_at'>
): Promise<DonatePackage> {
  const pool = await getConnection();
  
  // Преобразуем массив features в JSON-строку
  const featuresJson = JSON.stringify(packageData.features);
  
  const [result] = await pool.query(
    `INSERT INTO forsell_packages (name, price, description, status, \`group\`, features, command) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      packageData.name,
      packageData.price,
      packageData.description,
      packageData.status,
      packageData.group,
      featuresJson,
      packageData.command
    ]
  );
  
  const insertId = (result as any).insertId;
  return getDonatePackageById(insertId) as Promise<DonatePackage>;
}

// Обновить донат-пакет
export async function updateDonatePackage(
  id: number,
  packageData: Partial<Omit<DonatePackage, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
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
    updateValues.push(JSON.stringify(packageData.features));
  }
  
  if (packageData.command !== undefined) {
    updateFields.push('command = ?');
    updateValues.push(packageData.command);
  }
  
  // Если нет полей для обновления, возвращаем false
  if (updateFields.length === 0) {
    return false;
  }
  
  const [result] = await pool.query(
    `UPDATE forsell_packages SET ${updateFields.join(', ')} WHERE id = ?`,
    [...updateValues, id]
  );
  
  return (result as any).affectedRows > 0;
}

// Удалить донат-пакет
export async function deleteDonatePackage(id: number): Promise<boolean> {
  const pool = await getConnection();
  const [result] = await pool.query('DELETE FROM forsell_packages WHERE id = ?', [id]);
  return (result as any).affectedRows > 0;
}

// ============ Функции для работы с привилегиями ============

// Получить все привилегии
export async function getAllPrivileges(): Promise<Privilege[]> {
  const pool = await getConnection();
  const [rows] = await pool.query<any[]>("SELECT * FROM forsell_privileges ORDER BY name ASC");
  return rows;
}

// Получить привилегию по ID
export async function getPrivilegeById(id: number): Promise<Privilege | null> {
  const pool = await getConnection();
  const [rows] = await pool.query<any[]>("SELECT * FROM forsell_privileges WHERE id = ?", [id]);
  
  if (rows.length === 0) {
    return null;
  }
  
  return rows[0];
}

// Создать новую привилегию
export async function createPrivilege(
  privilegeData: Omit<Privilege, 'id' | 'created_at' | 'updated_at'>
): Promise<Privilege> {
  const pool = await getConnection();
  
  const [result] = await pool.query(
    `INSERT INTO forsell_privileges (name, type, description, permission, command) 
     VALUES (?, ?, ?, ?, ?)`,
    [
      privilegeData.name,
      privilegeData.type,
      privilegeData.description,
      privilegeData.permission,
      privilegeData.command
    ]
  );
  
  const insertId = (result as any).insertId;
  return getPrivilegeById(insertId) as Promise<Privilege>;
}

// Обновить привилегию
export async function updatePrivilege(
  id: number,
  privilegeData: Partial<Omit<Privilege, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
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
  
  // Если нет полей для обновления, возвращаем false
  if (updateFields.length === 0) {
    return false;
  }
  
  const [result] = await pool.query(
    `UPDATE forsell_privileges SET ${updateFields.join(', ')} WHERE id = ?`,
    [...updateValues, id]
  );
  
  return (result as any).affectedRows > 0;
}

// Удалить привилегию
export async function deletePrivilege(id: number): Promise<boolean> {
  const pool = await getConnection();
  const [result] = await pool.query('DELETE FROM forsell_privileges WHERE id = ?', [id]);
  return (result as any).affectedRows > 0;
}

// Инициализация базы данных при импорте модуля
initDb().catch(console.error); 