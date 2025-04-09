'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AppError } from '@/lib/services/error-service';
import { useToast } from '@/components/ui/use-toast';

interface ErrorContextProps {
  error: AppError | null;
  setError: (error: AppError | null) => void;
  showError: (error: AppError) => void;
  showSuccess: (success: AppError) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextProps | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<AppError | null>(null);
  const { toast } = useToast();

  // Функция для отображения ошибки через тост
  const showError = (error: AppError) => {
    console.log("Отображение ошибки для пользователя:", error);
    setError(error);
    
    // Используем разные классы стилей для разных типов ошибок
    const toastClassName = "border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-900";
    
    toast({
      title: error.title,
      description: error.message,
      variant: 'destructive',
      duration: 5000, // Показываем сообщение дольше для лучшей видимости
      className: toastClassName
    });
  };

  // Функция для отображения успешных сообщений
  const showSuccess = (success: AppError) => {
    console.log("Отображение успешного сообщения:", success);
    
    // Стили для успешных сообщений
    const toastClassName = "border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-900";
    
    toast({
      title: success.title,
      description: success.message,
      variant: 'default',
      duration: 3000,
      className: toastClassName
    });
  };

  // Функция для очистки текущей ошибки
  const clearError = () => {
    setError(null);
  };

  // Глобальный обработчик ошибок для перехвата непредвиденных ошибок
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error("Глобальная ошибка:", event.error);
      showError({
        type: 'general',
        title: 'Непредвиденная ошибка',
        message: event.message || 'Произошла ошибка в приложении. Пожалуйста, обновите страницу.',
        variant: 'destructive'
      });
    };

    // Регистрируем глобальный обработчик ошибок
    window.addEventListener('error', handleGlobalError);
    
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  return (
    <ErrorContext.Provider value={{ error, setError, showError, showSuccess, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}

// Хук для использования контекста ошибок
export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
} 