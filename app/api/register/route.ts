import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { createUser, getUserByEmail } from '@/lib/db/database';
import { z } from 'zod';

// Валидация данных запроса
const registerSchema = z.object({
  name: z.string().min(3, 'Имя должно содержать не менее 3 символов')
    .max(50, 'Имя не должно превышать 50 символов')
    .refine(name => /^[а-яА-Яa-zA-Z0-9_\-\s]+$/.test(name), 
      'Имя может содержать только буквы, цифры, пробелы, дефисы и нижние подчеркивания'),
  email: z.string().email('Некорректный формат email')
    .min(5, 'Email слишком короткий')
    .max(100, 'Email не должен превышать 100 символов'),
  password: z.string().min(6, 'Пароль должен содержать не менее 6 символов')
    .max(100, 'Пароль не должен превышать 100 символов')
    .refine(
      password => /[A-Za-z]/.test(password) && /[0-9]/.test(password),
      'Пароль должен содержать как минимум одну букву и одну цифру'
    ),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

export async function POST(request: NextRequest) {
  try {
    // Получаем данные из формы
    const formData = await request.formData();
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    // Валидируем данные
    const validationResult = registerSchema.safeParse(data);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      
      // Формируем понятное сообщение об ошибке для пользователя
      let errorMessage = 'Ошибка валидации: ';
      
      // Проверяем безопасным способом на наличие ошибок
      const nameErrors = formattedErrors.name?._errors;
      const emailErrors = formattedErrors.email?._errors;
      const passwordErrors = formattedErrors.password?._errors;
      const confirmPasswordErrors = formattedErrors.confirmPassword?._errors;
      
      if (nameErrors && nameErrors.length > 0) {
        errorMessage = nameErrors[0];
      } else if (emailErrors && emailErrors.length > 0) {
        errorMessage = emailErrors[0];
      } else if (passwordErrors && passwordErrors.length > 0) {
        errorMessage = passwordErrors[0];
      } else if (confirmPasswordErrors && confirmPasswordErrors.length > 0) {
        errorMessage = confirmPasswordErrors[0];
      }
      
      return NextResponse.json(
        { error: errorMessage }, 
        { status: 400 }
      );
    }

    // Проверяем, существует ли пользователь с таким email
    try {
      const existingUser = await getUserByEmail(data.email);
      if (existingUser) {
        return NextResponse.json(
          { error: 'Пользователь с таким email уже существует' }, 
          { status: 409 }
        );
      }
    } catch (dbError: any) {
      console.error('Ошибка проверки существующего пользователя:', dbError);
      return NextResponse.json(
        { error: 'Ошибка доступа к базе данных. Пожалуйста, попробуйте позже.' }, 
        { status: 500 }
      );
    }

    // Хешируем пароль
    let hashedPassword;
    try {
      hashedPassword = await hash(data.password, 12);
    } catch (hashError: any) {
      console.error('Ошибка хеширования пароля:', hashError);
      return NextResponse.json(
        { error: 'Ошибка при обработке пароля. Пожалуйста, попробуйте позже.' }, 
        { status: 500 }
      );
    }

    // Создаем пользователя
    try {
      await createUser({
        name: data.name,
        email: data.email,
        password: hashedPassword,
      });
    } catch (createError: any) {
      console.error('Ошибка создания пользователя:', createError);
      
      // Проверка на дубликаты (если произошла гонка условий)
      if (createError.message && createError.message.includes('Duplicate entry')) {
        return NextResponse.json(
          { error: 'Пользователь с таким email уже существует' }, 
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: 'Не удалось создать пользователя. Пожалуйста, попробуйте позже.' }, 
        { status: 500 }
      );
    }

    // Успешная регистрация
    return NextResponse.json(
      { success: true, message: 'Регистрация успешно завершена' },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('Ошибка регистрации:', error);
    return NextResponse.json(
      { error: 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.' }, 
      { status: 500 }
    );
  }
} 