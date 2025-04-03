'use client'

import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
  import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import RefreshToken from './refresh-token'
import { createContext, useContext, useEffect, useState } from 'react'
import { getAccessTokenFromLocalStorage, remmoveTokenFromLocalStorage } from '@/lib/utils'
  

  const queryClient = new QueryClient({
    defaultOptions:{
        queries:{
            refetchOnWindowFocus: false,
            refetchOnMount: false
        }
    }
  })

const AppContext = createContext({
  isAuth: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIsAuth: (isAuth: boolean)=>{

  }
})
export const useAppContext = () =>{
  return useContext(AppContext)
}

  export default function AppProvider({children}:{children: React.ReactNode}){
    const [isAuth, setIsAuthState] = useState(false)
    useEffect(()=>{
      const accessToken = getAccessTokenFromLocalStorage()
      if(accessToken){
        setIsAuthState(true)
      }
    },[])
const setIsAuth = (isAuth: boolean) =>{
  if(isAuth){
    setIsAuthState(true)
  }else{
    setIsAuthState(false)
    remmoveTokenFromLocalStorage()
  }
}
    return (
        <AppContext.Provider value={{isAuth, setIsAuth}}>
      <QueryClientProvider client={queryClient}>
          {children}
          <RefreshToken/>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        </AppContext.Provider>
       
      )
  }