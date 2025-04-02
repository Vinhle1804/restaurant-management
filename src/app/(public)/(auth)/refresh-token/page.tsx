"use client";

import {checkAndRefreshToken, getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect} from "react";

export default function RefreshPage() {
  const router = useRouter();
  const searchParams = useSearchParams()
  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const redirectPathname = searchParams.get('redirect')
  console.log(redirectPathname)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useEffect(() => {
    if ((refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLocalStorage())){
          checkAndRefreshToken({
          onSuccess:() => {
           router.push(redirectPathname || '/') 
          }
          })
        }
 
  }, [ router, refreshTokenFromUrl, redirectPathname]);
  return <div>wait a minute........</div>;
}
