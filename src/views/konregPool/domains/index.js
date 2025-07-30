/* eslint-disable no-confusing-arrow */
import { v3ApiNew } from "../../../api/ApiCallV3New";

const apiWithTag = v3ApiNew.enhanceEndpoints({
  addTagTypes: ["KonregPool"],
});
const konregPoolApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    konregPool: builder.query({
      query: ({ sorted, conditions, ...arg }) => {
        const params = { ...arg };
        params.conditions = JSON.stringify(conditions || []);
        if (sorted) {
          params.sorted = JSON.stringify(sorted || []);
        }
        return {
          url: "/pengusulan/konregpool",
          params,
        };
      },
      providesTags: () => [{ type: "KonregPool", id: "LIST" }],
    }),
    detailKonregPool: builder.query({
      query: (id) => {
        return {
          url: `/pengusulan/konregpool/${id}`,
        };
      },
      providesTags: (result, error, id) => [{ type: "KonregPool", id }],
    }),
    exportExcelKonregPool: builder.query({
      query: ({ sorted, conditions, ...arg } = {}) => {
        const params = { ...arg };
        params.conditions = JSON.stringify(conditions || []);
        if (sorted) {
          params.sorted = JSON.stringify(sorted || []);
        }
        return {
          url: "/pengusulan/konregpool/export/excel",
          params: params,
        };
      },
      transformErrorResponse: (response) => response.data,
    }),
  }),
  overrideExisting: true,
});

export const {
  useKonregPoolQuery,
  useDetailKonregPoolQuery,
  useLazyExportExcelKonregPoolQuery,
} = konregPoolApi;
