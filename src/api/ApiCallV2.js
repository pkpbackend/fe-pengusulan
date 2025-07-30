import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BACKEND_BASE_URL } from "@constants/app"
import { getAuth } from "@utils/auth"

export const v2Api = createApi({
  reducerPath: "apiV2",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BACKEND_BASE_URL}/api/v1/v2`,
    prepareHeaders: (headers) => {
      const token = getAuth(true)
      if (token) {
        headers.set("token", `${token}`)
      }
      return headers
    }
  }),
  endpoints: () => ({})
})
