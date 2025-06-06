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
import { ChevronRight, ChevronLeft, Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { AddressType } from "@/schemaValidations/account.schema";

type FormData = {
  addresses: AddressType[];
  selectedAddressId: number | null;
  defaultAddressId: number | null;
};

// TODO: Import these API functions from your API service
// import { 
//   getAllAddresses, 
//   getAddressById, 
//   addAddress, 
//   updateAddress, 
//   deleteAddress 
// } from "@/services/addressService";

const AddressList = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
  
  useEffect(() => {
  if (watchedSelectedId !== null) {
    form.setValue("defaultAddressId", watchedSelectedId);
  }
}, [form, watchedSelectedId]);


  // Load addresses from API
  const loadAddresses = async () => {
    try {
      setLoading(true);
      // TODO: Replace with your actual API call
      // const response = await getAllAddresses();
      // const addressData = response.data;
      
      // Temporary fake data - remove when API is integrated
      const addressData: AddressType[] = [
        {
          id: 1,
          accountId: 123,
          recipientName: "Phúc Vinh",
          recipientPhone: "(+84) 896 637 695",
          province: "79",
          provinceName: "TP. Hồ Chí Minh",
          district: "760",
          districtName: "Quận 12",
          ward: "26734",
          wardName: "Phường Tân Chánh Hiệp",
          addressDetail: "Văn Phòng Tuyển Sinh Hoàng Diệu",
          addressNotes: "",
        },
        {
          id: 2,
          accountId: 123,
          recipientName: "Phúc Vinh",
          recipientPhone: "(+84) 896 637 695",
          province: "79",
          provinceName: "TP. Hồ Chí Minh",
          district: "760",
          districtName: "Quận 12",
          ward: "26728",
          wardName: "Phường Thới An",
          addressDetail: "96/9, Thới An 11",
          addressNotes: "hehehe",
        },
        {
          id: 3,
          accountId: 123,
          recipientName: "Siu Nhân Gao Tế Xuống Ao",
          recipientPhone: "(+84) 372 345 219",
          province: "74",
          provinceName: "Bình Dương",
          district: "721",
          districtName: "Thành Phố Dĩ An",
          ward: "25816",
          wardName: "Phường Đông Hòa",
          addressDetail: "Ktx B Dhqg Công Chính",
          addressNotes: "",
        },
        {
          id: 4,
          accountId: 123,
          recipientName: "Đỗ Hằng",
          recipientPhone: "(+84) 344 973 147",
          province: "95",
          provinceName: "Bình Định",
          district: "857",
          districtName: "Huyện Tây Sơn",
          ward: "29959",
          wardName: "Xã Bình Tường",
          addressDetail: "Xóm 7 hòa sơn",
          addressNotes: "",
        },
      ];

      form.setValue("addresses", addressData);

    } catch (error) {
      console.error("Failed to load addresses:", error);
      // TODO: Show error toast/notification
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadAddresses();
    }
  }, [open]);

  // Handle address selection
  const handleSelectAddress = (addressId: number) => {
    form.setValue("selectedAddressId", addressId);
  };

  // Handle add new address
  const handleAddNewAddress = async () => {
    try {
      // TODO: Open add address modal/form
      // After successful add, reload addresses
      // await loadAddresses();
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
      // const addressDetails = await getAddressById(addressId);
      // Open edit modal with addressDetails
      // After successful update, reload addresses
      // await loadAddresses();
      console.log("Edit address:", addressId);
    } catch (error) {
      console.error("Failed to get address details:", error);
      // TODO: Show error toast/notification
    }
  };

  // Handle delete address
  const handleDeleteAddress = async (addressId: number) => {
    try {
      // TODO: Show confirmation dialog
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

      // TODO: Show success toast/notification
      console.log("Address deleted successfully");
      
    } catch (error) {
      console.error("Failed to delete address:", error);
      // TODO: Show error toast/notification
      // Reload addresses to sync with server state
      await loadAddresses();
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle form submission
  const onSubmit = (data: FormData) => {
    const selectedAddress = data.addresses.find((addr) => addr.id === data.selectedAddressId);
    console.log("Selected Address:", selectedAddress);
    
    // TODO: Handle the selected address (e.g., pass to parent component, save to context, etc.)
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

      <DialogContent className="w-screen h-screen max-w-full max-h-full flex flex-col sm:max-w-[600px] sm:max-h-[564px] ">
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
            <DialogTitle className="text-lg font-medium text-gray-900 ">
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

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">Đang tải...</span>
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

                            {/* Default address badge */}
                            {/* {watchedDefaultId === addr.id && !addr.addressNotes && (
                              <div className="mt-2">
                                <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-600 rounded border border-red-200">
                                  Mặc định
                                </span>
                              </div>
                            )} */}
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

              {/* Add New Address Button */}
              <Button
                type="button"
                variant="ghost"
                className="w-full mt-6 p-4 border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                onClick={handleAddNewAddress}
              >
                <Plus className="h-5 w-5 mr-2" />
                Thêm Địa Chỉ Mới
              </Button>
            </div>
          </div>

          {/* Submit button */}
      
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