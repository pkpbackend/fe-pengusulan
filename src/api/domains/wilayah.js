import _ from "lodash";
import { v3ApiNew } from "../ApiCallV3New";

const wilayahApi = v3ApiNew.injectEndpoints({
  endpoints: (builder) => ({
    provinsi: builder.query({
      query: () => ({
        url: "/master/provinsi/all",
      }),
      invalidatesTags: ["Master/Wilayah/Provinsi"],
    }),
    kabupaten: builder.query({
      query: (provinsiId) => ({
        url: `/master/city/all`,
        params: {
          filtered: JSON.stringify([
            { id: "eq$ProvinsiId", value: provinsiId },
          ]),
        },
      }),
      invalidatesTags: ["Master/Wilayah/Kabupaten_Kota"],
    }),
    kecamatan: builder.query({
      query: (cityId) => ({
        url: `/master/kecamatan/all`,
        params: {
          filtered: JSON.stringify([{ id: "eq$CityId", value: cityId }]),
        },
      }),
      invalidatesTags: ["Master/Wilayah/Kecamatan"],
    }),
    desa: builder.query({
      query: (kecamatanId) => ({
        url: `/master/desa/all`,
        params: {
          filtered: JSON.stringify([
            { id: "eq$KecamatanId", value: kecamatanId },
          ]),
        },
      }),
      invalidatesTags: ["Master/Wilayah/Desa"],
    }),
    getRlthDesa: builder.query({
      query: (desaId) => ({
        url: `/master/wilayah/desa/${desaId}/rtlh`,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Master/Wilayah/Desa/GetRTLH"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useProvinsiQuery,
  useKabupatenQuery,
  useGetRlthDesaQuery,
  useKecamatanQuery,
  useDesaQuery,
} = wilayahApi;
