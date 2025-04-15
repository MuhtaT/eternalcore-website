'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GamepadIcon, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Тип для props компонента
interface MinecraftLinkProps {
  onStatusChange?: (linked: boolean) => void;
}

export function MinecraftLink({ onStatusChange }: MinecraftLinkProps) {
  return (
    <Card className="border-[#EC39D9]/30">
      <CardHeader>
        <CardTitle className="flex items-center">
          <GamepadIcon className="h-5 w-5 mr-2 text-[#FB0D68]" />
          Minecraft аккаунт
        </CardTitle>
        <CardDescription>
          Привязка аккаунта Minecraft временно недоступна
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Функциональность на обслуживании</AlertTitle>
          <AlertDescription>
            Привязка аккаунта Minecraft временно недоступна из-за технических работ. Пожалуйста, попробуйте позже.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button disabled className="w-full bg-[#FB0D68]/50 text-white font-medium">
          Привязать аккаунт
        </Button>
      </CardFooter>
    </Card>
  );
} 