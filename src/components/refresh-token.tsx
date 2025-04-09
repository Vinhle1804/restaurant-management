"use client";

import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "./app-provider";

//nhung page sau se k check refreshtoken
const UNAUTHENTICATED_PATH = [
  "/login",
  "/register",
  "/logout",
  "/refresh-token",
];
export default function RefreshToken() {
  const {socket, disconnectSocket} = useAppContext()
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let interval: any = null;
    //phai goi lan dau tien vi inteval se chay sau thoi gian timeout
    const onRefreshToken = (force?: boolean) =>checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
        disconnectSocket()
        router.push("/login");
      },
      force
    });
    onRefreshToken()
    //time interval phai < hon thoi gian het han accesstoken
    //vidu accesstoken 10s het han thi 1s check 1 lan
    const TIME_OUT = 2000;
    interval = setInterval(
      onRefreshToken,
      TIME_OUT
    )
      if (socket?.connected) {
        onConnect();
      }
    
      function onConnect() {
        console.log(socket?.id);
      }
    
      function onDisconnect() {
        console.log("disconnected");
      }
      function onRefreshTokenSocket(){
        onRefreshToken(true)
        
      }
      socket?.on("connect", onConnect);
      socket?.on("disconnect", onDisconnect);
      socket?.on("refresg-token", onRefreshTokenSocket);


    return () => {
      clearInterval(interval);
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("refresh-token", onRefreshTokenSocket);

    };
  }, [pathname, router, socket,disconnectSocket]);
  return null;
}
