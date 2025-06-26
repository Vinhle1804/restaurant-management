"use client";
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useDishListQuery } from "@/queries/useDish";
import { 
  decreaseQuantity, 
  increaseQuantity, 
  removeItem 
} from "@/redux/action/cartAction";
import type { AppDispatch } from "@/redux/store";
import Swal from "sweetalert2";
import { Dish } from "@/types/dish";


export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const cart = useSelector((state: RootState) => state.cart.cart);

  const { data } = useDishListQuery();

  const handleIncreaseQuantity = (id: number) => {
    dispatch(increaseQuantity(id));
  };

  const handleDecreaseQuantity = (id: number, quantity: number) => {
    if (quantity > 1) {
      dispatch(decreaseQuantity(id));
    } else {
      Swal.fire({
        title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) dispatch(removeItem(id));
      });
    }
  };

  const calculateSubtotal = useCallback(() => {
    return dishes.reduce(
      (total, dish) => total + dish.price * dish.quantity,
      0
    );
  }, [dishes]);

  useEffect(() => {
    const fetchDishes = () => {
      setLoading(true);
      try {
        const dishIds = cart.map((item) => item.dishId);

        if (dishIds.length > 0 && data?.payload?.data) {
          const cartMap = new Map(
            cart.map((item) => [item.dishId, item.quantity])
          );

          const dishesWithQuantity = data.payload.data
            .filter((dish) => cartMap.has(dish.id))
            .map((dish) => ({
              ...dish,
              quantity: cartMap.get(dish.id) || 0,
            }));

          setDishes(dishesWithQuantity);
        } else {
          setDishes([]);
        }
      } catch (error) {
        console.error("Không thể lấy thông tin món ăn:", error);
        setDishes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [cart, data]);

  return {
    dishes,
    loading,
    calculateSubtotal,
    handleIncreaseQuantity,
    handleDecreaseQuantity
  };
};