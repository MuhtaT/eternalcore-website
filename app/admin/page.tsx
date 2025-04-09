import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getAllUsers, isUserAdmin } from "@/lib/db/database";
import { AdminPanel } from "@/components/admin-panel";

export const metadata: Metadata = {
  title: "Панель администратора | EternalCore",
  description: "Панель управления администратора сервера EternalCore",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!session?.user) {
    console.log("Пользователь не авторизован, перенаправление на /login");
    redirect("/login");
  }
  
  // Проверяем, является ли пользователь администратором
  const userId = Number(session.user.id);
  const isAdmin = await isUserAdmin(userId);
  
  // Если пользователь не администратор, перенаправляем на профиль
  if (!isAdmin) {
    console.log("Пользователь не имеет прав администратора, перенаправление на /profile");
    redirect("/profile");
  }
  
  // Получаем список всех пользователей для панели администратора
  const users = await getAllUsers();
  
  return (
    <AdminPanel users={users} />
  );
} 