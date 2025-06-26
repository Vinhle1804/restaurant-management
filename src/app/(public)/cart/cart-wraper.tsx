"use client";
import { useDeliveryOptions } from "@/hooks/useDeliveryOptions";
import Cart from "./components/Cart";

export default function CartWrapper() {
  const {
    selectedDelivery,
    setSelectedDelivery,
    getDeliveryFee
  } = useDeliveryOptions();

  return (
    <Cart
      selectedDelivery={selectedDelivery}
      setSelectedDelivery={setSelectedDelivery}
      getDeliveryFee={getDeliveryFee}
    />
  );
}
