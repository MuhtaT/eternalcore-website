'use client';

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

type Props = {
  children?: React.ReactNode;
};

// Компонент-обертка для отслеживания изменений в сессии
function SessionMonitor() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Статус сессии изменился:", status);
    if (session) {
      console.log("Пользователь вошел в систему:", session.user?.email);
    }
  }, [session, status]);

  return null;
}

export const NextAuthProvider = ({ children }: Props) => {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      <SessionMonitor />
      {children}
    </SessionProvider>
  );
}; 