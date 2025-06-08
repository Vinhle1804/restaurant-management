import { useState, useEffect } from "react";
import { Address } from "@/types/adress";
import { useAccountMe} from "@/queries/useAccount";


export const useDeliveryAddress = () => {
  const [deliveryAddress, setDeliveryAddress] = useState<Address | null>(null);
  const [showDetailInput, setShowDetailInput] = useState(false);
  const {data} = useAccountMe()
  const addressDefault = data?.payload.data.defaultAddress
  const addressDefaultId = data?.payload.data.defaultAddressId
  console.log(addressDefault,"hehehe");

  useEffect(() => {

    // Check if there's an address in localStorage
    if (addressDefault) {
      try {
        setDeliveryAddress(addressDefault);
        console.log(1);
      } catch (e) {
        console.error("Error parsing saved address", e);
      }
    }
  }, [addressDefault]);


  return {
    deliveryAddress,
    showDetailInput,
    setShowDetailInput,
    addressDefaultId
  };
};