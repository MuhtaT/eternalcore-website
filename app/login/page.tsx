'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useError } from '@/lib/contexts/error-context';
import { handleAuthError, handleConnectionError } from '@/lib/services/error-service';
import { checkAuthState } from '@/lib/services/auth-diagnostics';

export default function LoginPage() {
  const router = useRouter();
  const { showError, showSuccess } = useError();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      console.log("Результат входа:", result);

      if (result?.error) {
        showError({
          type: 'auth',
          title: "Ошибка входа",
          message: result.error,
          variant: 'destructive'
        });
        setIsLoading(false);
      } else if (result?.ok) {
        showSuccess({
          type: 'success',
          title: "Успешный вход",
          message: "Вы успешно вошли в систему. Перенаправляем в личный кабинет.",
          variant: "default"
        });
        
        try {
          const authState = await checkAuthState();
          console.log("Диагностика авторизации:", authState);
          
          if (!authState.valid) {
            console.error("Проблема с авторизацией после входа:", authState);
            showError({
              type: 'auth',
              title: "Проблема с авторизацией",
              message: "Возникла проблема с авторизацией. Пожалуйста, попробуйте еще раз.",
              variant: 'destructive'
            });
            setIsLoading(false);
            return;
          }
        } catch (diagError) {
          console.error("Ошибка при диагностике авторизации:", diagError);
        }
        
        setTimeout(() => {
          router.push('/profile');
        }, 1500);
      } else {
        showError({
          type: 'auth', 
          title: "Ошибка входа",
          message: "Произошла неизвестная ошибка при входе в систему.",
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      showError(handleConnectionError(error));
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
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-transparent bg-clip-text">Добро пожаловать</CardTitle>
          <CardDescription className="text-center">
            Введите ваш email и пароль для входа
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Пароль</Label>
                  <Link 
                    href="#" 
                    className="text-sm text-muted-foreground hover:text-[#FB0D68] transition"
                  >
                    Забыли пароль?
                  </Link>
                </div>
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
              <Button 
                type="submit" 
                className="w-full bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white"
                disabled={isLoading}
              >
                <User className="mr-2 h-4 w-4" /> 
                {isLoading ? "Выполняется вход..." : "Войти в аккаунт"}
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
            <Link href="/register">Создать новый аккаунт</Link>
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