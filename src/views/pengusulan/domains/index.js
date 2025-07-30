/* eslint-disable no-confusing-arrow */
import { v3ApiNew } from "../../../api/ApiCallV3New";

const apiWithTag = v3ApiNew.enhanceEndpoints({
  addTagTypes: ["Pengusulan", "Pengusulan Vermin", "Pengusulan Location"],
});
const pengusulanUsulanApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    usulan: builder.query({
      query: ({ sorted, filtered, ...arg }) => {
        const params = { ...arg };
        if (filtered) {
          params.filtered = JSON.stringify(filtered || []);
        }
        if (sorted) {
          params.sorted = JSON.stringify(sorted);
        }
        return {
          url: "/pengusulan/usulan",
          params: params,
        };
      },
      providesTags: (result) => {
        return [{ type: "Pengusulan", id: "LIST" }];
      },
    }),
    detailUsulan: builder.query({
      query: (id) => {
        return {
          url: `/pengusulan/usulan/${id}`,
        };
      },
      providesTags: (result, error, id) => [{ type: "Pengusulan", id }],
    }),
    detailUsulanLocations: builder.query({
      query: (id) => {
        return {
          url: `/pengusulan/usulan/${id}/sasaran`,
        };
      },
      providesTags: (result, error, id) => [
        { type: "Pengusulan Location", id: id },
      ],
    }),
    usulanVermin: builder.query({
      query: (id) => {
        return {
          url: `/pengusulan/usulan/${id}/vermin`,
        };
      },
      providesTags: (result, error, id) => [{ type: "Pengusulan Vermin", id }],
    }),
    vertekByLocation: builder.query({
      query: (id) => {
        return {
          url: `/pengusulan/sasaran/${id}/vertek`,
        };
      },
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [
        { type: "Pengusulan Location", id },
      ],
    }),
    updateVertek: builder.mutation({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        for (const property in data) {
          if (data[property]) {
            formData.append(property, data[property]);
          }
        }
        return {
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          url: `/pengusulan/vertek/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, payload) => [
        { type: "Pengusulan Location", id: payload.id },
      ],
    }),
    updateStatusVertek: builder.mutation({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        for (const property in data) {
          if (data[property]) {
            formData.append(property, data[property]);
          }
        }
        return {
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          url: `/pengusulan/vertek/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, _, payload) => {
        if (result) {
          return [
            { type: "Pengusulan", id: payload.UsulanId },
            { type: "Pengusulan Location", id: payload.id },
          ];
        }
      },
    }),
    updateStatusVerlok: builder.mutation({
      query: ({ UsulanId, ...data }) => {
        return {
          url: `/pengusulan/usulan/${UsulanId}/verlok`,
          method: "PUT",
          body: {
            statusVertek: data.status,
            keteranganVertek: data.keterangan,
          },
        };
      },
      invalidatesTags: (result, _, payload) => {
        if (result) {
          return [{ type: "Pengusulan", id: payload.id }];
        }
      },
    }),
    createUsulan: builder.mutation({
      query: ({ typeUsulan, ...usulan }) => {
        let requestBody = usulan;
        if (typeUsulan === "psu-pp") {
          requestBody = new FormData();
          for (const key in usulan) {
            if (Object.hasOwnProperty.call(usulan, key)) {
              const value = usulan[key];
              if (
                key === "bentukBantuan" ||
                key === "rumahTerbangun" ||
                key === "proporsiJml"
              ) {
                requestBody.append(key, JSON.stringify(value));
              } else {
                requestBody.append(key, value);
              }
            }
          }
        }
        return {
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          url: `/pengusulan/usulan/${typeUsulan}`,
          method: "POST",
          body: requestBody,
        };
      },
      invalidatesTags: [{ type: "Pengusulan", id: "LIST" }],
    }),
    updateUsulan: builder.mutation({
      query: ({ id, typeUsulan, ...usulan }) => {
        let requestBody = usulan;
        if (typeUsulan === "psu-pp") {
          requestBody = new FormData();
          for (const key in usulan) {
            if (Object.hasOwnProperty.call(usulan, key)) {
              const value = usulan[key];
              if (
                key === "bentukBantuan" ||
                key === "rumahTerbangun" ||
                key === "proporsiJml"
              ) {
                requestBody.append(key, JSON.stringify(value));
              } else {
                if (key === "dokumenSbu") {
                  if (usulan.isNewSbu) {
                    requestBody.append(key, value);
                  }
                } else {
                  requestBody.append(key, value);
                }
              }
            }
          }
        }

        return {
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          url: `/pengusulan/usulan/${typeUsulan}/${id}`,
          method: "PUT",
          body: requestBody,
        };
      },
    }),
    deleteUsulan: builder.mutation({
      query: (id) => ({
        url: `/pengusulan/usulan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: () => [{ type: "Pengusulan", id: "List" }],
    }),
    updateValidasiVerminUsulan: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/pengusulan/vermin/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { UsulanId }) => [
        { type: "Pengusulan Vermin", id: UsulanId },
        { type: "Pengusulan", id: UsulanId },
      ],
    }),
    sendEmailNotification: builder.mutation({
      query: (data) => {
        return {
          url: `/pengusulan/vermin/notification-email`,
          method: "POST",
          body: data,
        };
      },
    }),
    createComment: builder.mutation({
      query: ({ id, message }) => ({
        url: `/pengusulan/usulan/${id}/comment`,
        method: "POST",
        body: { message },
      }),
      invalidatesTags: (result, _, payload) => {
        if (result) {
          return [{ type: "Pengusulan", id: payload.id }];
        }
      },
    }),
    sendUsulan: builder.mutation({
      query: (id) => {
        return {
          url: `/pengusulan/usulan/${id}/statusterkirim`,
          method: "POST",
          body: { statusTerkirim: "terkirim" },
        };
      },
      invalidatesTags: (result, _, payload) => {
        return [{ type: "Pengusulan", id: payload }];
      },
    }),
    syncKonreg: builder.mutation({
      query: (id) => {
        return {
          url: `/pengusulan/konregpool/sync-usulan/${id}`,
          method: "GET",
        };
      },
      invalidatesTags: (result, _, payload) => {
        return [{ type: "Pengusulan", id: payload }];
      },
    }),
    exportExcelUsulan: builder.query({
      query: ({ sorted, filtered, ...arg }) => {
        const params = { ...arg };
        if (filtered) {
          params.filtered = JSON.stringify(filtered || []);
        }
        if (sorted) {
          params.sorted = JSON.stringify(sorted);
        }
        return {
          url: "/pengusulan/usulan/export/excel",
          params: params,
        };
      },
    }),
    sendToPenetapan: builder.mutation({
      query: ({ ...body }) => {
        return {
          url: `/pengusulan/penetapan`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: (result, _, payload) =>
        result
          ? [{ type: "Pengusulan", id: payload?.usulans?.[0].UsulanId ?? "" }]
          : [],
    }),
    usulanSetting: builder.query({
      query: (key) => {
        return {
          url: `/portalperumahan/setting/${key}`,
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useUsulanQuery,
  useDetailUsulanQuery,
  useDetailUsulanLocationsQuery,
  useCreateUsulanMutation,
  useUpdateUsulanMutation,
  useDeleteUsulanMutation,
  useUpdateValidasiVerminUsulanMutation,
  useUsulanVerminQuery,
  useVertekByLocationQuery,
  useUpdateVertekMutation,
  useUpdateStatusVertekMutation,
  useUpdateStatusVerlokMutation,
  useSendEmailNotificationMutation,
  useCreateCommentMutation,
  useSendUsulanMutation,
  useSyncKonregMutation,
  useLazyExportExcelUsulanQuery,
  useSendToPenetapanMutation,
  useUsulanSettingQuery,
} = pengusulanUsulanApi;
