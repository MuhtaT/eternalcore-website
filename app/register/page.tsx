'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { useError } from '@/lib/contexts/error-context';
import { 
  handleValidationError, 
  handleConnectionError, 
  handleRegistrationError 
} from '@/lib/services/error-service';

export default function RegisterPage() {
  const router = useRouter();
  const { showError, showSuccess } = useError();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Клиентская валидация
    if (formData.password !== formData.confirmPassword) {
      showError(handleValidationError({
        message: "Пароли не совпадают. Пожалуйста, проверьте ввод."
      }));
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      showError(handleValidationError({
        message: "Пароль должен содержать не менее 6 символов."
      }));
      setIsLoading(false);
      return;
    }

    if (formData.name.length < 3) {
      showError(handleValidationError({
        message: "Имя должно содержать не менее 3 символов."
      }));
      setIsLoading(false);
      return;
    }

    // Отправка формы на сервер
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: new FormData(e.target as HTMLFormElement)
      });

      const data = await response.json();
      console.log("Результат регистрации:", data, response.status);

      if (response.ok) {
        // Успешная регистрация
        showSuccess({
          type: 'success',
          title: "Регистрация успешна!",
          message: "Аккаунт успешно создан. Перенаправляем на страницу входа.",
          variant: "default"
        });
        
        // Перенаправляем на страницу входа
        setTimeout(() => router.push('/login'), 1500);
      } else {
        // Обрабатываем ошибку регистрации
        showError(handleRegistrationError(data, response.status));
      }
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      showError(handleConnectionError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-r from-[#DF2456]/40 to-[#FB0D68]/40 blur-3xl" />
      </div>
      
      <Card className="w-full max-w-md border border-[#DF2456]/30 shadow-lg shadow-[#FB0D68]/10">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Link href="/" className="flex items-center space-x-1">
              <Image
                src="https://i.imgur.com/n1TNSBq.png"
                alt="EternalCore Logo"
                width={35}
                height={35}
              />
              <span className="font-bold text-xl bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-transparent bg-clip-text ml-0.5">EternalCore</span>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-transparent bg-clip-text">Создать аккаунт</CardTitle>
          <CardDescription className="text-center">
            Зарегистрируйтесь для доступа к серверу
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя пользователя</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="MinecraftPlayer" 
                  required 
                  className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  placeholder="example@mail.com" 
                  required 
                  type="email" 
                  className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input 
                  id="password" 
                  name="password" 
                  required 
                  type="password" 
                  className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  required 
                  type="password" 
                  className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white"
                disabled={isLoading}
              >
                <UserPlus className="mr-2 h-4 w-4" /> 
                {isLoading ? "Создание аккаунта..." : "Создать аккаунт"}
              </Button>
            </div>
          </form>
          
          <div className="flex items-center space-x-2 py-2">
            <Separator className="flex-1 bg-[#DF2456]/20" />
            <span className="text-xs text-muted-foreground">ИЛИ</span>
            <Separator className="flex-1 bg-[#DF2456]/20" />
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-[#DF2456]/30 hover:bg-[#DF2456]/10"
            asChild
          >
            <Link href="/login">У меня уже есть аккаунт</Link>
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-[#FB0D68] transition"
          >
            Вернуться на главную
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 