'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { PlusCircle } from 'lucide-react'

type LocationItem = {
  code: string;
  name: string;
}

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressDetail: string;
  province: string;
  provinceName: string;
  district: string;
  districtName: string;
  ward: string;
}
type DeliveryAddressProps = {
  onAddressAdded: (address: Address) => void;
}


const AddNewAddress: React.FC<DeliveryAddressProps> = ({ onAddressAdded }) => {

  const [open, setOpen] = useState(false)
  const [provinces, setProvinces] = useState<LocationItem[]>([])
  const [districts, setDistricts] = useState<LocationItem[]>([])
  const [wards, setWards] = useState<LocationItem[]>([])
  
  // Thêm state để lưu trữ tên của các địa điểm đã chọn
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('')
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('')

  const form = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      addressDetail: '',
      province: '',
      district: '',
      ward: ''
    }
  });

  const province = form.watch('province')
  const district = form.watch('district')

  const reset = () => {
    form.reset();
    setDistricts([]);
    setWards([]);
    setSelectedProvinceName('');
    setSelectedDistrictName('');
  };


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (values: any) => {
    // Create a full address object with ID and names
    const newAddress: Address = {
      id: Date.now().toString(),
      ...values,
      provinceName: selectedProvinceName,
      districtName: selectedDistrictName
    };
    
    // Pass the address back to parent component
    onAddressAdded(newAddress);
    
    toast.success('Đã thêm địa chỉ thành công', {
      description: `${values.fullName}, ${values.addressDetail}, ${values.ward}, ${selectedDistrictName}, ${selectedProvinceName}`
    });
    
    reset()
    setOpen(false);
  };

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProvinces(data)
      })
      .catch(() => toast.error('Lỗi khi tải tỉnh/thành phố'))
  }, [])

  useEffect(() => {
    if (province) {
      fetch(`https://provinces.open-api.vn/api/p/${province}?depth=2`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setDistricts(data.districts || [])
            setSelectedProvinceName(data.name || '')
          }
        })
        .catch(() => toast.error('Lỗi khi tải quận/huyện'))
    }
  }, [province])

  useEffect(() => {
    if (district) {
      fetch(`https://provinces.open-api.vn/api/d/${district}?depth=2`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setWards(data.wards || [])
            setSelectedDistrictName(data.name || '')
          }
        })
        .catch(() => toast.error('Lỗi khi tải phường/xã'))
    }
  }, [district])

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) reset()
        setOpen(value)
      }}
    >
     <DialogTrigger asChild>
  <Button
    variant="outline"
    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md shadow-sm hover:bg-gray-100 transition-colors"
  >
    <PlusCircle className="w-4 h-4 text-primary" />
    <span>Thay đổi địa chỉ</span>
  </Button>
</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Thêm địa chỉ giao hàng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-address-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <Label>Họ và tên</Label>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
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
                    onValueChange={(value) => {
                      field.onChange(value)
                      // Reset district and ward when province changes
                      form.setValue('district', '')
                      form.setValue('ward', '')
                    }}
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
                    onValueChange={(value) => {
                      field.onChange(value)
                      // Reset ward when district changes
                      form.setValue('ward', '')
                    }}
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
                    onValueChange={field.onChange}
                    disabled={!district}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phường/xã" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wards.map((item) => (
                        <SelectItem key={item.code} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressDetail"
              render={({ field }) => (
                <FormItem>
                  <Label>Ghi chú (Số nhà, tên đường,...)</Label>
                  <Input {...field} placeholder="Số nhà, tên đường, phường/xã" />
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
  )
}

export function onAddressAdded(newAddress: Address) {
  console.log(newAddress)
}

export default AddNewAddress;
