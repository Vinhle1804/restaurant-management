import http from "@/lib/http";
import { LoginBodyType, LoginResType, LogoutBodyType} from "@/schemaValidations/auth.schema";

const authApiRequest = {
    sLogin:(body:LoginBodyType)=> http.post<LoginResType>('/auth/login',body),
    login:(body:LoginBodyType)=> http.post<LoginResType>('api/auth/login',body,{baseUrl:''}),
    sLogout:(body: LogoutBodyType & {accessToken: string}) => http.post('/auth/logout',{refreshToken: body.refreshToken},
        {headers:{
        Authorization: `Bearer ${body.accessToken}`
    }}),
    logout:() => http.post('/api/auth/logout',null, {baseUrl:''})// client goi den route handler, k can truyen at&rt vi tu dong gui den thong qua cookie r
}

export default authApiRequest