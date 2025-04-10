import { NextRequest } from 'next/server';
import crypto from 'crypto';

// Константы для API ключей (в продакшене лучше хранить в .env)
// Примечание: Эти ключи должны быть заменены на надежные случайные строки
export const API_SECRET_KEY = 'lYQOi8n0DJdQx9TwF1A4JpTrvfbsUEP7'; // 32 символа (256 бит)
export const WEBHOOK_SECRET_KEY = 'VnYswOTnL5N2YAkQ1TnKwqhkH3FgXmxb'; // 32 символа (256 бит)

// Время допустимого расхождения между временем сервера и временем запроса (в секундах)
const TIMESTAMP_TOLERANCE = 300; // 5 минут

/**
 * Генерирует HMAC подпись для запроса
 */
export function generateSignature(payload: string, timestamp: number, key = API_SECRET_KEY): string {
  const data = `${timestamp}.${payload}`;
  return crypto
    .createHmac('sha256', key)
    .update(data)
    .digest('hex');
}

/**
 * Проверяет подлинность запроса
 */
export function verifyWebhookRequest(request: NextRequest): boolean {
  try {
    // Получаем заголовки запроса
    const apiSignature = request.headers.get('x-eternalcore-signature');
    const apiTimestamp = Number(request.headers.get('x-eternalcore-timestamp'));
    
    if (!apiSignature || !apiTimestamp) {
      console.error('Отсутствуют обязательные заголовки');
      return false;
    }
    
    // Проверяем, что временная метка не слишком старая или из будущего
    const currentTime = Math.floor(Date.now() / 1000);
    if (Math.abs(currentTime - apiTimestamp) > TIMESTAMP_TOLERANCE) {
      console.error('Временная метка недействительна');
      return false;
    }
    
    // Получаем тело запроса как строку
    const bodyText = request.url.split('?')[1] || '';
    
    // Генерируем подпись на основе тела запроса и проверяем
    const expectedSignature = generateSignature(bodyText, apiTimestamp, WEBHOOK_SECRET_KEY);
    
    if (apiSignature !== expectedSignature) {
      console.error('Подпись недействительна');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка проверки запроса:', error);
    return false;
  }
}

/**
 * Расшифровывает параметры запроса
 */
export function decodeRequestParams(request: NextRequest): Record<string, string> {
  const url = new URL(request.url);
  const params: Record<string, string> = {};
  
  for (const [key, value] of url.searchParams.entries()) {
    params[key] = value;
  }
  
  return params;
}

/**
 * Создает подписанный URL для запроса к API
 */
export function createSignedUrl(baseUrl: string, params: Record<string, string>): string {
  const timestamp = Math.floor(Date.now() / 1000);
  
  // Формируем query string из параметров
  const queryParams = new URLSearchParams(params).toString();
  
  // Генерируем подпись
  const signature = generateSignature(queryParams, timestamp);
  
  // Создаем итоговый URL
  return `${baseUrl}?${queryParams}`;
}

/**
 * Хедеры для добавления к запросу от Java плагина
 */
export function getAuthHeaders(payload: string): Record<string, string> {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = generateSignature(payload, timestamp, WEBHOOK_SECRET_KEY);
  
  return {
    'x-eternalcore-signature': signature,
    'x-eternalcore-timestamp': timestamp.toString(),
    'Content-Type': 'application/json'
  };
} 