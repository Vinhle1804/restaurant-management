import guestOnlineApiRequest from "@/apiRequests/onlineGuest"
import { useMutation } from "@tanstack/react-query"

export const useLoginMutation = () =>{
    return useMutation({
        mutationFn: guestOnlineApiRequest.login
    })
}

