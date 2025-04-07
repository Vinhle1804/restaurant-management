import http from "@/lib/http";
import { 
    LoginBodyType,
    LogoutBodyType, 
    RefreshTokenBodyType, 
    RefreshTokenResType
} from "@/schemaValidations/auth.schema";
import { GuestCreateOrdersBodyType, GuestCreateOrdersResType, GuestGetOrdersResType, GuestLoginBodyType, GuestLoginResType } from "@/schemaValidations/guest.schema";

const guestApiRequest = {
    refreshTokenRequest: null as Promise<{ status: number; payload: RefreshTokenResType }> | null,

    sLogin: (body: GuestLoginBodyType) => http.post<GuestLoginResType>('/guest/auth/login', body),

    login: (body: GuestLoginBodyType) => http.post<GuestLoginResType>('/api/guest/auth/login', body, { baseUrl: '' }),
    

    sLogout: (body: LogoutBodyType & { accessToken: string }) =>
        http.post<LoginBodyType>('/guest/auth/logout', { refreshToken: body.refreshToken }, {
            headers: {
                Authorization: `Bearer ${body.accessToken}`
            }
        }),

    logout: () => http.post('/api/guest/auth/logout', null, { baseUrl: '' }),

    sRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('/guest/auth/refresh-token', body),

  
    async refreshToken() {
        if (this.refreshTokenRequest) {
            return this.refreshTokenRequest; // Nếu request đang chạy, trả về promise đang chờ
        }

        this.refreshTokenRequest = http.post<RefreshTokenResType>('/api/guest/auth/refresh-token', null, { baseUrl: '' });

        try {
            const result = await this.refreshTokenRequest;
            return result;
        } finally {
            this.refreshTokenRequest = null; // Reset lại sau khi request hoàn thành
        }
    },
    order:(body: GuestCreateOrdersBodyType) => http.post<GuestCreateOrdersResType>('/guest/orders',body,),
    getOrderList: () => http.get<GuestGetOrdersResType>('/guest/orders')
};

export default guestApiRequest;
