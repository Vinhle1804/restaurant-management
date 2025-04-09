export const runtime = "nodejs"
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "sonner";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";
import { DishStatus, OrderStatus, Role, TableStatus } from "@/constants/type";
import envConfig from "@/config";
import { TokenPayload } from "@/types/jwt.types";
import guestApiRequest from "@/apiRequests/guest";
import { BookX, CookingPot, HandCoins, Loader, Truck } from "lucide-react";
import { format } from "date-fns";
import { io } from "socket.io-client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setError: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast("Lỗi", {
      description: error?.payload?.message ?? "Lỗi không xác định", // Cần truyền description vào đúng cấu trúc
      duration: duration ?? 5000, // tùy chọn
    });
  }
};

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

const isBrowser = typeof window != "undefined";

export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("accessToken") : null;

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("refreshToken") : null;

export const setAccessTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("accessToken", value);

export const setRefreshToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("refreshToken", value);

export const removeTokenFromLocalStorage = () => {
  if (isBrowser) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

export const decodeToken = (token: string) => {
  const decoded = jwt.decode(token);
  if (!decoded) {
    throw new Error('Token không hợp lệ hoặc không thể giải mã');
  }
  return decoded as TokenPayload;
};

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
  force?: boolean
}) => {
  //kh nen dua lo gic lay 2 token ra khoi function nay(checkandrefreshToken)
  //vi de moi lan ma checkAndRefreshToken() dc goi thi chung ta se co 1 access va 1 refresh moi
  //tranh hien tuong bug no lay access va refresh cu o lan dau goi cho cac lan tiep theo
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();
  //chua dang nhap thi cung k cho chay
  if (!accessToken || !refreshToken) {
    return;
  }
  const decodeAccessToken = decodeToken(accessToken) 
  const decodeRefreshToken = decodeToken(refreshToken) 
  //thoi diem het han cua token dc tinh theo epoch time (s)
  //con khi dung cu phap new Date().getTime() thi no se tra ve epoch time (ms)
  const now = (new Date().getTime() / 1000)-1
  //truong hop refresh token het han thi cho logout
  if (decodeRefreshToken.exp <= now) {
    removeTokenFromLocalStorage();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    param?.onError && param.onError();
   return;
  }
  //vi du access token cua chung ta co thoi gian het han la 10s
  //thi minh se kiem tra con 1/3 thoi gian (3s) thi se cho refresh token
  //thoi gian con lai dc tinh theo cong thuc: decodedAccessToken.exp-decodedAccessToken.iat
  if(param?.force || (
    decodeAccessToken.exp - now <
    (decodeAccessToken.exp - decodeAccessToken.iat) / 3
  ) ) {
    try {

      const role = decodeToken(refreshToken).role
      const res = role === Role.Guest ? await guestApiRequest.refreshToken() : await authApiRequest.refreshToken();
      setAccessTokenToLocalStorage(res.payload.data.accessToken);
      setRefreshToLocalStorage(res.payload.data.refreshToken);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      param?.onSuccess && param.onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      param?.onError && param.onError();
    }
  }
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(number)
}

export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    default:
      return 'Ẩn'
  }
}

export const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
  switch (status) {
    case OrderStatus.Delivered:
      return 'Đã phục vụ'
    case OrderStatus.Paid:
      return 'Đã thanh toán'
    case OrderStatus.Pending:
      return 'Chờ xử lý'
    case OrderStatus.Processing:
      return 'Đang nấu'
    default:
      return 'Từ chối'
  }
}

export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn'
    case TableStatus.Reserved:
      return 'Đã đặt'
    default:
      return 'Ẩn'
  }
}
export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return envConfig.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token
}

export function removeAccents(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(removeAccents(matchText.trim().toLowerCase()))
}

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss dd/MM/yyyy')
}

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss')
}

export const generateSocketInstance = (accessToken: string) =>{
  return io(envConfig.NEXT_PUBLIC_API_ENDPOINT,{
    auth:{
        Authorization: `Bearer ${accessToken}`
    }
})
}

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins
}



