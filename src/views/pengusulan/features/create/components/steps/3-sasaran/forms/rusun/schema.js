// ** Third Party Components
import * as yup from "yup";

export const formSchemaReguler = yup.object().shape({
  penerimaManfaat: yup.string().required("Penerima manfaat wajib diisi..."),

  jumlahUnit: yup
    .number("Jumlah unit harus berupa angka...")
    .typeError("Jumlah unit harus berupa angka...")
    .min(1, "Jumlah unit harus lebih dari 0...")
    .required("Jumlah unit wajib diisi..."),
  jumlahTower: yup
    .number("Jumlah unit harus berupa angka...")
    .typeError("Jumlah unit harus berupa angka...")
    .min(1, "Jumlah unit harus lebih dari 0...")
    .required("Jumlah tower wajib diisi..."),

  provinsi: yup
    .string()
    .required("Provinsi wajib diisi...")
    .test("not-zero", "Provinsi wajib diisi...", (value) => value !== "0"),
  kabupaten: yup
    .string()
    .required("Kabupaten/Kota wajib diisi...")
    .test(
      "not-zero",
      "Kabupaten/Kota wajib diisi...",
      (value) => value !== "0"
    ),
  kecamatan: yup
    .string()
    .required("Kecamatan wajib diisi...")
    .test("not-zero", "Kecamatan wajib diisi...", (value) => value !== "0"),
  desa: yup
    .string()
    .required("Desa/Kelurahan wajib diisi...")
    .test(
      "not-zero",
      "Desa/Kelurahan wajib diisi...",
      (value) => value !== "0"
    ),

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
});
