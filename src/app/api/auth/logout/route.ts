import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {

  const cookieStore = await cookies();
  
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value
  console.log("refreshToken",refreshToken)
  console.log(accessToken)
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  if(!accessToken || !refreshToken){
    return Response.json({
        message: 'khong nhan dc accessToken hay refreshToken'
    },{status: 200})
  }
  try {
  const result = await authApiRequest.sLogout({
    accessToken,
    refreshToken
  })
    return Response.json(result)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return Response.json( 
        {
            message: 'loi khi goi api den backend'
        },
        {status:200
        }
    )
  }
}