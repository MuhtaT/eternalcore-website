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

/**
 * Этот эндпоинт тестирует API интеграцию с сервером Minecraft
 * Он вызывает тестовый эндпоинт, проверяет подпись и возвращает результат
 */
export async function GET() {
  try {
    const timestamp = Date.now().toString();
    const signature = createSignature(timestamp, process.env.MINECRAFT_API_SECRET || '');
    
    // URL тестового эндпоинта
    // В реальной среде используйте process.env.MINECRAFT_SERVER_URL
    const testUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/minecraft/test`;
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'X-Timestamp': timestamp,
        'X-Signature': signature,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Test endpoint returned error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Проверяем подпись ответа
    const serverSignature = response.headers.get('X-Signature') || '';
    const serverTimestamp = response.headers.get('X-Timestamp') || '';
    
    const signatureValid = serverSignature && serverTimestamp 
      ? verifySignature(serverSignature, serverTimestamp, process.env.MINECRAFT_API_SECRET || '')
      : false;
    
    return NextResponse.json({
      data,
      test_result: {
        success: true,
        signatureValid,
        timestamp: serverTimestamp,
        signature: serverSignature ? '✓ Present' : '✗ Missing',
      }
    });
    
  } catch (error) {
    console.error('Error in test client:', error);
    return NextResponse.json({ 
      test_result: {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
} 