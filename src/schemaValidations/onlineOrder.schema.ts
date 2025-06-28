import { DishStatusValues } from '@/constants/dishs'
import { OrderStatusValues } from '@/constants/orders'
import z from 'zod'
import { DeliveryFeesSchema } from './deliveryFees.schema'
import { AddressSchema } from './account.schema'
import { PaymentMethodValues } from '@/constants/type'

const DishSnapshotSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  description: z.string(),
  status: z.enum(DishStatusValues),
  dishId: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

// Item món ăn trong đơn hàng online
export const OrderOnlineDishSchema = z.object({
  id: z.number(),
  orderOnlineId: z.number(),
  dishSnapshotId: z.number(),
  dishSnapshot: DishSnapshotSchema,
  quantity: z.number(),
  price: z.number()
})

export const OrderOnlineSchema = z.object({
  id: z.number(),
  trackingNumber: z.string().nullable().optional(),
  accountId: z.number(),
  account: z
    .object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      createdAt: z.date(),
      updatedAt: z.date()
    })
    .nullable(),
  deliveryAddress: AddressSchema,
   deliveryOption: DeliveryFeesSchema, 
  status: z.enum(OrderStatusValues),
  paymentMethod: z.string(),
  note: z.string().nullable(),
  totalPrice: z.number(),
  items: z.array(OrderOnlineDishSchema),
  createdAt: z.date(),
  updatedAt: z.date()
})


export const CreateOrderOnlineBody = z.object({
  items: z.array(
    z.object({
      dishId: z.number(),
      quantity: z.number()
    })
  ),
  deliveryAddressId: z.number(),
deliveryOptionId: z.number(),
  paymentMethod: z.enum(PaymentMethodValues),
  totalPrice: z.number()
})

export type CreateOrderOnlineBodyType = z.TypeOf<typeof CreateOrderOnlineBody>

export const CreateOrderOnlineRes = z.object({
  message: z.string(),
  data: OrderOnlineSchema
})

export type CreateOrderOnlineResType = z.TypeOf<typeof CreateOrderOnlineRes>

