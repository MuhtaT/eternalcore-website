import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Функция для создания HMAC подписи для запросов
function createSignature(timestamp: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(timestamp);
  return hmac.digest('hex');
}

export async function GET() {
  try {
    // Создаем тестовые данные для ответа
    const timestamp = Date.now().toString();
    const signature = createSignature(timestamp, process.env.MINECRAFT_API_SECRET || '');
    
    // Имитируем ответ сервера
    const responseData = {
      online: Math.floor(Math.random() * 100), // Случайное число игроков для тестирования
      server_name: "EternalCore",
      server_version: "1.16.5",
      test: true // Маркер, что это тестовый ответ
    };
    
    // Добавляем заголовки безопасности
    const headers = new Headers();
    headers.set('X-Timestamp', timestamp);
    headers.set('X-Signature', signature);
    
    return NextResponse.json(responseData, { 
      status: 200,
      headers: headers
    });
    
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
} 