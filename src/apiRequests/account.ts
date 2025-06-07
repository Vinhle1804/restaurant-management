import http from "@/lib/http";
import { AccountListResType, AccountResType, AddressResType, ChangePasswordBodyType, CreateAddressBodyType, CreateAddressResType, CreateEmployeeAccountBodyType, CreateGuestBodyType, CreateGuestResType, GetAddressByIdResType, GetAllAddressesResType, GetGuestListQueryParamsType, GetListGuestsResType, UpdateAddressBodyType, UpdateAddressDefaultResType, UpdateAddressResType, UpdateEmployeeAccountBodyType, UpdateMeBodyType } from "@/schemaValidations/account.schema";
import queryString from "query-string";


  const prefix = '/accounts'
const accountApiRequest = {

  me: () => http.get<AccountResType>(`${prefix}/me`),
  sMe:(accessToken: string) => http.get<AccountResType>(`${prefix}/me`,{
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }),
  updateMe:(body: UpdateMeBodyType) => http.put<AccountResType>(`${prefix}/me`,body),
  changePassword:(body: ChangePasswordBodyType) => http.put<AccountResType>(`${prefix}/change-password`,body),
  list:()=>http.get<AccountListResType>(`${prefix}`),
  addEmployee:(body: CreateEmployeeAccountBodyType) => http.post<AccountResType>(prefix,body),
  getListAddress:()=>http.get<GetAllAddressesResType>(`${prefix}/addresses`),
  getAddressById:(id: number )=>http.get<GetAddressByIdResType>(`${prefix}/address/${id}`),
    updateAddress: (id: number, body:UpdateAddressBodyType) => http.put<UpdateAddressResType>(`${prefix}/address/${id}`,body),
  updateEmployee: (id: number, body:UpdateEmployeeAccountBodyType) => http.put<AccountResType>(`${prefix}/detail/${id}`,body),
  getEmployee: (id: number) => http.get<AccountResType>(`${prefix}/detail/${id}`),
  deleteEmployee: (id: number) => http.delete<AccountResType>(`${prefix}/detail/${id}`),
   deleteAddress: (id: number) => http.delete<AddressResType>(`${prefix}/address/${id}`),
  guestList:(queryParams: GetGuestListQueryParamsType) =>http.get<GetListGuestsResType>(`${prefix}/guests?`+queryString.stringify({
    fromDate: queryParams.fromDate?.toISOString(),
    toDate: queryParams.toDate?.toISOString()

  })),
  createGuest:(body: CreateGuestBodyType) => http.post<CreateGuestResType>(`${prefix}/guests`, body),
  createAddress:(body: CreateAddressBodyType) => http.post<CreateAddressResType>(`${prefix}/address`,body),
  setAddressDefault:(id: number) => http.patch<UpdateAddressDefaultResType>(`${prefix}/address/${id}/default`,{})


}

export default accountApiRequest