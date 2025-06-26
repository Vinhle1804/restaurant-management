export type LocationItem = {
    code: string;
    name: string;
  }
  
  export type Address = {
    id: number;
    recipientName: string;
    recipientPhone: string;
    addressDetail: string;
    province: string;
    provinceName: string;
    district: string;
    districtName: string;
    ward: string;
    wardName:string,
    addressNotes?: string | null;
  }