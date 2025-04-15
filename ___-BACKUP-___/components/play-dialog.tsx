'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/copy-button";
import { Download, Gamepad2 } from "lucide-react";

interface PlayDialogProps {
  variant?: 'play' | 'download';
  children?: React.ReactNode;
}

export function PlayDialog({ variant = 'play', children }: PlayDialogProps) {
  const serverIP = "play.eternalcore.ru";
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button 
            className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white font-medium"
          >
            {variant === 'play' ? (
              <>
                <Gamepad2 className="mr-2 h-4 w-4" /> Играть сейчас
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Скачать лаунчер
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border border-[#DF2456]/30 shadow-lg shadow-[#FB0D68]/5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-transparent bg-clip-text">
            {variant === 'play' ? 'Начать игру на EternalCore' : 'Скачать лаунчер EternalCore'}
          </DialogTitle>
          <DialogDescription>
            {variant === 'play' 
              ? 'Присоединяйтесь к серверу прямо сейчас и начните свое приключение!'
              : 'Скачайте наш лаунчер для комфортной игры на сервере EternalCore'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {variant === 'play' ? (
            <>
              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="text-sm mb-2">IP-адрес сервера:</div>
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <Input 
                      readOnly 
                      value={serverIP} 
                      className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68] bg-transparent pr-10"
                      onClick={(e) => {
                        const input = e.target as HTMLInputElement;
                        input.select();
                        navigator.clipboard.writeText(serverIP);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CopyButton 
                        value={serverIP} 
                        iconOnly 
                        className="text-[#DF2456] hover:text-[#FB0D68] transition-colors" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Как подключиться:</h4>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                  <li>Откройте Minecraft версии 1.16.5</li>
                  <li>Выберите "Мультиплеер"</li>
                  <li>Нажмите "Добавить сервер"</li>
                  <li>Введите IP-адрес сервера из поля выше</li>
                  <li>Подключитесь и начните игру!</li>
                </ol>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-lg border p-4 bg-muted/50">
                <h4 className="font-medium text-sm mb-2">Преимущества нашего лаунчера:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Автоматическая установка всех необходимых модов</li>
                  <li>Оптимизированные настройки для лучшей производительности</li>
                  <li>Быстрое подключение к серверу в один клик</li>
                  <li>Автоматические обновления</li>
                </ul>
              </div>
            </>
          )}
        </div>
        <DialogFooter className="flex justify-end">
          <Button 
            type="button" 
            className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white font-medium"
            asChild
          >
            {variant === 'play' ? (
              <a href={`minecraft://${serverIP}`}>Подключиться прямо сейчас</a>
            ) : (
              <a href="/files/EternalCoreLauncher.exe" download>Скачать для Windows</a>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 