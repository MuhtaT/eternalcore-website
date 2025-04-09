import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Расширяем интерфейс User, чтобы добавить поля, которые нам нужны
   */
  interface User {
    id: string;
    role?: string;
  }

  /**
   * Расширяем интерфейс Session, чтобы добавить id и role
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    }
  }
}

declare module "next-auth/jwt" {
  /** Расширяем JWT токен для хранения роли */
  interface JWT {
    role?: string;
  }
} 