"use client";
import { useState } from "react";
import { useGetDeliveryFeeListQuery } from "@/queries/useOrder";


export const useDeliveryOptions = () => {
  const [selectedDelivery, setSelectedDelivery] = useState("DELIVERY002");
  const {data} = useGetDeliveryFeeListQuery()

  // Get delivery fee based on selected option
  const getDeliveryFee = () => {
    return data?.payload.data.find((option) => option.code === selectedDelivery)?.baseFee || 0;
  };

  return {
    selectedDelivery,
    setSelectedDelivery,
    getDeliveryFee
  };
};