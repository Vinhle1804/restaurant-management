"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight, ChevronLeft, Trash2, Edit, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { AddressType } from "@/schemaValidations/account.schema";
import { useGetAddressListQuery } from "@/queries/useAccount";
import AddNewAddress from "./add-delivery-address";
import { Address } from "@/types/adress";

type FormData = {
  addresses: AddressType[];
  selectedAddressId: number | null;
  defaultAddressId: number | null;
};

// Props interface để parent component có thể nhận địa chỉ đã chọn
interface AddressListProps {
  onAddressSelect?: (address: AddressType) => void;
   deliveryAddress: Address;
}

const AddressList = ({ onAddressSelect, deliveryAddress }: AddressListProps) => {
  const [open, setOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const form = useForm<FormData>({
    defaultValues: {
      addresses: [],
      selectedAddressId: null,
      defaultAddressId: null,
    },
  });

  const watchedSelectedId = form.watch("selectedAddressId");
  const watchedDefaultId = form.watch("defaultAddressId");
  const addresses = form.watch("addresses");

  


  // Lấy dữ liệu địa chỉ từ API
  const { data, isLoading, error } = useGetAddressListQuery();

//   const reset = () => {
//   form.reset({
//     addresses: data?.payload?.data || [],
//     selectedAddressId: null,
//     defaultAddressId: null,
//   });
// };

  
  // Xử lý dữ liệu từ API
  useEffect(() => {
    if (data?.payload?.data) {
      const addressData = Array.isArray(data.payload.data) 
        ? data.payload.data 
        : [data.payload.data];
      
      form.setValue("addresses", addressData);
      form.setValue("defaultAddressId",deliveryAddress.id)
    
    }
  }, [data, deliveryAddress.id, form]);



  // Handle address selection
  const handleSelectAddress = (addressId: number) => {
    form.setValue("selectedAddressId", addressId);
  };

  // Handle add new address
  const handleAddNewAddress = async () => {
    try {
      // TODO: Open add address modal/form
      // After successful add, reload addresses
      console.log("Add new address - open form/modal");
    } catch (error) {
      console.error("Failed to add address:", error);
      // TODO: Show error toast/notification
    }
  };

  // Handle edit address
  const handleEditAddress = async (addressId: number) => {
    try {
      // TODO: Get address details and open edit form/modal
      console.log("Edit address:", addressId);
    } catch (error) {
      console.error("Failed to get address details:", error);
      // TODO: Show error toast/notification
    }
  };

  // Handle delete address
  const handleDeleteAddress = async (addressId: number) => {
    try {
      const confirmed = window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?");
      if (!confirmed) return;

      setDeleteLoading(addressId);
      
      // TODO: Replace with your actual API call
      // await deleteAddress(addressId);
      
      // Remove from local state immediately for better UX
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      form.setValue("addresses", updatedAddresses);

      // If deleted address was selected, select another one
      if (watchedSelectedId === addressId) {
        const newSelected = updatedAddresses[0];
        form.setValue("selectedAddressId", newSelected?.id || null);
      }

      // If deleted address was default, set new default
      if (watchedDefaultId === addressId) {
        const newDefault = updatedAddresses[0];
        form.setValue("defaultAddressId", newDefault?.id || null);
      }

      console.log("Address deleted successfully");
      
    } catch (error) {
      console.error("Failed to delete address:", error);
      // TODO: Show error toast/notification
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle form submission
  const onSubmit = (data: FormData) => {
    const selectedAddress = data.addresses.find((addr) => addr.id === data.selectedAddressId);
    
    if (selectedAddress) {
      console.log("Selected Address:", selectedAddress);
      
      // Gọi callback để trả địa chỉ về parent component
      if (onAddressSelect) {
        onAddressSelect(selectedAddress);
      }
    }
    // Close dialog
    setOpen(false);

  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-2 h-auto">
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-screen h-screen max-w-full max-h-full flex flex-col sm:max-w-[600px] sm:max-h-[564px]">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="p-1 h-auto"
            >
              <ChevronLeft className="h-5 w-5 text-red-500" />
            </Button>
            <DialogTitle className="text-lg font-medium text-gray-900">
              Chọn địa chỉ nhận hàng
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Form wrapper */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Address List */}
          <div className="flex-1 overflow-auto bg-gray-50">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                Địa chỉ
              </h3>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">Đang tải...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  Có lỗi khi tải danh sách địa chỉ
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Chưa có địa chỉ nào
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`bg-white rounded-lg p-4 border cursor-pointer transition-all ${
                        watchedSelectedId === addr.id
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleSelectAddress(addr.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                watchedSelectedId === addr.id
                                  ? "border-red-500 bg-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {watchedSelectedId === addr.id && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <span className="font-medium text-gray-900 text-sm">
                              {addr.recipientName}
                            </span>
                            <span className="text-sm text-gray-500">
                              {addr.recipientPhone}
                            </span>
                          </div>

                          <div className="ml-6 space-y-1">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {addr.addressDetail}
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {addr.wardName}, {addr.districtName},{" "}
                              {addr.provinceName}
                            </p>

                            {addr.addressNotes && (
                              <div className="mt-2">
                                <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-600 rounded border border-red-200">
                                  {addr.addressNotes}
                                </span>
                              </div>
                            )}

                            
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600 p-1 h-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(addr.id);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-600 p-1 h-auto"
                            disabled={deleteLoading === addr.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(addr.id);
                            }}
                          >
                            {deleteLoading === addr.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <AddNewAddress onAddressAdded={handleAddNewAddress} />

    
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="p-4 border-t bg-white">
            <Button
              type="button"
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              onClick={() => onSubmit(form.getValues())}
              disabled={!watchedSelectedId}
            >
              Xác nhận địa chỉ
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddressList;