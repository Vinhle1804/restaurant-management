import http from "@/lib/http";
import queryString from "query-string";

import { GetOrdersOnlineQueryParamsType, UpdateOrderOnlineBodyType, UpdateOrderOnlineResType } from "@/schemaValidations/onlineOrder.schema";
import { GetOrdersOnlineResType } from "@/schemaValidations/onlineGuest.schema";

const onlineOrderApiRequest = {
    getOrderOnlineList: (queryParams: GetOrdersOnlineQueryParamsType) => 
        http.get<GetOrdersOnlineResType>('/e-orders?'+ queryString.stringify({
            fromDate: queryParams.fromDate?.toISOString(),
            toDate: queryParams.toDate?.toISOString()
        })),
    updateOrderOnline:(orderId: number, body:UpdateOrderOnlineBodyType) =>
        http.put<UpdateOrderOnlineResType>(`/e-orders/${orderId}`, body)

    

}
export default onlineOrderApiRequest