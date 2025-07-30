/* eslint-disable no-confusing-arrow */
import { v3ApiNew } from "../../../api/ApiCallV3New";

const apiWithTag = v3ApiNew.enhanceEndpoints({
  addTagTypes: ["Prioritas"],
});
const prioritasApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    prioritas: builder.query({
      query: ({ sorted, filtered, ...arg }) => {
        let params = { ...arg };
        if (filtered) {
          params.filtered = filtered;
        }
        if (sorted) {
          params.sorted = JSON.stringify(sorted);
        }

        return {
          url: "/pengusulan/usulan",
          params: {
            ...params,
            filtered: JSON.stringify([
              ...(params?.filtered || []),
              { id: "eq$statusTerkirim", value: "terkirim" },
            ]),
          },
        };
      },
      providesTags: (result) => {
        const data = result?.data || [];
        return data
          ? [
              ...data?.map(({ id }) => ({ type: "Prioritas", id })),
              { type: "Prioritas", id: "LIST" },
            ]
          : [{ type: "Prioritas", id: "LIST" }];
      },
    }),
    detailPrioritas: builder.query({
      query: (id) => {
        return {
          url: `/pengusulan/usulan/${id}`,
        };
      },
      providesTags: (result, error, id) => [{ type: "Prioritas", id }],
    }),

    updatePrioritas: builder.mutation({
      query: ({ ...prioritas }) => ({
        url: `/pengusulan/prioritas`,
        method: "POST",
        body: prioritas,
      }),
      invalidatesTags: (result, error) => [{ type: "Prioritas" }],
    }),

    jenisPrioritas: builder.query({
      query: (id) => {
        return {
          url: `/pengusulan/prioritas/jenis`,
          params: {
            sorted: JSON.stringify([{ id: "nilaiPrioritas", asc: true }]),
          },
        };
      },
      transformResponse: (response) => {
        return response.sort((a, b) => b.nilaiPrioritas - a.nilaiPrioritas);
      },
      providesTags: (result, error) => [{ type: "Prioritas" }],
    }),

    lampiranPrioritas: builder.query({
      query: ({ id, jenisPrioritas }) => {
        return {
          url: `/pengusulan/usulan/lampiran-prioritas/${id}/${jenisPrioritas}`,
        };
      },
      providesTags: () => ["LampiranPrioritas"],
    }),

    updateLampiranPrioritas: builder.mutation({
      query: ({ id, senFile }) => {
        return {
          url: `/pengusulan/usulan/lampiran-prioritas/${id}`,
          method: "PUT",
          body: senFile,
        };
      },
      invalidatesTags: () => ["LampiranPrioritas"],
    }),

    lampiranPrioritasDokumen: builder.mutation({
      query: ({ id, jenisPrioritas }) => {
        return {
          url: `/pengusulan/usulan/lampiran-prioritas/${id}/${jenisPrioritas}`,
          method: "GET",
        };
      },
      invalidatesTags: () => ["LampiranPrioritas"],
    }),

    rangkaianProgramPrioritas: builder.query({
      query: (id) => {
        return {
          url: `/pengusulan/prioritas/rangkaian-pemrograman`,
        };
      },
      providesTags: (result, error) => [{ type: "Prioritas" }],
    }),
    exportExcelPrioritas: builder.query({
      query: ({ sorted, filtered, ...arg } = {}) => {
        let params = { ...arg };
        if (filtered) {
          params.filtered = filtered;
        }
        if (sorted) {
          params.sorted = JSON.stringify(sorted);
        }
        return {
          url: "/pengusulan/prioritas/export/excel",
          params: {
            ...params,
            filtered: JSON.stringify([
              ...(params?.filtered || []),
              { id: "eq$statusTerkirim", value: "terkirim" },
            ]),
          },
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  usePrioritasQuery,
  useDetailPrioritasQuery,
  useJenisPrioritasQuery,
  useLampiranPrioritasQuery,
  useUpdateLampiranPrioritasMutation,
  useRangkaianProgramPrioritasQuery,
  useUpdatePrioritasMutation,
  useLampiranPrioritasDokumenMutation,
  useLazyExportExcelPrioritasQuery,
} = prioritasApi;
