import envConfig from '@/config';
import { io } from 'socket.io-client';
import { getAccessTokenFromLocalStorage } from './utils';

const socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT,{
    auth:{
        Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`
    },
    autoConnect: false
})

export default socket

export const generateSocketInstance = (accessToken: string) =>{
  return io(envConfig.NEXT_PUBLIC_API_ENDPOINT,{
    auth:{
        Authorization: `Bearer ${accessToken}`
    }
})
}