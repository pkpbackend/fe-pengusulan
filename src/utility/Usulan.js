import { JENIS_DATA_USULAN, TIPE_USULAN } from "../constants/usulan";

export const sasaranTransform = (data) => {
  if (!data) {
    return null;
  }

  return {
    ...data,
    provinsi: data.Provinsi,
    kabupaten: data.City,
    kecamatan: data.Kecamatan,
    desa: data.Desa,
    latitude: data.lat,
    longitude: data.lng,
    jenisKegiatan:
      { id: data?.MasterKegiatanId, name: "Peningkatan Kualitas" } || null,
  };
};

export const usulanTransform = (data) => {
  if (!data) {
    return null;
  }

  const jenisUsulan = TIPE_USULAN.find(
    (o) => o.direktorat === data.DirektoratId
  );

  let transformedData = {
    id: data.id,
    jenisUsulan: {
      label: jenisUsulan.name,
      value: jenisUsulan.direktorat,
    },
  };

  if (data.DirektoratId === 1) {
    transformedData = {
      ...transformedData,
      jenisData: JENIS_DATA_USULAN.non_ruk.find(
        (o) => o.value === Number(data.jenisData)
      ),

      // step 1
      nikPicPengusul: data.nik || "",
      namaPicPengusul: data.picPengusul || "",
      jabatanPicPengusul: data.jabatanPic || "",
      emailPicPengusul: data.email || "",
      telpPicPengusul: data.telponPengusul || "",
      hpPicPengusul: data.telponPengusul || "",

      instansiPengusul: data.instansi || "",
      alamatInstansiPengusul: data.alamatInstansi || "",

      tahunUsulan: Number(data.tahunProposal) || "",
      noSurat: data.noSurat || "",
      tanggalSurat: data.tglSurat || "",

      // step 2
      penerimaManfaat: Number(data.PenerimaManfaatId) || "",
      jumlahUnit: Number(data.jumlahUnit) || "",
      jumlahTower: Number(data.jumlahTb) || "",

      provinsi: data.ProvinsiId || "",
      kabupaten: data.CityId || "",
      kecamatan: data.KecamatanId || "",
      desa: data.DesaId || "",

      latitude: data.lat || "",
      longitude: data.lng || "",
    };
  } else if (data.DirektoratId === 2) {
    transformedData = {
      ...transformedData,
      tahunUsulan: Number(data.tahunProposal) || "",
      jenisData: JENIS_DATA_USULAN.non_ruk.find(
        (o) => o.value === Number(data.jenisData)
      ),

      // step 1
      nikPicPengusul: data.nik || "",
      namaPicPengusul: data.picPengusul || "",
      jabatanPicPengusul: data.jabatanPic || "",
      emailPicPengusul: data.email || "",
      telpPicPengusul: data.telponPengusul || "",
      hpPicPengusul: data.telponPengusul || "",

      instansiPengusul: data.instansi || "",
      alamatInstansiPengusul: data.alamatInstansi || "",

      noSurat: data.noSurat || "",
      tanggalSurat: data.tglSurat || "",
      penerimaManfaat: Number(data.PenerimaManfaatId) || "",
      jumlahUnit: Number(data.jumlahUnit) || "",

      provinsi: data.ProvinsiId || "",
      kabupaten: data.CityId || "",

      //sasarans
      sasarans: data.Sasarans.map((item) => {
        return sasaranTransform(item);
      }),
    };
  } else if (data.DirektoratId === 3) {
    const isRegularForm =
      Number(data.jenisData) === 1 || Number(data.jenisData) === 5;
    transformedData = {
      ...transformedData,
      jenisData: JENIS_DATA_USULAN.non_ruk.find(
        (o) => o.value === Number(data.jenisData)
      ),
      // Administrasi Usulan
      noSurat: data.noSurat || "",
      tanggalSurat: data.tglSurat || "",
      tahunUsulan: Number(data.tahunProposal) || "",

      // step 2
      nikPicPengusul: data.nik || "",
      namaPicPengusul: data.picPengusul || "",
    };
    if (isRegularForm) {
      transformedData = {
        // step 2
        ...transformedData,
        jabatanPicPengusul: data.jabatanPic || "",
        emailPicPengusul: data.email || "",
        telpPicPengusul: data.telponPengusul || "",

        instansiPengusul: data.instansi || "",
        alamatInstansiPengusul: data.alamatInstansi || "",

        ttdSuratUsulan: data.ttdBupati,

        penerimaManfaat: Number(data.PenerimaManfaatId) || "",
        jumlahUnit: Number(data.jumlahUnit) || "",
        jumlahUnitPk: Number(data.jumlahUnitPk) || "",

        provinsi: data.ProvinsiId || "",
        kabupaten: data.CityId || "",

        //sasarans
        sasarans: data.Sasarans.map((item) => {
          return sasaranTransform(item);
        }),
      };
    } else {
      transformedData = {
        ...transformedData,
        sasarans:
          data?.Sasarans?.map((sasaran) => ({
            id: sasaran.id,
            provinsi: sasaran.Provinsi,
            jumlahUnit: sasaran.jumlahUnit,
          })) ?? [],
        jumlahUnit: data.jumlahUnit,
      };
    }
  } else if (data.DirektoratId === 4) {
    const isPemda = Number(data.jenisData) !== 7;

    transformedData = {
      ...transformedData,
      jenisData: JENIS_DATA_USULAN.non_ruk.find(
        (o) => o.value === Number(data.jenisData)
      ),
      type: JENIS_DATA_USULAN.ruk.find((o) => o.value === Number(data.type)),
      nikPicPengusul: data.nik || "",

      noSurat: data.noSurat || "",
      tanggalSurat: data.tglSurat || null,
      tahunBantuanPsu: data.tahunBantuanPsu || "",

      namaPerumahan: data.namaPerumahan || "",
      alamatPerumahan: data.alamatLokasi || "",
      provinsi: data?.ProvinsiId || "",
      kabupaten: data?.CityId || "",
      kecamatan: data?.KecamatanId || "",
      desa: data?.DesaId || "",
      latitude: data.lat || "",
      longitude: data.lng || "",
      dayaTampung: data.dayaTampung,
      jumlahUsulan: data.jumlahUsulan,
    };
    if (isPemda) {
      transformedData = {
        ...transformedData,
        namaPicPengusul: data.picPengusul || "",
        jabatanPicPengusul: data.jabatanPic || "",
        emailPicPengusul: data.email || "",
        hpPicPengusul: data.telponPengusul || "",
        instansiPengusul: data.instansi || "",
        alamatInstansiPengusul: data.alamatInstansi || "",
      };
      if (Number(data.type) === 5) {
        transformedData = {
          ...transformedData,
          noSuratKeputusanDaerah: data.noSuratKeputusanDaerah,
          lokasi:
            data?.UsulanLokasis?.map((lokasi) => ({
              id: lokasi.id,
              kecamatan: { id: lokasi.KecamatanId },
              desa: { id: lokasi.DesaId },
              latitude: lokasi.lat,
              longitude: lokasi.lng,
            })) || [],

          luasanDelinasi: data?.luasanDelinasi || "",

          jmlRumahUmum: data.proporsiJml.jmlRumahUmum,
          jmlRumahMenengah: data.proporsiJml.jmlRumahMenengah,
          jmlRumahMewah: data.proporsiJml.jmlRumahMewah,
          jmlRumahUmumPersentase: data.proporsiJml.presentaseRumahUmum,
          jmlRumahMenengahPersentase: data.proporsiJml.presentaseRumahMenengah,
          jmlRumahMewahPersentase: data.proporsiJml.presentaseRumahMewah,

          jmlRumahUmumTerbangun: data.rumahTerbangun.jmlRumahUmum,
          jmlRumahMenengahTerbangun: data.rumahTerbangun.jmlRumahMenengah,
          jmlRumahMewahTerbangun: data.rumahTerbangun.jmleRumahMewah,
          jmlRumahUmumTerbangunPersentase:
            data.rumahTerbangun.presentaseRumahUmum,
          jmlRumahMenengahTerbangunPersentase:
            data.rumahTerbangun.presentaseRumahMenengah,
          jmlRumahMewahTerbangunPersentase:
            data.rumahTerbangun.presentaseRumahMewah,
          perumahan:
            data?.UsulanPerumahans?.map((perumahan) => ({
              id: perumahan.id,
              namaPerumahan: perumahan.namaPerumahan,
              jmlRumahUmum: perumahan.jmlRumahUmum,
              jmlRumahUmumPersentase: perumahan.presentaseRumahUmum,
              jmlRumahMenengah: perumahan.jmlRumahMenengah,
              jmlRumahMenengahPersentase: perumahan.presentaseRumahMenengah,
              jmlRumahMewah: perumahan.jmlRumahMewah,
              jmlRumahMewahPersentase: perumahan.presentaseRumahMewah,
            })) || [],
          jumlahUsulan: data?.jumlahUsulan || "",

          bentukBantuan: data.bentukBantuan.map((bantuan) => ({
            bantuan: bantuan.bentukBantuan,
            bersertaDrainase: bantuan.besertaDrainase ? "Ya" : "Tidak",
          })),
          panjangJalanUsulan: data.dimensiJalan.panjang || 0,
          lebarJalanUsulan: data.dimensiJalan.lebar || 0,
          statusJalan: data.statusJalan || "",
          detailStatus: data.detailStatus || "",
        };
      }
      if (Number(data.type) === 6) {
        transformedData = {
          ...transformedData,
          namaKelompokMbr: data.namaKelompokMbr,
          bentukBantuan: data.bentukBantuan.map((bantuan) => ({
            bantuan: bantuan.bentukBantuan,
          })),
        };
      }
    } else {
      transformedData = {
        ...transformedData,
        // step 2

        namaPicPengusul: data.picPengusul || "",
        telpPicPengusul: data.Perusahaan?.telpPenanggungJawab || "",
        perusahaanPengusul: data.Perusahaan?.name || "",
        asosiasiPengusul: data.Perusahaan?.asosiasi || "",
        namaDirekturPengusul: data.Perusahaan?.namaDirektur || "",
        telpDirekturPengusul: data.Perusahaan?.telpDirektur || "",
        emailPengusul: data.Perusahaan?.email || "",
        alamatPengusul: data.Perusahaan?.alamat || "",
        provinsiPengusul: data.Perusahaan?.ProvinsiId || "",
        kabupatenPengusul: data.Perusahaan?.CityId || "",
        kecamatanPengusul: data.Perusahaan?.KecamatanId || "",
        desaPengusul: data.Perusahaan?.DesaId || "",
        bentukBantuan: data.bentukBantuan.map((bantuan) => ({
          bantuan: bantuan.bentukBantuan,
        })),
        pengembang: data.Pengembang || null,
        dokumenSbu: Boolean(data.dokumenSbu) ? 1 : 0,
        fileDokumenSbu:
          { name: data.dokumenSbu.filename, ...data.dokumenSbu } || "",
      };
      if (Number(data.jenisData) === 7) {
        transformedData = {
          ...transformedData,
          jmlRumahUmum: data.proporsiJml.jmlRumahUmum,
          jmlRumahMenengah: data.proporsiJml.jmlRumahMenengah,
          jmlRumahMewah: data.proporsiJml.jmlRumahMewah,
          jmlRumahUmumPersentase: data.proporsiJml.presentaseRumahUmum,
          jmlRumahMenengahPersentase: data.proporsiJml.presentaseRumahMenengah,
          jmlRumahMewahPersentase: data.proporsiJml.presentaseRumahMewah,

          jmlRumahUmumTerbangun: data.rumahTerbangun.jmlRumahUmum,
          jmlRumahMenengahTerbangun: data.rumahTerbangun.jmlRumahMenengah,
          jmlRumahMewahTerbangun: data.rumahTerbangun.presentaseRumahMewah,
          jmlRumahUmumTerbangunPersentase:
            data.rumahTerbangun.presentaseRumahUmum,
          jmlRumahMenengahTerbangunPersentase:
            data.rumahTerbangun.presentaseRumahMenengah,
          jmlRumahMewahTerbangunPersentase:
            data.rumahTerbangun.presentaseRumahMewah,
        };
      }
    }
  }

  return transformedData;
};
