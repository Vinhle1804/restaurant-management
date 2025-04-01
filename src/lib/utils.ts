import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { EntityError } from "./http"
import { toast } from "sonner"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const handleErrorApi = ({error, setError, duration}:{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setError: UseFormSetError<any>
  duration?: number
}) =>{
if(error instanceof EntityError && setError){
  error.payload.errors.forEach(item =>{
    setError(item.field ,{
      type: 'server',
      message: item.message
    })
  })
}else{

 toast("Lỗi", {
    description: error?.payload?.message ?? "Lỗi không xác định", // Cần truyền description vào đúng cấu trúc
    duration: duration ?? 5000, // tùy chọn
  });
  
}
}


/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}


const isBrowser = typeof window != 'undefined'

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('accessToken'): null
} 
export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('refreshToken') : null
} 


