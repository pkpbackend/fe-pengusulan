// ** Third Party Components
import * as yup from "yup";

export const formVertekValidationSchema = () => {
  return yup.object().shape({
    status: yup.string(),
  });
};

export const formVertekSchema = () => {
  return yup.object().shape({
    fileFoto: yup.mixed().required("Dokumen Foto wajib diisi..."),
    fileVertek: yup.mixed().required("Dokumen Vertek wajib diisi..."),
  });
};
