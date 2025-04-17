'use client'

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slide/cartSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// Tạo type cho RootState (state toàn cục) và AppDispatch (dispatch có hỗ trợ thunk)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
