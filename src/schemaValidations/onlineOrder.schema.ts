import { DishStatusValues } from '@/constants/dishs'
import { OrderStatusValues } from '@/constants/orders'
import z from 'zod'

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
export type DishSnapshott = z.infer<typeof DishSnapshotSchema>;


// 🧩 Item món ăn trong đơn hàng online
export const OrderOnlineDishSchema = z.object({
  id: z.number(),
  orderOnlineId: z.number(),
  dishSnapshotId: z.number(),
  dishSnapshot: DishSnapshotSchema,
  quantity: z.number(),
  price: z.number()
})
export type OrderOnlineDish = z.infer<typeof OrderOnlineDishSchema>;


export const OrderOnlineSchema = z.object({
  id: z.number(),
  trackingNumber: z.string(),
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
  address: z.string(),
  status: z.enum(OrderStatusValues),
  paymentMethod: z.string(),
  note: z.string().nullable(),
  totalPrice: z.number(),
  items: z.array(OrderOnlineDishSchema),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type OrderOnline = z.infer<typeof OrderOnlineSchema>;
