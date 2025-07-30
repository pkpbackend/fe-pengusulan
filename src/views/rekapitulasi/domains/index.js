import { v3ApiNew } from "@api/ApiCallV3New";

const apiWithTag = v3ApiNew.enhanceEndpoints({
  addTagTypes: ["Rekapitulasi"],
});

const rekapitulasiApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    rekapitulasi: builder.query({
      query: (params) => {
        return {
          url: "/rekapusulan",
          params,
        };
      },
    }),
    rekapitulasiPerDirektorat: builder.query({
      query: (params) => {
        return {
          url: "/pengusulan/usulan/rekapitulasi/per-direktorat",
          params: { ...params },
        };
      },
    }),
    rekapitulasiPerProvinsi: builder.query({
      query: (params) => {
        return {
          url: "/pengusulan/usulan/rekapitulasi/per-provinsi",
          params: { ...params },
        };
      },
    }),
    user: builder.query({
      query: (params) => {
        return {
          url: "/sso/user",
          params: {
            ...params
          },
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useRekapitulasiQuery,
  useRekapitulasiPerDirektoratQuery,
  useRekapitulasiPerProvinsiQuery,
  useUserQuery,
} = rekapitulasiApi;
