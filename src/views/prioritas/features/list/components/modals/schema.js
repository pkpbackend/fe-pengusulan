// ** Third Party Components
import * as yup from "yup";

export const formUploadDokumen = yup.object().shape({
  id: yup.string(),

  file: yup.mixed().when("id", {
    is: (value) => Boolean(value),
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.required("file tidak boleh kosong"),
  }),
});
