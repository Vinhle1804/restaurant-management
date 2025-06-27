"use client";
import { calculateDeliveryFee } from "@/utils/delivery";
import { useState } from "react";

export type DeliveryFeeOption = {
  code: string;
  baseFee: number;
  extraFeePerKm: number;
  maxDistance: number;
}

export const useDeliveryOptions = () => {
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryFeeOption | null >(null);

  const distance = 5; // 5km ví dụ

  // Get delivery fee based on selected option
  const getDeliveryFee = () => {
    if (!selectedDelivery) return 0;
    return calculateDeliveryFee(distance, selectedDelivery);
  };
  
  
  return {
    selectedDelivery,
    setSelectedDelivery,
    getDeliveryFee
  };
};