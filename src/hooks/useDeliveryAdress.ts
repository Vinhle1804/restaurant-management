"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setDefaultAddress, setAddressIdDefault } from "@/redux/slide/deliverySlide";
import { useAccountMe } from "@/queries/useAccount";

export const useDeliveryAddress = () => {
  const [showDetailInput, setShowDetailInput] = useState(false);
  const dispatch = useDispatch();

  // 1. Lấy dữ liệu từ API
  const { data } = useAccountMe();
  const addressDefault = data?.payload.data.defaultAddress;
  const addressDefaultId = data?.payload.data.defaultAddressId;

  // 2. Lấy dữ liệu đã lưu trong Redux store
  const deliveryAddress = useSelector(
    (state: RootState) => state.delivery.defaultAddress
  );

  // 3. Khi API trả dữ liệu, lưu vào Redux
  useEffect(() => {
    if (addressDefault) {
      dispatch(setDefaultAddress(addressDefault));
    }
    if (addressDefaultId) {
      dispatch(setAddressIdDefault(addressDefaultId));
    }
  }, [addressDefault, addressDefaultId, dispatch]);

  return {
    deliveryAddress,
    showDetailInput,
    setShowDetailInput,
    addressDefaultId,
  };
};
