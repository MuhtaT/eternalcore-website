'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  UserCog, 
  ChevronDown, 
  Search, 
  UserPlus, 
  Shield, 
  User as UserIcon,
  UserX,
  RefreshCw, 
  Home,
  Upload,
  XCircle,
  CheckCircle,
  AlertCircle,
  Eye,
  RotateCcw,
  ArrowUpRight,
  ChartBar,
  Ban,
  Settings,
  Database,
  Server,
  HardDrive,
  Network,
  Mail,
  Download,
  Gift,
  Pencil,
  Trash2
} from 'lucide-react';
import { useError } from '@/lib/contexts/error-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationEllipsis, PaginationLink } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';

interface AdminPanelProps {
  users: User[];
}

// Компонент формы для редактирования/создания донат-пакета
function DonatePackageForm({ 
  initialData = null, 
  onSubmit, 
  onCancel 
}: { 
  initialData?: any, 
  onSubmit: (data: any) => void, 
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: initialData?.price || '',
    description: initialData?.description || '',
    status: initialData?.status || 'normal',
    group: initialData?.group || '',
    features: initialData?.features ? 
      (typeof initialData.features === 'string' ? initialData.features : JSON.stringify(initialData.features)) : 
      JSON.stringify(["Базовая привилегия"]),
    command: initialData?.command || ''
  });
  
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация данных
    if (!formData.name || !formData.price || !formData.description || !formData.group || !formData.command) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    // Проверка валидности JSON для features
    try {
      JSON.parse(formData.features);
    } catch (e) {
      setError('Неверный формат JSON для списка возможностей');
      return;
    }
    
    // Проверка на числовое значение цены
    if (isNaN(Number(formData.price))) {
      setError('Цена должна быть числом');
      return;
    }
    
    // Передаем данные родительскому компоненту
    onSubmit({
      ...formData,
      price: Number(formData.price),
      features: formData.features // Это уже строка JSON, не нужно преобразовывать
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Название пакета*</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="VIP" 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Цена*</Label>
          <Input 
            id="price" 
            name="price" 
            value={formData.price} 
            onChange={handleChange} 
            placeholder="299" 
            type="number" 
            min="0" 
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Описание пакета*</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          placeholder="Стартовый пакет привилегий..." 
          required 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Статус пакета</Label>
          <Select 
            name="status" 
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Обычный</SelectItem>
              <SelectItem value="recommended">Рекомендуемый</SelectItem>
              <SelectItem value="popular">Популярный</SelectItem>
              <SelectItem value="maximum">Максимальный</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="group">Группа пермишенов*</Label>
          <Input 
            id="group" 
            name="group" 
            value={formData.group} 
            onChange={handleChange} 
            placeholder="vip" 
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="features">Список возможностей (JSON массив)*</Label>
        <Textarea 
          id="features" 
          name="features" 
          value={formData.features} 
          onChange={handleChange} 
          placeholder='["Доступ к VIP серверам", "Префикс [VIP]", "Двойной опыт"]' 
          required 
        />
        <p className="text-xs text-muted-foreground">
          Введите список возможностей в формате JSON массива. Например: ["Доступ к VIP серверам", "Префикс [VIP]"]
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="command">Команда выдачи привилегии*</Label>
        <Input 
          id="command" 
          name="command" 
          value={formData.command} 
          onChange={handleChange} 
          placeholder="lp user {player} parent set vip" 
          required 
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Отмена</Button>
        <Button type="submit" className="bg-[#FB0D68] hover:bg-[#FB0D68]/90">
          {initialData ? 'Сохранить изменения' : 'Создать пакет'}
        </Button>
      </div>
    </form>
  );
}

