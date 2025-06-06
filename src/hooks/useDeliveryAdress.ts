import { useState, useEffect } from "react";
import { Address } from "@/types/adress";


export const useDeliveryAddress = () => {
  const [deliveryAddress, setDeliveryAddress] = useState<Address | null>(null);
  const [showDetailInput, setShowDetailInput] = useState(false);

  useEffect(() => {
    // Check if there's an address in localStorage
    const savedAddress = localStorage.getItem("deliveryAddress");
    if (savedAddress) {
      try {
        setDeliveryAddress(JSON.parse(savedAddress));
      } catch (e) {
        console.error("Error parsing saved address", e);
      }
    }
  }, []);

  // Handle when user adds or changes the main address
  const handleAddressAdded = (address: Address) => {
    setDeliveryAddress(address);
    // Save address to localStorage to retain it when refreshing the page
    localStorage.setItem("deliveryAddress", JSON.stringify(address));
  };

  // Handle address update including details
  const handleAddressUpdate = (updates: Partial<Address>) => {
    if (!deliveryAddress) return;

    const updatedAddress = { ...deliveryAddress, ...updates };
    setDeliveryAddress(updatedAddress);

    // Save updated address to localStorage
    localStorage.setItem("deliveryAddress", JSON.stringify(updatedAddress));
  };

  // Handle user input for notes
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleAddressUpdate({ addressNotes: e.target.value });
  };

  // Handle edit address button click
  const handleEditAddress = () => {
    setShowDetailInput(true);
  };

  // Format address for display
  const getFormattedAddress = () => {
    if (!deliveryAddress) return "";
    return `${deliveryAddress.addressDetail}, ${deliveryAddress.ward}, ${deliveryAddress.districtName}, ${deliveryAddress.provinceName}`;
  };

  return {
    deliveryAddress,
    showDetailInput,
    setShowDetailInput,
    handleAddressAdded,
    handleAddressUpdate,
    handleNotesChange,
    handleEditAddress,
    getFormattedAddress
  };
};