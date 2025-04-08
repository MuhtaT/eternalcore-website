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

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            image: user.image
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
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id;
      }
      return token;
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
  debug: process.env.NODE_ENV === "development", // Включаем дебаг в режиме разработки
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 