'use client';

import { useEffect, useRef } from 'react';
import { useError } from '@/lib/contexts/error-context';
import { Toaster } from '@/components/ui/toaster';
import { AppError } from '@/lib/services/error-service';

interface ErrorDisplayProps {
  error?: AppError;
  success?: AppError;
}

export function ErrorDisplay({ error, success }: ErrorDisplayProps) {
  const { showError, showSuccess } = useError();
  const rootRef = useRef<HTMLDivElement>(null);

  // Если передана ошибка в пропсах, показываем её
  useEffect(() => {
    if (error) {
      showError(error);
    }
    if (success) {
      showSuccess(success);
    }
  }, [error, success, showError, showSuccess]);

  // Устанавливаем слушатель для глобальных ошибок
  useEffect(() => {
    const handleGlobalError = (event: CustomEvent<AppError>) => {
      if (event.detail) {
        showError(event.detail);
      }
    };

    const handleGlobalSuccess = (event: CustomEvent<AppError>) => {
      if (event.detail) {
        showSuccess(event.detail);
      }
    };

    const rootElement = rootRef.current;
    if (rootElement) {
      rootElement.addEventListener('showError', handleGlobalError as EventListener);
      rootElement.addEventListener('showSuccess', handleGlobalSuccess as EventListener);
      
      return () => {
        rootElement.removeEventListener('showError', handleGlobalError as EventListener);
        rootElement.removeEventListener('showSuccess', handleGlobalSuccess as EventListener);
      };
    }
  }, [showError, showSuccess]);

  // Возвращаем Toaster и div с ссылкой для обработки событий
  return (
    <div ref={rootRef} id="error-root">
      <Toaster />
    </div>
  );
}

// Глобальная функция для показа ошибок из любого места в приложении
export function showGlobalError(error: AppError) {
  const errorRoot = document.getElementById('error-root');
  if (errorRoot) {
    const event = new CustomEvent('showError', { detail: error });
    errorRoot.dispatchEvent(event);
  } else {
    console.error('Error root element not found. Make sure to add id="error-root" to ErrorDisplay component container.');
    console.error('Ошибка:', error.title, error.message);
    alert(`${error.title}: ${error.message}`);
  }
}

// Глобальная функция для показа успешных сообщений из любого места в приложении
export function showGlobalSuccess(success: AppError) {
  const errorRoot = document.getElementById('error-root');
  if (errorRoot) {
    const event = new CustomEvent('showSuccess', { detail: success });
    errorRoot.dispatchEvent(event);
  } else {
    console.error('Error root element not found. Make sure to add id="error-root" to ErrorDisplay component container.');
    console.log('Успех:', success.title, success.message);
    alert(`${success.title}: ${success.message}`);
  }
} 