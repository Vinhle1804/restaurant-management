'use client'
import { useState, useEffect, FormEvent } from "react";
import Swal from "sweetalert2";
import { Dish } from "@/types/dish";
import { PaymentMethod } from "@/constants/orders";
import { toast } from "sonner";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface UseOrderProps {
  dishes: Dish[];
  calculateSubtotal: () => number;
  getDeliveryFee: () => number;
  paymentMethod: PaymentMethod;
}

export const useOrder = ({
  dishes,
  calculateSubtotal,
  getDeliveryFee,
  paymentMethod,
}: UseOrderProps) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);
    // 2. Lấy dữ liệu đã lưu trong Redux store
  const deliveryAddress = useSelector(
    (state: RootState) => state.delivery.defaultAddress
  );

  // Calculate total price whenever dependencies change
  useEffect(() => {
    const subtotal = calculateSubtotal();
    const deliveryFee = getDeliveryFee();
    setTotalPrice(subtotal + deliveryFee);
  }, [dishes, calculateSubtotal, getDeliveryFee]);

  // Handle order submission
  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();

    if (!deliveryAddress) {
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

    setSubmitting(true);

    try {
      // Construct order data
      const orderData = {
        items: dishes.map((dish) => ({
          dishId: dish.id,
          quantity: dish.quantity,
        })),
      deliveryAddress,
       paymentMethod,
      totalPrice
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
