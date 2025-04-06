"use client";
export const runtime = "nodejs"
import { useAppContext } from "@/components/app-provider";
import { Role } from "@/constants/type";
import { cn, handleErrorApi } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { RoleType } from "@/types/jwt.types";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
 

const menuItems: {
  title: string;
  href: string;
  role?: RoleType[];
  hideWhenLogin?: boolean;
}[] = [
  {
    title: "Home ",
    href: "/", //authRequired = undefined nghia la dang nhap hay chua deu cho hien thi
  },
  {
    title: "Menu",
    href: "/guest/menu", //authRequired = undefined nghia la dang nhap hay chua deu cho hien thi
    role: [Role.Guest],
  },
  {
    title: "Orders",
    href: "/guest/orders", //authRequired = undefined nghia la dang nhap hay chua deu cho hien thi
    role: [Role.Guest],
  },
  {
    title: "Đăng nhập",
    href: "/login",
    hideWhenLogin: true,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    role: [Role.Owner, Role.Employee], // chi hien thi khi la admin hoac staff
  },
];

export default function NavItems({ className }: { className?: string }) {
  const { role, setRole } = useAppContext();
  const logoutMutation = useLogoutMutation()
  const router = useRouter()
  const logout = async () =>{
if(logoutMutation.isPending) return
try {
  await logoutMutation.mutateAsync()
  setRole()
  router.push('/')
} catch (error) {
  handleErrorApi({
    error,
    setError: () => {} // Provide empty function since this is not a form context
  })
}
  }

return(
  <>
 {menuItems.map((item) => {
  // truong hop dang nhap chi hien thi menu dang nhap
  const isAuth = item.role && role && item.role.includes(role);
  //truong hop menu item co the hien thi du cho da dang nhap hay chua
  const canShow = item.role === undefined && !item.hideWhenLogin || (!role && item.hideWhenLogin);
  if (isAuth || canShow) {
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    )
  }
  return null
})}
  {role &&    <AlertDialog>
  <AlertDialogTrigger asChild >
  <div className={cn(className,'cusor-pointer')}>Logout</div>

  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure logout?</AlertDialogTitle>
      <AlertDialogDescription>
   dang xuat xong bi mat hoa don do
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction  onClick={logout} >Ok</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog> }


  </>
)
}



