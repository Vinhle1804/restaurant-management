'use client'
import { useState } from "react";
import { PaymentMethod } from "@/constants/orders";


export const usePaymentMethod = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.MoMo
  );
  const [showOptions, setShowOptions] = useState(false);

  // Handle payment method selection
  const handleSelectPayment = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setShowOptions(false);
  };

  return {
    paymentMethod,
    showOptions,
    setShowOptions,
    handleSelectPayment
  };
};