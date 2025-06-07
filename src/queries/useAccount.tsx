import accountApiRequest from "@/apiRequests/account"
import {  GetGuestListQueryParamsType, UpdateAddressBodyType,UpdateEmployeeAccountBodyType } from "@/schemaValidations/account.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useAccountMe = () =>{
    return useQuery({
        queryKey: ['account-me'],
        queryFn: accountApiRequest.me
    })
}

export const useUpdateMeMutation = () => {
    return useMutation({
        mutationFn: accountApiRequest.updateMe
    })
}

export const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: accountApiRequest.changePassword
    })
}

export const useGetAccountList = () => {
    return useQuery({
        queryKey: ['accounts'],
        queryFn: accountApiRequest.list
    })
}

export const useGetAccount = ({id, enabled}:{
    id: number,
    enabled: boolean
}) => {
    return useQuery({
        queryKey: ['accounts',id],
        queryFn:()=> accountApiRequest.getEmployee(id),
        enabled
    })
}

export const useAddAccountMutation = () =>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: accountApiRequest.addEmployee,
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:['accounts']
            })
        }
    })
}
export const useUpdateAccountMutation = () =>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: UpdateEmployeeAccountBodyType & { id: number }) => 
            accountApiRequest.updateEmployee(id, body),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:['accounts'],
                exact: true
            })
        }
    })
}

export const useDeleteAccountMutation = () =>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: accountApiRequest.deleteEmployee,
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:['accounts']
            })
        }
    })
}

export const useGetGuestListQuery = (queryParams: GetGuestListQueryParamsType) =>{
    return useQuery({
        queryFn: () => accountApiRequest.guestList(queryParams),
        queryKey: ['guests', queryParams]
    })
}
export const useCreateGuestMutation = () =>{
    return useMutation({
        mutationFn: accountApiRequest.createGuest
    })
}

export const useGetAddressListQuery = () =>{
    return useQuery({
        queryFn: () => accountApiRequest.getListAddress(),
        queryKey:['addresses']
    })
}
export const useGetAddressById = () => {
        return useQuery({
        queryFn: () => accountApiRequest.getAddressById,
        queryKey:['address']
    })
}
export const useCreateAddressMutation = () =>{
     const queryClient = useQueryClient()
    return useMutation({
        mutationFn: accountApiRequest.createAddress,
         onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:['address']
            })
        }
        
    })
}
export const useUpdateAddressMutation = () =>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: UpdateAddressBodyType & { id: number }) => 
            accountApiRequest.updateAddress(id, body),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:['address'],
                exact: true
            })
        }
    })}

    export const useUpdateDefaultAddressMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => accountApiRequest.setAddressDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['address'],
        exact: true
      })
    }
  })
}


    export const useDeleteAddressMutation = () =>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: accountApiRequest.deleteAddress,
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:['address']
            })
        }
    })
}