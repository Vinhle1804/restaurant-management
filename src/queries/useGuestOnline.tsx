import guestOnlineApiRequest from "@/apiRequests/onlineGuest"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useGuestOnlineOrderMutation = () =>{
    return useMutation({
        mutationFn: guestOnlineApiRequest.order
    })
}
export const useGuestOnlineGetOrderListQuery = () =>{
    return useQuery({
        queryFn: guestOnlineApiRequest.getOrderList,
        queryKey: ['online-orders'],
    })
    }