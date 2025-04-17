'use client'

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  dishId: number;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
}

const initialState: CartState = {
  cart: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("cart") || "[]") : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.cart = action.payload;
    },
  },
});

export const { setCart } = cartSlice.actions;
export default cartSlice.reducer;
