import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { EntityError } from "./http"
import { toast } from "sonner"
import jwt from 'jsonwebtoken'
import authApiRequest from "@/apiRequests/auth"


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

export const getAccessTokenFromLocalStorage = () => 
  isBrowser ? localStorage.getItem('accessToken'): null

export const getRefreshTokenFromLocalStorage = () => 
  isBrowser ? localStorage.getItem('refreshToken') : null


export const setAccessTokenToLocalStorage = (value: string) => 
 isBrowser && localStorage.setItem('accessToken', value)

export const setRefreshToLocalStorage = (value: string) => 
  isBrowser && localStorage.setItem('refreshToken', value)

export const checkAndRefreshToken = async (param?: {
   onError?: () => void 
   onSuccess?: () => void  
  }) => {
  //kh nen dua lo gic lay 2 token ra khoi function nay(checkandrefreshToken)
  //vi de moi lan ma checkAndRefreshToken() dc goi thi chung ta se co 1 access va 1 refresh moi
  //tranh hien tuong bug no lay access va refresh cu o lan dau goi cho cac lan tiep theo
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  //chua dang nhap thi cung k cho chay
  if(!accessToken || !refreshToken){
      return
  }
  const decodeAccessToken = jwt.decode(accessToken) as {
      exp: number
      iat: number
  }
  const decodeRefreshToken = jwt.decode(refreshToken) as {
      exp: number
      iat: number
  }
  //thoi diem het han cua token dc tinh theo epoch time (s)
  //con khi dung cu phap new Date().getTime() thi no se tra ve epoch time (ms)
  const now = Math.round(new Date().getTime()/1000)
  //truong hop refresh token het han thi k xu ly nua
  if(decodeRefreshToken.exp <= now){return}
  //vi du access token cua chung ta co thoi gian het han la 10s
  //thi minh se kiem tra con 1/3 thoi gian (3s) thi se cho refresh token
  //thoi gian con lai dc tinh theo cong thuc: decodedAccessToken.exp-decodedAccessToken.iat
  if(decodeAccessToken.exp- now <(decodeAccessToken.exp - decodeAccessToken.iat)/3){
      try {
          const res = await authApiRequest.refreshToken()
          setAccessTokenToLocalStorage(res.payload.data.accessToken)
          setRefreshToLocalStorage(res.payload.data.refreshToken)
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          param?.onSuccess && param.onSuccess()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        param?.onError && param.onError()
      }
  }
}


