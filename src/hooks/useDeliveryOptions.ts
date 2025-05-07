import { useState } from "react";
import { deliveryOptions } from "@/constants/deliveryOptions";


export const useDeliveryOptions = () => {
  const [selectedDelivery, setSelectedDelivery] = useState("fast");
  const [utensilsNeeded, setUtensilsNeeded] = useState(false);

  // Get delivery fee based on selected option
  const getDeliveryFee = () => {
    return deliveryOptions.find((option) => option.id === selectedDelivery)?.price || 0;
  };

  return {
    selectedDelivery,
    setSelectedDelivery,
    utensilsNeeded,
    setUtensilsNeeded,
    getDeliveryFee
  };
};