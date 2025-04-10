import http from "@/lib/http";
import { 
    LoginBodyType, 
    LoginResType, 
    LogoutBodyType, 
    // RefreshTokenBodyType, 
    RefreshTokenResType
} from "@/schemaValidations/auth.schema";

const guestOnlineApiRequest = {
    refreshTokenRequest: null as Promise<{ status: number; payload: RefreshTokenResType }> | null,

    sLogin: (body: LoginBodyType) => http.post<LoginResType>('online/login', body),

    login: (body: LoginBodyType) => http.post<LoginResType>('/api/online/login', body, { baseUrl: '' }),
    

    sLogout: (body: LogoutBodyType & { accessToken: string }) =>
        http.post('online/auth/logout', { refreshToken: body.refreshToken }, {
            headers: {
                Authorization: `Bearer ${body.accessToken}`
            }
        }),

    logout: () => http.post('/api/online/logout', null, { baseUrl: '' }),

    // sRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('online/refresh-token', body),

    // async refreshToken() {
    //     if (this.refreshTokenRequest) {
    //         return this.refreshTokenRequest; // Nếu request đang chạy, trả về promise đang chờ
    //     }

    //     this.refreshTokenRequest = http.post<RefreshTokenResType>('/api/online/refresh-token', null, { baseUrl: '' });

    //     try {
    //         const result = await this.refreshTokenRequest;
    //         return result;
    //     } finally {
    //         this.refreshTokenRequest = null; // Reset lại sau khi request hoàn thành
    //     }
    // }
};

export default guestOnlineApiRequest
