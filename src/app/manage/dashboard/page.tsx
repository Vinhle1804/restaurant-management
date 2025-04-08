import accountApiRequest from "@/apiRequests/account"
import { cookies } from "next/headers"

export default async function Dashboard() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  console.log("accessssss",accessToken)

  let name = ''
  try {
    const result = await accountApiRequest.sMe(accessToken)
    console.log("result",result)
    name = result.payload.data.name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if(error.digest?.includes('NEXT_REDIRECT')){
      throw error
    }
  }
  return (
    <div>
      DashBoard {name}
    </div>
  )
}
