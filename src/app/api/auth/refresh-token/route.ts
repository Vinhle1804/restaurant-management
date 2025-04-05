export const runtime = "nodejs"
import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value
  if(!refreshToken){
    return Response.json({
        message: 'K tim thay refreshToken'
    },{
        status: 401
    })
  }
  try {
    const {payload} = await authApiRequest.sRefreshToken({refreshToken})
    const decodedAccessToken = jwt.decode(payload.data.accessToken) as { exp: number };
    const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as { exp: number };
    cookieStore.set("accessToken", payload.data.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", payload.data.refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    })
    return Response.json(payload)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error : any) {
    if(error instanceof HttpError){
        return Response.json(error.payload,{
            status: error.status
        })
    } else{
        return Response.json({
            message:error.message ?? 'co loi xay ra'
        },{
            status: 401
        })
    }
  }
}

