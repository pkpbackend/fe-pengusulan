// ** Third Party Components
import * as yup from "yup";

export const formSchemaPemdaSkalaBesar = yup.object().shape({
  namaPerumahan: yup.string().required("Nama wajib diisi..."),
  alamatPerumahan: yup.string().required("Alamat perumahan wajib diisi..."),
  provinsi: yup.string().required("Provinsi wajib diisi..."),
  kabupaten: yup.string().required("Kabupaten wajib diisi..."),

  lokasi: yup
    .array()
    .of(
      yup.object().shape({
        kecamatan: yup
          .object()
          .typeError("Kecamatan wajib diisi...")
          .required("Kecamatan wajib diisi..."),
        desa: yup
          .object()
          .typeError("Desa wajib diisi...")
          .required("Desa wajib diisi..."),

        latitude: yup
          .number()
          .typeError("latitude harus berupa angka...")
          .min(-90, "longitude harus lebih dari -90 derajat")
          .max(90, "longitude harus kurang dari 90 derajat")
          .required("latitude wajib diisi..."),
        longitude: yup
          .number()
          .typeError("longitude harus berupa angka...")
          .min(-180, "latitude harus lebih dari -180 derajat")
          .max(180, "latitude harus kurang dari 180 derajat")
          .required("longitude wajib diisi..."),
      })
    )
    .min(1, "Wajib memiliki setidaknya satu lokasi..."),

  jumlahUsulan: yup
    .number()
    .typeError("Jumlah harus berupa angka...")
    .min(1, "Jumlah usulan harus lebih besar dari 1")
    .required("Jumlah usulan wajib diisi..."),

  noSuratKeputusanDaerah: yup
    .string()
    .required("No Surat Keputusan wajib diisi..."),
  luasanDelinasi: yup
    .number()
    .typeError("Jumlah harus berupa angka...")
    .required("Luasan delineasi wajib diisi..."),
  dayaTampung: yup
    .number()
    .typeError("Jumlah harus berupa angka...")
    .min(3000, "Daya tampung harus lebih besar dari 3000")
    .required("Daya Tampung wajib diisi..."),
  jmlRumahUmum: yup
    .number()
    .typeError("Jumlah harus berupa angka...")
    .required("Jumlah rumah umum wajib diisi..."),
  jmlRumahMenengah: yup
    .number()
    .typeError("Jumlah harus berupa angka...")
    .required("Jumlah rumah menengah wajib diisi..."),
  jmlRumahMewah: yup
    .number()
    .typeError("Jumlah harus berupa angka...")
    .required("Jumlah rumah mewah wajib diisi..."),
  jmlRumahUmumTerbangun: yup
    .number()
    .typeError("Jumlah harus berupa angka...")
    .required("Jumlah rumah umum terbangun wajib diisi..."),
  jmlRumahMenengahTerbangun: yup
    .number()
    .typeError("Jumlah harus berupa angka...")
    .required("Jumlah rumah menengah terbangun wajib diisi..."),
  jmlRumahMewahTerbangun: yup
    .number()
    .typeError("Jumlah harus berupa angka...")
    .required("Jumlah rumah mewah terbangun wajib diisi..."),
  panjangJalanUsulan: yup
    .number()
    .typeError("Jumlah harus berupa angka...")
    .required("Panjang jalan usulan wajib diisi..."),
  lebarJalanUsulan: yup
    .number()
    .typeError("Jumlah harus berupa angka...")
    .required("Lebar jalan usulan wajib diisi..."),

  statusJalan: yup.string().required("Status jalan wajib diisi..."),
  detailStatus: yup.object().when("statusJalan", {
    is: (value) => value === "Milik Pemda",
    then: () => yup.string().required("Keterangan status jalan wajib diisi..."),
  }),
  keteranganStatusJalanLainnya: yup.string().when("statusJalan", {
    is: (value) => value === "Lainnya",
    then: () =>
      yup.string().required("Keterangan status jalan lainnya wajib diisi..."),
  }),

  perumahan: yup
    .array()
    .of(
      yup.object().shape({
        namaPerumahan: yup.string().required("Nama perumahan wajib diisi..."),
        jmlRumahUmum: yup
          .number()
          .typeError("Jumlah harus berupa angka...")
          .required("Jumlah rumah umum wajib diisi..."),
        jmlRumahMenengah: yup
          .number()
          .typeError("Jumlah harus berupa angka...")
          .required("Jumlah rumah menengah wajib diisi..."),
        jmlRumahMewah: yup
          .number()
          .typeError("Jumlah harus berupa angka...")
          .required("Jumlah rumah mewah wajib diisi..."),
      })
    )
    .min(1, "Wajib memiliki setidaknya satu perumahan..."),

  bentukBantuan: yup
    .array()
    .of(
      yup.object().shape({
        bantuan: yup.string().required("Bentuk bantuan wajib diisi..."),
        bersertaDrainase: yup.string().required("Opsi drainase wajib diisi..."),
      })
    )
    .min(1, "Wajib memiliki setidaknya satu bentuk bantuan..."),
});
export const formSchemaPemdaSelainSkalaBesar = yup.object().shape({
  namaPerumahan: yup.string().required("Nama wajib diisi..."),
  namaKelompokMbr: yup.string().required("Nama kelompok MBR wajib diisi..."),
  alamatPerumahan: yup.string().required("Alamat perumahan wajib diisi..."),

  provinsi: yup.string().required("Provinsi wajib diisi..."),
  kabupaten: yup.string().required("Kabupaten/Kota wajib diisi..."),
  kecamatan: yup.string().required("Kecamatan wajib diisi..."),
  desa: yup.string().required("Desa wajib diisi..."),
  latitude: yup.string().required("latitude wajib diisi..."),
  longitude: yup.string().required("Longitude wajib diisi..."),

  dayaTampung: yup
    .number()
    .typeError("Jumlah harus berupa angka...")
    .min(1, "Daya tampung harus lebih besar dari 1")
    .required("Daya Tampung wajib diisi..."),
  jumlahUsulan: yup
    .number()
    .typeError("Jumlah harus berupa angka...")
    .min(1, "Jumlah usulan harus lebih besar dari 1")
    .required("Jumlah usulan wajib diisi..."),

  bentukBantuan: yup
    .array()
    .of(
      yup.object().shape({
        bantuan: yup.string().required("Bentuk bantuan wajib diisi..."),
      })
    )
    .min(1, "Wajib memiliki setidaknya satu bentuk bantuan..."),
});

