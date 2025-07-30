/* eslint-disable no-confusing-arrow */
import { v3ApiNew } from "../../../api/ApiCallV3New";

const apiWithTag = v3ApiNew.enhanceEndpoints({
  addTagTypes: ["Document"],
});
const usulanDocumentApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    masterCategoryDocument: builder.query({
      query: (arg) => {
        return {
          url: `/master/masterkategoridokumen/all`,
          params: arg,
        };
      },

      // providesTags: (result) => {
      //   const data = result?.data || []
      //   return data
      //     ? [
      //         ...data?.map(({ id }) => ({ type: "Dokumen", id })),
      //         { type: "Dokumen", id: "LIST" }
      //       ]
      //     : [{ type: "Dokumen", id: "LIST" }]
      // }
    }),
    usulanDocument: builder.query({
      query: (params) => {
        return {
          url: `/pengusulan/dokumen`,
          params: params,
        };
      },
      providesTags: () => ["Document"],
    }),
    uploadUsulanDocument: builder.mutation({
      query: (document) => {
        const formdata = new FormData();
        Object.keys(document).forEach((key) => {
          const value = document[key];
          if (value) {
            formdata.append(key, document[key]);
          }
        });
        return {
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          url: `/pengusulan/dokumen`,
          method: "POST",
          body: formdata,
        };
      },
      invalidatesTags: () => ["Document"],
    }),
    updateUsulanDocument: builder.mutation({
      query: ({ id, ...document }) => {
        const formdata = new FormData();
        Object.keys(document).forEach((key) => {
          const value = document[key];
          if (value) {
            formdata.append(key, document[key]);
          }
        });
        return {
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          url: `/pengusulan/dokumen/${id}`,
          method: "PUT",
          body: formdata,
        };
      },
      invalidatesTags: () => ["Document"],
    }),
    updateUsulanDocumentCheck: builder.mutation({
      query: ({ id, DocumentId, ...Document }) => {
        return {
          url: `/pengusulan/usulan/${id}/dokumen/${DocumentId}/check`,
          method: "PUT",
          body: Document,
        };
      },
      invalidatesTags: () => ["Document"],
    }),
    deleteUsulanDocument: builder.mutation({
      query: (id) => {
        return {
          url: `/pengusulan/dokumen/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: () => ["Document"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useUsulanDocumentQuery,
  useUpdateUsulanDocumentMutation,
  useDeleteUsulanDocumentMutation,
  useUpdateUsulanDocumentCheckMutation,
  useMasterCategoryDocumentQuery,
  useUploadUsulanDocumentMutation,
} = usulanDocumentApi;
