// ** Third Party Components
import * as yup from "yup"

export const formSchemaReguler = () => {
  return yup.object().shape({
    noSk: yup.string().required("No. SK wajib diisi..."),
    tanggalSk: yup.string().required("Tanggal wajib diisi..."),
    totalUnit: yup.number().required("Total Unit wajib diisi..."),
    keterangan: yup.string(),
  })
}

export const formSchemaRUK = () => {
  return yup.object().shape({
    noSk: yup.string().required("No. SK wajib diisi..."),
  })
}
