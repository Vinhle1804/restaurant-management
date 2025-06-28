"use client";
import { useState, useEffect, FormEvent } from "react";
import Swal from "sweetalert2";
import { Dish } from "@/types/dish";
import { PaymentMethod } from "@/constants/orders";
import { toast } from "sonner";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { DeliveryFeeOption } from "./useDeliveryOptions";

interface UseOrderProps {
  dishes: Dish[];
  calculateSubtotal: () => number;
  getDeliveryFee: () => number;
  selectedDelivery: DeliveryFeeOption | null;
  paymentMethod: PaymentMethod;
}

export const useOrder = ({
  dishes,
  calculateSubtotal,
  getDeliveryFee,
  selectedDelivery,
  paymentMethod,
}: UseOrderProps) => {
  const [deliveryOptionId, setDeliveryOptionId] =
    useState<number | undefined>(undefined);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  console.log(deliveryFee);
  const [submitting, setSubmitting] = useState(false);
  // 2. Lấy dữ liệu đã lưu trong Redux store
  const deliveryAddressId = useSelector(
    (state: RootState) => state.delivery.defaultAddress?.id
  );

  // Calculate total price whenever dependencies change
  useEffect(() => {
    const sellect = selectedDelivery?.id;
    const subtotal = calculateSubtotal();
    const deliveryFee = getDeliveryFee();
    setDeliveryOptionId(sellect);
    setDeliveryFee(deliveryFee);
    setTotalPrice(subtotal + deliveryFee);
  }, [dishes, calculateSubtotal, getDeliveryFee, selectedDelivery]);

  // Handle order submission
  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();

    if (!deliveryAddressId) {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng thêm địa chỉ giao hàng",
        icon: "error",
      });
      return;
    }

    if (dishes.length === 0) {
      Swal.fire({
        title: "Lỗi",
        text: "Giỏ hàng của bạn đang trống",
        icon: "error",
      });
      return;
    }
    if(!deliveryOptionId){
          Swal.fire({
        title: "Lỗi",
        text: "Vui long chon goi giao hang",
        icon: "error",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Construct order data
      const orderData = {
        items: dishes.map((dish) => ({
          dishId: dish.id,
          quantity: dish.quantity,
        })),
        deliveryAddressId,
        paymentMethod,
        totalPrice,
        deliveryOptionId,
      };

      // Here you would normally send the order to your API
      console.log("Submitting order:", orderData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      toast("success", {
        description: "dat hang thanh cong",
      });

      // Here you might want to clear the cart or redirect to an order confirmation page
    } catch (error) {
      console.error("Error submitting order:", error);
      toast("fail", {
        description: "dat hang that bai",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    totalPrice,
    submitting,
    handleSubmitOrder,
  };
};
