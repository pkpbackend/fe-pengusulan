// ** Third Party Components
import * as yup from "yup";

export const formSchemaPemda = () => {
  return yup.object().shape({
    nikPicPengusul: yup.string().required("NIK wajib diisi..."),
    namaPicPengusul: yup.string().required("Nama wajib diisi..."),
    jabatanPicPengusul: yup.string().required("Jabatan wajib diisi..."),
    emailPicPengusul: yup
      .string()
      .email("format email salah...")
      .required("Email wajib diisi..."),
    hpPicPengusul: yup.string().required("No. HP wajib diisi..."),

    noSurat: yup.string().required("No Surat Usulan wajib diisi..."),
    tanggalSurat: yup
      .date()
      .typeError("Tanggal Surat Usulan wajib diisi...")
      .required("Tanggal Surat Usulan wajib diisi..."),
    tahunBantuanPsu: yup.string().required("Tahun Anggaran wajib diisi..."),
  });
};

export const formSchemaPengembang = () => {
  return yup.object().shape({
    pengembang: yup
      .object()
      .typeError("Pengembang wajib diisi...")
      .required("Pengembang wajib diisi..."),

    nikPicPengusul: yup.string().required("NIK wajib diisi..."),
    namaPicPengusul: yup.string().required("Nama wajib diisi..."),
    telpPicPengusul: yup.string().required("No. HP wajib diisi..."),

    //perusahaan
    perusahaanPengusul: yup.string().required("Nama perusahaan wajib diisi..."),
    asosiasiPengusul: yup.string().required("Nama asosiasi wajib diisi..."),
    namaDirekturPengusul: yup.string().required("Nama direktur wajib diisi..."),
    telpDirekturPengusul: yup
      .string()
      .required("No. HP direktur wajib diisi..."),
    emailPengusul: yup
      .string()
      .email("format email salah...")
      .required("Email perusahaan wajib diisi..."),
    alamatPengusul: yup.string().required("Alamat perusahaan wajib diisi..."),
    provinsiPengusul: yup
      .string()
      .required("Provinsi perusahaan wajib diisi..."),
    kabupatenPengusul: yup
      .string()
      .required("Kabupaten perusahaan wajib diisi..."),
    kecamatanPengusul: yup
      .string()
      .required("Kecamatan perusahaan wajib diisi..."),
    desaPengusul: yup.string().required("Desa perusahaan wajib diisi..."),

    noSurat: yup.string().required("No Surat Usulan wajib diisi..."),
    tanggalSurat: yup
      .date()
      .typeError("Tanggal Surat Usulan wajib diisi...")
      .required("Tanggal Surat Usulan wajib diisi..."),
    tahunBantuanPsu: yup.string().required("Tahun Anggaran wajib diisi..."),
  });
};
