'use client'

import { checkAndRefreshToken } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useEffect } from "react"


//nhung page sau se k check refreshtoken
const UNAUTHENTICATED_PATH = ['/login','/register','/logout','/refresh-token']
export default function RefreshToken(){
    const pathname = usePathname()
    useEffect(()=>{
if(UNAUTHENTICATED_PATH.includes(pathname)){
    return
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let interval: any = null
//phai goi lan dau tien vi inteval se chay sau thoi gian timeout
checkAndRefreshToken({
    onError:()=>{
        clearInterval(interval)
    }
})
//time interval phai < hon thoi gian het han accesstoken
//vidu accesstoken 10s het han thi 1s check 1 lan
const TIME_OUT= 1000
interval = setInterval(checkAndRefreshToken,TIME_OUT)
    },[pathname])
    return null
}