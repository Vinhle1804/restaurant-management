import http from "@/lib/http";
import { 
    LoginBodyType, 
    LoginResType, 
    LogoutBodyType, 
    RefreshTokenBodyType, 
    RefreshTokenResType
} from "@/schemaValidations/auth.schema";

const authApiRequest = {
    refreshTokenRequest: null as Promise<{ status: number; payload: RefreshTokenResType }> | null,

    sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),

    login: (body: LoginBodyType) => http.post<LoginResType>('api/auth/login', body, { baseUrl: '' }),

    sLogout: (body: LogoutBodyType & { accessToken: string }) =>
        http.post('/auth/logout', { refreshToken: body.refreshToken }, {
            headers: {
                Authorization: `Bearer ${body.accessToken}`
            }
        }),

    logout: () => http.post('/api/auth/logout', null, { baseUrl: '' }),

    sRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('auth/refresh-token', body),

    async refreshToken() {
        if (this.refreshTokenRequest) {
            return this.refreshTokenRequest; // Nếu request đang chạy, trả về promise đang chờ
        }

        this.refreshTokenRequest = http.post<RefreshTokenResType>('/api/auth/refresh-token', null, { baseUrl: '' });

        try {
            const result = await this.refreshTokenRequest;
            return result;
        } finally {
            this.refreshTokenRequest = null; // Reset lại sau khi request hoàn thành
        }
    }
};

export default authApiRequest;
