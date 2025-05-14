import { useState } from "react";
import { useGetDeliveryFeeListQuery } from "@/queries/useOrder";


export const useDeliveryOptions = () => {
  const [selectedDelivery, setSelectedDelivery] = useState("fast");
  const [utensilsNeeded, setUtensilsNeeded] = useState(false);
  const {data} = useGetDeliveryFeeListQuery()

  // Get delivery fee based on selected option
  const getDeliveryFee = () => {
    return data?.payload.data.find((option) => option.code === selectedDelivery)?.baseFee || 0;
  };

  return {
    selectedDelivery,
    setSelectedDelivery,
    utensilsNeeded,
    setUtensilsNeeded,
    getDeliveryFee
  };
};