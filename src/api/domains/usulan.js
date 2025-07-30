import { v3ApiNew } from "../ApiCallV3New";

const masterApi = v3ApiNew.injectEndpoints({
  endpoints: (builder) => ({
    jenisKegiatan: builder.query({
      query: (arg) => {
        return {
          url: "/master/masterkegiatan",
          params: {
            ...arg,
          },
        };
      },
      transformResponse: (response) => response.data,
      invalidatesTags: ["MasterKegiatan"],
    }),
    penerimaManfaat: builder.query({
      query: (arg) => {
        return {
          url: "/master/penerimaManfaat",
          params: {
            ...arg,
          },
        };
      },
      transformResponse: (response) => response.data,
      invalidatesTags: ["PenerimaManfaat"],
    }),
    KRO: builder.query({
      query: (arg) => {
        return {
          url: "/master/filter/kro",
          params: {
            ...arg,
          },
        };
      },
      transformResponse: (response) => response.data,
      invalidatesTags: ["Kro"],
    }),
    RO: builder.query({
      query: (arg) => {
        return {
          url: "/master/filter/ro",
          params: {
            ...arg,
          },
        };
      },
      transformResponse: (response) => response.data,
      invalidatesTags: ["Ro"],
    }),
    pengembang: builder.query({
      query: (arg) => {
        return {
          url: "/master/pengembang/all",
          params: {
            ...arg,
          },
        };
      },
      transformResponse: (response) => response.data,
      invalidatesTags: ["Pengembang"],
    }),
    filterTahunUsulan: builder.query({
      query: () => "/pengusulan/filter/tahunusulan",
      invalidatesTags: ["Filter/TahunUsulan"],
    }),
  }),
  overrideExisting: true,
});

export const {
  usePenerimaManfaatQuery,
  useJenisKegiatanQuery,
  useKROQuery,
  useROQuery,
  usePengembangQuery,
  useFilterTahunUsulanQuery,
} = masterApi;
