'use client'

import { useAppContext } from '@/components/app-provider'
import Link from 'next/link'

const menuItems = [
  {
    title: 'Trang chu',
    href: '/' //authRequired = undefined nghia la dang nhap hay chua deu cho hien thi
  },
  {
    title: 'Món ăn',
    href: '/menu' //authRequired = undefined nghia la dang nhap hay chua deu cho hien thi
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
    authRequired: true // true nmghia la dang nhap r moi hien thi
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false // khi false nghia la chua dang nhap thi se hien thi
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true // true nmghia la dang nhap r moi hien thi
  }
]

export default function NavItems({ className }: { className?: string }) {
const {isAuth} = useAppContext()
  return menuItems.map((item) => {
if(item.authRequired === false && isAuth || item.authRequired === true && !isAuth) 
  return null
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    )
  })
}
