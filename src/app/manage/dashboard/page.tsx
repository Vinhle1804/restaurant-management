import accountApiRequest from "@/apiRequests/account"
import { cookies } from "next/headers"

export default async function Dashboard() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  console.log(accessToken)

  let name = ''
  try {
    const result = await accountApiRequest.sMe(accessToken)
    name = result.payload.data.name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("errrorrrrrr",error)
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
