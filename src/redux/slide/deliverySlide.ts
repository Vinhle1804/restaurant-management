import { Address } from "@/types/adress";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DeliveryState {
  defaultAddress: Address | null;
  addressIdDefault: number | null; 
}

const initialState: DeliveryState = {
  defaultAddress: null,
  addressIdDefault: null,
};

const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    // Cập nhật địa chỉ mặc định
    setDefaultAddress(state, action: PayloadAction<Address>) {
      state.defaultAddress = action.payload;
    },

    // Cập nhật ID địa chỉ mặc định
    setAddressIdDefault(state, action: PayloadAction<number>) {
      state.addressIdDefault = action.payload;
    },


  },
});

// Export action để dùng trong component
export const { setDefaultAddress, setAddressIdDefault} =
  deliverySlice.actions;

// Export reducer để thêm vào store
export default deliverySlice.reducer;
