import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Функция для создания HMAC подписи для запросов
function createSignature(timestamp: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(timestamp);
  return hmac.digest('hex');
}

// Функция для проверки ответа от сервера Minecraft
function verifySignature(signature: string, timestamp: string, secret: string): boolean {
  const expectedSignature = createSignature(timestamp, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Тайм-аут для запроса (5 секунд)
const TIMEOUT_MS = 5000;

// Кэширование данных на 30 секунд
let cachedOnlineCount: number | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 30 * 1000; // 30 секунд

export async function GET() {
  try {
    const now = Date.now();
    
    // Возвращаем кэшированные данные, если они актуальны
    if (cachedOnlineCount !== null && now - lastFetchTime < CACHE_TTL) {
      return NextResponse.json({ 
        online: cachedOnlineCount,
        cached: true
      });
    }
    
    const timestamp = now.toString();
    const signature = createSignature(timestamp, process.env.MINECRAFT_API_SECRET || '');
    
    // Создаем URL для запроса к серверу Minecraft
    const serverUrl = `${process.env.MINECRAFT_SERVER_URL}/online`;
    
    // Добавляем AbortController для возможности отмены запроса по тайм-ауту
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers: {
        'X-Timestamp': timestamp,
        'X-Signature': signature,
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Minecraft server returned error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Проверяем подпись ответа от сервера
    const serverSignature = response.headers.get('X-Signature') || '';
    const serverTimestamp = response.headers.get('X-Timestamp') || '';
    
    if (!serverSignature || !serverTimestamp || 
        !verifySignature(serverSignature, serverTimestamp, process.env.MINECRAFT_API_SECRET || '')) {
      throw new Error('Invalid signature from Minecraft server');
    }
    
    // Сохраняем данные в кэше
    cachedOnlineCount = data.online;
    lastFetchTime = now;
    
    return NextResponse.json({ 
      online: data.online,
      cached: false
    });
    
  } catch (error) {
    console.error('Error fetching online players:', error);
    
    // Если у нас есть кэшированные данные, возвращаем их даже если они устарели
    if (cachedOnlineCount !== null) {
      return NextResponse.json({ 
        online: cachedOnlineCount,
        cached: true,
        error: 'Using cached data due to error'
      });
    }
    
    // Если всё совсем плохо - возвращаем фолбэк значение
    return NextResponse.json({ 
      online: 0, 
      error: 'Error fetching online players',
      cached: false
    }, { status: 200 }); // 200 OK, чтобы не ломать фронтенд
  }
} 