import guestOnlineApiRequest from "@/apiRequests/onlineGuest"
import { useMutation } from "@tanstack/react-query"

export const useGuestOnlineOrderMutation = () =>{
    return useMutation({
        mutationFn: guestOnlineApiRequest.order
    })
}