import http from "@/lib/http";
import { 

    RefreshTokenResType
} from "@/schemaValidations/auth.schema";
import { GuestOnlineCreateOrdersBodyType, GuestOnlineCreateOrdersResType } from "@/schemaValidations/onlineGuest.schema";

const guestOnlineApiRequest = {
    refreshTokenRequest: null as Promise<{ status: number; payload: RefreshTokenResType }> | null,


    

 


  
   
    order:(body: GuestOnlineCreateOrdersBodyType) => http.post<GuestOnlineCreateOrdersResType>('/online/orders',body,),
};

export default guestOnlineApiRequest;