export const formSchemaPengembang = (isSkalaBesar = true) => {
  const scalaBesarValidationField = {
    jmlRumahUmum: yup
      .number()
      .typeError("Jumlah harus berupa angka...")
      .required("Jumlah rumah umum wajib diisi..."),
    jmlRumahMenengah: yup
      .number()
      .typeError("Jumlah harus berupa angka...")
      .required("Jumlah rumah menengah wajib diisi..."),
    jmlRumahMewah: yup
      .number()
      .typeError("Jumlah harus berupa angka...")
      .required("Jumlah rumah mewah wajib diisi..."),
    jmlRumahUmumTerbangun: yup
      .number()
      .typeError("Jumlah harus berupa angka...")
      .required("Jumlah rumah umum terbangun wajib diisi..."),
    jmlRumahMenengahTerbangun: yup
      .number()
      .typeError("Jumlah harus berupa angka...")
      .required("Jumlah rumah menengah terbangun wajib diisi..."),
    jmlRumahMewahTerbangun: yup
      .number()
      .typeError("Jumlah harus berupa angka...")
      .required("Jumlah rumah mewah terbangun wajib diisi..."),
    dayaTampung: yup
      .number()
      .typeError("Jumlah harus berupa angka...")
      .min(3000, "Daya tampung harus lebih besar dari 3000")
      .required("Daya Tampung wajib diisi..."),
  };

  return yup.object().shape({
    namaPerumahan: yup.string().required("Nama perumahan wajib diisi..."),
    alamatPerumahan: yup.string().required("Alamat perumahan wajib diisi..."),
    provinsi: yup.string().required("Provinsi perumahan wajib diisi..."),
    kabupaten: yup.string().required("Kabupaten perumahan wajib diisi..."),
    kecamatan: yup.string().required("Kecamatan perumahan wajib diisi..."),
    desa: yup.string().required("Desa perumahan wajib diisi..."),
    latitude: yup.string().required("Latitude perumahan wajib diisi..."),
    longitude: yup.string().required("Longitude perumahan wajib diisi..."),
    ...(isSkalaBesar
      ? scalaBesarValidationField
      : {
          dayaTampung: yup
            .number()
            .typeError("Jumlah harus berupa angka...")
            .min(100, "Daya tampung harus lebih besar dari 100")
            .max(
              3000,
              "Daya tampung harus lebih kecil dari atau sama dengan 3000"
            )
            .required("Daya Tampung wajib diisi..."),
        }),
    bentukBantuan: yup
      .array()
      .of(
        yup.object().shape({
          bantuan: yup.string().required("Bantuan wajib dipilih..."),
        })
      )
      .min(1, "Wajib memilih satu bantuan..."),

    dokumenSbu: yup.number().required("Dokumen SBU perusahaan wajib diisi..."),
    fileDokumenSbu: yup.mixed().when("dokumenSbu", {
      is: (val) => Number(val) === 1,
      then: (schema) =>
        schema.required("File dokumen SBU perusahaan wajib disertakan..."),
    }),
  });
};
