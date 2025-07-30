import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_BASE_URLV3 } from "@constants/app";
import { getAuthV3 } from "@utils/auth";

export const v3ApiNew = createApi({
  reducerPath: "apiV3New",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BACKEND_BASE_URLV3}/v3`,
    prepareHeaders: (headers) => {
      const token = getAuthV3(true);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getVertekByLocationId: builder.query({
      query: (id) => {
        return {
          url: `/pengusulan/sasaran/${id}/vertek`,
        };
      },
    }),
    getDataForExportExcelKonregPool: builder.query({
      query: ({ sorted, conditions, ...arg }) => {
        const params = { ...arg };
        params.conditions = JSON.stringify(conditions || []);
        if (sorted) {
          params.sorted = sorted;
        }
        return {
          url: "/pengusulan/konregpool",
          params,
        };
      },
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [
        { type: "Pengusulan Location", id },
      ],
    }),
  }),
});
