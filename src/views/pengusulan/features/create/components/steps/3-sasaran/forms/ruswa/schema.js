// ** Third Party Components
import * as yup from "yup";

export const formSchemaReguler = () => {
  return yup.object().shape({
    penerimaManfaat: yup.string().required("Penerima manfaat wajib diisi..."),
    provinsi: yup.string().required("Provinsi wajib diisi..."),
    kabupaten: yup.string().required("Kabupaten wajib diisi..."),
    sasarans: yup
      .array()
      .of(
        yup.object().shape({
          jenisKegiatan: yup.object().required("Jenis Kegiatan wajib diisi..."),
          kecamatan: yup.object().required("Kecamatan wajib diisi..."),
          desa: yup.object().required("Desa wajib diisi..."),

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

          // jumlahRtlh: yup
          //   .number("Jumlah unit harus berupa angka...")
          //   .typeError("Jumlah unit harus berupa angka..."),
          jumlahUnit: yup
            .number("Jumlah unit harus berupa angka...")
            .positive("Jumlah unit harus berupa angka...")
            .typeError("Jumlah unit harus berupa angka...")
            .min(1, "Jumlah unit harus lebih dari 0...")
            // .when(["jumlahRtlh"], (jumlahRtlh, schema) => {
            //   return schema.max(
            //     jumlahRtlh,
            //     `Jumlah unit tidak boleh melebihi jumlah RTLH`
            //   );
            // })
            .required("Jumlah unit wajib diisi..."),
        })
      )
      .min(1, "Wajib memiliki setidaknya satu sasaran..."),
  });
};

export const formSchemaDirektif = () => {
  return yup.object().shape({
    sasarans: yup
      .array()
      .of(
        yup.object().shape({
          jumlahUnit: yup
            .number("Jumlah unit harus berupa angka...")
            .typeError("Jumlah unit harus berupa angka...")
            .min(1, "Jumlah unit harus lebih dari 0...")
            .required("Jumlah unit wajib diisi..."),
          provinsi: yup.object().required("Provinsi wajib diisi..."),
        })
      )
      .min(1, "Wajib memiliki setidaknya satu sasaran..."),
  });
};
