export type LocationItem = {
  code: string;
  name: string;
}

export type Address = {
  id: string;
  fullName: string;
  phone: number;
  addressDetail: string;
  province: string;
  provinceName: string;
  district: string;
  districtName: string;
  ward: string;
  notes?: string;
}