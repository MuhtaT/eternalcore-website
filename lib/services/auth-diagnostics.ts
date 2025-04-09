// Утилита для диагностики проблем авторизации

import { Session } from 'next-auth';

// Проверка целостности сессии
export function validateSession(session: Session | null) {
  if (!session) {
    console.error("Диагностика: Сессия отсутствует");
    return {
      valid: false,
      error: "Сессия отсутствует"
    };
  }

  if (!session.user) {
    console.error("Диагностика: Объект пользователя отсутствует в сессии");
    return {
      valid: false,
      error: "Объект пользователя отсутствует в сессии"
    };
  }

  if (!session.user.email) {
    console.error("Диагностика: Email пользователя отсутствует в сессии");
    return {
      valid: false,
      error: "Email пользователя отсутствует"
    };
  }

  console.log("Диагностика: Сессия валидна", {
    email: session.user.email,
    name: session.user.name,
    expires: session.expires
  });

  return {
    valid: true
  };
}

// Проверка куки сессии
export function checkSessionCookies() {
  if (typeof window === 'undefined') {
    return { checked: false, msg: "Функция доступна только на клиенте" };
  }

  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const sessionCookies = cookies.filter(cookie => cookie.startsWith('next-auth.session-token='));

  if (sessionCookies.length === 0) {
    console.error("Диагностика: Cookie сессии отсутствует");
    return {
      valid: false,
      error: "Cookie сессии отсутствует"
    };
  }

  console.log(`Диагностика: Найдено ${sessionCookies.length} cookies сессии`);
  return {
    valid: true,
    count: sessionCookies.length
  };
}

// Проверка состояния авторизации
export async function checkAuthState() {
  try {
    // Проверяем наличие cookie сессии
    const cookieStatus = checkSessionCookies();
    
    // Проверяем текущую сессию через fetch
    const response = await fetch('/api/auth/session');
    const sessionData = await response.json();
    
    return {
      cookieStatus,
      sessionData,
      valid: sessionData?.user != null
    };
  } catch (error) {
    console.error("Ошибка при проверке состояния авторизации:", error);
    return {
      error: "Ошибка при проверке авторизации",
      message: error instanceof Error ? error.message : "Неизвестная ошибка"
    };
  }
} 