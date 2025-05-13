import { DishStatusType } from "@/constants/dishs";

export interface Dish {
    id: number;
    quantity: number;
    name: string;
    price: number;
    description: string;
    image: string;
    status: DishStatusType;
  }