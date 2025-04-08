// Схема базы данных
export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  image?: string;
  created_at: string;
};

export type Session = {
  id: string;
  userId: number;
  expires: string;
}; 