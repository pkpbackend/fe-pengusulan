// ** Third Party Components
import * as yup from "yup";

export const formUploadVermin = yup.object().shape({
  id: yup.string(),
  lengkap: yup.string().required("Kesesuaian dokumen harus diisi"),
  file: yup.mixed().when("id", {
    is: (value) => Boolean(value),
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.required("File tidak boleh kosong"),
  }),
});
export const formVerminSchema = () => {
  return yup.object().shape({
    status: yup.string(),
    komentar: yup
      .string()
      .nullable()
      .when("status", {
        is: (val) => Number(val) === 0 && val !== "",
        then: () => yup.string().required("Komentar wajib diisi..."),
      }),
  });
};

export const formVerminValidationSchema = () => {
  return yup.object().shape({
    status: yup.string(),
    kro: yup.string().when("status", {
      is: (val) => Number(val) === 1,
      then: () => yup.string().required("KRO wajib diisi..."),
    }),
    ro: yup.string().when("status", {
      is: (val) => Number(val) === 1,
      then: () => yup.string().required("RO wajib diisi..."),
    }),
    uraian: yup.string().when("status", {
      is: (val) => Number(val) === 1,
      then: () => yup.string().required("Uraian wajib diisi..."),
    }),
    anggaran: yup.string().when("status", {
      is: (val) => Number(val) === 1,
      then: () => yup.string().required("Anggaran wajib diisi..."),
    }),
  });
};