// Компонент формы для редактирования/создания привилегии
function PrivilegeForm({ 
  initialData = null, 
  onSubmit, 
  onCancel 
}: { 
  initialData?: any, 
  onSubmit: (data: any) => void, 
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'permission',
    description: initialData?.description || '',
    permission: initialData?.permission || '',
    command: initialData?.command || '',
    price: initialData?.price || '',
    icon: initialData?.icon || ''
  });
  
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация данных
    if (!formData.name || !formData.description || !formData.permission || !formData.command) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    // Передаем данные родительскому компоненту
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Название привилегии*</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="Доступ к телепортации" 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Тип привилегии</Label>
        <Select 
          name="type" 
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите тип" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="permission">Разрешение</SelectItem>
            <SelectItem value="command">Команда</SelectItem>
            <SelectItem value="feature">Функция</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Описание привилегии*</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          placeholder="Позволяет телепортироваться к другим игрокам..." 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="permission">Разрешение (permission)*</Label>
        <Input 
          id="permission" 
          name="permission" 
          value={formData.permission} 
          onChange={handleChange} 
          placeholder="essentials.tp" 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="command">Команда выдачи привилегии*</Label>
        <Input 
          id="command" 
          name="command" 
          value={formData.command} 
          onChange={handleChange} 
          placeholder="lp user {player} permission set essentials.tp true" 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Цена (₽)*</Label>
        <Input 
          id="price" 
          name="price" 
          type="number"
          step="0.01"
          min="0"
          value={formData.price} 
          onChange={handleChange} 
          placeholder="100" 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="icon">Иконка</Label>
        <Select 
          name="icon" 
          value={formData.icon}
          onValueChange={(value) => setFormData({ ...formData, icon: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите иконку" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">По умолчанию (от типа)</SelectItem>
            <SelectItem value="shield">Щит</SelectItem>
            <SelectItem value="command">Терминал</SelectItem>
            <SelectItem value="zap">Молния</SelectItem>
            <SelectItem value="gift">Подарок</SelectItem>
            <SelectItem value="rocket">Ракета</SelectItem>
            <SelectItem value="key">Ключ</SelectItem>
            <SelectItem value="crown">Корона</SelectItem>
            <SelectItem value="star">Звезда</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Отмена</Button>
        <Button type="submit" className="bg-[#FB0D68] hover:bg-[#FB0D68]/90">
          {initialData ? 'Сохранить изменения' : 'Создать привилегию'}
        </Button>
      </div>
    </form>
  );
}

export function AdminPanel({ users: initialUsers }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [addViolatorOpen, setAddViolatorOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [punishmentFilter, setPunishmentFilter] = useState('all');
  const [anticheatFilter, setAnticheatFilter] = useState('all');
  const { showError, showSuccess } = useError();
  // Добавляем новые состояния для управления донат-пакетами и привилегиями
  const [showDonatePackageDialog, setShowDonatePackageDialog] = useState(false);
  const [showPrivilegeDialog, setShowPrivilegeDialog] = useState(false);
  const [donatePackages, setDonatePackages] = useState<any[]>([]);
  const [privileges, setPrivileges] = useState<any[]>([]);
  const [currentPackage, setCurrentPackage] = useState<any>(null);
  const [currentPrivilege, setCurrentPrivilege] = useState<any>(null);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [isLoadingPrivileges, setIsLoadingPrivileges] = useState(false);

  // Отфильтрованные пользователи на основе поискового запроса
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Обновление роли пользователя
  const updateUserRole = async (userId: number, newRole: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/admin/users/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось обновить роль пользователя');
      }

      // Обновляем локальное состояние
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      showSuccess({
        type: 'success',
        title: 'Роль обновлена',
        message: `Роль пользователя успешно изменена на ${newRole}`,
        variant: 'default'
      });
    } catch (error: any) {
      showError({
        type: 'general',
        title: 'Ошибка обновления',
        message: error.message || 'Произошла ошибка при обновлении роли пользователя',
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Обработчик для формы добавления нарушителя (заглушка)
  const handleAddViolator = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess({
      type: 'success',
      title: 'Отчет отправлен',
      message: 'Отчет о нарушителе был успешно добавлен в систему.',
      variant: 'default'
    });
    setAddViolatorOpen(false);
  };

  // Открыть профиль пользователя
  const openUserProfile = (user: User) => {
    setSelectedUser(user);
    setUserProfileOpen(true);
  };

  // Мокирование действий для наказаний
  const handlePunishmentAction = (id: number, action: 'remove' | 'extend' | 'reduce') => {
    let message = '';
    switch (action) {
      case 'remove':
        message = 'Наказание успешно отменено';
        break;
      case 'extend':
        message = 'Срок наказания продлен';
        break;
      case 'reduce':
        message = 'Срок наказания сокращен';
        break;
    }
    
    showSuccess({
      type: 'success',
      title: 'Действие выполнено',
      message,
      variant: 'default'
    });
  };

  // Мокирование действий для античита
  const handleAnticheatAction = (id: number, action: 'ban' | 'warn' | 'ignore') => {
    let message = '';
    switch (action) {
      case 'ban':
        message = 'Игрок успешно забанен за использование читов';
        break;
      case 'warn':
        message = 'Игроку выдано предупреждение';
        break;
      case 'ignore':
        message = 'Срабатывание античита помечено как ложное';
        break;
    }
    
    showSuccess({
      type: 'success',
      title: 'Действие выполнено',
      message,
      variant: 'default'
    });
  };

  // Мокирование запроса статистики персонала
  const handleStaffStatsRequest = (period: 'week' | 'month' | 'all') => {
    showSuccess({
      type: 'success',
      title: 'Статистика обновлена',
      message: `Загружена статистика за период: ${period === 'week' ? 'неделя' : period === 'month' ? 'месяц' : 'все время'}`,
      variant: 'default'
    });
  };

  // Загрузка донат-пакетов и привилегий при монтировании компонента
  useEffect(() => {
    fetchDonatePackages();
    fetchPrivileges();
  }, []);

  // Загрузка донат-пакетов из API
  const fetchDonatePackages = async () => {
    setIsLoadingPackages(true);
    try {
      const response = await fetch('/api/donate/packages');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке донат-пакетов');
      }
      const data = await response.json();
      setDonatePackages(data);
    } catch (error: any) {
      showError({
        type: 'general',
        title: 'Ошибка загрузки',
        message: error.message || 'Не удалось загрузить донат-пакеты',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingPackages(false);
    }
  };

  // Загрузка привилегий из API
  const fetchPrivileges = async () => {
    setIsLoadingPrivileges(true);
    try {
      const response = await fetch('/api/donate/privileges');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке привилегий');
      }
      const data = await response.json();
      setPrivileges(data);
    } catch (error: any) {
      showError({
        type: 'general',
        title: 'Ошибка загрузки',
        message: error.message || 'Не удалось загрузить привилегии',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingPrivileges(false);
    }
  };

  // Добавление нового донат-пакета через API
  const addDonatePackage = async (packageData: any) => {
    try {
      const response = await fetch('/api/donate/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось создать донат-пакет');
      }
      
      const newPackage = await response.json();
      setDonatePackages([...donatePackages, newPackage]);
      
      showSuccess({
        type: 'success',
        title: 'Пакет создан',
        message: `Донат-пакет "${newPackage.name}" успешно создан`,
        variant: 'default'
      });
      
      return true;
    } catch (error: any) {
      showError({
        type: 'general',
        title: 'Ошибка создания',
        message: error.message || 'Не удалось создать донат-пакет',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Обновление донат-пакета через API
  const updateDonatePackage = async (id: number, packageData: any) => {
    try {
      // Проверка и преобразование features, чтобы избежать ошибки s.join is not a function
      let features = packageData.features;
      if (features !== undefined) {
        // Убедимся, что features - это строка JSON
        if (typeof features !== 'string') {
          features = JSON.stringify(features);
        } else {
          try {
            // Проверяем, что это валидный JSON
            JSON.parse(features);
          } catch (e) {
            // Если не валидный JSON, делаем массив и преобразуем в строку
            features = JSON.stringify(["Базовая привилегия"]);
          }
        }
      }

      const updatedData = {
        ...packageData,
        features
      };

      const response = await fetch('/api/donate/packages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updatedData }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось обновить донат-пакет');
      }
      
      // Обновляем локальное состояние
      setDonatePackages(donatePackages.map(pkg => 
        pkg.id === id ? { ...pkg, ...updatedData } : pkg
      ));
      
      showSuccess({
        type: 'success',
        title: 'Пакет обновлен',
        message: `Донат-пакет "${packageData.name}" успешно обновлен`,
        variant: 'default'
      });
      
      return true;
    } catch (error: any) {
      showError({
        type: 'general',
        title: 'Ошибка обновления',
        message: error.message || 'Не удалось обновить донат-пакет',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Удаление донат-пакета через API
  const deleteDonatePackage = async (id: number) => {
    try {
      const response = await fetch(`/api/donate/packages?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось удалить донат-пакет');
      }
      
      // Обновляем локальное состояние
      setDonatePackages(donatePackages.filter(pkg => pkg.id !== id));
      
      showSuccess({
        type: 'success',
        title: 'Пакет удален',
        message: 'Донат-пакет успешно удален',
        variant: 'default'
      });
      
      return true;
    } catch (error: any) {
      showError({
        type: 'general',
        title: 'Ошибка удаления',
        message: error.message || 'Не удалось удалить донат-пакет',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Добавление новой привилегии через API
  const addPrivilegeItem = async (privilegeData: any) => {
    try {
      const response = await fetch('/api/donate/privileges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(privilegeData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось создать привилегию');
      }
      
      const newPrivilege = await response.json();
      setPrivileges([...privileges, newPrivilege]);
      
      showSuccess({
        type: 'success',
        title: 'Привилегия создана',
        message: `Привилегия "${newPrivilege.name}" успешно создана`,
        variant: 'default'
      });
      
      return true;
    } catch (error: any) {
      showError({
        type: 'general',
        title: 'Ошибка создания',
        message: error.message || 'Не удалось создать привилегию',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Обновление привилегии через API
  const updatePrivilegeItem = async (id: number, privilegeData: any) => {
    try {
      const response = await fetch('/api/donate/privileges', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...privilegeData }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось обновить привилегию');
      }
      
      // Обновляем локальное состояние
      setPrivileges(privileges.map(priv => 
        priv.id === id ? { ...priv, ...privilegeData } : priv
      ));
      
      showSuccess({
        type: 'success',
        title: 'Привилегия обновлена',
        message: `Привилегия "${privilegeData.name}" успешно обновлена`,
        variant: 'default'
      });
      
      return true;
    } catch (error: any) {
      showError({
        type: 'general',
        title: 'Ошибка обновления',
        message: error.message || 'Не удалось обновить привилегию',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Удаление привилегии через API
  const deletePrivilegeItem = async (id: number) => {
    try {
      const response = await fetch(`/api/donate/privileges?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось удалить привилегию');
      }
      
      // Обновляем локальное состояние
      setPrivileges(privileges.filter(priv => priv.id !== id));
      
      showSuccess({
        type: 'success',
        title: 'Привилегия удалена',
        message: 'Привилегия успешно удалена',
        variant: 'default'
      });
      
      return true;
    } catch (error: any) {
      showError({
        type: 'general',
        title: 'Ошибка удаления',
        message: error.message || 'Не удалось удалить привилегию',
        variant: 'destructive'
      });
      return false;
    }
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-transparent bg-clip-text">
              Панель администратора
            </h1>
            <p className="text-muted-foreground mt-1">
              Управление пользователями и системой
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/profile">
              <Button variant="outline" size="sm" className="border-[#DF2456]/30 hover:bg-[#DF2456]/10">
                <Home className="mr-2 h-4 w-4" />
                К профилю
              </Button>
            </Link>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => window.location.reload()}
              disabled={isUpdating}
              className="border-[#DF2456]/30 hover:bg-[#DF2456]/10"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </div>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-background border border-[#DF2456]/30 mb-6 flex flex-wrap">
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="punishments">Наказания</TabsTrigger>
            <TabsTrigger value="anticheat">Античит</TabsTrigger>
            <TabsTrigger value="punishments-db">База наказаний</TabsTrigger>
            <TabsTrigger value="staff-activity">Актив персонала</TabsTrigger>
            <TabsTrigger value="cheat-hunters">ЧитХантеры</TabsTrigger>
            <TabsTrigger value="system">Система</TabsTrigger>
            <TabsTrigger value="logs">Логи</TabsTrigger>
            <TabsTrigger value="donate">Донат</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card className="border-[#DF2456]/30 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Управление пользователями</CardTitle>
                  <Button variant="outline" className="border-[#DF2456]/30 hover:bg-[#DF2456]/10">
                    <UserPlus className="mr-2 h-4 w-4" /> Добавить пользователя
                  </Button>
                </div>
                <CardDescription>
                  Просмотр и редактирование пользователей системы
                </CardDescription>
                <div className="flex items-center w-full max-w-sm mt-4">
                  <Input
                    placeholder="Поиск пользователей..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]"
                  />
                  <Button variant="ghost" className="ml-2">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-[#DF2456]/20">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Пользователь</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="hidden md:table-cell">Дата регистрации</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user.image || ''} alt={user.name} />
                                  <AvatarFallback className="bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-white text-xs">
                                    {user.name.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                            <TableCell className="hidden md:table-cell">{formatDate(user.created_at)}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.role === 'admin' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                              }`}>
                                {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="border-[#DF2456]/30">
                                  <DropdownMenuLabel>Действия</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => openUserProfile(user)}>
                                    <UserCog className="mr-2 h-4 w-4" />
                                    <span>Просмотр профиля</span>
                                  </DropdownMenuItem>
                                  {user.role !== 'admin' ? (
                                    <DropdownMenuItem onClick={() => updateUserRole(user.id, 'admin')}>
                                      <Shield className="mr-2 h-4 w-4" />
                                      <span>Назначить администратором</span>
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => updateUserRole(user.id, 'user')}>
                                      <UserIcon className="mr-2 h-4 w-4" />
                                      <span>Сделать обычным пользователем</span>
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem>
                                    <UserX className="mr-2 h-4 w-4 text-red-500" />
                                    <span className="text-red-500">Удалить пользователя</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            Пользователи не найдены
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="punishments">
            <Card className="border-[#DF2456]/30 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Последние наказания</CardTitle>
                  <div className="flex space-x-2">
                    <select 
                      className="rounded-md border border-[#DF2456]/30 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB0D68]"
                      value={punishmentFilter}
                      onChange={(e) => setPunishmentFilter(e.target.value)}
                    >
                      <option value="all">Все типы</option>
                      <option value="ban">Только баны</option>
                      <option value="mute">Только муты</option>
                      <option value="warn">Только предупреждения</option>
                    </select>
                    <Button variant="outline" className="border-[#DF2456]/30 hover:bg-[#DF2456]/10">
                      <RefreshCw className="mr-2 h-4 w-4" /> Обновить
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Последние наказания, выданные модераторами и администраторами
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-[#DF2456]/20">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Игрок</TableHead>
                        <TableHead>Тип</TableHead>
                        <TableHead>Причина</TableHead>
                        <TableHead>Модератор</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead>Срок</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">1</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-white text-xs">
                                MG
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">MineGamer123</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-500">
                            Бан
                          </span>
                        </TableCell>
                        <TableCell>Использование читов (X-Ray)</TableCell>
                        <TableCell>AdminUser</TableCell>
                        <TableCell>10.05.2025 15:42</TableCell>
                        <TableCell>30 дней</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="border-[#DF2456]/30">
                              <DropdownMenuLabel>Действия</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handlePunishmentAction(1, 'remove')}>
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                <span>Отменить наказание</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePunishmentAction(1, 'extend')}>
                                <ArrowUpRight className="mr-2 h-4 w-4 text-yellow-500" />
                                <span>Продлить срок</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePunishmentAction(1, 'reduce')}>
                                <RotateCcw className="mr-2 h-4 w-4 text-green-500" />
                                <span>Сократить срок</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">2</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-white text-xs">
                                CK
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">CraftKing</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-500">
                            Мут
                          </span>
                        </TableCell>
                        <TableCell>Оскорбления игроков</TableCell>
                        <TableCell>ModeratorUser</TableCell>
                        <TableCell>09.05.2025 18:30</TableCell>
                        <TableCell>3 часа</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="border-[#DF2456]/30">
                              <DropdownMenuLabel>Действия</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handlePunishmentAction(2, 'remove')}>
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                <span>Отменить наказание</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePunishmentAction(2, 'extend')}>
                                <ArrowUpRight className="mr-2 h-4 w-4 text-yellow-500" />
                                <span>Продлить срок</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePunishmentAction(2, 'reduce')}>
                                <RotateCcw className="mr-2 h-4 w-4 text-green-500" />
                                <span>Сократить срок</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="anticheat">
            <Card className="border-[#DF2456]/30 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Детекты античита</CardTitle>
                  <div className="flex space-x-2">
                    <select 
                      className="rounded-md border border-[#DF2456]/30 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB0D68]"
                      value={anticheatFilter}
                      onChange={(e) => setAnticheatFilter(e.target.value)}
                    >
                      <option value="all">Все уровни</option>
                      <option value="high">Высокий уровень</option>
                      <option value="medium">Средний уровень</option>
                      <option value="low">Низкий уровень</option>
                    </select>
                    <Button variant="outline" className="border-[#DF2456]/30 hover:bg-[#DF2456]/10">
                      <RefreshCw className="mr-2 h-4 w-4" /> Обновить
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Последние срабатывания античита на сервере
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-[#DF2456]/20">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Игрок</TableHead>
                        <TableHead>Тип</TableHead>
                        <TableHead>Описание</TableHead>
                        <TableHead>Уровень</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead>Действие</TableHead>
                        <TableHead className="text-right">Подробности</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">1</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-white text-xs">
                                RS
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">RapidSky</span>
                          </div>
                        </TableCell>
                        <TableCell>KillAura</TableCell>
                        <TableCell>Удары по нескольким целям одновременно</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-500">
                            Высокий
                          </span>
                        </TableCell>
                        <TableCell>10.05.2025 14:22</TableCell>
                        <TableCell>Кик</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="border-[#DF2456]/30">
                              <DropdownMenuLabel>Действия</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleAnticheatAction(1, 'ban')}>
                                <Ban className="mr-2 h-4 w-4 text-red-500" />
                                <span>Забанить игрока</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAnticheatAction(1, 'warn')}>
                                <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                                <span>Выдать предупреждение</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAnticheatAction(1, 'ignore')}>
                                <XCircle className="mr-2 h-4 w-4" />
                                <span>Пометить как ложное</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">2</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-white text-xs">
                                SB
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">ShadowBlade</span>
                          </div>
                        </TableCell>
                        <TableCell>Speed</TableCell>
                        <TableCell>Аномальная скорость передвижения</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-500">
                            Средний
                          </span>
                        </TableCell>
                        <TableCell>09.05.2025 19:45</TableCell>
                        <TableCell>Предупреждение</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="border-[#DF2456]/30">
                              <DropdownMenuLabel>Действия</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleAnticheatAction(2, 'ban')}>
                                <Ban className="mr-2 h-4 w-4 text-red-500" />
                                <span>Забанить игрока</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAnticheatAction(2, 'warn')}>
                                <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                                <span>Выдать предупреждение</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAnticheatAction(2, 'ignore')}>
                                <XCircle className="mr-2 h-4 w-4" />
                                <span>Пометить как ложное</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="punishments-db">
            <Card className="border-[#DF2456]/30 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>База наказаний</CardTitle>
                  <div className="flex space-x-2">
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Поиск по нику/IP..." className="pl-8 border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                    </div>
                    <Button variant="outline" className="border-[#DF2456]/30 hover:bg-[#DF2456]/10">
                      <Search className="mr-2 h-4 w-4" /> Найти
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  База данных всех наказаний на сервере с возможностью поиска
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="bg-background border border-[#DF2456]/20 mb-4">
                    <TabsTrigger value="active">Активные</TabsTrigger>
                    <TabsTrigger value="expired">Истекшие</TabsTrigger>
                    <TabsTrigger value="all">Все</TabsTrigger>
                  </TabsList>
                  
                  <div className="rounded-md border border-[#DF2456]/20">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Игрок</TableHead>
                          <TableHead>IP</TableHead>
                          <TableHead>Тип</TableHead>
                          <TableHead>Причина</TableHead>
                          <TableHead>Модератор</TableHead>
                          <TableHead>Дата</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">1</TableCell>
                          <TableCell>MineGamer123</TableCell>
                          <TableCell>192.168.1.***</TableCell>
                          <TableCell>Бан</TableCell>
                          <TableCell>Использование читов (X-Ray)</TableCell>
                          <TableCell>AdminUser</TableCell>
                          <TableCell>10.05.2025</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-500">
                              Активен
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">2</TableCell>
                          <TableCell>CraftKing</TableCell>
                          <TableCell>192.168.2.***</TableCell>
                          <TableCell>Мут</TableCell>
                          <TableCell>Оскорбления игроков</TableCell>
                          <TableCell>ModeratorUser</TableCell>
                          <TableCell>09.05.2025</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500">
                              Истек
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="staff-activity">
            <Card className="border-[#DF2456]/30 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Активность персонала</CardTitle>
                  <div className="flex space-x-2">
                    <Tabs defaultValue="week" className="w-auto">
                      <TabsList className="bg-background border border-[#DF2456]/20">
                        <TabsTrigger value="week" onClick={() => handleStaffStatsRequest('week')}>Неделя</TabsTrigger>
                        <TabsTrigger value="month" onClick={() => handleStaffStatsRequest('month')}>Месяц</TabsTrigger>
                        <TabsTrigger value="all" onClick={() => handleStaffStatsRequest('all')}>Все время</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
                <CardDescription>
                  Статистика активности модераторов и администраторов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-[#DF2456]/20">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Модератор/Админ</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Банов</TableHead>
                        <TableHead>Мутов</TableHead>
                        <TableHead>Предупреждений</TableHead>
                        <TableHead>Разбанов</TableHead>
                        <TableHead>Всего действий</TableHead>
                        <TableHead>Последняя активность</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-white text-xs">
                                AU
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">AdminUser</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-500">
                            Администратор
                          </span>
                        </TableCell>
                        <TableCell>15</TableCell>
                        <TableCell>8</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell className="font-medium">31</TableCell>
                        <TableCell>10.05.2025 16:30</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-white text-xs">
                                MU
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">ModeratorUser</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500">
                            Модератор
                          </span>
                        </TableCell>
                        <TableCell>7</TableCell>
                        <TableCell>12</TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell className="font-medium">30</TableCell>
                        <TableCell>09.05.2025 19:45</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cheat-hunters">
            <Card className="border-[#DF2456]/30 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>ЧитХантеры</CardTitle>
                  <Dialog open={addViolatorOpen} onOpenChange={setAddViolatorOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white">
                        <UserPlus className="mr-2 h-4 w-4" /> Добавить нарушителя
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] border-[#DF2456]/30">
                      <form onSubmit={handleAddViolator}>
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-transparent bg-clip-text">
                            Добавить нарушителя
                          </DialogTitle>
                          <DialogDescription>
                            Заполните форму с информацией о проверке игрока и найденных нарушениях
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="playerName">Ник игрока</Label>
                              <Input id="playerName" placeholder="Введите ник игрока" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="checkDate">Дата проверки</Label>
                              <Input id="checkDate" type="datetime-local" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" required />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="checkStatus">Статус проверки</Label>
                              <select id="checkStatus" className="w-full rounded-md border border-[#DF2456]/30 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB0D68]" required>
                                <option value="">Выберите статус</option>
                                <option value="confirmed">Подтверждено</option>
                                <option value="notConfirmed">Не подтверждено</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="checkTools">Программы для проверки</Label>
                              <Input id="checkTools" placeholder="Discord, AnyDesk и т.д." className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" required />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cheatsFound">Обнаруженные читы</Label>
                            <Input id="cheatsFound" placeholder="X-Ray, KillAura и т.д." className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="actionTaken">Принятые меры</Label>
                            <Input id="actionTaken" placeholder="Бан на 30 дней, предупреждение и т.д." className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="notes">Заметки</Label>
                            <Textarea id="notes" placeholder="Подробности проверки и другие заметки" className="resize-none border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" rows={3} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="checkScreenshot">Скриншот проверки</Label>
                              <div className="flex items-center justify-center border border-dashed border-[#DF2456]/40 rounded-md h-24 bg-muted/20 cursor-pointer hover:bg-muted/30 transition">
                                <div className="flex flex-col items-center space-y-1">
                                  <Upload className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">Загрузить скриншот</span>
                                </div>
                                <input type="file" id="checkScreenshot" className="hidden" accept="image/*" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cheatScreenshot">Скриншот нарушения</Label>
                              <div className="flex items-center justify-center border border-dashed border-[#DF2456]/40 rounded-md h-24 bg-muted/20 cursor-pointer hover:bg-muted/30 transition">
                                <div className="flex flex-col items-center space-y-1">
                                  <Upload className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">Загрузить скриншот</span>
                                </div>
                                <input type="file" id="cheatScreenshot" className="hidden" accept="image/*" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" className="border-[#DF2456]/30 hover:bg-[#DF2456]/10" onClick={() => setAddViolatorOpen(false)}>
                            Отмена
                          </Button>
                          <Button type="submit" className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white">
                            Добавить отчет
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <CardDescription>
                  Отчеты о проверках игроков и выявленных нарушителях
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Card className="border-[#DF2456]/20">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-white text-xs">
                              MG
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">Нарушитель: MineGamer123</CardTitle>
                            <CardDescription>Проверено: AdminUser | 10.05.2025 15:30</CardDescription>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                          Подтверждено
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Обнаружено</h4>
                            <p className="text-sm text-muted-foreground">
                              X-Ray, KillAura
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">Программы для проверки</h4>
                            <p className="text-sm text-muted-foreground">
                              AnyDesk, Discord
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">Заметки</h4>
                            <p className="text-sm text-muted-foreground">
                              Игрок признался в использовании читов. Обнаружены модификации клиента.
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">Принятые меры</h4>
                            <p className="text-sm text-muted-foreground">
                              Бан на 30 дней
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Скриншот проверки</h4>
                            <div className="border rounded-md overflow-hidden h-32 bg-muted/50 flex items-center justify-center">
                              <span className="text-sm text-muted-foreground">Скриншот Discord</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">Скриншот нарушения</h4>
                            <div className="border rounded-md overflow-hidden h-32 bg-muted/50 flex items-center justify-center">
                              <span className="text-sm text-muted-foreground">Скриншот с читами</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-[#DF2456]/20">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-white text-xs">
                              CK
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">Нарушитель: CraftKing</CardTitle>
                            <CardDescription>Проверено: ModeratorUser | 09.05.2025 19:45</CardDescription>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                          Не подтверждено
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Подозрение</h4>
                            <p className="text-sm text-muted-foreground">
                              Подозрение на SpeedHack
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">Программы для проверки</h4>
                            <p className="text-sm text-muted-foreground">
                              AnyDesk, Discord
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">Заметки</h4>
                            <p className="text-sm text-muted-foreground">
                              Проверка не выявила нарушений. Возможна была высокая задержка соединения.
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">Принятые меры</h4>
                            <p className="text-sm text-muted-foreground">
                              Нет
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Скриншот проверки</h4>
                          <div className="border rounded-md overflow-hidden h-32 bg-muted/50 flex items-center justify-center">
                            <span className="text-sm text-muted-foreground">Скриншот Discord</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card className="border-[#DF2456]/30 shadow-lg">
              <CardHeader>
                <CardTitle>Настройки системы</CardTitle>
                <CardDescription>
                  Управление системными настройками и конфигурацией
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="server" className="w-full">
                  <TabsList className="bg-background border border-[#DF2456]/20 mb-6">
                    <TabsTrigger value="server">Сервер</TabsTrigger>
                    <TabsTrigger value="database">База данных</TabsTrigger>
                    <TabsTrigger value="mail">Почта</TabsTrigger>
                    <TabsTrigger value="performance">Производительность</TabsTrigger>
                    <TabsTrigger value="donate">Донат</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="server">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-[#DF2456]/20">
                          <CardHeader className="pb-3">
                            <div className="flex items-center">
                              <Server className="h-5 w-5 text-[#FB0D68] mr-2" />
                              <CardTitle className="text-lg">Информация о сервере</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Операционная система</span>
                                <span className="text-sm font-medium">Linux Ubuntu 22.04 LTS</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Версия Java</span>
                                <span className="text-sm font-medium">OpenJDK 17.0.2</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Время работы</span>
                                <span className="text-sm font-medium">28 дней 14 часов</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">IP адрес</span>
                                <span className="text-sm font-medium">123.456.789.012</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-[#DF2456]/20">
                          <CardHeader className="pb-3">
                            <div className="flex items-center">
                              <HardDrive className="h-5 w-5 text-[#FB0D68] mr-2" />
                              <CardTitle className="text-lg">Ресурсы сервера</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm text-muted-foreground">CPU</span>
                                  <span className="text-sm font-medium">45%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-[#FB0D68] h-2 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm text-muted-foreground">RAM</span>
                                  <span className="text-sm font-medium">12GB/16GB (75%)</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-[#FB0D68] h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm text-muted-foreground">Диск</span>
                                  <span className="text-sm font-medium">320GB/500GB (64%)</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-[#FB0D68] h-2 rounded-full" style={{ width: '64%' }}></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm text-muted-foreground">Сеть</span>
                                  <span className="text-sm font-medium">24Mbps</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-[#FB0D68] h-2 rounded-full" style={{ width: '30%' }}></div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card className="border-[#DF2456]/20">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Settings className="h-5 w-5 text-[#FB0D68] mr-2" />
                              <CardTitle className="text-lg">Настройки сервера</CardTitle>
                            </div>
                            <Button className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white">
                              Сохранить изменения
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="serverName">Название сервера</Label>
                                <Input id="serverName" defaultValue="EternalCore" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="maxPlayers">Максимум игроков</Label>
                                <Input id="maxPlayers" type="number" defaultValue="1000" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="gamemode">Игровой режим</Label>
                                <select id="gamemode" className="w-full rounded-md border border-[#DF2456]/30 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB0D68]">
                                  <option value="survival">Выживание</option>
                                  <option value="creative">Творческий</option>
                                  <option value="adventure">Приключение</option>
                                  <option value="spectator">Наблюдатель</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="difficulty">Сложность</Label>
                                <select id="difficulty" className="w-full rounded-md border border-[#DF2456]/30 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB0D68]" defaultValue="normal">
                                  <option value="peaceful">Мирная</option>
                                  <option value="easy">Легкая</option>
                                  <option value="normal">Нормальная</option>
                                  <option value="hard">Сложная</option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="motd">MOTD (Сообщение дня)</Label>
                              <Textarea id="motd" defaultValue="Добро пожаловать на лучший Minecraft сервер EternalCore!" className="resize-none border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="pvp" defaultChecked className="rounded border-[#DF2456]/30 text-[#FB0D68] focus:ring-[#FB0D68]" />
                              <Label htmlFor="pvp">Включить PvP</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="whitelist" className="rounded border-[#DF2456]/30 text-[#FB0D68] focus:ring-[#FB0D68]" />
                              <Label htmlFor="whitelist">Включить белый список</Label>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="database">
                    <div className="space-y-6">
                      <Card className="border-[#DF2456]/20">
                        <CardHeader className="pb-3">
                          <div className="flex items-center">
                            <Database className="h-5 w-5 text-[#FB0D68] mr-2" />
                            <CardTitle className="text-lg">Подключение к базе данных</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="dbType">Тип базы данных</Label>
                                <Select defaultValue="mysql">
                                  <SelectTrigger className="w-[150px] border-[#DF2456]/30 focus:ring-[#FB0D68]">
                                    <SelectValue placeholder="Тип БД" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="mysql">MySQL</SelectItem>
                                    <SelectItem value="postgres">PostgreSQL</SelectItem>
                                    <SelectItem value="sqlite">SQLite</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="dbHost">Хост</Label>
                                <Input id="dbHost" defaultValue="localhost" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="dbPort">Порт</Label>
                                <Input id="dbPort" defaultValue="3306" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="dbName">База данных</Label>
                                <Input id="dbName" defaultValue="eternalcore" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="dbUser">Пользователь</Label>
                                <Input id="dbUser" defaultValue="root" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="dbPassword">Пароль</Label>
                                <Input id="dbPassword" type="password" defaultValue="********" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button variant="outline" className="border-[#DF2456]/30 hover:bg-[#DF2456]/10 mr-2">
                                Тест соединения
                              </Button>
                              <Button className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white">
                                Сохранить
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-[#DF2456]/20">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Database className="h-5 w-5 text-[#FB0D68] mr-2" />
                              <CardTitle className="text-lg">Управление базой данных</CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Button variant="outline" className="border-[#DF2456]/30 hover:bg-[#DF2456]/10">
                                Оптимизировать таблицы
                              </Button>
                              <Button variant="outline" className="border-[#DF2456]/30 hover:bg-[#DF2456]/10">
                                Резервное копирование
                              </Button>
                              <Button variant="outline" className="border-[#DF2456]/30 hover:bg-[#DF2456]/10">
                                Восстановление
                              </Button>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">Состояние базы данных</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Размер базы данных</span>
                                  <span className="text-sm font-medium">256 MB</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Количество таблиц</span>
                                  <span className="text-sm font-medium">24</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Последнее резервное копирование</span>
                                  <span className="text-sm font-medium">10.05.2025 03:00</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Статус соединения</span>
                                  <span className="text-sm font-medium text-green-500">Подключено</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="mail">
                    <Card className="border-[#DF2456]/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 text-[#FB0D68] mr-2" />
                            <CardTitle className="text-lg">Настройки почты</CardTitle>
                          </div>
                          <Button className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white">
                            Сохранить изменения
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="mailHost">SMTP-сервер</Label>
                              <Input id="mailHost" defaultValue="smtp.gmail.com" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mailPort">Порт</Label>
                              <Input id="mailPort" defaultValue="587" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mailUser">Email</Label>
                              <Input id="mailUser" defaultValue="support@eternalcore.ru" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mailPassword">Пароль</Label>
                              <Input id="mailPassword" type="password" defaultValue="********" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mailFromName">Имя отправителя</Label>
                              <Input id="mailFromName" defaultValue="EternalCore Server" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mailEncryption">Шифрование</Label>
                              <Select defaultValue="tls">
                                <SelectTrigger className="w-[120px] border-[#DF2456]/30 focus:ring-[#FB0D68]">
                                  <SelectValue placeholder="Протокол" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="tls">TLS</SelectItem>
                                  <SelectItem value="ssl">SSL</SelectItem>
                                  <SelectItem value="none">Без шифрования</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="mailNotifications" defaultChecked className="rounded border-[#DF2456]/30 text-[#FB0D68] focus:ring-[#FB0D68]" />
                            <Label htmlFor="mailNotifications">Включить уведомления по почте</Label>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="testEmail">Тестовый email</Label>
                            <div className="flex space-x-2">
                              <Input id="testEmail" placeholder="test@example.com" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                              <Button variant="outline" className="border-[#DF2456]/30 hover:bg-[#DF2456]/10">
                                Отправить тест
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="performance">
                    <Card className="border-[#DF2456]/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-center">
                          <ChartBar className="h-5 w-5 text-[#FB0D68] mr-2" />
                          <CardTitle className="text-lg">Настройки производительности</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="minMemory">Минимальная память (MB)</Label>
                              <Input id="minMemory" type="number" defaultValue="1024" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="maxMemory">Максимальная память (MB)</Label>
                              <Input id="maxMemory" type="number" defaultValue="4096" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="viewDistance">Дистанция прогрузки</Label>
                              <Input id="viewDistance" type="number" defaultValue="10" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="simulationDistance">Дистанция симуляции</Label>
                              <Input id="simulationDistance" type="number" defaultValue="6" className="border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Дополнительные JVM-параметры</Label>
                            <Textarea defaultValue="-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch" className="resize-none border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" />
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium mb-2">Оптимизация</h4>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="spigotTick" defaultChecked className="rounded border-[#DF2456]/30 text-[#FB0D68] focus:ring-[#FB0D68]" />
                                <Label htmlFor="spigotTick">Оптимизировать тики сервера</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="mobAI" defaultChecked className="rounded border-[#DF2456]/30 text-[#FB0D68] focus:ring-[#FB0D68]" />
                                <Label htmlFor="mobAI">Оптимизировать AI мобов</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="entityCollision" defaultChecked className="rounded border-[#DF2456]/30 text-[#FB0D68] focus:ring-[#FB0D68]" />
                                <Label htmlFor="entityCollision">Оптимизировать коллизии существ</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="chunkLoading" defaultChecked className="rounded border-[#DF2456]/30 text-[#FB0D68] focus:ring-[#FB0D68]" />
                                <Label htmlFor="chunkLoading">Оптимизировать загрузку чанков</Label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white">
                              Сохранить настройки
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="donate" className="space-y-6">
            <Card className="border-[#DF2456]/20 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="flex items-center">
                    <Gift className="mr-2 h-5 w-5 text-[#DF2456]" />
                    Управление донатом
                  </CardTitle>
                  <CardDescription>
                    Управление донат-пакетами и привилегиями на сервере
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    fetch('/api/revalidate?path=/donate', { method: 'POST' })
                      .then(res => {
                        if (res.ok) {
                          showSuccess({
                            type: 'success',
                            title: 'Страница обновлена',
                            message: 'Страница донатов успешно обновлена. Изменения станут видны для пользователей.',
                            variant: 'default'
                          });
                        } else {
                          throw new Error('Не удалось обновить страницу донатов');
                        }
                      })
                      .catch(err => {
                        showError({
                          type: 'general',
                          title: 'Ошибка обновления',
                          message: err.message || 'Не удалось обновить страницу донатов',
                          variant: 'destructive'
                        });
                      });
                  }}
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Обновить страницу донатов
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="packages" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="packages">Донат-пакеты</TabsTrigger>
                    <TabsTrigger value="privileges">Привилегии</TabsTrigger>
                  </TabsList>
                  
                  {/* Секция донат-пакетов */}
                  <TabsContent value="packages" className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Список донат-пакетов</h3>
                      <Button 
                        variant="outline" 
                        className="border-[#DF2456]/30 hover:bg-[#DF2456]/10"
                        onClick={() => {
                          setCurrentPackage(null);
                          setShowDonatePackageDialog(true);
                        }}
                      >
                        <Gift className="mr-2 h-4 w-4" />
                        Добавить пакет
                      </Button>
                    </div>
                    
                    <div className="rounded-md border border-[#DF2456]/20 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-100 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-900">
                            <TableHead className="w-[200px]">Название</TableHead>
                            <TableHead className="w-[100px]">Цена</TableHead>
                            <TableHead className="w-[150px]">Статус</TableHead>
                            <TableHead className="w-[150px]">Группа</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {donatePackages.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                Нет донат-пакетов
                              </TableCell>
                            </TableRow>
                          ) : (
                            donatePackages.map((pkg) => (
                              <TableRow key={pkg.id}>
                                <TableCell className="font-medium">{pkg.name}</TableCell>
                                <TableCell>{pkg.price} ₽</TableCell>
                                <TableCell>
                                  <Badge variant={pkg.status === 'recommended' ? 'default' : 'outline'} className={
                                    pkg.status === 'recommended' ? 'bg-green-500' : 
                                    pkg.status === 'popular' ? 'bg-blue-500' : 
                                    pkg.status === 'maximum' ? 'bg-purple-500' : ''
                                  }>
                                    {pkg.status === 'recommended' ? 'Рекомендуемый' : 
                                     pkg.status === 'popular' ? 'Популярный' : 
                                     pkg.status === 'maximum' ? 'Максимальный' : 'Обычный'}
                                  </Badge>
                                </TableCell>
                                <TableCell>{pkg.group}</TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => {
                                        setCurrentPackage(pkg);
                                        setShowDonatePackageDialog(true);
                                      }}
                                    >
                                      <Pencil className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="text-red-500"
                                      onClick={() => {
                                        // Подтверждение удаления
                                        if (window.confirm(`Вы уверены, что хотите удалить пакет "${pkg.name}"?`)) {
                                          deleteDonatePackage(pkg.id);
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  {/* Секция привилегий */}
                  <TabsContent value="privileges" className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Список привилегий</h3>
                      <Button 
                        variant="outline" 
                        className="border-[#DF2456]/30 hover:bg-[#DF2456]/10"
                        onClick={() => {
                          setCurrentPrivilege(null);
                          setShowPrivilegeDialog(true);
                        }}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Добавить привилегию
                      </Button>
                    </div>
                    
                    <div className="rounded-md border border-[#DF2456]/20 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-100 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-900">
                            <TableHead className="w-[200px]">Название</TableHead>
                            <TableHead className="w-[150px]">Тип</TableHead>
                            <TableHead className="w-[150px]">Право</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {privileges.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                Нет привилегий
                              </TableCell>
                            </TableRow>
                          ) : (
                            privileges.map((priv) => (
                              <TableRow key={priv.id}>
                                <TableCell className="font-medium">{priv.name}</TableCell>
                                <TableCell>{priv.type}</TableCell>
                                <TableCell>{priv.permission}</TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => {
                                        setCurrentPrivilege(priv);
                                        setShowPrivilegeDialog(true);
                                      }}
                                    >
                                      <Pencil className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="text-red-500"
                                      onClick={() => {
                                        // Подтверждение удаления
                                        if (window.confirm(`Вы уверены, что хотите удалить привилегию "${priv.name}"?`)) {
                                          deletePrivilegeItem(priv.id);
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card className="border-[#DF2456]/30 shadow-lg">
              <CardHeader>
                <CardTitle>Системные логи</CardTitle>
                <CardDescription>
                  Журнал действий и событий системы
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="server" className="w-full">
                  <TabsList className="bg-background border border-[#DF2456]/20 mb-4">
                    <TabsTrigger value="server">Сервер</TabsTrigger>
                    <TabsTrigger value="website">Веб-сайт</TabsTrigger>
                    <TabsTrigger value="metrics">Метрики</TabsTrigger>
                    <TabsTrigger value="auth">Авторизация</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="server">
                    <div className="space-y-6">
                      <Card className="border-[#DF2456]/20">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle>Нагрузка на сервер</CardTitle>
                            <Select defaultValue="24h">
                              <SelectTrigger className="w-[120px] border-[#DF2456]/30 focus:ring-[#FB0D68]">
                                <SelectValue placeholder="Период" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1h">1 час</SelectItem>
                                <SelectItem value="6h">6 часов</SelectItem>
                                <SelectItem value="24h">24 часа</SelectItem>
                                <SelectItem value="7d">7 дней</SelectItem>
                                <SelectItem value="30d">30 дней</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px] w-full rounded-md bg-gradient-to-r from-[#DF2456]/5 to-[#FB0D68]/5 flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">График загрузки CPU и RAM</p>
                            {/* В будущем здесь будет реальный график */}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-[#DF2456]/20">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle>Логи сервера</CardTitle>
                            <div className="flex gap-2">
                              <Select defaultValue="all">
                                <SelectTrigger className="w-[120px] border-[#DF2456]/30 focus:ring-[#FB0D68]">
                                  <SelectValue placeholder="Тип" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Все</SelectItem>
                                  <SelectItem value="info">Информация</SelectItem>
                                  <SelectItem value="warning">Предупреждения</SelectItem>
                                  <SelectItem value="error">Ошибки</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="outline" size="icon" className="border-[#DF2456]/30">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="rounded-md border border-[#DF2456]/20 overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-100 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-900">
                                  <TableHead className="w-[120px]">Время</TableHead>
                                  <TableHead className="w-[100px]">Тип</TableHead>
                                  <TableHead>Сообщение</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="text-xs text-muted-foreground">07.11.2023 14:32:45</TableCell>
                                  <TableCell>
                                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500">INFO</span>
                                  </TableCell>
                                  <TableCell className="text-sm">Сервер запущен успешно. Порт: 25565</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-xs text-muted-foreground">07.11.2023 14:32:30</TableCell>
                                  <TableCell>
                                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-500">WARN</span>
                                  </TableCell>
                                  <TableCell className="text-sm">Плагин EssentialsX использует устаревший API</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-xs text-muted-foreground">07.11.2023 14:31:50</TableCell>
                                  <TableCell>
                                    <span className="px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-500">ERROR</span>
                                  </TableCell>
                                  <TableCell className="text-sm">Не удалось загрузить плагин WorldEdit: несовместимая версия</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-xs text-muted-foreground">07.11.2023 14:31:20</TableCell>
                                  <TableCell>
                                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500">INFO</span>
                                  </TableCell>
                                  <TableCell className="text-sm">Загрузка мира: world (размер: 1.2 GB)</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-xs text-muted-foreground">07.11.2023 14:31:00</TableCell>
                                  <TableCell>
                                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500">INFO</span>
                                  </TableCell>
                                  <TableCell className="text-sm">Инициализация сервера. Java Version: 17.0.2</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                          <div className="flex justify-center mt-4">
                            <Pagination>
                              <PaginationContent>
                                <PaginationItem>
                                  <PaginationPrevious href="#" />
                                </PaginationItem>
                                <PaginationItem>
                                  <PaginationLink href="#">1</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                  <PaginationLink href="#" isActive>2</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                  <PaginationLink href="#">3</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                  <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                  <PaginationNext href="#" />
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="website">
                    <Card className="border-[#DF2456]/20">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>Логи активности на сайте</CardTitle>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="Поиск..." 
                              className="max-w-[200px] border-[#DF2456]/30 focus-visible:ring-[#FB0D68]" 
                            />
                            <Button variant="outline" size="icon" className="border-[#DF2456]/30">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border border-[#DF2456]/20 overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-100 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-900">
                                <TableHead className="w-[120px]">Время</TableHead>
                                <TableHead className="w-[130px]">Пользователь</TableHead>
                                <TableHead className="w-[120px]">IP</TableHead>
                                <TableHead>Действие</TableHead>
                                <TableHead className="w-[100px]">Страница</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="text-xs text-muted-foreground">07.11.2023 18:45:12</TableCell>
                                <TableCell className="text-sm">admin</TableCell>
                                <TableCell className="text-xs text-muted-foreground">192.168.1.***</TableCell>
                                <TableCell className="text-sm">Изменение настроек сервера</TableCell>
                                <TableCell className="text-xs text-muted-foreground">/admin</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="text-xs text-muted-foreground">07.11.2023 18:30:05</TableCell>
                                <TableCell className="text-sm">player123</TableCell>
                                <TableCell className="text-xs text-muted-foreground">192.168.3.***</TableCell>
                                <TableCell className="text-sm">Вход в аккаунт</TableCell>
                                <TableCell className="text-xs text-muted-foreground">/login</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="text-xs text-muted-foreground">07.11.2023 18:12:33</TableCell>
                                <TableCell className="text-sm">newuser</TableCell>
                                <TableCell className="text-xs text-muted-foreground">192.168.5.***</TableCell>
                                <TableCell className="text-sm">Регистрация аккаунта</TableCell>
                                <TableCell className="text-xs text-muted-foreground">/register</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="text-xs text-muted-foreground">07.11.2023 17:50:21</TableCell>
                                <TableCell className="text-sm">admin</TableCell>
                                <TableCell className="text-xs text-muted-foreground">192.168.1.***</TableCell>
                                <TableCell className="text-sm">Выдача прав администратора пользователю mod1</TableCell>
                                <TableCell className="text-xs text-muted-foreground">/admin</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="text-xs text-muted-foreground">07.11.2023 17:30:00</TableCell>
                                <TableCell className="text-sm">player456</TableCell>
                                <TableCell className="text-xs text-muted-foreground">192.168.7.***</TableCell>
                                <TableCell className="text-sm">Покупка привилегии VIP</TableCell>
                                <TableCell className="text-xs text-muted-foreground">/donate</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        <div className="flex justify-center mt-4">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious href="#" />
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationLink href="#" isActive>1</PaginationLink>
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationLink href="#">2</PaginationLink>
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationLink href="#">3</PaginationLink>
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationNext href="#" />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="metrics">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="border-[#DF2456]/20">
                        <CardHeader className="pb-2">
                          <CardTitle>Онлайн игроков</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px] w-full rounded-md bg-gradient-to-r from-[#DF2456]/5 to-[#FB0D68]/5 flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">Статистика онлайна за последние 7 дней</p>
                            {/* В будущем здесь будет реальный график */}
                          </div>
                          <div className="flex justify-between mt-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Макс. за 24ч</p>
                              <p className="font-medium">127</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Средний</p>
                              <p className="font-medium">86</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Сейчас</p>
                              <p className="font-medium">42</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-[#DF2456]/20">
                        <CardHeader className="pb-2">
                          <CardTitle>Регистрации</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px] w-full rounded-md bg-gradient-to-r from-[#DF2456]/5 to-[#FB0D68]/5 flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">Новые регистрации по дням</p>
                            {/* В будущем здесь будет реальный график */}
                          </div>
                          <div className="flex justify-between mt-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Всего</p>
                              <p className="font-medium">1,258</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">За неделю</p>
                              <p className="font-medium">83</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Сегодня</p>
                              <p className="font-medium">12</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-[#DF2456]/20">
                        <CardHeader className="pb-2">
                          <CardTitle>Пожертвования</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px] w-full rounded-md bg-gradient-to-r from-[#DF2456]/5 to-[#FB0D68]/5 flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">Статистика пожертвований</p>
                            {/* В будущем здесь будет реальный график */}
                          </div>
                          <div className="flex justify-between mt-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Всего</p>
                              <p className="font-medium">15,750 EC</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">За месяц</p>
                              <p className="font-medium">4,230 EC</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">За неделю</p>
                              <p className="font-medium">850 EC</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-[#DF2456]/20">
                        <CardHeader className="pb-2">
                          <CardTitle>Использование ресурсов</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px] w-full rounded-md bg-gradient-to-r from-[#DF2456]/5 to-[#FB0D68]/5 flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">Использование CPU/RAM/Диска</p>
                            {/* В будущем здесь будет реальный график */}
                          </div>
                          <div className="flex justify-between mt-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">CPU</p>
                              <p className="font-medium">23%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">RAM</p>
                              <p className="font-medium">4.7 GB / 8 GB</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Диск</p>
                              <p className="font-medium">15.2 GB / 50 GB</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="auth">
                    <Card className="border-[#DF2456]/20">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>Логи авторизации</CardTitle>
                          <div className="flex gap-2">
                            <Select defaultValue="all">
                              <SelectTrigger className="w-[120px] border-[#DF2456]/30 focus:ring-[#FB0D68]">
                                <SelectValue placeholder="Статус" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Все</SelectItem>
                                <SelectItem value="success">Успешно</SelectItem>
                                <SelectItem value="failed">Неудачно</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon" className="border-[#DF2456]/30">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border border-[#DF2456]/20 overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-100 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-900">
                                <TableHead className="w-[120px]">Время</TableHead>
                                <TableHead className="w-[130px]">Пользователь</TableHead>
                                <TableHead className="w-[120px]">IP</TableHead>
                                <TableHead className="w-[100px]">Статус</TableHead>
                                <TableHead>Метод</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="text-xs text-muted-foreground">07.11.2023 19:15:22</TableCell>
                                <TableCell className="text-sm">player123</TableCell>
                                <TableCell className="text-xs text-muted-foreground">192.168.3.***</TableCell>
                                <TableCell>
                                  <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500">Успешно</span>
                                </TableCell>
                                <TableCell className="text-sm">Пароль</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="text-xs text-muted-foreground">07.11.2023 18:50:10</TableCell>
                                <TableCell className="text-sm">unknown</TableCell>
                                <TableCell className="text-xs text-muted-foreground">192.168.9.***</TableCell>
                                <TableCell>
                                  <span className="px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-500">Неудачно</span>
                                </TableCell>
                                <TableCell className="text-sm">Пароль</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="text-xs text-muted-foreground">07.11.2023 18:30:05</TableCell>
                                <TableCell className="text-sm">player123</TableCell>
                                <TableCell className="text-xs text-muted-foreground">192.168.3.***</TableCell>
                                <TableCell>
                                  <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500">Успешно</span>
                                </TableCell>
                                <TableCell className="text-sm">Google</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="text-xs text-muted-foreground">07.11.2023 17:45:33</TableCell>
                                <TableCell className="text-sm">admin</TableCell>
                                <TableCell className="text-xs text-muted-foreground">192.168.1.***</TableCell>
                                <TableCell>
                                  <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500">Успешно</span>
                                </TableCell>
                                <TableCell className="text-sm">Пароль</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="text-xs text-muted-foreground">07.11.2023 17:20:17</TableCell>
                                <TableCell className="text-sm">unknown</TableCell>
                                <TableCell className="text-xs text-muted-foreground">192.168.8.***</TableCell>
                                <TableCell>
                                  <span className="px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-500">Неудачно</span>
                                </TableCell>
                                <TableCell className="text-sm">Пароль</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        <div className="flex justify-center mt-4">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious href="#" />
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationLink href="#" isActive>1</PaginationLink>
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationLink href="#">2</PaginationLink>
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationLink href="#">3</PaginationLink>
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationNext href="#" />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Диалоговые окна для донат-пакетов и привилегий */}
      <Dialog open={showDonatePackageDialog} onOpenChange={setShowDonatePackageDialog}>
        <DialogContent className="sm:max-w-md border-[#DF2456]/30 shadow-lg shadow-[#FB0D68]/5">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {currentPackage ? "Редактирование пакета" : "Добавление нового пакета"}
            </DialogTitle>
            <DialogDescription>
              Заполните информацию о донат-пакете для отображения на сайте
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            
            // Обрабатываем features - преобразуем из текста с новыми строками в массив JSON
            const featuresText = formData.get('features') as string;
            const featuresArray = featuresText
              .split('\n')
              .map(line => line.trim())
              .filter(line => line); // удаляем пустые строки
            
            const packageData = {
              name: formData.get('name') as string,
              price: Number(formData.get('price')),
              description: formData.get('description') as string,
              status: formData.get('status') as string,
              group: formData.get('group') as string,
              features: JSON.stringify(featuresArray), // преобразуем в JSON строку
              command: formData.get('command') as string
            };
            
            try {
              if (currentPackage) {
                // Обновление существующего пакета через API
                const success = await updateDonatePackage(currentPackage.id, packageData);
                if (success) {
                  showSuccess({
                    type: 'success',
                    title: 'Пакет обновлен',
                    message: `Донат-пакет "${packageData.name}" успешно обновлен`,
                    variant: 'default'
                  });
                }
              } else {
                // Добавление нового пакета через API
                const success = await addDonatePackage(packageData);
                if (success) {
                  showSuccess({
                    type: 'success',
                    title: 'Пакет создан',
                    message: `Донат-пакет "${packageData.name}" успешно создан`,
                    variant: 'default'
                  });
                }
              }
              
              // Обновляем список пакетов
              await fetchDonatePackages();
              setShowDonatePackageDialog(false);
            } catch (error: any) {
              showError({
                type: 'general',
                title: currentPackage ? 'Ошибка обновления' : 'Ошибка создания',
                message: error.message || `Не удалось ${currentPackage ? 'обновить' : 'создать'} донат-пакет`,
                variant: 'destructive'
              });
            }
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Название</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="VIP" 
                  className="col-span-3 border-[#DF2456]/30 focus-visible:ring-[#FB0D68]"
                  defaultValue={currentPackage?.name || ''}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Цена (₽)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  placeholder="299" 
                  className="col-span-3 border-[#DF2456]/30 focus-visible:ring-[#FB0D68]"
                  defaultValue={currentPackage?.price || ''}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Описание</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Базовый набор возможностей..." 
                  className="col-span-3 border-[#DF2456]/30 focus-visible:ring-[#FB0D68]"
                  defaultValue={currentPackage?.description || ''}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Статус</Label>
                <Select name="status" defaultValue={currentPackage?.status || 'normal'}>
                  <SelectTrigger className="col-span-3 border-[#DF2456]/30 focus:ring-[#FB0D68]">
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Обычный</SelectItem>
                    <SelectItem value="recommended">Рекомендуемый</SelectItem>
                    <SelectItem value="popular">Популярный</SelectItem>
                    <SelectItem value="maximum">Максимальный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="group" className="text-right">Группа</Label>
                <Input 
                  id="group" 
                  name="group" 
                  placeholder="vip" 
                  className="col-span-3 border-[#DF2456]/30 focus-visible:ring-[#FB0D68]"
                  defaultValue={currentPackage?.group || ''}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="features" className="text-right">
                  Возможности
                  <span className="block text-xs text-muted-foreground">(по одной на строку)</span>
                </Label>
                <Textarea 
                  id="features" 
                  name="features" 
                  placeholder="Кит VIP каждые 24 часа&#10;Команда /fly&#10;10 приватных регионов"
                  className="col-span-3 min-h-[100px] border-[#DF2456]/30 focus-visible:ring-[#FB0D68]"
                  defaultValue={
                    (() => {
                      try {
                        // Проверяем, если это строка JSON, то парсим ее
                        if (currentPackage?.features && typeof currentPackage.features === 'string') {
                          const parsed = JSON.parse(currentPackage.features);
                          if (Array.isArray(parsed)) {
                            return parsed.join('\n');
                          }
                        }
                        // Если это массив, конвертируем в строки
                        if (currentPackage?.features && Array.isArray(currentPackage.features)) {
                          return currentPackage.features.join('\n');
                        }
                        return '';
                      } catch (e) {
                        console.error("Ошибка при обработке features:", e);
                        return '';
                      }
                    })()
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="command" className="text-right">
                  Команда выдачи
                  <span className="block text-xs text-muted-foreground">Плейсхолдеры: {`{player}`}, {`{priv.group}`}</span>
                </Label>
                <Input 
                  id="command" 
                  name="command" 
                  placeholder="lp user {player} parent set {priv.group}" 
                  className="col-span-3 border-[#DF2456]/30 focus-visible:ring-[#FB0D68]"
                  defaultValue={currentPackage?.command || 'lp user {player} parent set {priv.group}'}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                className="border-[#DF2456]/30 hover:bg-[#DF2456]/10"
                onClick={() => setShowDonatePackageDialog(false)}
              >
                Отмена
              </Button>
              <Button type="submit" className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white font-medium">
                {currentPackage ? "Сохранить" : "Добавить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showPrivilegeDialog} onOpenChange={setShowPrivilegeDialog}>
        <DialogContent className="sm:max-w-md border-[#DF2456]/30 shadow-lg shadow-[#FB0D68]/5">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {currentPrivilege ? "Редактирование привилегии" : "Добавление новой привилегии"}
            </DialogTitle>
            <DialogDescription>
              Заполните информацию о привилегии для системы доната
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            
            const privilegeData = {
              id: currentPrivilege?.id,
              name: formData.get('name') as string,
              type: formData.get('type') as string,
              description: formData.get('description') as string,
              permission: formData.get('permission') as string,
              command: formData.get('command') as string,
              price: formData.get('price') ? Number(formData.get('price')) : undefined,
              icon: (formData.get('icon') as string) === 'none' ? undefined : (formData.get('icon') as string)
            };
            
            try {
              if (currentPrivilege) {
                // Обновление существующей привилегии через API
                const success = await updatePrivilegeItem(currentPrivilege.id, privilegeData);
                if (success) {
                  showSuccess({
                    type: 'success',
                    title: 'Привилегия обновлена',
                    message: `Привилегия "${privilegeData.name}" успешно обновлена`,
                    variant: 'default'
                  });
                }
              } else {
                // Добавление новой привилегии через API
                const success = await addPrivilegeItem(privilegeData);
                if (success) {
                  showSuccess({
                    type: 'success',
                    title: 'Привилегия создана',
                    message: `Привилегия "${privilegeData.name}" успешно создана`,
                    variant: 'default'
                  });
                }
              }
              
              // Обновляем список привилегий
              await fetchPrivileges();
              setShowPrivilegeDialog(false);
            } catch (error: any) {
              showError({
                type: 'general',
                title: currentPrivilege ? 'Ошибка обновления' : 'Ошибка создания',
                message: error.message || `Не удалось ${currentPrivilege ? 'обновить' : 'создать'} привилегию`,
                variant: 'destructive'
              });
            }
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priv-name" className="text-right">Название</Label>
                <Input 
                  id="priv-name" 
                  name="name" 
                  placeholder="Fly" 
                  className="col-span-3 border-[#DF2456]/30 focus-visible:ring-[#FB0D68]"
                  defaultValue={currentPrivilege?.name || ''}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priv-type" className="text-right">Тип</Label>
                <Select name="type" defaultValue={currentPrivilege?.type || 'permission'}>
                  <SelectTrigger className="col-span-3 border-[#DF2456]/30 focus:ring-[#FB0D68]">
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permission">Право</SelectItem>
                    <SelectItem value="command">Команда</SelectItem>
                    <SelectItem value="feature">Возможность</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priv-price" className="text-right">Цена (₽)</Label>
                <Input 
                  id="priv-price" 
                  name="price" 
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="100" 
                  className="col-span-3 border-[#DF2456]/30 focus-visible:ring-[#FB0D68]"
                  defaultValue={currentPrivilege?.price || ''}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priv-icon" className="text-right">
                  Иконка
                  <span className="block text-xs text-muted-foreground">Опционально</span>
                </Label>
                <Select name="icon" defaultValue={currentPrivilege?.icon || 'none'}>
                  <SelectTrigger className="col-span-3 border-[#DF2456]/30 focus:ring-[#FB0D68]">
                    <SelectValue placeholder="Выберите иконку" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">По умолчанию (от типа)</SelectItem>
                    <SelectItem value="shield">Щит</SelectItem>
                    <SelectItem value="command">Терминал</SelectItem>
                    <SelectItem value="zap">Молния</SelectItem>
                    <SelectItem value="gift">Подарок</SelectItem>
                    <SelectItem value="rocket">Ракета</SelectItem>
                    <SelectItem value="key">Ключ</SelectItem>
                    <SelectItem value="crown">Корона</SelectItem>
                    <SelectItem value="star">Звезда</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priv-description" className="text-right">Описание</Label>
                <Textarea 
                  id="priv-description" 
                  name="description" 
                  placeholder="Позволяет игроку летать..." 
                  className="col-span-3 border-[#DF2456]/30 focus-visible:ring-[#FB0D68]"
                  defaultValue={currentPrivilege?.description || ''}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="permission" className="text-right">Право/Ключ</Label>
                <Input 
                  id="permission" 
                  name="permission" 
                  placeholder="essentials.fly" 
                  className="col-span-3 border-[#DF2456]/30 focus-visible:ring-[#FB0D68]"
                  defaultValue={currentPrivilege?.permission || ''}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priv-command" className="text-right">
                  Команда выдачи
                  <span className="block text-xs text-muted-foreground">Плейсхолдеры: {`{player}`}, {`{priv.perm}`}</span>
                </Label>
                <Input 
                  id="priv-command" 
                  name="command" 
                  placeholder="lp user {player} permission set {priv.perm}" 
                  className="col-span-3 border-[#DF2456]/30 focus-visible:ring-[#FB0D68]"
                  defaultValue={currentPrivilege?.command || 'lp user {player} permission set {priv.perm}'}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                className="border-[#DF2456]/30 hover:bg-[#DF2456]/10"
                onClick={() => setShowPrivilegeDialog(false)}
              >
                Отмена
              </Button>
              <Button type="submit" className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white font-medium">
                {currentPrivilege ? "Сохранить" : "Добавить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 