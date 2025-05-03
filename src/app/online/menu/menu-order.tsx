"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDishListQuery } from "@/queries/useDish";
import { cn, formatCurrency } from "@/lib/utils";
import Quantity from "./quantity";
import { useMemo, useState } from "react";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import { DishStatus } from "@/constants/dishs";
import { useDispatch } from "react-redux";
import { addtoCart } from "@/redux/action/cartAction";
import { AppDispatch } from "@/redux/store";

// fake data

export default function MenuOrder() {
  const { data } = useDishListQuery();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dishes = data?.payload.data ?? [];
  const dispatch = useDispatch<AppDispatch>();

  const [orders, setOrder] = useState<GuestCreateOrdersBodyType>([]);
  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrder((prevOrders) => {
      const index = prevOrders.findIndex((order) => order.dishId === dishId);

      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId);
      }
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }];
      }
      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };
  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id);
      if (!order) return result;
      return result + order.quantity * dish.price;
    }, 0);
  }, [dishes, orders]);

  const addToCart = () => {
    dispatch(addtoCart(orders));
    
  };
  
  

  console.log(orders);
  return (
    <>
      {dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
          <div
            key={dish.id}
            className={cn("flex gap-4", {
              "pointer-events-none": dish.status === DishStatus.Unavailable,
            })}
          >
            <div className="flex-shrink-0 relative">
              {dish.status === DishStatus.Unavailable && (
                <span className="absolute inset-0 flex items-center justify-center text-sm">
                  Sold out!!
                </span>
              )}
              <Image
                src={dish.image}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                className="object-cover w-[80px] h-[80px] rounded-md"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm">{dish.name}</h3>
              <p className="text-xs">{dish.description}</p>
              <p className="text-xs font-semibold">
                {formatCurrency(dish.price)}đ
              </p>
            </div>
            <div className="flex-shrink-0 ml-auto flex justify-center items-center">
              <Quantity
                onChange={(value) => handleQuantityChange(dish.id, value)}
                value={
                  orders.find((orders) => orders.dishId === dish.id)
                    ?.quantity ?? 0
                }
              />
            </div>
          </div>
        ))}
      <div className="sticky bottom-0">
        <Button
          className="w-full justify-between"
          onClick={addToCart}
          disabled={orders.length === 0}
        >
          <span>Dat hang · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)} </span>
        </Button>
      </div>
    </>
  );
}
