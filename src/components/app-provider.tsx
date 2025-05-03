/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import RefreshToken from './refresh-token';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { decodeToken, getAccessTokenFromLocalStorage, removeTokenFromLocalStorage } from '@/lib/utils'; // Sửa 'remmove' thành 'remove'
import { RoleType } from '@/types/jwt.types';
import { Socket } from 'socket.io-client';
import ListenLogoutSocket from './listen-logout-socket';
import { generateSocketInstance } from '@/lib/socket';

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
  socket: undefined as Socket | undefined,
  setSocket:(socket?: Socket |undefined) =>{},
  disconnectSocket: () => {}
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | undefined>()
  const [role, setRoleState] = useState<RoleType | undefined>();
  const count = useRef(0)
  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      const decodedRole = decodeToken(accessToken).role;
      setRoleState(decodedRole);
      setSocket(generateSocketInstance(accessToken))
    }
    count.current ++
  }, []);

const disconnectSocket = useCallback(()=>{
  socket?.disconnect()
  setSocket(undefined)
},[socket, setSocket])


  const setRole = (role?: RoleType | undefined) => {
    setRoleState(role);
    if (!role) {
      removeTokenFromLocalStorage(); // Only remove token if no role
    }
  };
const isAuth = Boolean(role);
  return (
    <AppContext.Provider value={{ role, setRole, isAuth, socket, setSocket, disconnectSocket }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ListenLogoutSocket/>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
