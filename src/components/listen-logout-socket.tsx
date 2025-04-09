import { useLogoutMutation } from "@/queries/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react"
import { useAppContext } from "./app-provider";
import { handleErrorApi } from "@/lib/utils";

//nhung page sau se k check refreshtoken
const UNAUTHENTICATED_PATH = [
    "/login",
    "/register",
    "/logout",
    "/refresh-token",
  ];
export default function ListenLogoutSocket(){
      const router = useRouter();
          const pathname = usePathname();
            const {isPending,mutateAsync} = useLogoutMutation()
              const {setRole,socket, disconnectSocket} = useAppContext()
            
          
        useEffect(()=>{
            if (UNAUTHENTICATED_PATH.includes(pathname)) return
          async  function onLogout(){
             if (isPending) return
                try {
                  await mutateAsync() // Đã thêm dấu ngoặc để gọi hàm
                  setRole()
                  disconnectSocket()
                  router.push('/')
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                  handleErrorApi(error)
                }
            }
            socket?.on('logout',onLogout)
            return () =>{
                socket?.off('logout',onLogout)
            }
        },[socket, pathname, isPending,mutateAsync,setRole,router,disconnectSocket])
    return null
}