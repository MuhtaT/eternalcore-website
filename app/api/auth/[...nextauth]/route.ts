import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getUserByEmail } from "@/lib/db/database";

// Главный конфигурационный файл для NextAuth
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Требуются email и пароль для входа");
          }

          const user = await getUserByEmail(credentials.email).catch(error => {
            console.error("Ошибка при получении пользователя:", error);
            throw new Error("Ошибка доступа к базе данных. Пожалуйста, попробуйте позже.");
          });
          
          if (!user) {
            console.log(`Попытка входа с несуществующим email: ${credentials.email}`);
            throw new Error("Пользователь с таким email не найден");
          }

          const isPasswordValid = await compare(credentials.password, user.password).catch(error => {
            console.error("Ошибка при проверке пароля:", error);
            throw new Error("Ошибка проверки пароля. Пожалуйста, попробуйте позже.");
          });

          if (!isPasswordValid) {
            console.log(`Неверный пароль для пользователя: ${user.email}`);
            throw new Error("Неверный пароль");
          }

          console.log(`Успешная авторизация пользователя: ${user.email}`);
          
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role || 'user'
          };
        } catch (error: any) {
          console.error("Ошибка авторизации:", error);
          // Перебрасываем ошибку для отображения клиенту
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (token?.sub && session?.user) {
        session.user.id = token.sub;
        // Добавляем роль пользователя в сессию
        session.user.role = token.role || 'user';
        console.log("Сессия создана для пользователя:", session.user.email, "с ролью:", session.user.role);
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id;
        // Сохраняем роль пользователя в JWT
        token.role = user.role;
        console.log("JWT токен создан для пользователя ID:", user.id, "с ролью:", user.role);
      }
      return token;
    },
    // Добавляем обратный вызов для редиректов
    async redirect({ url, baseUrl }) {
      console.log("Перенаправление:", { url, baseUrl });
      // Гарантируем корректные редиректы
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
    newUser: "/register"
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Настройки для cookie сессии
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,  // Для разработки на HTTP устанавливаем false
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: false,
        maxAge: 60 * 5, // 5 минут
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: false,
        maxAge: 60 * 5, // 5 минут
      },
    },
  },
  useSecureCookies: false, // Отключаем secure cookies, так как используем HTTP
  // Настройка для предотвращения перенаправления cookie
  // @ts-ignore - trustHost доступен в новых версиях NextAuth но еще не добавлен в типы
  trustHost: true,
  // Повышаем уровень логирования
  debug: true,
  logger: {
    error(code, ...message) {
      console.error('[NextAuth Error]', code, message);
    },
    warn(code, ...message) {
      console.warn('[NextAuth Warning]', code, message);
    },
    debug(code, ...message) {
      console.log('[NextAuth Debug]', code, message);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 