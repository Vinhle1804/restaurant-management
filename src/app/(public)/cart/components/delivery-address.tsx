"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { Address, LocationItem } from "@/types/adress";

type DeliveryAddressProps = {
  onAddressAdded: (address: Address) => void;
};

const AddNewAddress: React.FC<DeliveryAddressProps> = ({ onAddressAdded }) => {
  const [open, setOpen] = useState(false);
  const [provinces, setProvinces] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [wards, setWards] = useState<LocationItem[]>([]);
  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedWardName, setSelectedWardName] = useState("");

  const form = useForm<Address>({
    defaultValues: {
      recipientName: "",
      recipientPhone: "",
      addressDetail: "",
      province: "",
      provinceName: "",
      district: "",
      districtName: "",
      ward: "",
      wardName: "",
      addressNotes: "",
    },
  });

  // Lấy giá trị đang chọn
  const province = useWatch({ control: form.control, name: "province" });
  const district = useWatch({ control: form.control, name: "district" });
  const ward = useWatch({ control: form.control, name: "ward" });

  const reset = () => {
    form.reset();
    setDistricts([]);
    setWards([]);
    setSelectedProvinceName("");
    setSelectedDistrictName("");
    setSelectedWardName("");
  };

  const onSubmit = (values: Address) => {
    const newAddress: Address = {
      ...values,
      provinceName: selectedProvinceName,
      districtName: selectedDistrictName,
      wardName: selectedWardName,
    };
    onAddressAdded(newAddress);
    toast.success("Đã thêm địa chỉ thành công", {
      description: `${values.recipientName}, ${values.addressDetail}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`,
    });
    reset();
    setOpen(false);
  };

  // Lấy danh sách provinces 1 lần khi component mount
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProvinces(data);
      })
      .catch(() => toast.error("Lỗi khi tải tỉnh/thành phố"));
  }, []);

  // Khi province thay đổi: lấy districts, reset district, ward, và tên liên quan
  useEffect(() => {
    if (province) {
      fetch(`https://provinces.open-api.vn/api/p/${province}?depth=2`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setDistricts(data.districts || []);
            setSelectedProvinceName(data.name || "");
            form.setValue("provinceName", data.name || "");
          }
        })
        .catch(() => toast.error("Lỗi khi tải quận/huyện"));
    } else {
      setDistricts([]);
      setSelectedProvinceName("");
    }
    // Reset district và ward khi province đổi
    form.setValue("district", "");
    form.setValue("districtName", "");
    form.setValue("ward", "");
    form.setValue("wardName", "");
    setSelectedDistrictName("");
    setSelectedWardName("");
    setWards([]);
  }, [province, form]);

  // Khi district thay đổi: lấy wards, reset ward và tên liên quan
  useEffect(() => {
    if (district) {
      fetch(`https://provinces.open-api.vn/api/d/${district}?depth=2`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setWards(data.wards || []);
            setSelectedDistrictName(data.name || "");
            form.setValue("districtName", data.name || "");
          }
        })
        .catch(() => toast.error("Lỗi khi tải phường/xã"));
    } else {
      setWards([]);
      setSelectedDistrictName("");
    }
    // Reset ward khi district đổi
    form.setValue("ward", "");
    form.setValue("wardName", "");
    setSelectedWardName("");
  }, [district, form]);

  // Khi ward thay đổi: cập nhật tên ward
  useEffect(() => {
    if (ward && wards.length > 0) {
      const selectedWard = wards.find(w => w.code === ward);
      if (selectedWard) {
        setSelectedWardName(selectedWard.name || "");
        form.setValue("wardName", selectedWard.name || "");
      }
    } else {
      setSelectedWardName("");
    }
  }, [ward, wards, form]);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) reset();
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md shadow-sm hover:bg-gray-100 transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-primary" />
          <span>Thêm địa chỉ</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-w-full max-h-full flex flex-col sm:max-w-[600px] sm:max-h-[564px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Thêm địa chỉ giao hàng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-address-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
          >
            {/* Full name */}
            <FormField
              control={form.control}
              name="recipientName"
              render={({ field }) => (
                <FormItem>
                  <Label>Họ và tên</Label>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Phone */}
            <FormField
              control={form.control}
              name="recipientPhone"
              render={({ field }) => (
                <FormItem>
                  <Label>Số điện thoại</Label>
                  <Input {...field} type="tel" />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Province */}
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <Label>Tỉnh/Thành phố</Label>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tỉnh/thành phố">
                          {selectedProvinceName || "Chọn tỉnh/thành phố"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((item) => (
                        <SelectItem key={item.code} value={item.code}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* District */}
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <Label>Quận/Huyện</Label>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    disabled={!province}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn quận/huyện">
                          {selectedDistrictName || "Chọn quận/huyện"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map((item) => (
                        <SelectItem key={item.code} value={item.code}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Ward */}
            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem>
                  <Label>Phường/Xã</Label>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    disabled={!district}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phường/xã">
                          {selectedWardName || "Chọn phường/xã"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wards.map((item) => (
                        <SelectItem key={item.code} value={item.code}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Address detail */}
            <FormField
              control={form.control}
              name="addressDetail"
              render={({ field }) => (
                <FormItem>
                  <Label>Ghi chú (Số nhà, tên đường,...)</Label>
                  <Input
                    {...field}
                    placeholder="Số nhà, tên đường, phường/xã"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="add-address-form">
            Thêm địa chỉ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewAddress;