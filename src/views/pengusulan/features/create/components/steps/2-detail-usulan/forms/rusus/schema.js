// ** Third Party Components
import * as yup from "yup";

export const formSchemaReguler = () => {
  return yup.object().shape({
    nikPicPengusul: yup.string().required("NIK wajib diisi..."),
    namaPicPengusul: yup.string().required("Nama wajib diisi..."),
    jabatanPicPengusul: yup.string().required("Jabatan wajib diisi..."),
    emailPicPengusul: yup
      .string()
      .email("format email salah...")
      .required("Email wajib diisi..."),
    telpPicPengusul: yup.string().required("No. Telepon wajib diisi..."),

    noSurat: yup.string().required("No Surat Permohonan wajib diisi..."),
    tanggalSurat: yup
      .date()
      .typeError("Tanggal Surat Permohonan wajib diisi...")
      .required("Tanggal Surat Permohonan wajib diisi..."),
  });
};
