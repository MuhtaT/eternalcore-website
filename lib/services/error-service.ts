// Определяем типы ошибок
export type ErrorType = 'auth' | 'validation' | 'connection' | 'database' | 'general' | 'success';

// Интерфейс для ошибки
export interface AppError {
  type: ErrorType;
  title: string;
  message: string;
  status?: number;
  variant?: 'default' | 'destructive';
}

// Функция для обработки ошибок авторизации
export function handleAuthError(error: any): AppError {
  console.error('Ошибка авторизации:', error);
  
  // Карта соответствия ошибок NextAuth понятным пользовательским сообщениям
  const errorMessages: Record<string, string> = {
    "Требуются email и пароль для входа": "Пожалуйста, введите email и пароль для входа",
    "Пользователь с таким email не найден": "Пользователь с таким email не найден. Проверьте правильность ввода или зарегистрируйтесь.",
    "Неверный пароль": "Неверный пароль. Пожалуйста, проверьте правильность ввода.",
    "Ошибка доступа к базе данных": "Ошибка доступа к базе данных. Пожалуйста, попробуйте позже."
  };
  
  // Если это строка ошибки от nextauth
  if (typeof error === 'string') {
    // Если ошибка есть в нашем словаре - используем понятное описание
    const friendlyMessage = errorMessages[error] || error;
    
    return {
      type: 'auth',
      title: 'Ошибка входа',
      message: friendlyMessage,
      variant: 'destructive'
    };
  }
  
  // Для других типов ошибок
  return {
    type: 'auth',
    title: 'Ошибка входа',
    message: error?.message || 'Произошла ошибка при входе. Пожалуйста, попробуйте позже.',
    variant: 'destructive'
  };
}

// Функция для обработки ошибок валидации
export function handleValidationError(error: any): AppError {
  console.error('Ошибка валидации:', error);
  
  return {
    type: 'validation',
    title: 'Ошибка валидации',
    message: error?.message || 'Пожалуйста, проверьте введенные данные.',
    variant: 'destructive'
  };
}

// Функция для обработки ошибок соединения
export function handleConnectionError(error: any): AppError {
  console.error('Ошибка соединения:', error);
  
  return {
    type: 'connection',
    title: 'Ошибка соединения',
    message: 'Не удалось подключиться к серверу. Пожалуйста, проверьте подключение к интернету и попробуйте снова.',
    variant: 'destructive'
  };
}

// Функция для обработки ошибок базы данных
export function handleDatabaseError(error: any): AppError {
  console.error('Ошибка базы данных:', error);
  
  return {
    type: 'database',
    title: 'Ошибка базы данных',
    message: 'Произошла ошибка при обращении к базе данных. Пожалуйста, попробуйте позже.',
    variant: 'destructive'
  };
}

// Функция для обработки ошибок регистрации
export function handleRegistrationError(error: any, status?: number): AppError {
  console.error('Ошибка регистрации:', error);
  
  if (status === 409) {
    return {
      type: 'validation',
      title: 'Ошибка регистрации',
      message: 'Пользователь с таким email уже существует. Пожалуйста, используйте другой email или восстановите пароль.',
      status,
      variant: 'destructive'
    };
  }
  
  return {
    type: 'general',
    title: 'Ошибка регистрации',
    message: error?.message || error?.error || 'Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.',
    status,
    variant: 'destructive'
  };
}

// Функция для успешных уведомлений
export function handleSuccess(message: string, title: string = 'Успешно'): AppError {
  return {
    type: 'success',
    title: title,
    message: message,
    variant: 'default'
  };
}

// Общая функция для обработки ошибок
export function handleError(error: any): AppError {
  console.error('Произошла ошибка:', error);
  
  if (typeof error === 'string') {
    return {
      type: 'general',
      title: 'Ошибка',
      message: error,
      variant: 'destructive'
    };
  }
  
  return {
    type: 'general',
    title: 'Ошибка',
    message: error?.message || 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.',
    variant: 'destructive'
  };
} 