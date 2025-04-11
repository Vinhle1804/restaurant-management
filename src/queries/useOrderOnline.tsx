import onlineOrderApiRequest from "@/apiRequests/onlineOrder";
import { GetOrdersOnlineQueryParamsType, UpdateOrderOnlineBodyType } from "@/schemaValidations/onlineOrder.schema";
import {
} from "@/schemaValidations/order.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUpdateOrderOnlineMutation = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      ...body
    }: UpdateOrderOnlineBodyType & {
      orderId: number;
    }) => onlineOrderApiRequest.updateOrderOnline(orderId, body),
  });
};

export const useGetOrderOnlineListQuery = (queryParams: GetOrdersOnlineQueryParamsType) => {
  return useQuery({
    queryFn: () => onlineOrderApiRequest.getOrderOnlineList(queryParams),
    queryKey: ["orders-online", queryParams],
  });
};


