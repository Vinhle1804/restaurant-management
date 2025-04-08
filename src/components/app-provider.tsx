/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import RefreshToken from './refresh-token';
import { createContext, useContext, useEffect, useState } from 'react';
import { decodeToken, getAccessTokenFromLocalStorage, removeTokenFromLocalStorage } from '@/lib/utils'; // Sửa 'remmove' thành 'remove'
import { RoleType } from '@/types/jwt.types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime:1000*6
    },
  },
});

const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<RoleType | undefined>();

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      const decodedRole = decodeToken(accessToken).role;
      setRoleState(decodedRole);
    }
  }, []);

  const setRole = (role?: RoleType | undefined) => {
    setRoleState(role);
    if (!role) {
      removeTokenFromLocalStorage(); // Only remove token if no role
    }
  };
const isAuth = Boolean(role);
  return (
    <AppContext.Provider value={{ role, setRole, isAuth }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
