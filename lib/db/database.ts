import mysql from 'mysql2/promise';
import { User } from './schema';

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
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      image VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Создаем таблицу сессий
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(255) PRIMARY KEY,
      user_id INT NOT NULL,
      expires VARCHAR(255) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
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

export async function createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
  const pool = await getConnection();
  const [result] = await pool.query<mysql.ResultSetHeader>(
    'INSERT INTO users (name, email, password, image) VALUES (?, ?, ?, ?)',
    [user.name, user.email, user.password, user.image || null]
  );
  
  const createdUser = await getUserById(result.insertId);
  if (!createdUser) {
    throw new Error('Failed to create user');
  }
  
  return createdUser;
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

// Инициализация базы данных при импорте модуля
initDb().catch(console.error); 