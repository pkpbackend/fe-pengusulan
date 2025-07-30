/* eslint-disable no-confusing-arrow */
import { v3ApiNew } from "../../../api/ApiCallV3New"

const apiWithTag = v3ApiNew.enhanceEndpoints({
  addTagTypes: ["Penetapan"],
})
const pengusulanPenetapanApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    penetapan: builder.query({
      query: ({ sorted, filtered, ...arg }) => {
        const params = { ...arg }
        params.filtered = JSON.stringify(filtered || [])
        if (sorted) {
          params.sorted = sorted
        }

        return {
          url: "/pengusulan/penetapan",
          params: params,
        }
      },
      providesTags: (result) => {
        return [{ type: "Penetapan", id: "LIST" }]
      },
    }),
    detailPenetapan: builder.query({
      query: (id) => {
        return {
          url: `/pengusulan/penetapan/${id}`,
        }
      },
      providesTags: (result) => {
        return [{ type: "Penetapan", id: "DETAIL" }]
      },
    }),
    exportExcelPenetapan: builder.mutation({
      query: ({ filtered, ...arg }) => {
        const params = { ...arg }

        if (filtered) {
          params.filtered = JSON.stringify(filtered)
        }
         
        return {
          url: "/pengusulan/penetapan/export/excel",
          method: "GET",
          params,
        }
      },
    }),
    createPenetapan: builder.mutation({
      query: ({ ...body }) => {
        return {
          url: `/pengusulan/penetapan`,
          method: "POST",
          body,
        }
      },
      invalidatesTags: [{ type: "Penetapan", id: "LIST" }],
    }),
    updatePenetapan: builder.mutation({
      query: ({ id, ...body }) => {
        return {
          url: `/pengusulan/penetapan/${id}`,
          method: "PUT",
          body,
        }
      },
      invalidatesTags: [{ type: "Penetapan", id: "LIST" }],
    }),
    updateUsulan: builder.mutation({
      query: ({ PenetapanId, UsulanId, ...body }) => {
        console.log(`
        PenetapanId: ${PenetapanId}
        UsulanId: ${UsulanId}
        `)
        return {
          url: `/pengusulan/penetapan/${PenetapanId}/usulan/${UsulanId}`,
          method: "PUT",
          body,
        }
      },
      invalidatesTags: [{ type: "Penetapan", id: "DETAIL" }],
    }),
    deletePenetapan: builder.mutation({
      query: (id) => ({
        url: `/pengusulan/penetapan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: () => [{ type: "Penetapan", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
})

export const {
  usePenetapanQuery,
  useDetailPenetapanQuery,
  useExportExcelPenetapanMutation,
  useCreatePenetapanMutation,
  useUpdatePenetapanMutation,
  useUpdateUsulanMutation,
  useDeletePenetapanMutation,
} = pengusulanPenetapanApi
