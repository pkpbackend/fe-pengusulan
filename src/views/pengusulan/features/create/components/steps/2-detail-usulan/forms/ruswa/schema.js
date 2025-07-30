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
    ttdSuratUsulan: yup.string().required("Penandatangan Surat wajib diisi..."),
    tahunUsulan: yup.string().required("Tahun Anggaran wajib diisi..."),
  });
};

export const formSchemaDirektif = () => {
  return yup.object().shape({
    nikPicPengusul: yup.string().required("NIK wajib diisi..."),
    namaPicPengusul: yup.string().required("Nama wajib diisi..."),

    noSurat: yup.string().required("No Surat Permohonan wajib diisi..."),
    tanggalSurat: yup
      .date()
      .typeError("Tanggal Surat Permohonan wajib diisi...")
      .required("Tanggal Surat Permohonan wajib diisi..."),
    tahunUsulan: yup.string().required("Tahun Anggaran wajib diisi..."),
  });
};
